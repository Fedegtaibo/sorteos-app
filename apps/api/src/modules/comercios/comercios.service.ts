import {
  Injectable, NotFoundException, BadRequestException,
  ConflictException, Inject,
} from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class ComerciosService {
  constructor(@Inject('KNEX') private readonly db: Knex) {}

  async obtenerMiPerfil(userId: string) {
    const comercio = await this.db('comercios')
      .join('users', 'comercios.user_id', 'users.id')
      .where('comercios.user_id', userId)
      .select('comercios.*', 'users.email')
      .first();

    if (!comercio) throw new NotFoundException('Perfil de comercio no encontrado');
    return comercio;
  }

  async actualizarPerfil(userId: string, dto: any) {
    const comercio = await this.db('comercios').where({ user_id: userId }).first();
    if (!comercio) throw new NotFoundException('Comercio no encontrado');

    if (dto.cuit && dto.cuit !== comercio.cuit) {
      const existe = await this.db('comercios')
        .where({ cuit: dto.cuit })
        .whereNot({ id: comercio.id })
        .first();
      if (existe) throw new ConflictException({ code: 'CUIT_EN_USO', message: 'Ese CUIT ya está registrado' });
    }

    const [updated] = await this.db('comercios')
      .where({ user_id: userId })
      .update({
        razon_social: dto.razonSocial || comercio.razon_social,
        cuit: dto.cuit || comercio.cuit,
        telefono: dto.telefono || comercio.telefono,
      })
      .returning('*');

    return updated;
  }

  async obtenerEstadisticas(userId: string) {
    const comercio = await this.db('comercios')
      .where({ user_id: userId, estado: 'aprobado' })
      .first('id', 'comision_pct');

    if (!comercio) throw new NotFoundException('Comercio no aprobado');

    const sorteos = await this.db('sorteos')
      .where({ comercio_id: comercio.id })
      .select('id', 'estado', 'valor_numero', 'cant_numeros');

    const ids = sorteos.map(s => s.id);

    const vendidosPorSorteo = ids.length
      ? await this.db('numeros')
          .whereIn('sorteo_id', ids)
          .where('estado', 'vendido')
          .groupBy('sorteo_id')
          .select('sorteo_id')
          .count('* as total')
      : [];

    const vendidosMap = Object.fromEntries(
      vendidosPorSorteo.map(v => [v.sorteo_id, Number(v.total)])
    );

    let recaudacionTotal = 0;
    sorteos.forEach(s => {
      recaudacionTotal += (vendidosMap[s.id] || 0) * Number(s.valor_numero);
    });

    const comision = recaudacionTotal * (Number(comercio.comision_pct) / 100);

    return {
      sorteos: {
        total: sorteos.length,
        activos: sorteos.filter(s => s.estado === 'activo').length,
        finalizados: sorteos.filter(s => s.estado === 'finalizado').length,
        borradores: sorteos.filter(s => s.estado === 'borrador').length,
      },
      recaudacion: {
        bruta: recaudacionTotal,
        comision,
        neta: recaudacionTotal - comision,
        comisionPct: Number(comercio.comision_pct),
      },
    };
  }

  // ─── ADMIN ────────────────────────────────────────────────

  async listarTodos(filtros: { estado?: string; page?: number; limit?: number }) {
    const page = filtros.page || 1;
    const limit = Math.min(filtros.limit || 20, 100);
    const offset = (page - 1) * limit;

    let query = this.db('comercios')
      .join('users', 'comercios.user_id', 'users.id')
      .select('comercios.*', 'users.email');

    if (filtros.estado) query = query.where('comercios.estado', filtros.estado);

    const [{ count }] = await this.db('comercios').count('* as count');
    const data = await query.orderBy('comercios.created_at', 'desc').limit(limit).offset(offset);

    return {
      data,
      meta: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) },
    };
  }

  async aprobar(comercioId: string, adminId: string) {
    const comercio = await this.db('comercios').where({ id: comercioId }).first();
    if (!comercio) throw new NotFoundException('Comercio no encontrado');
    if (comercio.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden aprobar comercios pendientes');
    }

    const [updated] = await this.db('comercios')
      .where({ id: comercioId })
      .update({ estado: 'aprobado', aprobado_por: adminId, aprobado_at: new Date() })
      .returning('*');

    return { comercio: updated, mensaje: 'Comercio aprobado' };
  }

  async rechazar(comercioId: string, adminId: string, motivo: string) {
    const [updated] = await this.db('comercios')
      .where({ id: comercioId })
      .update({ estado: 'rechazado', motivo_rechazo: motivo })
      .returning('*');

    return { comercio: updated, mensaje: 'Comercio rechazado' };
  }

  async suspender(comercioId: string) {
    // Al suspender: cancelar todos los sorteos activos del comercio
    const sorteos = await this.db('sorteos')
      .where({ comercio_id: comercioId, estado: 'activo' })
      .select('id');

    await this.db.transaction(async (trx) => {
      if (sorteos.length) {
        await trx('sorteos')
          .whereIn('id', sorteos.map(s => s.id))
          .update({ estado: 'cancelado', cancelado_at: new Date(), motivo_cancelacion: 'Comercio suspendido' });

        // Liberar numeros reservados de esos sorteos
        await trx('numeros')
          .whereIn('sorteo_id', sorteos.map(s => s.id))
          .where('estado', 'reservado')
          .update({ estado: 'libre', reservado_por: null, reservado_hasta: null });
      }
      await trx('comercios').where({ id: comercioId }).update({ estado: 'suspendido' });
    });

    return { mensaje: `Comercio suspendido. ${sorteos.length} sorteo(s) cancelado(s).` };
  }

  async actualizarComision(comercioId: string, comisionPct: number) {
    if (comisionPct < 0 || comisionPct > 50) {
      throw new BadRequestException('La comision debe estar entre 0% y 50%');
    }
    await this.db('comercios').where({ id: comercioId }).update({ comision_pct: comisionPct });
    return { mensaje: `Comision actualizada a ${comisionPct}%` };
  }
}
