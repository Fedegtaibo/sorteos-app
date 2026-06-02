import { ConfigService } from '@nestjs/config';
import type { Knex } from 'knex';

export const getDatabaseConfig = (config: ConfigService): Knex.Config => ({
  client: 'pg',
  connection: config.get<string>('DATABASE_URL'),
  pool: {
    min: config.get<number>('DATABASE_POOL_MIN', 2),
    max: config.get<number>('DATABASE_POOL_MAX', 10),
  },
  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    extension: 'ts',
  },
});
