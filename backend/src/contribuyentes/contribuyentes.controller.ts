import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContribuyentesService } from './contribuyentes.service';
import { CreateContribuyenteDto } from './dto/create-contribuyente.dto';
import { UpdateContribuyenteDto } from './dto/update-contribuyente.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('contribuyentes')
export class ContribuyentesController {
  constructor(private readonly contribuyentesService: ContribuyentesService) {}

  @Post()
  create(@Body() dto: CreateContribuyenteDto) {
    return this.contribuyentesService.create(dto);
  }

  @Get()
  findAll(@Query('q') q?: string) {
    return this.contribuyentesService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contribuyentesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContribuyenteDto) {
    return this.contribuyentesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contribuyentesService.remove(+id);
  }
}
