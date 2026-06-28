import { Module } from '@nestjs/common';

import { ComerciosService } from './comercios.service';
import { ComerciosController } from './comercios.controller';

@Module({
  providers: [ComerciosService],
  controllers: [ComerciosController],
  exports: [ComerciosService],
})
export class ComerciosModule {}