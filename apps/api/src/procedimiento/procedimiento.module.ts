import { Module } from '@nestjs/common';
import { ProcedimientoService } from './procedimiento.service';
import { ProcedimientoController } from './procedimiento.controller';

@Module({
  controllers: [ProcedimientoController],
  providers: [ProcedimientoService],
})
export class ProcedimientoModule {}
