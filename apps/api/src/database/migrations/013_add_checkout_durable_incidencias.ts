import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('pagos', (table) => {
    table.uuid('checkout_id').nullable();
    table
      .uuid('sorteo_id')
      .nullable()
      .references('id')
      .inTable('sorteos');
  });

  await knex.raw(`
    CREATE UNIQUE INDEX idx_pagos_checkout_numero
    ON pagos(checkout_id, numero_id)
    WHERE checkout_id IS NOT NULL
  `);

  await knex.raw(`
    CREATE INDEX idx_pagos_preference_id
    ON pagos(preference_id)
    WHERE preference_id IS NOT NULL
  `);

  await knex.schema.createTable('pagos_incidencias', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('payment_external_id', 255).notNullable().unique();
    table.string('preference_id', 255).nullable();
    table.uuid('checkout_id').nullable();
    table.string('codigo', 64).notNullable();
    table.string('estado', 32).notNullable().defaultTo('abierta');
    table.decimal('monto_recibido', 12, 2).nullable();
    table.jsonb('detalle').nullable();
    table.timestamps(true, true);
    table.timestamp('resuelta_at').nullable();
    table.uuid('resuelta_por').nullable().references('id').inTable('users');
  });

  await knex.raw(`
    ALTER TABLE pagos_incidencias
    ADD CONSTRAINT pagos_incidencias_estado_check
    CHECK (estado IN ('abierta', 'resuelta'))
  `);

  await knex.raw(`
    CREATE INDEX idx_pagos_incidencias_estado
    ON pagos_incidencias(estado)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('pagos_incidencias');
  await knex.raw('DROP INDEX IF EXISTS idx_pagos_preference_id');
  await knex.raw('DROP INDEX IF EXISTS idx_pagos_checkout_numero');

  await knex.schema.alterTable('pagos', (table) => {
    table.dropColumn('sorteo_id');
    table.dropColumn('checkout_id');
  });
}
