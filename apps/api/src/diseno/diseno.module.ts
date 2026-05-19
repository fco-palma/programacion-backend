import { Module } from '@nestjs/common';
import { DisenoService } from './diseno.service';
import { DisenoController } from './diseno.controller';

@Module({
  controllers: [DisenoController],
  providers: [DisenoService],
})
export class DisenoModule {}
