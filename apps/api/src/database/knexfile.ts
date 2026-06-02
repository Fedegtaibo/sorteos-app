import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 },
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
  seeds: {
    directory: './src/database/seeds',
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
};

export default config;
