import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateClienteDto) {
    const { fecha_nacimiento, ...rest } = dto;

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.cliente.create({
          data: {
            ...rest,
            fecha_nacimiento: new Date(fecha_nacimiento),
          }
        });
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al registrar el cliente: ${error.message}`,
      )
    }
  }

  findAll(skip = 0, take = 20) {
    return this.prisma.cliente.findMany({
      skip,
      take,
      orderBy: { nombre: 'asc' },
      include: {
        citas: true,
      },
    });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { rut_cliente: id },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async update(id: string, dto: UpdateClienteDto) {
    await this.findOne(id);
    const { fecha_nacimiento, ...rest } = dto;
    return this.prisma.cliente.update({
      where: { rut_cliente: id },
      data: {
        ...rest,
        ...(fecha_nacimiento !== undefined ? { fecha_ingreso: new Date(fecha_nacimiento) } : {}),
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.cliente.delete({
      where: { rut_cliente: id },
    });
    return { ok: true };
  }
}
