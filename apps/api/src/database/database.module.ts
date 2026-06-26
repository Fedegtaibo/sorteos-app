import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';

@Global()
@Module({
  providers: [
    {
      provide: 'KNEX',
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        Knex({
          client: 'pg',
          connection: config.get('DATABASE_URL'),
          pool: {
            min: config.get('DATABASE_POOL_MIN', 2),
            max: config.get('DATABASE_POOL_MAX', 10),
          },
        }),
    },
  ],
  exports: ['KNEX'],
})
export class DatabaseModule {}