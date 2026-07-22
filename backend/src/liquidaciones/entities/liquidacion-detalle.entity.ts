import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Liquidacion } from './liquidacion.entity';
import { Concepto } from '../../conceptos/entities/concepto.entity';

@Entity('liquidaciones_detalles')
export class LiquidacionDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  liquidacion_id: number;

  @ManyToOne(() => Liquidacion, (liquidacion) => liquidacion.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'liquidacion_id' })
  liquidacion: Liquidacion;

  @Column()
  concepto_id: number;

  @ManyToOne(() => Concepto, (concepto) => concepto.detalles)
  @JoinColumn({ name: 'concepto_id' })
  concepto: Concepto;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 1 })
  cantidad: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  monto: number;
}
