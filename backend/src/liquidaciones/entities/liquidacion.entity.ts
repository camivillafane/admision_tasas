import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Contribuyente } from '../../contribuyentes/entities/contribuyente.entity';
import { LiquidacionDetalle } from './liquidacion-detalle.entity';
import { Pago } from '../../pagos/entities/pago.entity';

@Entity('liquidaciones')
export class Liquidacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, nullable: true, unique: true })
  numero: string;

  @Column()
  contribuyente_id: number;

  @ManyToOne(() => Contribuyente, (contribuyente) => contribuyente.liquidaciones)
  @JoinColumn({ name: 'contribuyente_id' })
  contribuyente: Contribuyente;

  @Column({ length: 100 })
  tipo_evento: string;

  @Column({ type: 'date' })
  fecha_evento: Date;

  @Column({ type: 'date', default: () => 'CAST(GETDATE() AS DATE)' })
  fecha_emision: Date;

  @Column({ type: 'date' })
  fecha_vencimiento: Date;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  total: number;

  @Column({ length: 20, default: 'pendiente' })
  estado: 'pendiente' | 'pagada' | 'vencida' | 'anulada';

  @OneToMany(() => LiquidacionDetalle, (detalle) => detalle.liquidacion, { cascade: true })
  detalles: LiquidacionDetalle[];

  @OneToMany(() => Pago, (pago) => pago.liquidacion, { cascade: true })
  pagos: Pago[];
}
