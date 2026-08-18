import {
  Injectable, ConflictException, NotFoundException,
  BadRequestException, Logger, Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);

  constructor(
  @Inject('KNEX') private readonly db: Knex,
  @Inject('REDIS') private readonly redis: Redis,
  @InjectQueue('pagos') private readonly pagosQueue: Queue,
  private readonly config: ConfigService,
  private readonly auditService: AuditService,
) {}

  // ─── RESERVA ──────────────────────────────────────────────

  async reservarNumero(sorteoId: string, numeroId: string, userId: string) {
    await this.liberarReservasVencidas(sorteoId);

    return this.db.transaction(async (trx) => {
      const sorteo = await trx('sorteos')
        .where({ id: sorteoId })
        .forUpdate()
        .first();

      if (!sorteo) throw new NotFoundException('Sorteo no encontrado');
      if (sorteo.estado !== 'activo') {
        throw new BadRequestException({
          code: 'SORTEO_NO_ACTIVO',
          message: 'El sorteo no está disponible',
        });
      }

      const numero = await trx('numeros')
        .where({ id: numeroId, sorteo_id: sorteoId, estado: 'libre' })
        .forUpdate()
        .first();

      if (!numero) {
        throw new ConflictException({
          code: 'NUMERO_NO_DISPONIBLE',
          message: 'Este numero ya fue tomado. Elegí otro.',
          numeroId,
        });
      }

      const comercio = await trx('comercios')
        .where({ id: sorteo.comercio_id })
        .forUpdate()
        .first();

      if (!comercio || comercio.estado !== 'aprobado') {
        throw new BadRequestException({
          code: 'COMERCIO_NO_APROBADO',
          message: 'El sorteo no está disponible',
        });
      }

      const ttlSegundos = this.config.get<number>('REDIS_TTL_RESERVA', 600);
      const reservadoHasta = new Date(Date.now() + ttlSegundos * 1000);

      await trx('numeros').where({ id: numeroId }).update({
        estado: 'reservado',
        reservado_por: userId,
        reservado_hasta: reservadoHasta,
        notif_expiracion_enviada: false,
      });

      await this.redis.setex(`reserva:${numeroId}`, ttlSegundos, userId);

      return {
        numeroId,
        reservadoHasta,
        minutosRestantes: Math.round(ttlSegundos / 60),
      };
    });
  }

  async liberarReserva(sorteoId: string, numeroId: string, userId: string) {
    const numero = await this.db('numeros')
      .where({ id: numeroId, sorteo_id: sorteoId, reservado_por: userId, estado: 'reservado' })
      .first();

    if (!numero) throw new NotFoundException('Reserva no encontrada');

    await this.db('numeros').where({ id: numeroId }).update({
      estado: 'libre',
      reservado_por: null,
      reservado_hasta: null,
    });

    await this.redis.del(`reserva:${numeroId}`);

    return { mensaje: 'Reserva liberada' };
  }

  // ─── CHECKOUT SIMPLE ──────────────────────────────────────

  async crearCheckout(sorteoId: string, numeroId: string, userId: string) {
    return this.crearCheckoutMultiple(sorteoId, [numeroId], userId);
  }

  // ─── CHECKOUT MULTIPLE ────────────────────────────────────

  async crearCheckoutMultiple(sorteoId: string, numeroIds: string[], userId: string) {
    if (!Array.isArray(numeroIds) || numeroIds.length === 0) {
      throw new BadRequestException({
        code: 'NUMEROS_REQUERIDOS',
        message: 'Tenés que seleccionar al menos un número',
      });
    }

    const idsUnicos = Array.from(new Set(numeroIds));

    const user = await this.db('users').where({ id: userId }).first('email');
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.liberarReservasVencidas(sorteoId);

    const checkoutId = randomUUID();
    const checkout = await this.db.transaction(async (trx) => {
      const sorteo = await trx('sorteos')
        .where({ id: sorteoId })
        .forUpdate()
        .first();

      if (!sorteo) throw new NotFoundException('Sorteo no encontrado');
      if (sorteo.estado !== 'activo') {
        throw new BadRequestException({
          code: 'SORTEO_NO_ACTIVO',
          message: 'El sorteo no está disponible',
        });
      }

      const numeros = await trx('numeros')
        .whereIn('id', idsUnicos)
        .where({
          sorteo_id: sorteoId,
          reservado_por: userId,
          estado: 'reservado',
        })
        .orderBy('id', 'asc')
        .forUpdate();

      if (numeros.length !== idsUnicos.length) {
        throw new BadRequestException({
          code: 'RESERVA_INVALIDA',
          message: 'Alguno de los números no está reservado para vos o la reserva expiró',
        });
      }

      const comercio = await trx('comercios')
        .where({ id: sorteo.comercio_id })
        .forUpdate()
        .first();

      if (!comercio || comercio.estado !== 'aprobado') {
        throw new BadRequestException({
          code: 'COMERCIO_NO_APROBADO',
          message: 'El sorteo no está disponible',
        });
      }

      await trx('pagos').insert(numeros.map((numero) => ({
        checkout_id: checkoutId,
        participacion_id: null,
        usuario_id: userId,
        sorteo_id: sorteoId,
        numero_id: numero.id,
        proveedor: 'mercadopago',
        preference_id: null,
        external_id: null,
        monto: sorteo.valor_numero,
        estado: 'pendiente',
      })));

      return { sorteo, numeros };
    });

    const { sorteo, numeros } = checkout;

    const mpAccessToken = this.config.get<string>('MP_ACCESS_TOKEN');
    const baseUrl = this.config.get<string>('BASE_URL');
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    const minReservadoHasta = numeros.reduce((min, n) => {
      const fecha = new Date(n.reservado_hasta).getTime();
      return fecha < min ? fecha : min;
    }, new Date(numeros[0].reservado_hasta).getTime());

    const items = numeros.map((numero) => ({
      title: `Número ${numero.numero_visible} — ${sorteo.nombre}`,
      quantity: 1,
      unit_price: Number(sorteo.valor_numero),
      currency_id: 'ARS',
    }));

    const externalReference = `checkout:${checkoutId}`;

    const preferenceBody: any = {
  items,
  payer: { email: user.email },
  external_reference: externalReference,
  notification_url: `${baseUrl}/v1/webhooks/mercadopago`,
  expires: true,
  expiration_date_to: new Date(minReservadoHasta).toISOString(),
};

if (frontendUrl && !frontendUrl.includes('localhost')) {
  preferenceBody.back_urls = {
    success: `${frontendUrl}/pago/exitoso`,
    failure: `${frontendUrl}/pago/fallido`,
    pending: `${frontendUrl}/pago/pendiente`,
  };

  preferenceBody.auto_return = 'approved';
}

    const disponibilidad = await this.db('sorteos')
      .leftJoin('comercios', 'sorteos.comercio_id', 'comercios.id')
      .where('sorteos.id', sorteoId)
      .select(
        'sorteos.estado as sorteo_estado',
        'comercios.estado as comercio_estado',
      )
      .first();

    if (
      !disponibilidad ||
      disponibilidad.sorteo_estado !== 'activo' ||
      disponibilidad.comercio_estado !== 'aprobado'
    ) {
      await this.db('pagos')
        .where({ checkout_id: checkoutId })
        .update({ estado: 'cancelado' });
      throw new BadRequestException({
        code: 'SORTEO_NO_DISPONIBLE',
        message: 'El sorteo no está disponible',
      });
    }

    let mpResponse: Response;
    try {
      mpResponse = await fetch(
        'https://api.mercadopago.com/checkout/preferences',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferenceBody),
        },
      );
    } catch (error: any) {
      await this.db('pagos')
        .where({ checkout_id: checkoutId })
        .update({ estado: 'cancelado' });
      this.logger.error(`Error creando preferencia MP: ${error?.message || 'error de red'}`);
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'No se pudo crear el pago. Intentá de nuevo.',
      });
    }

    if (!mpResponse.ok) {
      const error = await mpResponse.text();

      await this.db('pagos')
        .where({ checkout_id: checkoutId })
        .update({ estado: 'cancelado' });

      this.logger.error(
        `Error creando preferencia MP: ${error}`,
      );

      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'No se pudo crear el pago. Intentá de nuevo.',
      });
    }

    let preference: any;
    try {
      preference = await mpResponse.json();
    } catch {
      await this.db('pagos')
        .where({ checkout_id: checkoutId })
        .update({ estado: 'cancelado' });
      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'No se pudo crear el pago. Intentá de nuevo.',
      });
    }

    if (typeof preference.id !== 'string' || preference.id.length === 0) {
      await this.db('pagos')
        .where({ checkout_id: checkoutId })
        .update({ estado: 'cancelado' });

      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'No se pudo crear el pago. Intentá de nuevo.',
      });
    }

    await this.db('pagos')
      .where({ checkout_id: checkoutId })
      .update({ preference_id: preference.id });

    return {
      checkoutUrl:
        this.config.get<string>('NODE_ENV') === 'production'
          ? preference.init_point
          : preference.sandbox_init_point || preference.init_point,
      preferenceId: preference.id,
      expira: new Date(minReservadoHasta),
      numeroIds: idsUnicos,
    };
  }


  // WEBHOOK
  async procesarWebhookMP(body: any) {
    if (body.type !== 'payment' || !body.data?.id) {
      return { received: true, skipped: true };
    }

    const nodeEnv = this.config.get<string>('NODE_ENV');

    if (nodeEnv !== 'production') {
      const resultado = await this.confirmarPagoMP(String(body.data.id));
      return { received: true, processedDirectly: true, resultado };
    }

    await this.pagosQueue.add(
      'confirmar-pago-mp',
      { paymentId: body.data.id },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return { received: true };
  }

  async confirmarPagoMP(paymentId: string) {
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${this.config.get('MP_ACCESS_TOKEN')}` } },
    );

    if (!mpResponse.ok) {
      this.logger.warn(
        `No se pudo recuperar pago MP ${paymentId}: HTTP ${mpResponse.status}`,
      );

      if (mpResponse.status >= 400 && mpResponse.status < 500) {
        return {
          skipped: true,
          reason: 'payment_not_retrievable',
          statusCode: mpResponse.status,
        };
      }

      throw new Error(
        `Mercado Pago no disponible al consultar pago ${paymentId}: HTTP ${mpResponse.status}`,
      );
    }

    const payment = await mpResponse.json();

    if (payment.status !== 'approved') {
      this.logger.log(`Pago ${paymentId} no aprobado: ${payment.status}`);
      return this.procesarPagoNoAprobado(payment);
    }

    return this.conciliarPagoAprobado(String(paymentId), payment);
  }

  private async procesarPagoNoAprobado(payment: any) {
    const externalReference = typeof payment.external_reference === 'string'
      ? payment.external_reference
      : '';
    const checkoutId = this.checkoutIdDesdeReferencia(externalReference);
    const estado = payment.status === 'rejected' ? 'rechazado' : 'pendiente';

    if (checkoutId) {
      await this.db('pagos').where({ checkout_id: checkoutId }).update({ estado });
    } else if (typeof payment.preference_id === 'string') {
      // Compatibilidad con preferences históricas que no tienen checkout_id.
      await this.db('pagos').where({ preference_id: payment.preference_id }).update({ estado });
    }

    return { status: payment.status };
  }

  private async conciliarPagoAprobado(paymentId: string, payment: any) {
    const detalle = this.detalleFinancieroSeguro(payment);
    const montoRecibido = this.montoDecimalSeguro(payment.transaction_amount);
    const montoRecibidoCentavos = this.montoACentavos(payment.transaction_amount);
    const externalReference = typeof payment.external_reference === 'string'
      ? payment.external_reference
      : '';

    const pagoExistente = await this.db('pagos')
      .where('external_id', paymentId)
      .orWhere('external_id', 'like', `${paymentId}:%`)
      .first();
    const incidenciaExistente = await this.db('pagos_incidencias')
      .where({ payment_external_id: paymentId })
      .first();

    if (pagoExistente?.estado === 'aprobado' || incidenciaExistente) {
      return {
        confirmed: Boolean(pagoExistente?.participacion_id),
        incident: Boolean(incidenciaExistente),
        paymentId,
        idempotent: true,
      };
    }

    if (!montoRecibido || montoRecibidoCentavos === null || montoRecibidoCentavos <= 0n) {
      await this.registrarIncidencia({
        paymentId,
        codigo: 'monto_no_coincide',
        montoRecibido: null,
        detalle: { ...detalle, motivo_tecnico: 'transaction_amount_invalido' },
      });
      return { confirmed: false, incident: true, paymentId };
    }

    if (!externalReference) {
      await this.registrarIncidencia({
        paymentId,
        codigo: 'referencia_invalida',
        montoRecibido,
        detalle: { ...detalle, motivo_tecnico: 'external_reference_ausente' },
      });
      return { confirmed: false, incident: true, paymentId };
    }

    if (externalReference.startsWith('checkout:')) {
      const checkoutId = this.checkoutIdDesdeReferencia(externalReference);

      if (!checkoutId) {
        await this.registrarIncidencia({
          paymentId,
          codigo: 'referencia_invalida',
          montoRecibido,
          detalle: { ...detalle, motivo_tecnico: 'checkout_id_invalido' },
        });
        return { confirmed: false, incident: true, paymentId };
      }

      return this.conciliarCheckoutDurable(
        paymentId,
        checkoutId,
        montoRecibido,
        montoRecibidoCentavos,
        detalle,
      );
    }

    const referenciaLegacy = this.parsearReferenciaLegacy(externalReference);
    if (!referenciaLegacy) {
      await this.registrarIncidencia({
        paymentId,
        codigo: 'referencia_invalida',
        montoRecibido,
        detalle: { ...detalle, motivo_tecnico: 'formato_legacy_invalido' },
      });
      return { confirmed: false, incident: true, paymentId };
    }

    return this.conciliarPagoLegacy(
      paymentId,
      referenciaLegacy,
      montoRecibido,
      montoRecibidoCentavos,
      detalle,
    );
  }

  private async conciliarCheckoutDurable(
    paymentId: string,
    checkoutId: string,
    montoRecibido: string,
    montoRecibidoCentavos: bigint,
    detalle: Record<string, unknown>,
  ) {
    const auditLogs: any[] = [];
    const redisIds: string[] = [];

    try {
      const resultado = await this.db.transaction(async (trx) => {
        const pagos = await trx('pagos')
          .where({ checkout_id: checkoutId })
          .orderBy('numero_id', 'asc')
          .forUpdate();

        if (pagos.length === 0) {
          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            codigo: 'checkout_no_encontrado',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'checkout_sin_pagos' },
          }, trx);
          return { confirmed: false, incident: true, numeroIds: [] };
        }

        const externalIdsEsperados = pagos.map((p) =>
          pagos.length === 1 ? paymentId : `${paymentId}:${p.numero_id}`,
        );
        const pagosTerminales = pagos.every((p) => p.estado === 'aprobado' && p.external_id);

        if (pagosTerminales) {
          const mismoPayment = pagos.every(
            (p, index) => p.external_id === externalIdsEsperados[index],
          );
          if (mismoPayment) {
            return {
              confirmed: pagos.every((p) => Boolean(p.participacion_id)),
              incident: pagos.some((p) => !p.participacion_id),
              numeroIds: pagos.map((p) => p.numero_id),
              idempotent: true,
            };
          }

          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            codigo: 'checkout_inconsistente',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'checkout_aprobado_por_otro_payment' },
          }, trx);
          return {
            confirmed: false,
            incident: true,
            numeroIds: pagos.map((p) => p.numero_id),
          };
        }

        const userIds = new Set(pagos.map((p) => p.usuario_id));
        const sorteoIds = new Set(pagos.map((p) => p.sorteo_id));
        const numeroIds = pagos.map((p) => p.numero_id);
        const numeroIdsUnicos = new Set(numeroIds);
        const preferenceIds = new Set(
          pagos.map((p) => p.preference_id).filter((id) => Boolean(id)),
        );
        const tienePreferenceNula = pagos.some((p) => !p.preference_id);
        const checkoutInconsistente =
          userIds.size !== 1 ||
          sorteoIds.size !== 1 ||
          !pagos[0].sorteo_id ||
          numeroIdsUnicos.size !== pagos.length ||
          preferenceIds.size > 1 ||
          (preferenceIds.size === 1 && tienePreferenceNula);

        if (checkoutInconsistente) {
          await this.marcarPagosAprobados(trx, pagos, paymentId, detalle);
          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            preferenceId: preferenceIds.size === 1 ? String([...preferenceIds][0]) : null,
            codigo: preferenceIds.size > 1 || (preferenceIds.size === 1 && tienePreferenceNula)
              ? 'preference_no_coincide'
              : 'checkout_inconsistente',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'filas_checkout_inconsistentes' },
          }, trx);
          return { confirmed: false, incident: true, numeroIds };
        }

        if (detalle.currency_id !== 'ARS') {
          await this.marcarPagosAprobados(trx, pagos, paymentId, detalle);
          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            preferenceId: preferenceIds.size === 1 ? String([...preferenceIds][0]) : null,
            codigo: 'monto_no_coincide',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'currency_id_distinta' },
          }, trx);
          return { confirmed: false, incident: true, numeroIds };
        }

        const montoEsperadoCentavos = pagos.reduce<bigint | null>((total, pago) => {
          const centavos = this.montoACentavos(pago.monto);
          return total === null || centavos === null ? null : total + centavos;
        }, 0n);

        if (montoEsperadoCentavos === null || montoEsperadoCentavos !== montoRecibidoCentavos) {
          await this.marcarPagosAprobados(trx, pagos, paymentId, detalle);
          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            preferenceId: preferenceIds.size === 1 ? String([...preferenceIds][0]) : null,
            codigo: 'monto_no_coincide',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'total_checkout_distinto' },
          }, trx);
          return { confirmed: false, incident: true, numeroIds };
        }

        const numeros = await trx('numeros')
          .whereIn('id', numeroIds)
          .orderBy('id', 'asc')
          .forUpdate();
        const participaciones = await trx('participaciones')
          .whereIn('numero_id', numeroIds)
          .select('numero_id');
        const conParticipacion = new Set(participaciones.map((p) => p.numero_id));
        const numerosPorId = new Map(numeros.map((numero) => [numero.id, numero]));
        const userId = String([...userIds][0]);
        const sorteoId = String([...sorteoIds][0]);
        const conflictivos = numeroIds.filter((numeroId) => {
          const numero = numerosPorId.get(numeroId);
          if (!numero || numero.sorteo_id !== sorteoId || conParticipacion.has(numeroId)) return true;
          return numero.estado !== 'libre' && !(
            numero.estado === 'reservado' && numero.reservado_por === userId
          );
        });

        if (conflictivos.length > 0) {
          await this.marcarPagosAprobados(trx, pagos, paymentId, detalle);
          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            preferenceId: preferenceIds.size === 1 ? String([...preferenceIds][0]) : null,
            codigo: 'numero_no_asignable',
            montoRecibido,
            detalle: {
              ...detalle,
              numeroIds_conflictivos: conflictivos,
              motivo_tecnico: 'asignacion_atomica_imposible',
            },
          }, trx);
          return { confirmed: false, incident: true, numeroIds };
        }

        const sorteo = await trx('sorteos').where({ id: sorteoId }).first();
        if (!sorteo) {
          await this.marcarPagosAprobados(trx, pagos, paymentId, detalle);
          await this.registrarIncidencia({
            paymentId,
            checkoutId,
            codigo: 'checkout_inconsistente',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'sorteo_inexistente' },
          }, trx);
          return { confirmed: false, incident: true, numeroIds };
        }

        for (const pago of pagos) {
          const numero = numerosPorId.get(pago.numero_id)!;
          await trx('numeros').where({ id: numero.id }).update({
            estado: 'vendido',
            reservado_por: null,
            reservado_hasta: null,
          });

          const [participacion] = await trx('participaciones').insert({
            usuario_id: userId,
            numero_id: numero.id,
            sorteo_id: sorteoId,
            monto_pagado: pago.monto,
            comprobante_codigo: this.codigoComprobante(paymentId, numero.id),
            comprobante_emitido_at: new Date(),
          }).returning('*');
          const externalId = pagos.length === 1 ? paymentId : `${paymentId}:${numero.id}`;

          await trx('pagos').where({ id: pago.id }).update({
            participacion_id: participacion.id,
            external_id: externalId,
            estado: 'aprobado',
            webhook_payload: detalle,
            procesado_at: new Date(),
          });

          redisIds.push(numero.id);
          auditLogs.push(this.auditPagoAprobado({
            paymentId,
            preferenceId: pago.preference_id,
            externalId,
            userId,
            sorteo,
            numero,
            participacion,
            monto: pago.monto,
          }));
        }

        return { confirmed: true, incident: false, numeroIds };
      });

      for (const numeroId of redisIds) await this.redis.del(`reserva:${numeroId}`);
      for (const log of auditLogs) await this.auditService.registrar(log);

      return { ...resultado, paymentId };
    } catch (error: any) {
      return this.resolverErrorConciliacion(paymentId, montoRecibido, detalle, error, checkoutId);
    }
  }

  private async conciliarPagoLegacy(
    paymentId: string,
    referencia: { numeroIds: string[]; userId: string; sorteoId: string },
    montoRecibido: string,
    montoRecibidoCentavos: bigint,
    detalle: Record<string, unknown>,
  ) {
    const { numeroIds, userId, sorteoId } = referencia;
    const auditLogs: any[] = [];
    const redisIds: string[] = [];

    if (montoRecibidoCentavos % BigInt(numeroIds.length) !== 0n) {
      await this.registrarIncidencia({
        paymentId,
        codigo: 'monto_no_coincide',
        montoRecibido,
        detalle: { ...detalle, motivo_tecnico: 'monto_legacy_no_divisible' },
      });
      return { confirmed: false, incident: true, paymentId, numeroIds };
    }

    try {
      const resultado = await this.db.transaction(async (trx) => {
        const numeros = await trx('numeros')
          .whereIn('id', numeroIds)
          .orderBy('id', 'asc')
          .forUpdate();
        const participaciones = await trx('participaciones')
          .whereIn('numero_id', numeroIds)
          .select('numero_id');
        const conParticipacion = new Set(participaciones.map((p) => p.numero_id));
        const numerosPorId = new Map(numeros.map((numero) => [numero.id, numero]));
        const conflictivos = numeroIds.filter((numeroId) => {
          const numero = numerosPorId.get(numeroId);
          if (!numero || numero.sorteo_id !== sorteoId || conParticipacion.has(numeroId)) return true;
          return numero.estado !== 'libre' && !(
            numero.estado === 'reservado' && numero.reservado_por === userId
          );
        });

        if (conflictivos.length > 0) {
          await this.registrarIncidencia({
            paymentId,
            codigo: 'numero_no_asignable',
            montoRecibido,
            detalle: {
              ...detalle,
              numeroIds_conflictivos: conflictivos,
              motivo_tecnico: 'asignacion_legacy_imposible',
            },
          }, trx);
          return { confirmed: false, incident: true };
        }

        const [sorteo, user] = await Promise.all([
          trx('sorteos').where({ id: sorteoId }).first(),
          trx('users').where({ id: userId }).first('id'),
        ]);
        if (!sorteo || !user) {
          await this.registrarIncidencia({
            paymentId,
            codigo: 'checkout_inconsistente',
            montoRecibido,
            detalle: { ...detalle, motivo_tecnico: 'entidad_legacy_inexistente' },
          }, trx);
          return { confirmed: false, incident: true };
        }

        const montoPorNumero = this.centavosADecimal(
          montoRecibidoCentavos / BigInt(numeroIds.length),
        );

        for (const numeroId of numeroIds) {
          const numero = numerosPorId.get(numeroId)!;
          await trx('numeros').where({ id: numero.id }).update({
            estado: 'vendido',
            reservado_por: null,
            reservado_hasta: null,
          });
          const [participacion] = await trx('participaciones').insert({
            usuario_id: userId,
            numero_id: numero.id,
            sorteo_id: sorteoId,
            monto_pagado: montoPorNumero,
            comprobante_codigo: this.codigoComprobante(paymentId, numero.id),
            comprobante_emitido_at: new Date(),
          }).returning('*');
          const externalId = numeroIds.length === 1 ? paymentId : `${paymentId}:${numero.id}`;

          await trx('pagos').insert({
            participacion_id: participacion.id,
            usuario_id: userId,
            numero_id: numero.id,
            sorteo_id: sorteoId,
            proveedor: 'mercadopago',
            preference_id: null,
            external_id: externalId,
            monto: montoPorNumero,
            estado: 'aprobado',
            webhook_payload: detalle,
            procesado_at: new Date(),
          });

          redisIds.push(numero.id);
          auditLogs.push(this.auditPagoAprobado({
            paymentId,
            preferenceId: null,
            externalId,
            userId,
            sorteo,
            numero,
            participacion,
            monto: montoPorNumero,
          }));
        }

        return { confirmed: true, incident: false };
      });

      for (const numeroId of redisIds) await this.redis.del(`reserva:${numeroId}`);
      for (const log of auditLogs) await this.auditService.registrar(log);

      return { ...resultado, paymentId, numeroIds };
    } catch (error: any) {
      return this.resolverErrorConciliacion(paymentId, montoRecibido, detalle, error);
    }
  }

  private async marcarPagosAprobados(
    trx: Knex.Transaction,
    pagos: any[],
    paymentId: string,
    detalle: Record<string, unknown>,
  ) {
    for (const pago of pagos) {
      const externalId = pagos.length === 1 ? paymentId : `${paymentId}:${pago.numero_id}`;
      await trx('pagos').where({ id: pago.id }).update({
        external_id: externalId,
        estado: 'aprobado',
        webhook_payload: detalle,
        procesado_at: new Date(),
      });
    }
  }

  private async registrarIncidencia(
    input: {
      paymentId: string;
      codigo: string;
      montoRecibido: string | null;
      detalle: Record<string, unknown>;
      checkoutId?: string | null;
      preferenceId?: string | null;
    },
    db: Knex | Knex.Transaction = this.db,
  ) {
    await db('pagos_incidencias')
      .insert({
        payment_external_id: input.paymentId,
        preference_id: input.preferenceId ?? null,
        checkout_id: input.checkoutId ?? null,
        codigo: input.codigo,
        estado: 'abierta',
        monto_recibido: input.montoRecibido,
        detalle: input.detalle,
      })
      .onConflict('payment_external_id')
      .ignore();
  }

  private async resolverErrorConciliacion(
    paymentId: string,
    montoRecibido: string,
    detalle: Record<string, unknown>,
    error: any,
    checkoutId?: string,
  ) {
    const pagoExistente = await this.db('pagos')
      .where('external_id', paymentId)
      .orWhere('external_id', 'like', `${paymentId}:%`)
      .first();
    const incidenciaExistente = await this.db('pagos_incidencias')
      .where({ payment_external_id: paymentId })
      .first();

    if (pagoExistente?.estado === 'aprobado' || incidenciaExistente) {
      return {
        confirmed: Boolean(pagoExistente?.participacion_id),
        incident: Boolean(incidenciaExistente),
        paymentId,
        idempotent: true,
      };
    }

    this.logger.error(
      `Error conciliando pago MP ${paymentId}: ${error?.message || 'error desconocido'}`,
    );
    await this.registrarIncidencia({
      paymentId,
      checkoutId: checkoutId ?? null,
      codigo: 'checkout_inconsistente',
      montoRecibido,
      detalle: { ...detalle, motivo_tecnico: 'error_transaccional_conciliacion' },
    });
    return { confirmed: false, incident: true, paymentId };
  }

  private checkoutIdDesdeReferencia(externalReference: string) {
    const match = /^checkout:([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i
      .exec(externalReference);
    return match?.[1] ?? null;
  }

  private parsearReferenciaLegacy(externalReference: string) {
    if (externalReference.startsWith('multi:')) {
      const parts = externalReference.split(':');
      if (parts.length !== 4) return null;
      const numeroIds = parts[1].split(',').filter(Boolean);
      if (numeroIds.length === 0 || new Set(numeroIds).size !== numeroIds.length) return null;
      return { numeroIds, userId: parts[2], sorteoId: parts[3] };
    }

    const parts = externalReference.split(':');
    if (parts.length !== 3 || parts.some((part) => !part)) return null;
    return { numeroIds: [parts[0]], userId: parts[1], sorteoId: parts[2] };
  }

  private montoACentavos(value: unknown): bigint | null {
    const raw = String(value ?? '').trim();
    const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(raw);
    if (!match) return null;
    return BigInt(match[1]) * 100n + BigInt((match[2] ?? '').padEnd(2, '0'));
  }

  private montoDecimalSeguro(value: unknown): string | null {
    const centavos = this.montoACentavos(value);
    return centavos === null ? null : this.centavosADecimal(centavos);
  }

  private centavosADecimal(centavos: bigint) {
    return `${centavos / 100n}.${String(centavos % 100n).padStart(2, '0')}`;
  }

  private detalleFinancieroSeguro(payment: any): Record<string, unknown> {
    return {
      status: typeof payment.status === 'string' ? payment.status : null,
      status_detail: typeof payment.status_detail === 'string' ? payment.status_detail : null,
      external_reference: typeof payment.external_reference === 'string'
        ? payment.external_reference
        : null,
      transaction_amount: this.montoDecimalSeguro(payment.transaction_amount),
      currency_id: typeof payment.currency_id === 'string' ? payment.currency_id : null,
    };
  }

  private codigoComprobante(paymentId: string, numeroId: string) {
    return `SOR-${new Date().getFullYear()}-${paymentId.slice(-10)}-${numeroId.slice(0, 6).toUpperCase()}`;
  }

  private auditPagoAprobado(input: any) {
    return {
      actorId: input.userId,
      actorRole: 'participante',
      accion: 'pago.mercadopago.aprobado',
      entidadTipo: 'participacion',
      entidadId: input.participacion.id,
      comercioId: input.sorteo.comercio_id,
      sorteoId: input.sorteo.id,
      metadata: {
        paymentId: input.paymentId,
        preferenceId: input.preferenceId,
        externalId: input.externalId,
        sorteoNombre: input.sorteo.nombre,
        numeroId: input.numero.id,
        numeroVisible: input.numero.numero_visible,
        participacionId: input.participacion.id,
        monto: input.monto,
        proveedor: 'mercadopago',
        estado: 'aprobado',
      },
    };
  }

      async obtenerMisPremios(userId: string) {
    const premios = await this.db('entregas_premios')
      .join('sorteos', 'entregas_premios.sorteo_id', 'sorteos.id')
      .join('participaciones', 'entregas_premios.participacion_id', 'participaciones.id')
      .join('numeros', 'participaciones.numero_id', 'numeros.id')
      .join('comercios', 'entregas_premios.comercio_id', 'comercios.id')
      .where('entregas_premios.ganador_id', userId)
      .select(
        'entregas_premios.*',
        'sorteos.nombre as sorteo_nombre',
        'numeros.numero_visible',
        'comercios.razon_social as comercio_nombre',
      )
      .orderBy('entregas_premios.created_at', 'desc');

    return { data: premios };
  }
  async confirmarRecepcionPremio(userId: string, entregaId: string) {
    const entrega = await this.db('entregas_premios')
      .where({
        id: entregaId,
        ganador_id: userId,
      })
      .first();

    if (!entrega) {
      throw new NotFoundException('Premio no encontrado');
    }

    if (entrega.estado !== 'entregado') {
      throw new BadRequestException('Solo podés confirmar premios marcados como entregados');
    }

    const [updated] = await this.db('entregas_premios')
      .where({ id: entregaId })
      .update({
        estado: 'confirmado',
        confirmado_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    const sorteo = await this.db('sorteos')
  .where({ id: entrega.sorteo_id })
  .first();

const comercio = await this.db('comercios')
  .where({ id: entrega.comercio_id })
  .first();

const montoBruto = Number(sorteo.recaudacion_total || 0);
const comisionPct = Number(comercio.comision_pct || 0);
const montoComision = (montoBruto * comisionPct) / 100;
const montoNeto = montoBruto - montoComision;

await this.db('liberaciones_fondos')
  .insert({
    entrega_id: entrega.id,
    sorteo_id: entrega.sorteo_id,
    comercio_id: entrega.comercio_id,
    monto_bruto: montoBruto,
    comision_pct: comisionPct,
    monto_comision: montoComision,
    monto_neto: montoNeto,
    estado: 'liberado',
    liberado_at: new Date(),
  })
  .onConflict('entrega_id')
  .merge(); 




    return {
      mensaje: 'Recepción del premio confirmada',
      entrega: updated,
    };
  }

  async reclamarPremio(userId: string, entregaId: string, motivo: string) {
    const entrega = await this.db('entregas_premios')
      .where({
        id: entregaId,
        ganador_id: userId,
      })
      .first();

    if (!entrega) {
      throw new NotFoundException('Premio no encontrado');
    }

    if (entrega.estado === 'confirmado') {
  throw new BadRequestException(
    'No podés reclamar un premio ya confirmado',
  );
}
    

    const [updated] = await this.db('entregas_premios')
      .where({ id: entregaId })
      .update({
        estado: 'reclamado',
        reclamado_at: new Date(),
        notas_ganador: motivo || 'Reclamo iniciado por el ganador',
        updated_at: new Date(),
      })
      .returning('*');

    await this.db('liberaciones_fondos')
  .insert({
    entrega_id: entrega.id,
    sorteo_id: entrega.sorteo_id,
    comercio_id: entrega.comercio_id,
    estado: 'retenido',
    motivo: motivo,
    retenido_at: new Date(),
  })
  .onConflict('entrega_id')
  .merge({
    estado: 'retenido',
    motivo: motivo,
    retenido_at: new Date(),
  }); 


   await this.auditService.registrar({
  actorId: userId,
  actorRole: 'participante',
  accion: 'premio.reclamado',
  entidadTipo: 'entrega_premio',
  entidadId: entregaId,
  comercioId: entrega.comercio_id,
  sorteoId: entrega.sorteo_id,
  metadata: {
    entregaId,
    ganadorId: userId,
    participacionId: entrega.participacion_id,
    motivo: motivo || 'Reclamo iniciado por el ganador',
    estadoAnterior: entrega.estado,
    estadoNuevo: 'reclamado',
    fondos: 'retenidos',
  },
});

    return {
      mensaje: 'Reclamo iniciado. Un administrador revisará el caso.',
      entrega: updated,
    };
  }

  // ─── PARTICIPACIONES ──────────────────────────────────────

  async obtenerParticipaciones(userId: string) {
    return this.db('participaciones')
      .join('numeros', 'participaciones.numero_id', 'numeros.id')
      .join('sorteos', 'participaciones.sorteo_id', 'sorteos.id')
      .join('comercios', 'sorteos.comercio_id', 'comercios.id')
      .where('participaciones.usuario_id', userId)
      .select(
        'participaciones.id',
        'participaciones.monto_pagado',
        'participaciones.comprobante_url',
        'participaciones.comprobante_codigo',
        'participaciones.comprobante_emitido_at',
        'participaciones.created_at',
        'numeros.numero_visible',
        'sorteos.nombre as sorteo_nombre',
        'sorteos.estado as sorteo_estado',
        'sorteos.fecha_sorteo',
        'sorteos.ganador_participacion_id',
        'comercios.razon_social as comercio',
      )
      .orderBy('participaciones.created_at', 'desc');
  }

  // ─── DEV ──────────────────────────────────────────────────

    async simularPagoAprobado(sorteoId: string, numeroId: string, userId: string) {
    const resultado = await this.db.transaction(async (trx) => {
      const numero = await trx('numeros')
        .where({
          id: numeroId,
          sorteo_id: sorteoId,
        })
        .first();

      if (!numero) {
        throw new NotFoundException('Número no encontrado');
      }

      if (numero.estado === 'vendido') {
        throw new BadRequestException('El número ya está vendido');
      }

      const sorteo = await trx('sorteos')
        .where({ id: sorteoId })
        .first();

      if (!sorteo) {
        throw new NotFoundException('Sorteo no encontrado');
      }

      await trx('numeros')
        .where({ id: numeroId })
        .update({
          estado: 'vendido',
          reservado_por: null,
          reservado_hasta: null,
        });

      const comprobanteCodigo = `SOR-${new Date().getFullYear()}-DEV-${String(Date.now()).slice(-8)}-${String(numeroId).slice(0, 6).toUpperCase()}`;
      const comprobanteEmitidoAt = new Date();

      const [participacion] = await trx('participaciones')
        .insert({
          usuario_id: userId,
          numero_id: numeroId,
          sorteo_id: sorteoId,
          monto_pagado: sorteo.valor_numero,
          comprobante_codigo: comprobanteCodigo,
          comprobante_emitido_at: comprobanteEmitidoAt,
        })
        .returning('*');

      const devId = `dev-${Date.now()}`;

      await trx('pagos').insert({
        participacion_id: participacion.id,
        usuario_id: userId,
        numero_id: numeroId,
        proveedor: 'mercadopago',
        preference_id: devId,
        external_id: devId,
        monto: sorteo.valor_numero,
        estado: 'aprobado',
        webhook_payload: { dev: true },
        procesado_at: new Date(),
      });

      await this.redis.del(`reserva:${numeroId}`);

      return {
        mensaje: 'Pago simulado correctamente',
        participacion,
        audit: {
          sorteo,
          numero,
          devId,
        },
      };
    });

    await this.auditService.registrar({
      actorId: userId,
      actorRole: 'participante',
      accion: 'pago.simulado',
      entidadTipo: 'participacion',
      entidadId: resultado.participacion.id,
      comercioId: resultado.audit.sorteo.comercio_id,
      sorteoId,
      metadata: {
        sorteoNombre: resultado.audit.sorteo.nombre,
        numeroId,
        numeroVisible: resultado.audit.numero.numero_visible,
        participacionId: resultado.participacion.id,
        monto: resultado.participacion.monto_pagado,
        proveedor: 'mercadopago',
        externalId: resultado.audit.devId,
        estado: 'aprobado',
      },
    });

    return {
      mensaje: resultado.mensaje,
      participacion: resultado.participacion,
    };
  }
  private async liberarReservasVencidas(sorteoId?: string) {
    const query = this.db('numeros')
      .where({ estado: 'reservado' })
      .whereNotNull('reservado_hasta')
      .where('reservado_hasta', '<', new Date());

    if (sorteoId) {
      query.andWhere({ sorteo_id: sorteoId });
    }

    return query.update({
      estado: 'libre',
      reservado_por: null,
      reservado_hasta: null,
      notif_expiracion_enviada: false,
    });
  }

}
