import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { PagosQueueProcessor } from './pagos-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'pagos' }),
  ],
  providers: [PagosService, PagosQueueProcessor],
  controllers: [PagosController],
})
export class PagosModule {}
