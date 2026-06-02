import {
  Injectable, ConflictException, NotFoundException,
  BadRequestException, Logger, Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);

  constructor(
    @Inject('KNEX') private readonly db: Knex,
    @Inject('REDIS') private readonly redis: Redis,
    @InjectQueue('pagos') private readonly pagosQueue: Queue,
    private readonly config: ConfigService,
  ) {}

  // ─── RESERVA ──────────────────────────────────────────────

  async reservarNumero(sorteoId: string, numeroId: string, userId: string) {
    return this.db.transaction(async (trx) => {
      // SELECT FOR UPDATE — lock exclusivo sobre esta fila
      // Garantiza que solo un usuario puede reservar este numero a la vez
      const numero = await trx('numeros')
        .where({ id: numeroId, sorteo_id: sorteoId, estado: 'libre' })
        .forUpdate()   // <-- el lock
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

      // Tambien en Redis para el job de liberacion (doble garantia)
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
      estado: 'libre', reservado_por: null, reservado_hasta: null,
    });
    await this.redis.del(`reserva:${numeroId}`);

    return { mensaje: 'Reserva liberada' };
  }

  // ─── CHECKOUT ─────────────────────────────────────────────

  async crearCheckout(sorteoId: string, numeroId: string, userId: string) {
    // Verificar que el numero esta reservado para ESTE usuario
    const numero = await this.db('numeros')
      .where({ id: numeroId, sorteo_id: sorteoId, reservado_por: userId, estado: 'reservado' })
      .first();

    if (!numero) {
      throw new BadRequestException({
        code: 'RESERVA_INVALIDA',
        message: 'El numero no esta reservado para vos o la reserva expiro',
      });
    }

    const sorteo = await this.db('sorteos').where({ id: sorteoId }).first();
    const user = await this.db('users').where({ id: userId }).first('email');

    // Crear preferencia en MercadoPago
    const mpAccessToken = this.config.get('MP_ACCESS_TOKEN');
    const baseUrl = this.config.get('BASE_URL');
    const frontendUrl = this.config.get('FRONTEND_URL');

    const preferenceBody = {
      items: [{
        title: `Número ${numero.numero_visible} — ${sorteo.nombre}`,
        quantity: 1,
        unit_price: Number(sorteo.valor_numero),
        currency_id: 'ARS',
      }],
      payer: { email: user.email },
      // external_reference es la clave que usamos en el webhook para identificar la compra
      external_reference: `${numeroId}:${userId}:${sorteoId}`,
      notification_url: `${baseUrl}/webhooks/mercadopago`,
      back_urls: {
        success: `${frontendUrl}/pago/exitoso`,
        failure: `${frontendUrl}/pago/fallido`,
        pending: `${frontendUrl}/pago/pendiente`,
      },
      auto_return: 'approved',
      expires: true,
      expiration_date_to: numero.reservado_hasta,
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`,
      },
      body: JSON.stringify(preferenceBody),
    });

    if (!mpResponse.ok) {
      const err = await mpResponse.text();
      this.logger.error('Error creando preferencia MP:', err);
      throw new BadRequestException('No se pudo crear el pago. Intentá de nuevo.');
    }

    const preference = await mpResponse.json();

    // Guardar el intento de pago en DB
    await this.db('pagos').insert({
      usuario_id: userId,
      numero_id: numeroId,
      proveedor: 'mercadopago',
      preference_id: preference.id,
      monto: sorteo.valor_numero,
      estado: 'pendiente',
    });

    return {
      checkoutUrl: preference.init_point,
      preferenceId: preference.id,
      expira: numero.reservado_hasta,
    };
  }

  // ─── WEBHOOK ──────────────────────────────────────────────

  async procesarWebhookMP(body: any) {
    if (body.type !== 'payment' || !body.data?.id) {
      return { received: true, skipped: true };
    }

    // Encolar con jobId unico = idempotencia en la cola
    // Si MP envia el mismo webhook 2 veces, BullMQ lo ignora
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
    // CAPA 2: Verificar idempotencia — ya fue procesado?
    const existente = await this.db('pagos')
      .where({ external_id: String(paymentId) })
      .first();

    if (existente?.estado === 'aprobado') {
      this.logger.log(`Pago ${paymentId} ya procesado. Ignorando.`);
      return { skipped: true };
    }

    // Consultar el estado real en MP
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      { headers: { 'Authorization': `Bearer ${this.config.get('MP_ACCESS_TOKEN')}` } },
    );

    const payment = await mpResponse.json();

    if (payment.status !== 'approved') {
      this.logger.log(`Pago ${paymentId} no aprobado: ${payment.status}`);
      await this.db('pagos')
        .where({ preference_id: payment.preference_id })
        .update({ estado: payment.status === 'rejected' ? 'rechazado' : 'pendiente' });
      return { status: payment.status };
    }

    // Extraer ids del external_reference
    const [numeroId, userId, sorteoId] = payment.external_reference.split(':');

    // Confirmar en transaccion atomica
    try {
      await this.db.transaction(async (trx) => {
        // Verificar que el numero sigue reservado para este usuario
        const numero = await trx('numeros')
          .where({ id: numeroId, estado: 'reservado', reservado_por: userId })
          .forUpdate()
          .first();

        if (!numero) {
          // El numero ya no esta disponible — devolver el pago
          this.logger.warn(`Numero ${numeroId} no disponible para pago ${paymentId}. Iniciando devolucion.`);
          // TODO: iniciar devolucion automatica
          return;
        }

        // 1. Marcar numero como vendido
        await trx('numeros').where({ id: numeroId }).update({
          estado: 'vendido', reservado_por: null, reservado_hasta: null,
        });

        // 2. Crear participacion
        const [participacion] = await trx('participaciones').insert({
          usuario_id: userId,
          numero_id: numeroId,
          sorteo_id: sorteoId,
          monto_pagado: payment.transaction_amount,
        }).returning('*');

        // 3. Registrar pago aprobado
        // CAPA 3: Si external_id ya existe, PostgreSQL tira UniqueConstraintError
        await trx('pagos').insert({
          participacion_id: participacion.id,
          usuario_id: userId,
          numero_id: numeroId,
          proveedor: 'mercadopago',
          external_id: String(paymentId),
          monto: payment.transaction_amount,
          estado: 'aprobado',
          webhook_payload: payment,
          procesado_at: new Date(),
        });

        // 4. Limpiar Redis
        await this.redis.del(`reserva:${numeroId}`);
      });
    } catch (err: any) {
      // UniqueConstraintError de PostgreSQL = pago duplicado capturado por DB
      if (err.code === '23505') {
        this.logger.warn(`Pago duplicado capturado por DB: ${paymentId}`);
        return { skipped: true, reason: 'duplicate' };
      }
      throw err;
    }

    return { confirmed: true, paymentId };
  }

  // ─── PARTICIPACIONES ──────────────────────────────────────

  async obtenerParticipaciones(userId: string) {
    return this.db('participaciones')
      .join('numeros', 'participaciones.numero_id', 'numeros.id')
      .join('sorteos', 'participaciones.sorteo_id', 'sorteos.id')
      .join('comercios', 'sorteos.comercio_id', 'comercios.id')
      .where('participaciones.usuario_id', userId)
      .select(
        'participaciones.id', 'participaciones.monto_pagado',
        'participaciones.comprobante_url', 'participaciones.created_at',
        'numeros.numero_visible',
        'sorteos.nombre as sorteo_nombre', 'sorteos.estado as sorteo_estado',
        'sorteos.fecha_sorteo', 'sorteos.ganador_participacion_id',
        'comercios.razon_social as comercio',
      )
      .orderBy('participaciones.created_at', 'desc');
  }
}
