import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTatuadorDto } from './dto/create-tatuador.dto';
import { UpdateTatuadorDto } from './dto/update-tatuador.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TatuadorService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateTatuadorDto): Promise<string> {
    const idTatuadorGenerado = await this.generarIdTatuador();
    const { ...rest } = dto;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.tatuador.create({
          data: {
            id_tatuador: idTatuadorGenerado,
            ...rest,
          }
        })
      });

      return idTatuadorGenerado;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar al tatuador: ${error.message}`,
      )
    }
  }

  findAll(skip = 0, take = 20) {
    return this.prisma.tatuador.findMany({
      skip,
      take,
      orderBy: { nombre: 'asc' },
      include: {
        citas: true
      }
    });
  }

  async findOne(id: string) {
    const tatuador = await this.prisma.tatuador.findUnique({
      where: { id_tatuador: id },
    });

    if (!tatuador) {
      throw new NotFoundException(`Tatuador con ID ${id} no encontrado`);
    }

    return tatuador;
  }

  async update(id: string, dto: UpdateTatuadorDto) {
    await this.findOne(id);
    const { ...rest } = dto;
    return this.prisma.tatuador.update({
      where: { id_tatuador: id },
      data: {
        ...rest
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.tatuador.delete({
      where: { id_tatuador: id },
    });
    return { ok: true };
  }

  private async generarIdTatuador(): Promise<string> {
    const ultima = await this.prisma.tatuador.findFirst({
      orderBy: { id_tatuador: 'desc' },
      select: { id_tatuador: true },
    });

    if (!ultima) return 'TATU0001';
    const num = parseInt(ultima.id_tatuador.replace(/\D/g, ''), 10)
    return `TATU${String(num + 1).padStart(4, '0')}`
  }
}
