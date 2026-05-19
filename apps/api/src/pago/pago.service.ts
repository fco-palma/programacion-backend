import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PagoService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreatePagoDto): Promise<string> {
    const idPagoGenerado = await this.generarIdPago();
    const { fecha, ...rest } = dto;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.pago.create({
          data: {
            id_pago: idPagoGenerado,
            ...rest,
            fecha: new Date(fecha),
          }
        })
      });

      return idPagoGenerado;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar el pago: ${error.message}`,
      )
    }

  }

  findAll(skip = 0, take = 20) {
    return this.prisma.pago.findMany({
      skip,
      take,
      orderBy: { estado: 'asc' },
      include: {
        cita: true
      }
    });
  }

  async findOne(id: string) {
    const pago = await this.prisma.pago.findUnique({
      where: { id_pago: id },
    });

    if (!pago) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }

    return pago;
  }

  async update(id: string, dto: UpdatePagoDto) {
    await this.findOne(id);
    const { fecha, ...rest } = dto;
    return this.prisma.pago.update({
      where: { id_pago: id },
      data: {
        ...rest,
        ...(fecha !== undefined ? { fecha_ingreso: new Date(fecha) } : {}),
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.pago.delete({
      where: { id_pago: id },
    });
    return { ok: true };
  }

  private async generarIdPago(): Promise<string> {
    const ultima = await this.prisma.pago.findFirst({
      orderBy: { id_pago: 'desc' },
      select: { id_pago: true },
    });

    if (!ultima) return 'PAGO0001';
    const num = parseInt(ultima.id_pago.replace(/\D/g, ''), 10)
    return `PAGO${String(num + 1).padStart(4, '0')}`
  }
}
