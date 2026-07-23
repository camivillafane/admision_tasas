import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  private async calcularDetalles(
    detallesInput: CreateLiquidacionDto['detalles'] | UpdateLiquidacionDto['detalles'],
  ) {
    if (!detallesInput || detallesInput.length === 0) {
      throw new BadRequestException('La liquidación debe tener al menos un detalle');
    }

    return Promise.all(
      detallesInput.map(async (d) => {
        const concepto = await this.conceptoRepository.findOne({ where: { id: d.concepto_id } });
        if (!concepto) throw new NotFoundException(`Concepto ${d.concepto_id} no encontrado`);
        if (!concepto.activo) throw new BadRequestException(`Concepto ${concepto.codigo} está inactivo`);

        let monto: number;
        let base: number | null = null;

        if (d.monto !== undefined && d.monto !== null) {
          monto = Number(d.monto);
        } else if (concepto.es_porcentaje) {
          if (d.base_imponible === undefined || d.base_imponible === null) {
            throw new BadRequestException(
              `El concepto ${concepto.codigo} requiere una base imponible porque es porcentaje`,
            );
          }
          base = Number(d.base_imponible);
          const valor = Number(concepto.valor);
          monto = base * (valor / 100);
          if (concepto.tipo === 'exencion') monto = monto * -1;
        } else {
          monto = Number(concepto.valor) * Number(d.cantidad);
          if (concepto.tipo === 'exencion') monto = monto * -1;
        }

        return {
          concepto_id: d.concepto_id,
          cantidad: Number(d.cantidad),
          base_imponible: base,
          monto: Number(monto.toFixed(2)),
        };
      }),
    );
  }

  async create(dto: CreateLiquidacionDto) {
    const detalles = await this.calcularDetalles(dto.detalles);
    const total = Number(detalles.reduce((sum, d) => sum + d.monto, 0).toFixed(2));

    if (total < 0) {
      throw new BadRequestException('El total de la liquidación no puede ser negativo');
    }

    const liquidacion = this.liquidacionRepository.create({
      contribuyente_id: dto.contribuyente_id,
      tipo_evento: dto.tipo_evento,
      fecha_evento: new Date(dto.fecha_evento),
      fecha_vencimiento: new Date(dto.fecha_vencimiento),
      total,
      detalles: detalles as any,
    });

    return this.liquidacionRepository.save(liquidacion);
  }

  private async marcarVencidasAutomatico() {
    const hoy = new Date().toISOString().split('T')[0];
    await this.liquidacionRepository
      .createQueryBuilder()
      .update(Liquidacion)
      .set({ estado: 'vencida' })
      .where("estado = 'pendiente'")
      .andWhere("fecha_vencimiento < :hoy", { hoy })
      .execute();
  }

  async findAll() {
    await this.marcarVencidasAutomatico();
    return this.liquidacionRepository.find({
      relations: ['contribuyente', 'detalles', 'detalles.concepto'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    await this.marcarVencidasAutomatico();
    const liquidacion = await this.liquidacionRepository.findOne({
      where: { id },
      relations: ['contribuyente', 'detalles', 'detalles.concepto'],
    });
    if (!liquidacion) throw new NotFoundException('Liquidación no encontrada');
    return liquidacion;
  }

  async update(id: number, dto: UpdateLiquidacionDto) {
    const liquidacion = await this.findOne(id);

    if (liquidacion.estado === 'pagada' || liquidacion.estado === 'anulada') {
      throw new BadRequestException('No se puede modificar una liquidación pagada o anulada');
    }

    if (dto.estado) {
      const transicionesValidas: Record<string, string[]> = {
        pendiente: ['pagada', 'vencida', 'anulada'],
        vencida: ['pagada', 'anulada'],
        pagada: [],
        anulada: [],
      };
      if (!transicionesValidas[liquidacion.estado].includes(dto.estado)) {
        throw new BadRequestException(
          `No se puede cambiar el estado de '${liquidacion.estado}' a '${dto.estado}'`,
        );
      }
      liquidacion.estado = dto.estado;
    }

    if (dto.tipo_evento) liquidacion.tipo_evento = dto.tipo_evento;
    if (dto.fecha_evento) liquidacion.fecha_evento = new Date(dto.fecha_evento);
    if (dto.fecha_vencimiento) liquidacion.fecha_vencimiento = new Date(dto.fecha_vencimiento);

    if (dto.detalles && dto.detalles.length > 0) {
      const nuevosDetalles = await this.calcularDetalles(dto.detalles);
      const total = Number(nuevosDetalles.reduce((sum, d) => sum + d.monto, 0).toFixed(2));
      if (total < 0) {
        throw new BadRequestException('El total de la liquidación no puede ser negativo');
      }

      await this.dataSource.transaction(async (manager) => {
        await manager.delete(LiquidacionDetalle, { liquidacion_id: id });
        const detallesEntities = nuevosDetalles.map((d) =>
          manager.create(LiquidacionDetalle, { ...d, liquidacion_id: id }),
        );
        await manager.save(detallesEntities);
      });

      liquidacion.total = total;
    }

    return this.liquidacionRepository.save(liquidacion);
  }

  async remove(id: number) {
    const liquidacion = await this.findOne(id);
    if (liquidacion.estado === 'pagada') {
      throw new BadRequestException('No se puede eliminar una liquidación pagada');
    }
    return this.liquidacionRepository.remove(liquidacion);
  }
}
