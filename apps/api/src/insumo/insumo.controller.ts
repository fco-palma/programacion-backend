import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InsumoService } from './insumo.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';

@Controller('insumos')
export class InsumoController {
  constructor(private readonly insumoService: InsumoService) { }

  @Post()
  create(@Body() dto: CreateInsumoDto) {
    return this.insumoService.create(dto);
  }

  @Get()
  findAll(@Query('skip') skip = '0', @Query('take') take = '20') {
    return this.insumoService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insumoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInsumoDto) {
    return this.insumoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insumoService.remove(id);
  }
}
