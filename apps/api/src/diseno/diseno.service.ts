import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDisenoDto } from './dto/create-diseno.dto';
import { UpdateDisenoDto } from './dto/update-diseno.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DisenoService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateDisenoDto): Promise<string> {
    const idDisenoGenerado = await this.generarIdDiseno();
    const { fecha_creacion, ...rest } = dto;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.diseno.create({
          data: {
            id_diseno: idDisenoGenerado,
            ...rest,
            fecha_creacion: new Date(fecha_creacion),
          }
        })
      });

      return idDisenoGenerado;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar el diseño: ${error.message}`,
      )
    }

  }

  findAll(skip = 0, take = 20) {
    return this.prisma.diseno.findMany({
      skip,
      take,
      orderBy: { boceto: 'asc' },
      include: {
        citas: true,
      },
    });
  }

  async findOne(id: string) {
    const diseno = await this.prisma.diseno.findUnique({
      where: { id_diseno: id },
    });

    if (!diseno) {
      throw new NotFoundException(`Diseño con ID ${id} no encontrado`)
    }

    return diseno;
  }

  async update(id: string, dto: UpdateDisenoDto) {
    await this.findOne(id);
    const { fecha_creacion, ...rest } = dto;
    return this.prisma.diseno.update({
      where: { id_diseno: id },
      data: {
        ...rest,
        ...(fecha_creacion !== undefined ? { fecha_creacion: new Date(fecha_creacion) } : {}),
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.diseno.delete({
      where: { id_diseno: id },
    });

    return { ok: true };
  }

  private async generarIdDiseno(): Promise<string> {
    const ultima = await this.prisma.diseno.findFirst({
      orderBy: { id_diseno: 'desc' },
      select: { id_diseno: true },
    });

    if (!ultima) return 'DISE0001';
    const num = parseInt(ultima.id_diseno.replace(/\D/g, ''), 10)
    return `DISE${String(num + 1).padStart(4, '0')}`
  }
}
