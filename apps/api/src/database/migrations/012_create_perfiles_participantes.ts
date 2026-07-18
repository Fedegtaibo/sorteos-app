import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const existe = await knex.schema.hasTable('perfiles_participantes');

  if (!existe) {
    await knex.schema.createTable('perfiles_participantes', (table) => {
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('uuid_generate_v4()'));

      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');

      table.string('nombre', 120).notNullable();
      table.string('apellido', 120).notNullable();

      table.date('fecha_nacimiento').notNullable();

      table.string('dni', 20).notNullable();
      table.string('nacionalidad', 80).notNullable();

      table.string('provincia', 120).notNullable();
      table.string('ciudad', 120).notNullable();
      table.text('direccion').notNullable();
      table.string('codigo_postal', 20).notNullable();

      table
        .boolean('mayor_18_declarado')
        .notNullable()
        .defaultTo(false);

      table.timestamp('mayor_18_declarado_at').nullable();
      table.timestamp('terminos_aceptados_at').nullable();

      table.timestamps(true, true);
    });
  }

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_perfiles_participantes_user
    ON perfiles_participantes(user_id)
  `);

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_perfiles_participantes_dni
    ON perfiles_participantes(dni)
  `);

  await knex.raw(`
    CREATE INDEX IF NOT EXISTS idx_perfiles_participantes_ubicacion
    ON perfiles_participantes(provincia, ciudad)
  `);

  await knex.raw(`
    DROP TRIGGER IF EXISTS perfiles_participantes_set_updated_at
    ON perfiles_participantes
  `);

  await knex.raw(`
    CREATE TRIGGER perfiles_participantes_set_updated_at
    BEFORE UPDATE ON perfiles_participantes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at()
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('perfiles_participantes');
}