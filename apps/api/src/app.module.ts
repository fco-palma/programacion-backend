import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { InsumoModule } from './insumo/insumo.module';
import { ClienteModule } from './cliente/cliente.module';
import { TatuadorModule } from './tatuador/tatuador.module';
import { DisenoModule } from './diseno/diseno.module';
import { CitaModule } from './cita/cita.module';
import { PagoModule } from './pago/pago.module';
import { ProcedimientoModule } from './procedimiento/procedimiento.module';


@Module({
  imports: [
    PrismaModule,
    InsumoModule,
    ClienteModule,
    TatuadorModule,
    DisenoModule,
    CitaModule,
    PagoModule,
    ProcedimientoModule,
    // LOS DEMAS MODULOS DEL PROYECTO
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
