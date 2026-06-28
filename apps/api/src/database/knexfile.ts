import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgresql://sorteos:sorteos_dev_2025@localhost:5432/sorteos_dev';

const nodeEnv = process.env.NODE_ENV || 'development';
const databaseSsl = process.env.DATABASE_SSL === 'true';

const useSsl =
  databaseSsl ||
  nodeEnv === 'production' ||
  databaseUrl.includes('sslmode=require');

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: databaseUrl,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  },
  pool: {
    min: Number(process.env.DATABASE_POOL_MIN || 2),
    max: Number(process.env.DATABASE_POOL_MAX || 10),
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
  seeds: {
    directory: './seeds',
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
};

export default config;