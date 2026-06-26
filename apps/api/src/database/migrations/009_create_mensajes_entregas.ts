import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('mensajes_entregas', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('entrega_id')
      .notNullable()
      .references('id')
      .inTable('entregas_premios')
      .onDelete('CASCADE');

    table
      .uuid('sender_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.text('mensaje').notNullable();

    table.boolean('leido')
      .notNullable()
      .defaultTo(false);

    table.timestamp('created_at')
      .defaultTo(knex.fn.now());

    table.index(['entrega_id']);
    table.index(['sender_id']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('mensajes_entregas');
}