import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notificaciones', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

    t.uuid('usuario_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    t.string('tipo', 50).notNullable();
    t.string('titulo', 255).notNullable();
    t.text('mensaje').notNullable();

    t.boolean('leida').notNullable().defaultTo(false);

    t.string('url', 500).nullable();

    t.timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    t.timestamp('leida_at').nullable();
  });

  await knex.raw(`
    CREATE INDEX idx_notificaciones_usuario
    ON notificaciones(usuario_id)
  `);

  await knex.raw(`
    CREATE INDEX idx_notificaciones_leida
    ON notificaciones(leida)
  `);

  await knex.raw(`
    CREATE INDEX idx_notificaciones_fecha
    ON notificaciones(created_at DESC)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('notificaciones');
}