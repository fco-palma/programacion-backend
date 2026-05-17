import { Module } from '@nestjs/common';
import { InsumoService } from './insumo.service';
import { InsumoController } from './insumo.controller';

@Module({
  controllers: [InsumoController],
  providers: [InsumoService],
})
export class InsumoModule {}
