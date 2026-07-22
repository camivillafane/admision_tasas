import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ length: 255 })
  password_hash: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}
