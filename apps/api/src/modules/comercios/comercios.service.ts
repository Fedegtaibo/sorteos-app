import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
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

    if (!comercio) {
      throw new NotFoundException('Perfil de comercio no encontrado');
    }

    return comercio;
  }

  async actualizarPerfil(userId: string, dto: any) {
    const comercio = await this.db('comercios').where({ user_id: userId }).first();

    if (!comercio) {
      throw new NotFoundException('Comercio no encontrado');
    }

    if (dto.cuit && dto.cuit !== comercio.cuit) {
      const existe = await this.db('comercios')
        .where({ cuit: dto.cuit })
        .whereNot({ id: comercio.id })
        .first();

      if (existe) {
        throw new ConflictException({
          code: 'CUIT_EN_USO',
          message: 'Ese CUIT ya está registrado',
        });
      }
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

    if (!comercio) {
      throw new NotFoundException('Comercio no aprobado');
    }

    const sorteos = await this.db('sorteos')
      .where({ comercio_id: comercio.id })
      .select('id', 'nombre', 'estado', 'valor_numero', 'cant_numeros', 'created_at');

    const ids = sorteos.map((s) => s.id);

    const vendidosPorSorteo = ids.length
      ? await this.db('numeros')
          .whereIn('sorteo_id', ids)
          .where('estado', 'vendido')
          .groupBy('sorteo_id')
          .select('sorteo_id')
          .count('* as total')
      : [];

    const vendidosMap = Object.fromEntries(
      vendidosPorSorteo.map((v) => [v.sorteo_id, Number(v.total)]),
    );

    let recaudacionTotal = 0;

    const topSorteos = sorteos
      .map((s) => {
        const vendidos = vendidosMap[s.id] || 0;
        const recaudacion = vendidos * Number(s.valor_numero);

        recaudacionTotal += recaudacion;

        return {
          id: s.id,
          nombre: s.nombre,
          estado: s.estado,
          vendidos,
          totalNumeros: Number(s.cant_numeros),
          porcentajeVendido: Number(s.cant_numeros)
            ? Math.round((vendidos / Number(s.cant_numeros)) * 100)
            : 0,
          recaudacion,
        };
      })
      .sort((a, b) => b.recaudacion - a.recaudacion)
      .slice(0, 5);

    const comision = recaudacionTotal * (Number(comercio.comision_pct) / 100);

    const entregasStats = await this.db('entregas_premios')
      .where({ comercio_id: comercio.id })
      .groupBy('estado')
      .select('estado')
      .count('* as total');

    const entregasMap = Object.fromEntries(
      entregasStats.map((e) => [e.estado, Number(e.total)]),
    );

    const pagosPorDia = ids.length
      ? await this.db('pagos')
          .join('participaciones', 'pagos.participacion_id', 'participaciones.id')
          .whereIn('participaciones.sorteo_id', ids)
          .where('pagos.estado', 'aprobado')
          .whereRaw("pagos.created_at >= NOW() - INTERVAL '30 days'")
          .select(this.db.raw("TO_CHAR(pagos.created_at, 'YYYY-MM-DD') as fecha"))
          .sum('pagos.monto as total')
          .groupByRaw("TO_CHAR(pagos.created_at, 'YYYY-MM-DD')")
          .orderBy('fecha', 'asc')
      : [];

    const participantesUnicos = ids.length
      ? await this.db('participaciones')
          .whereIn('sorteo_id', ids)
          .countDistinct('usuario_id as total')
          .first()
      : { total: 0 };

    const ventasTotales = ids.length
      ? await this.db('participaciones')
          .whereIn('sorteo_id', ids)
          .count('* as total')
          .first()
      : { total: 0 };


const topCompradores = ids.length
  ? await this.db('participaciones')
      .join('users', 'participaciones.usuario_id', 'users.id')
      .whereIn('participaciones.sorteo_id', ids)
      .groupBy('users.id', 'users.email')
      .select(
        'users.email',
        this.db.raw('COUNT(*) as total')
      )
      .orderBy('total', 'desc')
      .limit(5)
  : [];


    return {
      sorteos: {
        total: sorteos.length,
        activos: sorteos.filter((s) => s.estado === 'activo').length,
        finalizados: sorteos.filter((s) => s.estado === 'finalizado').length,
        borradores: sorteos.filter((s) => s.estado === 'borrador').length,
      },
      recaudacion: {
        bruta: recaudacionTotal,
        comision,
        neta: recaudacionTotal - comision,
        comisionPct: Number(comercio.comision_pct),
      },
      participantes: {
        unicos: Number(participantesUnicos?.total || 0),
        ventasTotales: Number(ventasTotales?.total || 0),
      },
      entregas: {
        total: Object.values(entregasMap).reduce((a: any, b: any) => a + b, 0),
        pendientes: entregasMap['pendiente'] || 0,
        preparando: entregasMap['preparando'] || 0,
        enviados: entregasMap['enviado'] || 0,
        entregados: entregasMap['entregado'] || 0,
        confirmados: entregasMap['confirmado'] || 0,
        reclamados: entregasMap['reclamado'] || 0,
      },
      topSorteos,
      ventasUltimos30Dias: pagosPorDia.map((p: any) => ({
        fecha: p.fecha,
        total: Number(p.total || 0),
      })),
topCompradores: topCompradores.map((u: any) => ({
  email: u.email,
  total: Number(u.total),
})),
    };
  }

  async listarTodos(filtros: { estado?: string; page?: number; limit?: number }) {
    const page = filtros.page || 1;
    const limit = Math.min(filtros.limit || 20, 100);
    const offset = (page - 1) * limit;

    let query = this.db('comercios')
      .join('users', 'comercios.user_id', 'users.id')
      .select('comercios.*', 'users.email');

    if (filtros.estado) {
      query = query.where('comercios.estado', filtros.estado);
    }

    const [{ count }] = await this.db('comercios').count('* as count');

    const data = await query
      .orderBy('comercios.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      meta: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  }

  async aprobar(comercioId: string, adminId: string) {
    const comercio = await this.db('comercios').where({ id: comercioId }).first();

    if (!comercio) {
      throw new NotFoundException('Comercio no encontrado');
    }

    if (comercio.estado !== 'pendiente') {
      throw new BadRequestException('Solo se pueden aprobar comercios pendientes');
    }

    const [updated] = await this.db('comercios')
      .where({ id: comercioId })
      .update({
        estado: 'aprobado',
        aprobado_por: adminId,
        aprobado_at: new Date(),
      })
      .returning('*');

    return {
      comercio: updated,
      mensaje: 'Comercio aprobado',
    };
  }

  async rechazar(comercioId: string, adminId: string, motivo: string) {
    const [updated] = await this.db('comercios')
      .where({ id: comercioId })
      .update({
        estado: 'rechazado',
        motivo_rechazo: motivo,
      })
      .returning('*');

    return {
      comercio: updated,
      mensaje: 'Comercio rechazado',
    };
  }

  async suspender(comercioId: string) {
    const sorteos = await this.db('sorteos')
      .where({ comercio_id: comercioId, estado: 'activo' })
      .select('id');

    await this.db.transaction(async (trx) => {
      if (sorteos.length) {
        await trx('sorteos')
          .whereIn('id', sorteos.map((s) => s.id))
          .update({
            estado: 'cancelado',
            cancelado_at: new Date(),
            motivo_cancelacion: 'Comercio suspendido',
          });

        await trx('numeros')
          .whereIn('sorteo_id', sorteos.map((s) => s.id))
          .where('estado', 'reservado')
          .update({
            estado: 'libre',
            reservado_por: null,
            reservado_hasta: null,
          });
      }

      await trx('comercios')
        .where({ id: comercioId })
        .update({ estado: 'suspendido' });
    });

    return {
      mensaje: `Comercio suspendido. ${sorteos.length} sorteo(s) cancelado(s).`,
    };
  }

  async actualizarComision(comercioId: string, comisionPct: number) {
    if (comisionPct < 0 || comisionPct > 50) {
      throw new BadRequestException('La comisión debe estar entre 0% y 50%');
    }

    await this.db('comercios')
      .where({ id: comercioId })
      .update({ comision_pct: comisionPct });

    return {
      mensaje: `Comisión actualizada a ${comisionPct}%`,
    };
  }

  async actualizarMercadoPagoToken(comercioId: string, accessToken: string) {
    if (!accessToken || !accessToken.startsWith('APP_USR-')) {
      throw new BadRequestException('Access Token de Mercado Pago inválido');
    }

    await this.db('comercios')
      .where({ id: comercioId })
      .update({ mp_access_token_enc: accessToken });

    return {
      mensaje: 'Token de Mercado Pago actualizado',
    };
  }

  async listarEntregas(userId: string) {
    const comercio = await this.db('comercios')
      .where({ user_id: userId })
      .first('id');

    if (!comercio) {
      throw new NotFoundException('Comercio no encontrado');
    }

    const entregas = await this.db('entregas_premios')
      .join('sorteos', 'entregas_premios.sorteo_id', 'sorteos.id')
      .join('participaciones', 'entregas_premios.participacion_id', 'participaciones.id')
      .join('numeros', 'participaciones.numero_id', 'numeros.id')
      .join('users', 'entregas_premios.ganador_id', 'users.id')
      .where('entregas_premios.comercio_id', comercio.id)
      .select(
        'entregas_premios.*',
        'sorteos.nombre as sorteo_nombre',
        'numeros.numero_visible',
        'users.email as ganador_email',
      )
      .orderBy('entregas_premios.created_at', 'desc');

    return {
      data: entregas,
    };
  }

  async actualizarEntrega(userId: string, entregaId: string, dto: any) {
    const comercio = await this.db('comercios')
      .where({ user_id: userId })
      .first('id');

    if (!comercio) {
      throw new NotFoundException('Comercio no encontrado');
    }

    const entrega = await this.db('entregas_premios')
      .where({
        id: entregaId,
        comercio_id: comercio.id,
      })
      .first();

    if (!entrega) {
      throw new NotFoundException('Entrega no encontrada');
    }

    const estadosPermitidos = ['preparando', 'enviado', 'entregado'];

    if (!estadosPermitidos.includes(dto.estado)) {
      throw new BadRequestException('Estado de entrega inválido');
    }

    const update: any = {
      estado: dto.estado,
      updated_at: new Date(),
    };

    if (dto.estado === 'preparando') {
      update.preparado_at = new Date();
      update.notas_comercio = dto.notasComercio || entrega.notas_comercio;
    }

    if (dto.estado === 'enviado') {
      update.enviado_at = new Date();
      update.empresa_envio = dto.empresaEnvio || entrega.empresa_envio;
      update.codigo_seguimiento = dto.codigoSeguimiento || entrega.codigo_seguimiento;
      update.notas_comercio = dto.notasComercio || entrega.notas_comercio;
    }

    if (dto.estado === 'entregado') {
      update.entregado_at = new Date();
      update.evidencias_urls = dto.evidenciasUrls || entrega.evidencias_urls;
      update.notas_comercio = dto.notasComercio || entrega.notas_comercio;
    }

    const [updated] = await this.db('entregas_premios')
      .where({ id: entregaId })
      .update(update)
      .returning('*');

    return {
      mensaje: 'Entrega actualizada',
      entrega: updated,
    };
  }
}