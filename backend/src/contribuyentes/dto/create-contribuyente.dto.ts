import { IsString, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateContribuyenteDto {
  @IsString()
  @Length(1, 20)
  cuit: string;

  @IsString()
  @Length(1, 150)
  apellido: string;

  @IsString()
  @Length(1, 150)
  nombre: string;

  @IsString()
  @IsOptional()
  @Length(0, 200)
  domicilio?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
