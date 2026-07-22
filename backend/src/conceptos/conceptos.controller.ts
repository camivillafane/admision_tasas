import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConceptosService } from './conceptos.service';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('conceptos')
export class ConceptosController {
  constructor(private readonly conceptosService: ConceptosService) {}

  @Post()
  create(@Body() dto: CreateConceptoDto) {
    return this.conceptosService.create(dto);
  }

  @Get()
  findAll() {
    return this.conceptosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conceptosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateConceptoDto) {
    return this.conceptosService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conceptosService.remove(+id);
  }
}
