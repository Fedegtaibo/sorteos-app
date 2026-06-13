import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import Knex from 'knex';

import { validateEnv } from './config/env.config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

import { AuthModule } from './modules/auth/auth.module';
import { SorteosModule } from './modules/sorteos/sorteos.module';
import { PagosModule } from './modules/pagos/pagos.module';
import { ComerciosModule } from './modules/comercios/comercios.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('REDIS_URL'),
        defaultJobOptions: { removeOnComplete: false, removeOnFail: false },
      }),
    }),
    NotificationsModule,
    AuthModule,
    ComerciosModule,
    SorteosModule,
    PagosModule,
    AdminModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: 'KNEX',
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        Knex({
          client: 'pg',
          connection: config.get('DATABASE_URL'),
          pool: { min: config.get('DATABASE_POOL_MIN', 2), max: config.get('DATABASE_POOL_MAX', 10) },
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
  ],
})
export class AppModule {}

