import { AuditModule } from '../audit/audit.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

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
  exports: [PagosService, 'REDIS'],
})
export class PagosModule {}