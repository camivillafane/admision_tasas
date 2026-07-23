import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptosService } from './conceptos.service';
import { ConceptosController } from './conceptos.controller';
import { Concepto } from './entities/concepto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concepto])],
  controllers: [ConceptosController],
  providers: [ConceptosService],
})
export class ConceptosModule {}
