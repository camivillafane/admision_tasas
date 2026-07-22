import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LiquidacionDetalle } from '../../liquidaciones/entities/liquidacion-detalle.entity';

@Entity('conceptos')
export class Concepto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 150 })
  descripcion: string;

  @Column({ length: 20 })
  tipo: 'tasa' | 'recargo' | 'exencion';

  @Column({ default: false })
  es_porcentaje: boolean;

  @Column({ type: 'numeric', precision: 12, scale: 4 })
  valor: number;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => LiquidacionDetalle, (detalle) => detalle.concepto)
  detalles: LiquidacionDetalle[];
}
