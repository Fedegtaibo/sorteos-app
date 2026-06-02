import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('numeros', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('sorteo_id').notNullable().references('id').inTable('sorteos').onDelete('CASCADE');
    t.integer('numero_visible').notNullable();
    t.enu('estado', ['libre', 'reservado', 'vendido']).notNullable().defaultTo('libre');
    t.timestamp('reservado_hasta').nullable();
    t.uuid('reservado_por').nullable().references('id').inTable('users');
    t.boolean('notif_expiracion_enviada').notNullable().defaultTo(false);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  // Indice compuesto critico: queries de disponibilidad
  await knex.raw('CREATE INDEX idx_numeros_sorteo_estado ON numeros(sorteo_id, estado)');
  // Garantiza que no haya dos numeros visibles iguales en el mismo sorteo
  await knex.raw('CREATE UNIQUE INDEX idx_numeros_sorteo_visible ON numeros(sorteo_id, numero_visible)');
  // Para el job de liberacion de reservas expiradas
  await knex.raw('CREATE INDEX idx_numeros_reservado_hasta ON numeros(reservado_hasta) WHERE reservado_hasta IS NOT NULL');

  await knex.schema.createTable('chances_internas', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('numero_id').notNullable().references('id').inTable('numeros').onDelete('CASCADE');
    t.uuid('sorteo_id').notNullable().references('id').inTable('sorteos').onDelete('CASCADE');
    t.integer('valor_interno').notNullable();
  });

  // Garantiza que no haya valores internos repetidos en el mismo sorteo
  await knex.raw('CREATE UNIQUE INDEX idx_chances_sorteo_valor ON chances_internas(sorteo_id, valor_interno)');
  await knex.raw('CREATE INDEX idx_chances_sorteo_id ON chances_internas(sorteo_id)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('chances_internas');
  await knex.schema.dropTableIfExists('numeros');
}
