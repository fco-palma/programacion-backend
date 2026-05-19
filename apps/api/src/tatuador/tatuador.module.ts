import { Module } from '@nestjs/common';
import { TatuadorService } from './tatuador.service';
import { TatuadorController } from './tatuador.controller';

@Module({
  controllers: [TatuadorController],
  providers: [TatuadorService],
})
export class TatuadorModule {}
