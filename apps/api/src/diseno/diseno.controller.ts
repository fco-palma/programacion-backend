import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DisenoService } from './diseno.service';
import { CreateDisenoDto } from './dto/create-diseno.dto';
import { UpdateDisenoDto } from './dto/update-diseno.dto';

@Controller('diseno')
export class DisenoController {
  constructor(private readonly disenoService: DisenoService) { }

  @Post()
  create(@Body() createDisenoDto: CreateDisenoDto) {
    return this.disenoService.create(createDisenoDto);
  }

  @Get()
  findAll(@Query('skip') skip = '0', @Query('take') take = '20') {
    return this.disenoService.findAll(Number(skip), Number(take));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disenoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDisenoDto) {
    return this.disenoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disenoService.remove(id);
  }
}
