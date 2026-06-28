import { ConfigService } from '@nestjs/config';
import type { Knex } from 'knex';

export const getDatabaseConfig = (config: ConfigService): Knex.Config => {
  const databaseUrl =
    config.get<string>('DATABASE_URL') ||
    'postgresql://sorteos:sorteos_dev_2025@localhost:5432/sorteos_dev';

  const nodeEnv = config.get<string>('NODE_ENV', 'development');
  const databaseSsl = config.get<boolean>('DATABASE_SSL', false);

  const useSsl =
    databaseSsl ||
    nodeEnv === 'production' ||
    databaseUrl.includes('sslmode=require');

  return {
    client: 'pg',
    connection: {
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    },
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
  };
};