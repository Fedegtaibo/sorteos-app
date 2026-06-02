import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sorteos', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('comercio_id').notNullable().references('id').inTable('comercios').onDelete('CASCADE');
    t.string('nombre', 255).notNullable();
    t.text('descripcion').nullable();
    t.text('imagen_principal_url').nullable();
    t.specificType('imagenes_urls', 'TEXT[]').nullable();
    t.timestamp('fecha_sorteo').notNullable();
    t.decimal('valor_numero', 12, 2).notNullable();
    t.integer('cant_numeros').notNullable();
    t.integer('chances_por_numero').notNullable().defaultTo(1);
    t.enu('estado', ['borrador', 'activo', 'finalizado', 'cancelado'])
      .notNullable().defaultTo('borrador');
    t.decimal('recaudacion_total', 14, 2).nullable();
    t.decimal('comision_aplicada', 5, 2).nullable();
    t.uuid('ganador_participacion_id').nullable();
    t.string('hash_resultado', 64).nullable();
    t.string('seed_externo').nullable();
    t.boolean('notif_24h_enviada').notNullable().defaultTo(false);
    t.timestamp('activado_at').nullable();
    t.timestamp('finalizado_at').nullable();
    t.timestamp('cancelado_at').nullable();
    t.uuid('cancelado_por').nullable().references('id').inTable('users');
    t.text('motivo_cancelacion').nullable();
    t.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX idx_sorteos_comercio_id ON sorteos(comercio_id)');
  await knex.raw('CREATE INDEX idx_sorteos_estado ON sorteos(estado)');
  await knex.raw('CREATE INDEX idx_sorteos_fecha ON sorteos(fecha_sorteo)');
  await knex.raw('CREATE INDEX idx_sorteos_estado_fecha ON sorteos(estado, fecha_sorteo)');
  await knex.raw(`
    CREATE TRIGGER sorteos_set_updated_at
    BEFORE UPDATE ON sorteos
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('sorteos');
}
