import {
  Injectable, NotFoundException, BadRequestException,
  ForbiddenException, ConflictException, Inject,
} from '@nestjs/common';
import { Knex } from 'knex';
import { createHash, randomBytes } from 'crypto';
import { CreateSorteoDto } from './dto/create-sorteo.dto';
import { RealizarSorteoDto } from './dto/realizar-sorteo.dto';
import { NotificationsService } from '../notifications/notifications.service';
@Injectable()
export class SorteosService {
  constructor(
  @Inject('KNEX') private readonly db: Knex,
  private readonly notificationsService: NotificationsService,
) {}

  // ─── PUBLICO ──────────────────────────────────────────────

  async listar(filtros: { estado?: string; page?: number; limit?: number }) {
    const page = filtros.page || 1;
    const limit = Math.min(filtros.limit || 20, 100);
    const offset = (page - 1) * limit;

    let query = this.db('sorteos')
      .join('comercios', 'sorteos.comercio_id', 'comercios.id')
      .select(
        'sorteos.id', 'sorteos.nombre', 'sorteos.descripcion',
        'sorteos.imagen_principal_url', 'sorteos.fecha_sorteo',
        'sorteos.valor_numero', 'sorteos.cant_numeros', 'sorteos.estado',
        'comercios.razon_social as comercio_nombre',
      );

    if (filtros.estado) query = query.where('sorteos.estado', filtros.estado);
    else query = query.whereIn('sorteos.estado', ['activo']);

    const [{ count }] = await this.db('sorteos')
      .count('* as count')
      .whereIn('estado', filtros.estado ? [filtros.estado] : ['activo']);

    const sorteos = await query.orderBy('sorteos.fecha_sorteo', 'asc').limit(limit).offset(offset);

    // Agregar conteo de vendidos a cada sorteo
    const ids = sorteos.map(s => s.id);
    const vendidos = ids.length ? await this.db('numeros')
      .whereIn('sorteo_id', ids)
      .where('estado', 'vendido')
      .groupBy('sorteo_id')
      .select('sorteo_id')
      .count('* as total') : [];

    const vendidosMap = Object.fromEntries(vendidos.map(v => [v.sorteo_id, Number(v.total)]));

    return {
      data: sorteos.map(s => ({ ...s, numeros_vendidos: vendidosMap[s.id] || 0 })),
      meta: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) },
    };
  }

  async obtener(id: string) {
    const sorteo = await this.db('sorteos')
      .join('comercios', 'sorteos.comercio_id', 'comercios.id')
      .where('sorteos.id', id)
      .select('sorteos.*', 'comercios.razon_social as comercio_nombre')
      .first();

    if (!sorteo) throw new NotFoundException({ code: 'SORTEO_NO_ENCONTRADO', message: 'Sorteo no encontrado' });

    const stats = await this.db('numeros')
      .where({ sorteo_id: id })
      .groupBy('estado')
      .select('estado')
      .count('* as total');

    const statsMap = Object.fromEntries(stats.map(s => [s.estado, Number(s.total)]));

    return {
      ...sorteo,
      stats: {
        libres: statsMap['libre'] || 0,
        reservados: statsMap['reservado'] || 0,
        vendidos: statsMap['vendido'] || 0,
      },
    };
  }

  async obtenerNumeros(sorteoId: string) {
    const sorteo = await this.db('sorteos').where({ id: sorteoId }).first('id', 'estado');
    if (!sorteo) throw new NotFoundException('Sorteo no encontrado');

    return this.db('numeros')
      .where({ sorteo_id: sorteoId })
      .select('id', 'numero_visible', 'estado')
      .orderBy('numero_visible');
  }

  // ─── COMERCIO ─────────────────────────────────────────────

  async crear(comercioId: string, dto: CreateSorteoDto) {
    const fechaSorteo = new Date(dto.fechaSorteo);
    if (fechaSorteo <= new Date()) {
      throw new BadRequestException('La fecha del sorteo debe ser futura');
    }

    const [sorteo] = await this.db('sorteos')
      .insert({
        comercio_id: comercioId,
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        imagen_principal_url: dto.imagenPrincipalUrl,
        fecha_sorteo: fechaSorteo,
        valor_numero: dto.valorNumero,
        cant_numeros: dto.cantNumeros,
        chances_por_numero: dto.chancesPorNumero || 1,
        estado: 'borrador',
      })
      .returning('*');

    return sorteo;
  }

  async activar(sorteoId: string, comercioId: string) {
    const sorteo = await this.getSorteoDeComercio(sorteoId, comercioId);

    if (sorteo.estado !== 'borrador') {
      throw new BadRequestException('Solo se pueden activar sorteos en borrador');
    }

    // Generar todos los numeros y sus chances en una transaccion
    await this.db.transaction(async (trx) => {
      const totalChances = sorteo.cant_numeros * sorteo.chances_por_numero;

      // Pool de valores internos shuffleado criptograficamente
      const pool = Array.from({ length: totalChances }, (_, i) => i + 1);
      for (let i = pool.length - 1; i > 0; i--) {
        const buf = randomBytes(4);
        const j = buf.readUInt32BE(0) % (i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }

      // Insertar numeros en lote
      const numerosData = Array.from({ length: sorteo.cant_numeros }, (_, i) => ({
        sorteo_id: sorteoId,
        numero_visible: i + 1,
        estado: 'libre',
      }));

      const numerosCreados = await trx('numeros').insert(numerosData).returning('*');

      // Insertar chances en lote
      const chancesData = numerosCreados.flatMap((numero, i) =>
        Array.from({ length: sorteo.chances_por_numero }, (_, c) => ({
          numero_id: numero.id,
          sorteo_id: sorteoId,
          valor_interno: pool[i * sorteo.chances_por_numero + c],
        }))
      );

      await trx('chances_internas').insert(chancesData);
      await trx('sorteos').where({ id: sorteoId }).update({ estado: 'activo', activado_at: new Date() });
    });

    return { mensaje: 'Sorteo activado correctamente' };
  }

  async realizar(sorteoId: string, comercioId: string, dto: RealizarSorteoDto) {
    const sorteo = await this.getSorteoDeComercio(sorteoId, comercioId);

    if (sorteo.estado !== 'activo') {
      throw new BadRequestException('Solo se pueden realizar sorteos activos');
    }
   // if (new Date(sorteo.fecha_sorteo) > new Date()) {
//   throw new BadRequestException('Todavia no llego la fecha del sorteo');
// }

    // Solo chances de numeros VENDIDOS participan
    const chancesSoldas = await this.db('chances_internas')
      .join('numeros', 'chances_internas.numero_id', 'numeros.id')
      .where({ 'numeros.sorteo_id': sorteoId, 'numeros.estado': 'vendido' })
      .select('chances_internas.id', 'chances_internas.valor_interno', 'numeros.numero_visible', 'chances_internas.numero_id')
      .orderBy('chances_internas.valor_interno');

    if (chancesSoldas.length === 0) {
      throw new BadRequestException('No hay participantes en este sorteo');
    }

    // Seed combinado: seed externo + datos del sorteo = resultado determinista pero no manipulable
    const seedCombinado = createHash('sha256')
      .update(`${dto.seedExterno}:${sorteoId}:${chancesSoldas.length}`)
      .digest('hex');

    const indice = parseInt(seedCombinado.slice(0, 8), 16) % chancesSoldas.length;
    const chanceGanadora = chancesSoldas[indice];

    const participacion = await this.db('participaciones')
      .where({ numero_id: chanceGanadora.numero_id })
      .first();

    // Hash del resultado para verificacion publica
    const hashResultado = createHash('sha256').update(JSON.stringify({
      sorteoId, seedExterno: dto.seedExterno,
      chanceGanadoraId: chanceGanadora.id,
      valorInterno: chanceGanadora.valor_interno,
      numeroVisible: chanceGanadora.numero_visible,
      timestamp: new Date().toISOString(),
    })).digest('hex');

   await this.db.transaction(async (trx) => {
  await trx('sorteos').where({ id: sorteoId }).update({
    estado: 'finalizado',
    ganador_participacion_id: participacion.id,
    hash_resultado: hashResultado,
    seed_externo: dto.seedExterno,
   recaudacion_total: this.db.raw(
  '(SELECT COUNT(*) FROM numeros WHERE sorteo_id = ? AND estado = ?) * ?',
  [sorteoId, 'vendido', Number(sorteo.valor_numero)]
),
    finalizado_at: new Date(),
  });

  await trx('entregas_premios')
    .insert({
      sorteo_id: sorteoId,
      participacion_id: participacion.id,
      ganador_id: participacion.usuario_id,
      comercio_id: sorteo.comercio_id,
      estado: 'pendiente',
    })
    .onConflict('sorteo_id')
    .ignore();
}); 
  await this.notificationsService.crearNotificacion({
  usuarioId: participacion.usuario_id,
  tipo: 'premio_ganado',
  titulo: '¡Ganaste un sorteo!',
  mensaje: `Felicitaciones, ganaste el premio del sorteo "${sorteo.nombre}".`,
  url: '/dashboard/premios',
});




    return {
      numeroGanador: chanceGanadora.numero_visible,
      hashResultado,
      seedExterno: dto.seedExterno,
      totalParticipantes: chancesSoldas.length,
    };
  }

  async verificar(sorteoId: string) {
    const sorteo = await this.db('sorteos')
      .where({ id: sorteoId, estado: 'finalizado' })
      .first();
    if (!sorteo) throw new NotFoundException('Sorteo no encontrado o no finalizado');

    return {
      sorteoId,
      seedExterno: sorteo.seed_externo,
      hashResultado: sorteo.hash_resultado,
      instrucciones: 'Podés verificar el resultado ejecutando el mismo algoritmo SHA-256 con estos datos publicos',
    };
  }

  async listarDeComercio(comercioId: string) {
    const sorteos = await this.db('sorteos')
      .where({ comercio_id: comercioId })
      .select('*')
      .orderBy('created_at', 'desc');

    const ids = sorteos.map(s => s.id);
    if (!ids.length) return { data: [] };

    const stats = await this.db('numeros')
      .whereIn('sorteo_id', ids)
      .groupBy('sorteo_id', 'estado')
      .select('sorteo_id', 'estado')
      .count('* as total');

    const statsMap: Record<string, Record<string, number>> = {};
    stats.forEach(s => {
      if (!statsMap[s.sorteo_id]) statsMap[s.sorteo_id] = {};
      statsMap[s.sorteo_id][s.estado] = Number(s.total);
    });

    return {
      data: sorteos.map(s => ({
        ...s,
        stats: {
          libres: statsMap[s.id]?.libre || 0,
          reservados: statsMap[s.id]?.reservado || 0,
          vendidos: statsMap[s.id]?.vendido || 0,
        },
        recaudacion: (statsMap[s.id]?.vendido || 0) * Number(s.valor_numero),
      })),
    };
  }

  // ─── HELPERS PRIVADOS ─────────────────────────────────────

  private async getSorteoDeComercio(sorteoId: string, comercioId: string) {
    const sorteo = await this.db('sorteos').where({ id: sorteoId }).first();
    if (!sorteo) throw new NotFoundException('Sorteo no encontrado');
    if (sorteo.comercio_id !== comercioId) {
      throw new ForbiddenException('No tenes permiso sobre este sorteo');
    }
    return sorteo;
  }
}
