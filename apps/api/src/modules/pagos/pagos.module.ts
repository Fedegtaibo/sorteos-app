import { AuditModule } from '../audit/audit.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import Knex from 'knex';

import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';

@Module({
  imports: [
    ConfigModule,
    AuditModule,
    BullModule.registerQueue({
      name: 'pagos',
    }),
  ],
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
    {
      provide: 'REDIS',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const Redis = (await import('ioredis')).default;
        return new Redis(config.get<string>('REDIS_URL') || 'redis://localhost:6379');
      },
    },
    PagosService,
  ],
  controllers: [PagosController],
  exports: [PagosService, 'KNEX', 'REDIS'],
})
export class PagosModule {}