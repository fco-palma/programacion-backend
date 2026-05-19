import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TatuadorService } from './tatuador.service';
import { CreateTatuadorDto } from './dto/create-tatuador.dto';
import { UpdateTatuadorDto } from './dto/update-tatuador.dto';

@Controller('tatuador')
export class TatuadorController {
  constructor(private readonly tatuadorService: TatuadorService) { }

  @Post()
  create(@Body() dto: CreateTatuadorDto) {
    return this.tatuadorService.create(dto);
  }

  @Get()
  findAll(@Query('skip') skip = '0', @Query('take') take = '20') {
    return this.tatuadorService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tatuadorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTatuadorDto) {
    return this.tatuadorService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tatuadorService.remove(id);
  }
}
