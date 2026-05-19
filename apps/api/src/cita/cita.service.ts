import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CitaService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateCitaDto): Promise<string> {
    const idCitaGenerado = await this.generarIdCita();
    const { fecha, hora, fecha_creacion, ...rest } = dto;

    try {
      const fechaCita = new Date(`${fecha}T00:00:00`);

      const horaCita = new Date(`1970-01-01T${hora}`);

      const fechaDeCreacion = new Date(`${fecha_creacion}T00:00:00`);

      await this.prisma.$transaction(async (tx) => {
        await tx.cita.create({
          data: {
            id_cita: idCitaGenerado,
            ...rest,
            fecha: fechaCita,
            hora: horaCita,
            fecha_creacion: fechaDeCreacion,
          },
        });
      });

      return idCitaGenerado;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar la cita: ${error.message}`,
      );
    }
  }

  findAll(skip = 0, take = 20) {
    return this.prisma.cita.findMany({
      skip,
      take,
      orderBy: { fecha_creacion: 'asc' },
      include: {
        pagos: true,
        procedimientos: true,
      }
    })
  }

  async findOne(id: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id_cita: id }
    });

    if (!cita) {
      throw new NotFoundException(`Cita con el ID ${id} no encontrada`);
    }

    return cita;
  }

  async update(id: string, dto: UpdateCitaDto) {
    await this.findOne(id);
    const { fecha, hora, fecha_creacion, ...rest } = dto;
    return this.prisma.cita.update({
      where: { id_cita: id },
      data: {
        ...rest,
        ...(fecha ? { fecha: new Date(`${fecha}T00:00:00`) } : {}),
        ...(hora ? { hora: new Date(`1970-01-01T${hora}`) } : {}),
        ...(fecha_creacion ? { fecha_creacion: new Date(`${fecha_creacion}T00:00:00`) } : {}),
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.cita.delete({
      where: { id_cita: id },
    });
    return { ok: true };
  }

  private async generarIdCita(): Promise<string> {
    const ultima = await this.prisma.cita.findFirst({
      orderBy: { id_cita: 'desc' },
      select: { id_cita: true },
    });

    if (!ultima) return 'CITA0001';
    const num = parseInt(ultima.id_cita.replace(/\D/g, ''), 10)
    return `CITA${String(num + 1).padStart(4, '0')}`
  }
}
