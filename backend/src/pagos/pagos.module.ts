import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pago } from './entities/pago.entity';
import { Liquidacion } from '../liquidaciones/entities/liquidacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Liquidacion])],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
