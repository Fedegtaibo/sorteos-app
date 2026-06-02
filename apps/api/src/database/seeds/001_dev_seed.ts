import type { Knex } from 'knex';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Limpiar en orden correcto (foreign keys)
  await knex('pagos').del();
  await knex('participaciones').del();
  await knex('chances_internas').del();
  await knex('numeros').del();
  await knex('sorteos').del();
  await knex('comercios').del();
  await knex('users').del();

  const hash = await bcrypt.hash('password123', 12);

  const [admin, comercioUser, participante] = await knex('users')
    .insert([
      { email: 'admin@sorteos.dev', password_hash: hash, role: 'admin', email_verified: true },
      { email: 'techstore@sorteos.dev', password_hash: hash, role: 'comercio', email_verified: true },
      { email: 'juan@sorteos.dev', password_hash: hash, role: 'participante', email_verified: true },
    ])
    .returning('*');

  const [comercio] = await knex('comercios')
    .insert({
      user_id: comercioUser.id,
      razon_social: 'Tech Store Cordoba SRL',
      cuit: '30712345678',
      telefono: '+54 351 555 0001',
      estado: 'aprobado',
      comision_pct: 8.00,
      aprobado_por: admin.id,
      aprobado_at: new Date(),
    })
    .returning('*');

  // Sorteo de ejemplo en estado activo
  const [sorteo] = await knex('sorteos')
    .insert({
      comercio_id: comercio.id,
      nombre: 'iPhone 16 Pro Max 256GB',
      descripcion: 'Sorteo verificado. El ganador recibe el equipo sellado de fabrica.',
      fecha_sorteo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      valor_numero: 2500,
      cant_numeros: 10,
      chances_por_numero: 3,
      estado: 'activo',
      activado_at: new Date(),
    })
    .returning('*');

  // Generar numeros y chances para el sorteo
  const totalChances = sorteo.cant_numeros * sorteo.chances_por_numero;
  const pool = Array.from({ length: totalChances }, (_, i) => i + 1);

  // Shuffle simple para el seed
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  for (let n = 1; n <= sorteo.cant_numeros; n++) {
    const [numero] = await knex('numeros')
      .insert({ sorteo_id: sorteo.id, numero_visible: n, estado: 'libre' })
      .returning('*');

    const chances = [];
    for (let c = 0; c < sorteo.chances_por_numero; c++) {
      chances.push({
        numero_id: numero.id,
        sorteo_id: sorteo.id,
        valor_interno: pool[(n - 1) * sorteo.chances_por_numero + c],
      });
    }
    await knex('chances_internas').insert(chances);
  }

  console.log('\nSeed completado:');
  console.log('  admin@sorteos.dev     / password123  (admin)');
  console.log('  techstore@sorteos.dev / password123  (comercio)');
  console.log('  juan@sorteos.dev      / password123  (participante)');
  console.log(`\n  Sorteo de prueba creado: "${sorteo.nombre}" con ${sorteo.cant_numeros} numeros\n`);
}
