import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('previous_refresh_token_hash', 255).nullable();
    table.timestamp('previous_refresh_valid_until', { useTz: true }).nullable();
    table.text('refresh_rotation_result_encrypted').nullable();
    table
      .timestamp('refresh_rotation_result_valid_until', { useTz: true })
      .nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('refresh_rotation_result_valid_until');
    table.dropColumn('refresh_rotation_result_encrypted');
    table.dropColumn('previous_refresh_valid_until');
    table.dropColumn('previous_refresh_token_hash');
  });
}
