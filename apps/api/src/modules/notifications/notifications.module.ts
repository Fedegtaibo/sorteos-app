import { Global, Module } from '@nestjs/common';
import knex from 'knex';
import dbConfig from '../../database/knexfile';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  providers: [
    {
      provide: 'KNEX',
      useFactory: () => knex(dbConfig),
    },
    NotificationsService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}