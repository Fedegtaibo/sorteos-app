import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('entregas_premios', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    t.uuid('sorteo_id').notNullable().references('id').inTable('sorteos');
    t.uuid('participacion_id').notNullable().references('id').inTable('participaciones');
    t.uuid('ganador_id').notNullable().references('id').inTable('users');
    t.uuid('comercio_id').notNullable().references('id').inTable('comercios');

    t.enu('estado', [
      'pendiente',
      'preparando',
      'enviado',
      'entregado',
      'confirmado',
      'reclamado',
    ]).notNullable().defaultTo('pendiente');

    t.text('direccion_entrega').nullable();
    t.text('codigo_seguimiento').nullable();
    t.text('empresa_envio').nullable();

    t.jsonb('evidencias_urls').nullable();

    t.timestamp('preparado_at').nullable();
    t.timestamp('enviado_at').nullable();
    t.timestamp('entregado_at').nullable();
    t.timestamp('confirmado_at').nullable();
    t.timestamp('reclamado_at').nullable();

    t.text('notas_comercio').nullable();
    t.text('notas_ganador').nullable();
    t.text('notas_admin').nullable();

    t.timestamps(true, true);
  });

  await knex.raw('CREATE UNIQUE INDEX idx_entregas_sorteo ON entregas_premios(sorteo_id)');
  await knex.raw('CREATE UNIQUE INDEX idx_entregas_participacion ON entregas_premios(participacion_id)');
  await knex.raw('CREATE INDEX idx_entregas_ganador ON entregas_premios(ganador_id)');
  await knex.raw('CREATE INDEX idx_entregas_comercio ON entregas_premios(comercio_id)');
  await knex.raw('CREATE INDEX idx_entregas_estado ON entregas_premios(estado)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('entregas_premios');
}