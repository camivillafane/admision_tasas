import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Liquidacion } from './entities/liquidacion.entity';
import { LiquidacionDetalle } from './entities/liquidacion-detalle.entity';
import { Concepto } from '../conceptos/entities/concepto.entity';
import { CreateLiquidacionDto } from './dto/create-liquidacion.dto';
import { UpdateLiquidacionDto } from './dto/update-liquidacion.dto';

@Injectable()
export class LiquidacionesService {
  constructor(
    @InjectRepository(Liquidacion)
    private readonly liquidacionRepository: Repository<Liquidacion>,
    @InjectRepository(LiquidacionDetalle)
    private readonly detalleRepository: Repository<LiquidacionDetalle>,
    @InjectRepository(Concepto)
    private readonly conceptoRepository: Repository<Concepto>,
  ) {}

  async create(dto: CreateLiquidacionDto) {
    const detalles = await Promise.all(
      dto.detalles.map(async (d) => {
        const concepto = await this.conceptoRepository.findOne({ where: { id: d.concepto_id } });
        if (!concepto) throw new NotFoundException(`Concepto ${d.concepto_id} no encontrado`);
        const monto = d.monto ?? Number(concepto.valor) * Number(d.cantidad);
        return this.detalleRepository.create({
          concepto_id: d.concepto_id,
          cantidad: d.cantidad,
          monto: Number(monto.toFixed(2)),
        });
      }),
    );

    const total = detalles.reduce((sum, d) => sum + d.monto, 0);

    const liquidacion = this.liquidacionRepository.create({
      contribuyente_id: dto.contribuyente_id,
      tipo_evento: dto.tipo_evento,
      fecha_evento: new Date(dto.fecha_evento),
      fecha_vencimiento: new Date(dto.fecha_vencimiento),
      total,
      detalles,
    });

    return this.liquidacionRepository.save(liquidacion);
  }

  findAll() {
    return this.liquidacionRepository.find({
      relations: ['contribuyente', 'detalles', 'detalles.concepto'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const liquidacion = await this.liquidacionRepository.findOne({
      where: { id },
      relations: ['contribuyente', 'detalles', 'detalles.concepto'],
    });
    if (!liquidacion) throw new NotFoundException('Liquidación no encontrada');
    return liquidacion;
  }

  async update(id: number, dto: UpdateLiquidacionDto) {
    const liquidacion = await this.findOne(id);
    if (dto.estado) liquidacion.estado = dto.estado;
    return this.liquidacionRepository.save(liquidacion);
  }

  async remove(id: number) {
    const liquidacion = await this.findOne(id);
    return this.liquidacionRepository.remove(liquidacion);
  }
}
