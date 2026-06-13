import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Knex from 'knex';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

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
    AdminService,
  ],
  controllers: [AdminController],
  exports: [AdminService, 'KNEX'],
})
export class AdminModule {}