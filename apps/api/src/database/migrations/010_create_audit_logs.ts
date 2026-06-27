import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('actor_id')
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.string('actor_role', 50).nullable();

    table.string('accion', 120).notNullable();

    table.string('entidad_tipo', 80).nullable();
    table.uuid('entidad_id').nullable();

    table
      .uuid('comercio_id')
      .nullable()
      .references('id')
      .inTable('comercios')
      .onDelete('SET NULL');

    table
      .uuid('sorteo_id')
      .nullable()
      .references('id')
      .inTable('sorteos')
      .onDelete('SET NULL');

    table.string('ip', 80).nullable();
    table.text('user_agent').nullable();

    table.jsonb('metadata').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['actor_id']);
    table.index(['accion']);
    table.index(['entidad_tipo', 'entidad_id']);
    table.index(['comercio_id']);
    table.index(['sorteo_id']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_logs');
}