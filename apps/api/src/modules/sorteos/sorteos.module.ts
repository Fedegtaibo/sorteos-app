import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';

import { SorteosService } from './sorteos.service';
import { SorteosController } from './sorteos.controller';

@Module({
  imports: [AuditModule],
  providers: [SorteosService],
  controllers: [SorteosController],
  exports: [SorteosService],
})
export class SorteosModule {}