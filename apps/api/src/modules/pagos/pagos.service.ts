import {
  Injectable, ConflictException, NotFoundException,
  BadRequestException, Logger, Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import Redis from 'ioredis';
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
    return this.db.transaction(async (trx) => {
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

    const numeros = await this.db('numeros')
      .whereIn('id', idsUnicos)
      .where({
        sorteo_id: sorteoId,
        reservado_por: userId,
        estado: 'reservado',
      })
      .orderBy('numero_visible', 'asc');

    if (numeros.length !== idsUnicos.length) {
      throw new BadRequestException({
        code: 'RESERVA_INVALIDA',
        message: 'Alguno de los números no está reservado para vos o la reserva expiró',
      });
    }

    const sorteo = await this.db('sorteos').where({ id: sorteoId }).first();
    if (!sorteo) throw new NotFoundException('Sorteo no encontrado');

    const user = await this.db('users').where({ id: userId }).first('email');
    if (!user) throw new NotFoundException('Usuario no encontrado');

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

    const externalReference =
      idsUnicos.length === 1
        ? `${idsUnicos[0]}:${userId}:${sorteoId}`
        : `multi:${idsUnicos.join(',')}:${userId}:${sorteoId}`;

    const preferenceBody = {
      items,
      payer: { email: user.email },
      external_reference: externalReference,
      notification_url: `${baseUrl}/webhooks/mercadopago`,
      back_urls: {
        success: `${frontendUrl}/pago/exitoso`,
        failure: `${frontendUrl}/pago/fallido`,
        pending: `${frontendUrl}/pago/pendiente`,
      },
      auto_return: 'approved',
      expires: true,
      expiration_date_to: new Date(minReservadoHasta).toISOString(),
    };

        const mpResponse = await fetch(
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

    if (!mpResponse.ok) {
      const error = await mpResponse.text();

      this.logger.error(
        `Error creando preferencia MP: ${error}`,
      );

      throw new BadRequestException({
        code: 'BAD_REQUEST',
        message: 'No se pudo crear el pago. Intentá de nuevo.',
      });
    }

    const preference: any = await mpResponse.json();

    return {
      checkoutUrl:
        preference.init_point || preference.sandbox_init_point,
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


 

    await this.pagosQueue.add(
      'confirmar-pago-mp',
      { paymentId: body.data.id },
      {
        jobId: `mp-payment-${body.data.id}`,
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );

    return { received: true };
  }

  async confirmarPagoMP(paymentId: string) {
    const existente = await this.db('pagos')
      .where('external_id', String(paymentId))
      .orWhere('external_id', 'like', `${paymentId}:%`)
      .first();

    if (existente?.estado === 'aprobado') {
      this.logger.log(`Pago ${paymentId} ya procesado. Ignorando.`);
      return { skipped: true };
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { Authorization: `Bearer ${this.config.get('MP_ACCESS_TOKEN')}` } },
    );

    const payment = await mpResponse.json();

    if (payment.status !== 'approved') {
      this.logger.log(`Pago ${paymentId} no aprobado: ${payment.status}`);

      await this.db('pagos')
        .where({ preference_id: payment.preference_id })
        .update({
          estado: payment.status === 'rejected' ? 'rechazado' : 'pendiente',
        });

      return { status: payment.status };
    }

    const externalReference = payment.external_reference as string;

    let numeroIds: string[] = [];
    let userId: string;
    let sorteoId: string;

    if (externalReference.startsWith('multi:')) {
      const [, numerosRaw, usuarioRaw, sorteoRaw] = externalReference.split(':');
      numeroIds = numerosRaw.split(',').filter(Boolean);
      userId = usuarioRaw;
      sorteoId = sorteoRaw;
    } else {
      const [numeroId, usuarioRaw, sorteoRaw] = externalReference.split(':');
      numeroIds = [numeroId];
      userId = usuarioRaw;
      sorteoId = sorteoRaw;
    }

    const auditLogs: any[] = [];
    let compraConfirmada = false;

    try {
      await this.db.transaction(async (trx) => {
        const numeros = await trx('numeros')
          .whereIn('id', numeroIds)
          .where({
            estado: 'reservado',
            reservado_por: userId,
            sorteo_id: sorteoId,
          })
          .forUpdate();

        if (numeros.length !== numeroIds.length) {
          this.logger.warn(
            `Uno o mas numeros no disponibles para pago ${paymentId}. No se confirma la compra.`,
          );
          return;
        }

        const sorteo = await trx('sorteos')
          .where({ id: sorteoId })
          .first();

        if (!sorteo) {
          throw new NotFoundException('Sorteo no encontrado');
        }

        const montoPorNumero = Number(payment.transaction_amount) / numeroIds.length;

        for (const numero of numeros) {
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
          }).returning('*');

          const externalId =
            numeroIds.length === 1
              ? String(paymentId)
              : `${paymentId}:${numero.id}`;

          const updated = await trx('pagos')
            .where({
              preference_id: payment.preference_id,
              numero_id: numero.id,
              usuario_id: userId,
            })
            .update({
              participacion_id: participacion.id,
              external_id: externalId,
              monto: montoPorNumero,
              estado: 'aprobado',
              webhook_payload: payment,
              procesado_at: new Date(),
            });

          if (!updated) {
            await trx('pagos').insert({
              participacion_id: participacion.id,
              usuario_id: userId,
              numero_id: numero.id,
              proveedor: 'mercadopago',
              preference_id: payment.preference_id,
              external_id: externalId,
              monto: montoPorNumero,
              estado: 'aprobado',
              webhook_payload: payment,
              procesado_at: new Date(),
            });
          }

          await this.redis.del(`reserva:${numero.id}`);

          auditLogs.push({
            actorId: userId,
            actorRole: 'participante',
            accion: 'pago.mercadopago.aprobado',
            entidadTipo: 'participacion',
            entidadId: participacion.id,
            comercioId: sorteo.comercio_id,
            sorteoId,
            metadata: {
              paymentId: String(paymentId),
              preferenceId: payment.preference_id,
              externalId,
              sorteoNombre: sorteo.nombre,
              numeroId: numero.id,
              numeroVisible: numero.numero_visible,
              participacionId: participacion.id,
              monto: montoPorNumero,
              proveedor: 'mercadopago',
              estado: 'aprobado',
              paymentStatus: payment.status,
              paymentMethodId: payment.payment_method_id || null,
            },
          });
        }

        compraConfirmada = true;
      });
    } catch (err: any) {
      if (err.code === '23505') {
        this.logger.warn(`Pago duplicado capturado por DB: ${paymentId}`);
        return { skipped: true, reason: 'duplicate' };
      }

      throw err;
    }

    for (const log of auditLogs) {
      await this.auditService.registrar(log);
    }

    return {
      confirmed: compraConfirmada,
      paymentId,
      numeroIds,
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

      const [participacion] = await trx('participaciones')
        .insert({
          usuario_id: userId,
          numero_id: numeroId,
          sorteo_id: sorteoId,
          monto_pagado: sorteo.valor_numero,
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
}