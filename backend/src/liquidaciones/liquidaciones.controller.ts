import { Controller, Get, Post, Patch, Delete, Body, Param, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LiquidacionesService } from './liquidaciones.service';
import { PdfService } from './pdf.service';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateLiquidacionDto } from './dto/update-liquidacion.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('liquidaciones')
export class LiquidacionesController {
  constructor(
    private readonly liquidacionesService: LiquidacionesService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  create(@Body() dto: CreateLiquidacionDto) {
    return this.liquidacionesService.create(dto);
  }

  @Get()
  findAll() {
    return this.liquidacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.liquidacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLiquidacionDto) {
    return this.liquidacionesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.liquidacionesService.remove(+id);
  }

  @Get(':id/pdf')
  async pdf(@Param('id') id: string, @Res() res: Response) {
    const liquidacion = await this.liquidacionesService.findOne(+id);
    const buffer = await this.pdfService.generar(liquidacion);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=liquidacion-${id}.pdf`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
