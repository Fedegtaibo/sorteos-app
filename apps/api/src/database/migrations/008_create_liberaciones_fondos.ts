import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('liberaciones_fondos', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    t.uuid('entrega_id')
      .notNullable()
      .references('id')
      .inTable('entregas_premios')
      .onDelete('CASCADE');

    t.uuid('sorteo_id')
      .notNullable()
      .references('id')
      .inTable('sorteos')
      .onDelete('CASCADE');

    t.uuid('comercio_id')
      .notNullable()
      .references('id')
      .inTable('comercios')
      .onDelete('CASCADE');

    t.decimal('monto_bruto', 12, 2).notNullable().defaultTo(0);
    t.decimal('comision_pct', 5, 2).notNullable().defaultTo(0);
    t.decimal('monto_comision', 12, 2).notNullable().defaultTo(0);
    t.decimal('monto_neto', 12, 2).notNullable().defaultTo(0);

    t.enu('estado', ['pendiente', 'liberado', 'retenido'])
      .notNullable()
      .defaultTo('pendiente');

    t.text('motivo').nullable();

    t.timestamp('liberado_at').nullable();
    t.timestamp('retenido_at').nullable();

    t.timestamps(true, true);
  });

  await knex.raw('CREATE UNIQUE INDEX idx_liberaciones_entrega ON liberaciones_fondos(entrega_id)');
  await knex.raw('CREATE INDEX idx_liberaciones_comercio ON liberaciones_fondos(comercio_id)');
  await knex.raw('CREATE INDEX idx_liberaciones_estado ON liberaciones_fondos(estado)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('liberaciones_fondos');
}