import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProcedimientoService } from './procedimiento.service';
import { CreateProcedimientoDto } from './dto/create-procedimiento.dto';
import { UpdateProcedimientoDto } from './dto/update-procedimiento.dto';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('procedimiento')
@Controller('procedimiento')
export class ProcedimientoController {
  constructor(private readonly procedimientoService: ProcedimientoService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo procedimiento con sus insumos' })
  create(@Body() dto: CreateProcedimientoDto) {
    return this.procedimientoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de todos los procedimientos' })
  findAll(@Query('skip') skip = '0', @Query('take') take = '20') {
    return this.procedimientoService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de un procedimiento por su ID' })
  @ApiParam({ name: 'id', description: 'ID del procedimiento (ej: PRO-1234)', type: String })
  findOne(@Param('id') id: string) {
    return this.procedimientoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos o insumos de un procedimiento' })
  @ApiParam({ name: 'id', description: 'ID del procedimiento a modificar', type: String })
  update(@Param('id') id: string, @Body() dto: UpdateProcedimientoDto) {
    return this.procedimientoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un procedimiento y sus registros de insumos asociados' })
  @ApiParam({ name: 'id', description: 'ID del procedimiento a eliminar', type: String })
  remove(@Param('id') id: string) {
    return this.procedimientoService.remove(id);
  }
}
