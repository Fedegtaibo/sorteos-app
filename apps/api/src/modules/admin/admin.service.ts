import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class AdminService {
  constructor(@Inject('KNEX') private readonly db: Knex) {}

  async estadisticasGlobales() {
    const [usuarios, comercios, sorteos, pagos] = await Promise.all([
      this.db('users').count('* as total').groupBy('role').select('role'),
      this.db('comercios').count('* as total').groupBy('estado').select('estado'),
      this.db('sorteos').count('* as total').groupBy('estado').select('estado'),
      this.db('pagos').where('estado', 'aprobado').sum('monto as total').first(),
    ]);

    const usuariosMap = Object.fromEntries(usuarios.map(u => [u.role, Number(u.total)]));
    const comerciosMap = Object.fromEntries(comercios.map(c => [c.estado, Number(c.total)]));
    const sorteosMap = Object.fromEntries(sorteos.map(s => [s.estado, Number(s.total)]));
    const volumenTotal = Number(pagos?.total || 0);

    // Calcular comision promedio (8%) sobre el volumen
    const comisionEstimada = volumenTotal * 0.08;

    return {
      usuarios: {
        total: Object.values(usuariosMap).reduce((a, b) => a + b, 0),
        participantes: usuariosMap['participante'] || 0,
        comercios: usuariosMap['comercio'] || 0,
        admins: usuariosMap['admin'] || 0,
      },
      comercios: {
        total: Object.values(comerciosMap).reduce((a, b) => a + b, 0),
        aprobados: comerciosMap['aprobado'] || 0,
        pendientes: comerciosMap['pendiente'] || 0,
        suspendidos: comerciosMap['suspendido'] || 0,
      },
      sorteos: {
        total: Object.values(sorteosMap).reduce((a, b) => a + b, 0),
        activos: sorteosMap['activo'] || 0,
        finalizados: sorteosMap['finalizado'] || 0,
        borradores: sorteosMap['borrador'] || 0,
      },
      finanzas: {
        volumenTotal,
        comisionEstimada,
        ticketPromedio: volumenTotal > 0 ? volumenTotal / (sorteosMap['finalizado'] || 1) : 0,
      },
    };
  }

  async listarUsuarios(filtros: { role?: string; page?: number; limit?: number }) {
    const page = filtros.page || 1;
    const limit = Math.min(filtros.limit || 20, 100);
    const offset = (page - 1) * limit;

    let query = this.db('users').select('id', 'email', 'role', 'email_verified', 'is_blocked', 'created_at');
    if (filtros.role) query = query.where('role', filtros.role);

    const [{ count }] = await this.db('users').count('* as count');
    const data = await query.orderBy('created_at', 'desc').limit(limit).offset(offset);

    return { data, meta: { page, limit, total: Number(count) } };
  }

  async bloquearUsuario(userId: string, bloquear: boolean) {
    await this.db('users').where({ id: userId }).update({ is_blocked: bloquear });
    return { mensaje: bloquear ? 'Usuario bloqueado' : 'Usuario desbloqueado' };
  }

  async listaSorteosTodos(filtros: { page?: number; limit?: number }) {
    const page = filtros.page || 1;
    const limit = Math.min(filtros.limit || 30, 100);
    const offset = (page - 1) * limit;

    const [{ count }] = await this.db('sorteos').count('* as count');

    const data = await this.db('sorteos')
      .join('comercios', 'sorteos.comercio_id', 'comercios.id')
      .select('sorteos.*', 'comercios.razon_social as comercio')
      .orderBy('sorteos.created_at', 'desc')
      .limit(limit).offset(offset);

    return { data, meta: { page, limit, total: Number(count) } };
  }

async listarReclamos() {
  const data = await this.db('entregas_premios')
    .join('sorteos', 'entregas_premios.sorteo_id', 'sorteos.id')
    .join('comercios', 'entregas_premios.comercio_id', 'comercios.id')
    .join('users', 'entregas_premios.ganador_id', 'users.id')
    .leftJoin('liberaciones_fondos', 'entregas_premios.id', 'liberaciones_fondos.entrega_id')
    .where('entregas_premios.estado', 'reclamado')
    .select(
      'entregas_premios.*',
      'sorteos.nombre as sorteo_nombre',
      'comercios.razon_social as comercio_nombre',
      'users.email as ganador_email',
      'liberaciones_fondos.estado as fondos_estado',
      'liberaciones_fondos.monto_bruto',
      'liberaciones_fondos.monto_neto',
      'liberaciones_fondos.motivo as fondos_motivo',
    )
    .orderBy('entregas_premios.reclamado_at', 'desc');

  return { data };
}
async liberarReclamo(entregaId: string) {
  await this.db('liberaciones_fondos')
    .where({ entrega_id: entregaId })
    .update({
      estado: 'liberado',
      liberado_at: new Date(),
    });

  await this.db('entregas_premios')
    .where({ id: entregaId })
    .update({
      estado: 'confirmado',
    });

  return { mensaje: 'Fondos liberados' };
}

async ponerEnRevision(entregaId: string) {
  await this.db('liberaciones_fondos')
    .where({ entrega_id: entregaId })
    .update({
      estado: 'retenido',
      motivo: 'En revisión',
    });

  return { mensaje: 'Reclamo en revisión' };
}

async cerrarReclamo(entregaId: string) {
  await this.db('entregas_premios')
    .where({ id: entregaId })
    .update({
      estado: 'confirmado',
    });

  return { mensaje: 'Reclamo cerrado' };
}
  
async listarAuditoria(limit = 100) {
  const safeLimit = Math.min(Number(limit) || 100, 200);

  const data = await this.db('audit_logs')
    .leftJoin('users as actor', 'audit_logs.actor_id', 'actor.id')
    .leftJoin('sorteos', 'audit_logs.sorteo_id', 'sorteos.id')
    .leftJoin('comercios', 'audit_logs.comercio_id', 'comercios.id')
    .select(
      'audit_logs.id',
      'audit_logs.actor_id',
      'audit_logs.actor_role',
      'audit_logs.accion',
      'audit_logs.entidad_tipo',
      'audit_logs.entidad_id',
      'audit_logs.comercio_id',
      'audit_logs.sorteo_id',
      'audit_logs.metadata',
      'audit_logs.created_at',
      'actor.email as actor_email',
      'sorteos.nombre as sorteo_nombre',
      'comercios.razon_social as comercio_nombre',
    )
    .orderBy('audit_logs.created_at', 'desc')
    .limit(safeLimit);

  return { data };
}

}
