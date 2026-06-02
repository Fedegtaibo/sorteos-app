import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Processor('pagos')
export class PagosQueueProcessor {
  private readonly logger = new Logger(PagosQueueProcessor.name);

  constructor(private readonly pagosService: PagosService) {}

  @Process('confirmar-pago-mp')
  async confirmarPago(job: Job<{ paymentId: string }>) {
    this.logger.log(`Procesando pago MP: ${job.data.paymentId} (intento ${job.attemptsMade + 1})`);
    return this.pagosService.confirmarPagoMP(job.data.paymentId);
  }
}
