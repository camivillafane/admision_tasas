import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Contribuyente } from './entities/contribuyente.entity';
import { CreateContribuyenteDto } from './dto/create-contribuyente.dto';
import { UpdateContribuyenteDto } from './dto/update-contribuyente.dto';

@Injectable()
export class ContribuyentesService {
  constructor(
    @InjectRepository(Contribuyente)
    private readonly contribuyenteRepository: Repository<Contribuyente>,
  ) {}

  create(dto: CreateContribuyenteDto) {
    const contribuyente = this.contribuyenteRepository.create(dto);
    return this.contribuyenteRepository.save(contribuyente);
  }

  findAll(query?: string) {
    const where: any = {};
    if (query) {
      where.cuit = Like(`%${query}%`);
    }
    return this.contribuyenteRepository.find({ where, order: { apellido: 'ASC', nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const contribuyente = await this.contribuyenteRepository.findOne({ where: { id } });
    if (!contribuyente) throw new NotFoundException('Contribuyente no encontrado');
    return contribuyente;
  }

  async update(id: number, dto: UpdateContribuyenteDto) {
    const contribuyente = await this.findOne(id);
    Object.assign(contribuyente, dto);
    return this.contribuyenteRepository.save(contribuyente);
  }

  async remove(id: number) {
    const contribuyente = await this.findOne(id);
    return this.contribuyenteRepository.remove(contribuyente);
  }
}
