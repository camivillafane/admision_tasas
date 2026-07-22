import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concepto } from './entities/concepto.entity';
import { CreateConceptoDto } from './dto/create-concepto.dto';
import { UpdateConceptoDto } from './dto/update-concepto.dto';

@Injectable()
export class ConceptosService {
  constructor(
    @InjectRepository(Concepto)
    private readonly conceptoRepository: Repository<Concepto>,
  ) {}

  create(dto: CreateConceptoDto) {
    const concepto = this.conceptoRepository.create(dto);
    return this.conceptoRepository.save(concepto);
  }

  findAll() {
    return this.conceptoRepository.find({ order: { codigo: 'ASC' } });
  }

  async findOne(id: number) {
    const concepto = await this.conceptoRepository.findOne({ where: { id } });
    if (!concepto) throw new NotFoundException('Concepto no encontrado');
    return concepto;
  }

  async update(id: number, dto: UpdateConceptoDto) {
    const concepto = await this.findOne(id);
    Object.assign(concepto, dto);
    return this.conceptoRepository.save(concepto);
  }

  async remove(id: number) {
    const concepto = await this.findOne(id);
    return this.conceptoRepository.remove(concepto);
  }
}
