import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Global() // Disponible en todos los modulos sin importar
@Module({
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
