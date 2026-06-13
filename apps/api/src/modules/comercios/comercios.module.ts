import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Knex from 'knex';

import { ComerciosService } from './comercios.service';
import { ComerciosController } from './comercios.controller';

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
    ComerciosService,
  ],
  controllers: [ComerciosController],
  exports: [ComerciosService, 'KNEX'],
})
export class ComerciosModule {}