import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InsumoService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateInsumoDto): Promise<string> {
    const idInsumoGenerado = await this.generarIdInsumo();
    const { fecha_ingreso, fecha_vencimiento, ...rest } = dto;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.insumo.create({
          data: {
            id_insumo: idInsumoGenerado,
            ...rest,
            fecha_ingreso: new Date(fecha_ingreso),
            fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
          }
        })
      });

      return idInsumoGenerado;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar el insumo: ${error.message}`,
      )
    }
  }

  findAll(skip = 0, take = 20) {
    return this.prisma.insumo.findMany({
      skip,
      take,
      orderBy: { nombre: 'asc' },
      include: {
        procedimientos: true,
      },
    });
  }

  async findOne(id: string) {
    const insumo = await this.prisma.insumo.findUnique({
      where: { id_insumo: id },
    });

    if (!insumo) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return insumo;
  }

  async update(id: string, dto: UpdateInsumoDto) {
    await this.findOne(id);
    const { fecha_ingreso, fecha_vencimiento, ...rest } = dto;
    return this.prisma.insumo.update({
      where: { id_insumo: id },
      data: {
        ...rest,
        ...(fecha_ingreso !== undefined ? { fecha_ingreso: new Date(fecha_ingreso) } : {}),
        ...(fecha_vencimiento !== undefined ? { fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null } : {}),
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.insumo.delete({
      where: { id_insumo: id },
    });
    return { ok: true };
  }

  private async generarIdInsumo(): Promise<string> {
    const ultima = await this.prisma.insumo.findFirst({
      orderBy: { id_insumo: 'desc' },
      select: { id_insumo: true },
    });

    if (!ultima) return 'INS0001';
    const num = parseInt(ultima.id_insumo.replace(/\D/g, ''), 10)
    return `INS${String(num + 1).padStart(4, '0')}`
  }
}
