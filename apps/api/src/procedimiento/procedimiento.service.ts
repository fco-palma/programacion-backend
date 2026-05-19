import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProcedimientoDto } from './dto/create-procedimiento.dto';
import { UpdateProcedimientoDto } from './dto/update-procedimiento.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProcedimientoService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateProcedimientoDto): Promise<string> {
    const idProcedimientoGenerado = await this.generarIdProcedimiento();

    const { fecha_ejecucion, fecha_creacion, insumos_utilizados, id_cita, ...rest } = dto;

    try {
      const citaExiste = await this.prisma.cita.findUnique({
        where: { id_cita: id_cita },
      });

      if (!citaExiste) {
        throw new NotFoundException(`La cita con ID ${id_cita} no existe.`)
      }

      const fechaEjecucion = new Date(`${fecha_ejecucion}T00:00:00`);
      const fechaCreacion = new Date(`${fecha_creacion}T00:00:00`);

      await this.prisma.$transaction(async (tx) => {
        await tx.procedimiento.create({
          data: {
            id_procedimiento: idProcedimientoGenerado,
            ...rest,
            fecha_ejecucion: fechaEjecucion,
            fecha_creacion: fechaCreacion,
            id_cita: id_cita,
            insumos_utilizados: {
              create: insumos_utilizados.map((insumo) => ({
                id_insumo: insumo.id_insumo,
                cantidad_utilizada: insumo.cantidad_utilizada,
              })),
            },
          },
        });
        // AQUI SE PODRIA MEJORAR EL FLUJO DE NEGOCIO, ACTUALZIANDO LA CANTIDAD EN STOCK DEL INSUMO
      });
      return idProcedimientoGenerado;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al registrar el procedimiento: ${error.message}`,
      );
    }
  }

  findAll(skip = 0, take = 20) {
    return this.prisma.procedimiento.findMany({
      skip,
      take,
      orderBy: { completado: 'asc' },
      include: {
        cita: true
      }
    });
  }

  async findOne(id: string) {
    const procedimiento = await this.prisma.procedimiento.findUnique({
      where: { id_procedimiento: id },
    });

    if (!procedimiento) {
      throw new NotFoundException(`Procedimiento con ID ${id} no encontrado`);
    }

    return procedimiento;
  }

  async update(id: string, dto: UpdateProcedimientoDto) {
    const procedimientoExiste = await this.prisma.procedimiento.findUnique({
      where: { id_procedimiento: id },
    });

    if (!procedimientoExiste) {
      throw new NotFoundException(`El procedimiento con ID ${id} no existe.`)
    }

    const { fecha_ejecucion, fecha_creacion, insumos_utilizados, id_cita, ...rest } = dto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (insumos_utilizados) {
          await tx.procedimientoInsumo.deleteMany({
            where: { id_procedimiento: id },
          });
        }

        return await tx.procedimiento.update({
          where: { id_procedimiento: id },
          data: {
            ...rest,
            id_cita: id_cita,
            ...(fecha_ejecucion ? { fecha_ejecucion: new Date(`${fecha_ejecucion}T00:00:00`) } : {}),
            ...(fecha_creacion ? { fecha_creacion: new Date(`${fecha_creacion}T00:00:00`) } : {}),
            ...(insumos_utilizados ? {
              insumos_utilizados: {
                create: insumos_utilizados.map((insumo) => ({
                  id_insumo: insumo.id_insumo,
                  cantidad_utilizada: insumo.cantidad_utilizada,
                })),
              },
            } : {}),
          },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el procedimiento: ${error.message}`,
      );
    }
  }

  async remove(id: string) {
    const procedimientoExiste = await this.prisma.procedimiento.findUnique({
      where: { id_procedimiento: id }
    });

    if (!procedimientoExiste) {
      throw new NotFoundException(`El procedimiento con ID ${id} no existe.`);
    }

    try {
      await this.prisma.$transaction(async (tx) => {

        // SE ELIMINAN LAS TABLAS INTERMEDIAS
        await tx.procedimientoInsumo.deleteMany({
          where: { id_procedimiento: id },
        });

        // SE ELIMINA LA TABLA PRINCIPAL
        await tx.procedimiento.delete({
          where: { id_procedimiento: id },
        });
      });

      return { message: `Procedimiento ${id} y sus insumos asociados fueron eliminados con éxito` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al eliminar el procedimiento: ${error.message}`,
      );
    }
  }

  private async generarIdProcedimiento(): Promise<string> {
    const ultima = await this.prisma.procedimiento.findFirst({
      orderBy: { id_procedimiento: 'desc' },
      select: { id_procedimiento: true },
    });

    if (!ultima) return 'PROCE0001';
    const num = parseInt(ultima.id_procedimiento.replace(/\D/g, ''), 10)
    return `PROCE${String(num + 1).padStart(4, '0')}`
  }
}
