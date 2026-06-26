import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Knex } from 'knex';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject('KNEX') private readonly db: Knex,
    private readonly notificationsService: NotificationsService,
  ) {}

  async listarMensajes(entregaId: string, userId: string) {
    await this.validarAcceso(entregaId, userId);

    await this.db('mensajes_entregas')
      .where('entrega_id', entregaId)
      .whereNot('sender_id', userId)
      .where('leido', false)
      .update({ leido: true });

    const data = await this.db('mensajes_entregas')
      .join('users', 'mensajes_entregas.sender_id', 'users.id')
      .where('mensajes_entregas.entrega_id', entregaId)
      .select(
        'mensajes_entregas.*',
        'users.email as sender_email',
        'users.role as sender_role',
      )
      .orderBy('mensajes_entregas.created_at', 'asc');

    return { data };
  }

  async enviarMensaje(entregaId: string, userId: string, mensaje: string) {
    const entrega = await this.validarAcceso(entregaId, userId);

    if (!mensaje || !mensaje.trim()) {
      throw new ForbiddenException('El mensaje no puede estar vacío');
    }

    const [created] = await this.db('mensajes_entregas')
      .insert({
        entrega_id: entregaId,
        sender_id: userId,
        mensaje: mensaje.trim(),
      })
      .returning('*');

    const destinatarioId =
      entrega.ganador_id === userId
        ? entrega.comercio_user_id
        : entrega.ganador_id;

    const url =
      entrega.ganador_id === userId
        ? '/dashboard/entregas'
        : '/dashboard/premios';

    await this.notificationsService.crearNotificacion({
      usuarioId: destinatarioId,
      tipo: 'chat',
      titulo: 'Nuevo mensaje en una entrega',
      mensaje: 'Tenés un nuevo mensaje relacionado con la entrega de un premio.',
      url,
    });

    return {
      mensaje: 'Mensaje enviado',
      data: created,
    };
  }

  private async validarAcceso(entregaId: string, userId: string) {
    const entrega = await this.db('entregas_premios')
      .join('comercios', 'entregas_premios.comercio_id', 'comercios.id')
      .where('entregas_premios.id', entregaId)
      .select(
        'entregas_premios.*',
        'comercios.user_id as comercio_user_id',
      )
      .first();

    if (!entrega) {
      throw new NotFoundException('Entrega no encontrada');
    }

    const esGanador = entrega.ganador_id === userId;
    const esComercio = entrega.comercio_user_id === userId;

    if (!esGanador && !esComercio) {
      throw new ForbiddenException('No tenés acceso a este chat');
    }

    return entrega;
  }
}