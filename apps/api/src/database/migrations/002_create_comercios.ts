import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('comercios', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('razon_social', 255).notNullable();
    t.string('cuit', 20).notNullable().unique();
    t.string('telefono', 30).nullable();
    t.enu('estado', ['pendiente', 'aprobado', 'rechazado', 'suspendido'])
      .notNullable().defaultTo('pendiente');
    t.decimal('comision_pct', 5, 2).notNullable().defaultTo(8.00);
    t.text('mp_access_token_enc').nullable(); // Encriptado con AES-256
    t.uuid('aprobado_por').nullable().references('id').inTable('users');
    t.timestamp('aprobado_at').nullable();
    t.text('motivo_rechazo').nullable();
    t.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX idx_comercios_user_id ON comercios(user_id)');
  await knex.raw('CREATE INDEX idx_comercios_estado ON comercios(estado)');
  await knex.raw(`
    CREATE TRIGGER comercios_set_updated_at
    BEFORE UPDATE ON comercios
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('comercios');
}
