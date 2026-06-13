import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Knex from 'knex';

import { SorteosService } from './sorteos.service';
import { SorteosController } from './sorteos.controller';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KNEX',
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        Knex({
          client: 'pg',
          connection: config.get('DATABASE_URL'),
        }),
    },
    SorteosService,
  ],
  controllers: [SorteosController],
  exports: [SorteosService, 'KNEX'],
})
export class SorteosModule {}
