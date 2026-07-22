import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Liquidacion } from '../../liquidaciones/entities/liquidacion.entity';

@Entity('contribuyentes')
export class Contribuyente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  cuit: string;

  @Column({ length: 150 })
  apellido: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  domicilio: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Liquidacion, (liquidacion) => liquidacion.contribuyente)
  liquidaciones: Liquidacion[];
}
