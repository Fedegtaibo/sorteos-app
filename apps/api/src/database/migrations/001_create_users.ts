import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.string('email', 255).notNullable().unique();
    t.text('password_hash').notNullable();
    t.enu('role', ['admin', 'comercio', 'participante']).notNullable();
    t.boolean('email_verified').notNullable().defaultTo(false);
    t.string('email_verification_token', 255).nullable();
    t.string('refresh_token_hash', 255).nullable();
    t.boolean('is_blocked').notNullable().defaultTo(false);
    t.timestamps(true, true);
  });

  await knex.raw('CREATE INDEX idx_users_email ON users(email)');
  await knex.raw('CREATE INDEX idx_users_role ON users(role)');

  // Trigger: actualiza updated_at automaticamente en cada UPDATE
  await knex.raw(`
    CREATE OR REPLACE FUNCTION trigger_set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql;
  `);
  await knex.raw(`
    CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP FUNCTION IF EXISTS trigger_set_updated_at CASCADE');
}
