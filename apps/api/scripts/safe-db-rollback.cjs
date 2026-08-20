const path = require('node:path');
const { spawnSync } = require('node:child_process');

const apiDirectory = path.resolve(__dirname, '..');
const developmentDatabaseUrl =
  'postgresql://sorteos:sorteos_dev_2025@localhost:5432/sorteos_dev';
const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

function validateRollbackTarget(nodeEnv, connectionString) {
  if (nodeEnv === 'production') {
    throw new Error('El rollback está bloqueado en producción');
  }

  let databaseUrl;
  try {
    databaseUrl = new URL(connectionString);
  } catch {
    throw new Error('No se pudo validar la base de datos del rollback');
  }

  const hostname = databaseUrl.hostname.replace(/^\[|\]$/g, '');
  const databaseName = decodeURIComponent(databaseUrl.pathname.replace(/^\/+/, ''));

  if (!localHosts.has(hostname) || databaseName !== 'sorteos_dev') {
    throw new Error(
      'El rollback solo puede ejecutarse contra la base local sorteos_dev',
    );
  }
}

function main() {
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(apiDirectory, '.env') });

  const nodeEnv = process.env.NODE_ENV || 'development';
  const connectionString = process.env.DATABASE_URL || developmentDatabaseUrl;

  validateRollbackTarget(nodeEnv, connectionString);

  const pnpmExecutable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const result = spawnSync(
    pnpmExecutable,
    ['exec', 'knex', 'migrate:rollback', '--knexfile', 'src/database/knexfile.ts'],
    {
      cwd: apiDirectory,
      env: process.env,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Rollback bloqueado');
    process.exitCode = 1;
  }
}

module.exports = { validateRollbackTarget };
