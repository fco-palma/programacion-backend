import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { InsumoModule } from './insumo/insumo.module';


@Module({
  imports: [
    PrismaModule,
    InsumoModule,
    // LOS DEMAS MODULOS DEL PROYECTO
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
