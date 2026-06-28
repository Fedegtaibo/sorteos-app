import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Knex from 'knex';
import { getDatabaseConfig } from '../config/database.config';

@Global()
@Module({
  providers: [
    {
      provide: 'KNEX',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => Knex(getDatabaseConfig(config)),
    },
  ],
  exports: ['KNEX'],
})
export class DatabaseModule {}