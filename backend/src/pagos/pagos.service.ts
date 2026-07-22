import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { Liquidacion } from '../liquidaciones/entities/liquidacion.entity';
import { CreatePagoDto } from './dto/create-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
    @InjectRepository(Liquidacion)
    private readonly liquidacionRepository: Repository<Liquidacion>,
  ) {}

  async create(dto: CreatePagoDto) {
    const liquidacion = await this.liquidacionRepository.findOne({
      where: { id: dto.liquidacion_id },
      relations: ['pagos'],
    });

    if (!liquidacion) throw new NotFoundException('Liquidación no encontrada');
    if (liquidacion.estado === 'anulada') {
      throw new BadRequestException('No se puede registrar un pago sobre una liquidación anulada');
    }
    if (liquidacion.estado === 'pagada') {
      throw new BadRequestException('La liquidación ya está pagada');
    }

    const totalPagado = (liquidacion.pagos || []).reduce((sum, p) => sum + Number(p.monto), 0);
    const restante = Number((Number(liquidacion.total) - totalPagado).toFixed(2));

    if (Number(dto.monto) > restante) {
      throw new BadRequestException(`El monto excede el saldo pendiente de $${restante.toFixed(2)}`);
    }

    const pago = this.pagoRepository.create({
      liquidacion_id: dto.liquidacion_id,
      monto: Number(dto.monto),
      fecha_pago: dto.fecha_pago ? new Date(dto.fecha_pago) : new Date(),
      medio_pago: dto.medio_pago,
      observaciones: dto.observaciones,
    });

    const saved = await this.pagoRepository.save(pago);

    const nuevoTotalPagado = Number((totalPagado + Number(dto.monto)).toFixed(2));
    if (nuevoTotalPagado >= Number(liquidacion.total)) {
      liquidacion.estado = 'pagada';
      await this.liquidacionRepository.save(liquidacion);
    }

    return saved;
  }

  findAll() {
    return this.pagoRepository.find({
      relations: ['liquidacion', 'liquidacion.contribuyente'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const pago = await this.pagoRepository.findOne({
      where: { id },
      relations: ['liquidacion', 'liquidacion.contribuyente'],
    });
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return pago;
  }

  async remove(id: number) {
    const pago = await this.findOne(id);
    const liquidacion = await this.liquidacionRepository.findOne({
      where: { id: pago.liquidacion_id },
    });

    await this.pagoRepository.remove(pago);

    if (liquidacion && liquidacion.estado === 'pagada') {
      liquidacion.estado = 'pendiente';
      await this.liquidacionRepository.save(liquidacion);
    }

    return { eliminado: true };
  }
}
