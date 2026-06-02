import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('participaciones', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('usuario_id').notNullable().references('id').inTable('users');
    t.uuid('numero_id').notNullable().references('id').inTable('numeros');
    t.uuid('sorteo_id').notNullable().references('id').inTable('sorteos');
    t.decimal('monto_pagado', 12, 2).notNullable();
    t.text('comprobante_url').nullable();
    t.string('comprobante_hash', 64).nullable();
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  // Un numero = una participacion
  await knex.raw('CREATE UNIQUE INDEX idx_participaciones_numero ON participaciones(numero_id)');
  await knex.raw('CREATE INDEX idx_participaciones_usuario ON participaciones(usuario_id)');
  await knex.raw('CREATE INDEX idx_participaciones_sorteo ON participaciones(sorteo_id)');

  await knex.schema.createTable('pagos', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('participacion_id').nullable().references('id').inTable('participaciones');
    t.uuid('usuario_id').notNullable().references('id').inTable('users');
    t.uuid('numero_id').notNullable().references('id').inTable('numeros');
    t.enu('proveedor', ['mercadopago', 'stripe']).notNullable().defaultTo('mercadopago');
    // external_id UNIQUE es la clave para evitar pagos duplicados
    t.string('external_id', 255).unique().nullable();
    t.string('preference_id', 255).nullable();
    t.decimal('monto', 12, 2).notNullable();
    t.enu('estado', ['pendiente', 'aprobado', 'rechazado', 'devuelto', 'cancelado'])
      .notNullable().defaultTo('pendiente');
    t.jsonb('webhook_payload').nullable();
    t.timestamp('procesado_at').nullable();
    t.timestamps(true, true);
  });

  await knex.raw('CREATE UNIQUE INDEX idx_pagos_external_id ON pagos(external_id) WHERE external_id IS NOT NULL');
  await knex.raw('CREATE INDEX idx_pagos_usuario ON pagos(usuario_id)');
  await knex.raw('CREATE INDEX idx_pagos_estado ON pagos(estado)');
  await knex.raw('CREATE INDEX idx_pagos_numero ON pagos(numero_id)');

  await knex.schema.createTable('devoluciones', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    t.uuid('pago_id').notNullable().references('id').inTable('pagos');
    t.uuid('usuario_id').notNullable().references('id').inTable('users');
    t.decimal('monto', 12, 2).notNullable();
    t.enu('motivo', ['sorteo_cancelado', 'pago_duplicado', 'error_tecnico', 'reclamo_resuelto'])
      .notNullable();
    t.enu('estado', ['iniciada', 'procesando', 'completada', 'fallida'])
      .notNullable().defaultTo('iniciada');
    t.string('mp_refund_id').nullable();
    t.text('notas').nullable();
    t.uuid('procesado_por').nullable().references('id').inTable('users');
    t.timestamp('completada_at').nullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('devoluciones');
  await knex.schema.dropTableIfExists('pagos');
  await knex.schema.dropTableIfExists('participaciones');
}
