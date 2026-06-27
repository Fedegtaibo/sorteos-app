import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

type AuditLogInput = {
  actorId?: string | null;
  actorRole?: string | null;
  accion: string;
  entidadTipo?: string | null;
  entidadId?: string | null;
  comercioId?: string | null;
  sorteoId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: any;
};

@Injectable()
export class AuditService {
  constructor(@Inject('KNEX') private readonly db: Knex) {}

  async registrar(input: AuditLogInput) {
    try {
      const [log] = await this.db('audit_logs')
        .insert({
          actor_id: input.actorId || null,
          actor_role: input.actorRole || null,
          accion: input.accion,
          entidad_tipo: input.entidadTipo || null,
          entidad_id: input.entidadId || null,
          comercio_id: input.comercioId || null,
          sorteo_id: input.sorteoId || null,
          ip: input.ip || null,
          user_agent: input.userAgent || null,
          metadata: input.metadata || null,
        })
        .returning('*');

      return log;
    } catch (error) {
      console.error('Error registrando audit log:', error);
      return null;
    }
  }

  async listar(limit = 100) {
    return this.db('audit_logs')
      .leftJoin('users', 'audit_logs.actor_id', 'users.id')
      .select(
        'audit_logs.*',
        'users.email as actor_email',
      )
      .orderBy('audit_logs.created_at', 'desc')
      .limit(limit);
  }
}