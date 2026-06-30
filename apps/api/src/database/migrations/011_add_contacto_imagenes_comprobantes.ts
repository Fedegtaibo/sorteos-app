import type { Knex } from 'knex';

async function addColumnIfMissing(
  knex: Knex,
  tableName: string,
  columnName: string,
  builder: (table: Knex.AlterTableBuilder) => void,
) {
  const exists = await knex.schema.hasColumn(tableName, columnName);

  if (!exists) {
    await knex.schema.alterTable(tableName, builder);
  }
}

async function dropColumnIfExists(
  knex: Knex,
  tableName: string,
  columnName: string,
) {
  const exists = await knex.schema.hasColumn(tableName, columnName);

  if (exists) {
    await knex.schema.alterTable(tableName, (table) => {
      table.dropColumn(columnName);
    });
  }
}

export async function up(knex: Knex): Promise<void> {
  await addColumnIfMissing(knex, 'users', 'telefono', (table) => {
    table.string('telefono', 30).nullable();
  });

  await addColumnIfMissing(knex, 'users', 'telefono_verified', (table) => {
    table.boolean('telefono_verified').notNullable().defaultTo(false);
  });

  await addColumnIfMissing(knex, 'users', 'telefono_verification_code', (table) => {
    table.string('telefono_verification_code', 10).nullable();
  });

  await addColumnIfMissing(knex, 'users', 'telefono_verification_expires_at', (table) => {
    table.timestamp('telefono_verification_expires_at').nullable();
  });

  await addColumnIfMissing(knex, 'comercios', 'whatsapp', (table) => {
    table.string('whatsapp', 30).nullable();
  });

  await addColumnIfMissing(knex, 'comercios', 'logo_url', (table) => {
    table.text('logo_url').nullable();
  });

  await addColumnIfMissing(knex, 'comercios', 'portada_url', (table) => {
    table.text('portada_url').nullable();
  });

  await addColumnIfMissing(knex, 'comercios', 'direccion', (table) => {
    table.text('direccion').nullable();
  });

  await addColumnIfMissing(knex, 'comercios', 'instagram', (table) => {
    table.string('instagram', 120).nullable();
  });

  await addColumnIfMissing(knex, 'participaciones', 'comprobante_codigo', (table) => {
    table.string('comprobante_codigo', 50).nullable();
  });

  await addColumnIfMissing(knex, 'participaciones', 'comprobante_emitido_at', (table) => {
    table.timestamp('comprobante_emitido_at').nullable();
  });

  await knex.raw(
    'CREATE INDEX IF NOT EXISTS idx_users_telefono ON users(telefono)',
  );

  await knex.raw(
    'CREATE INDEX IF NOT EXISTS idx_comercios_whatsapp ON comercios(whatsapp)',
  );

  await knex.raw(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_participaciones_comprobante_codigo
    ON participaciones(comprobante_codigo)
    WHERE comprobante_codigo IS NOT NULL
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX IF EXISTS idx_participaciones_comprobante_codigo');
  await knex.raw('DROP INDEX IF EXISTS idx_comercios_whatsapp');
  await knex.raw('DROP INDEX IF EXISTS idx_users_telefono');

  await dropColumnIfExists(knex, 'participaciones', 'comprobante_emitido_at');
  await dropColumnIfExists(knex, 'participaciones', 'comprobante_codigo');

  await dropColumnIfExists(knex, 'comercios', 'instagram');
  await dropColumnIfExists(knex, 'comercios', 'direccion');
  await dropColumnIfExists(knex, 'comercios', 'portada_url');
  await dropColumnIfExists(knex, 'comercios', 'logo_url');
  await dropColumnIfExists(knex, 'comercios', 'whatsapp');

  await dropColumnIfExists(knex, 'users', 'telefono_verification_expires_at');
  await dropColumnIfExists(knex, 'users', 'telefono_verification_code');
  await dropColumnIfExists(knex, 'users', 'telefono_verified');
  await dropColumnIfExists(knex, 'users', 'telefono');
}