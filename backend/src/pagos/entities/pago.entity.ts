import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Liquidacion } from '../../liquidaciones/entities/liquidacion.entity';

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  liquidacion_id: number;

  @ManyToOne(() => Liquidacion, (liquidacion) => liquidacion.pagos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'liquidacion_id' })
  liquidacion: Liquidacion;

  @Column({ type: 'date' })
  fecha_pago: Date;

  @Column({ type: 'numeric', precision: 18, scale: 2 })
  monto: number;

  @Column({ length: 50, nullable: true })
  medio_pago: string;

  @Column({ length: 500, nullable: true })
  observaciones: string;
}
