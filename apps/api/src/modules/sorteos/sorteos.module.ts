import { Module } from '@nestjs/common';
import { SorteosService } from './sorteos.service';
import { SorteosController } from './sorteos.controller';

@Module({
  providers: [SorteosService],
  controllers: [SorteosController],
  exports: [SorteosService],
})
export class SorteosModule {}
