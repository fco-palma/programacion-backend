import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CitaService } from './cita.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Controller('cita')
export class CitaController {
  constructor(private readonly citaService: CitaService) { }

  @Post()
  create(@Body() dto: CreateCitaDto) {
    return this.citaService.create(dto);
  }

  @Get()
  findAll(@Query('skip') skip = '0', @Query('take') take = '20') {
    return this.citaService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCitaDto) {
    return this.citaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citaService.remove(id);
  }
}
