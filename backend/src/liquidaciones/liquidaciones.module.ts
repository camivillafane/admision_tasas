import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiquidacionesService } from './liquidaciones.service';
import { LiquidacionesController } from './liquidaciones.controller';
import { PdfService } from './pdf.service';
import { Liquidacion } from './entities/liquidacion.entity';
import { LiquidacionDetalle } from './entities/liquidacion-detalle.entity';
import { Concepto } from '../conceptos/entities/concepto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Liquidacion, LiquidacionDetalle, Concepto])],
  controllers: [LiquidacionesController],
  providers: [LiquidacionesService, PdfService],
})
export class LiquidacionesModule {}
