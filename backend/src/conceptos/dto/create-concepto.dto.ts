import { IsString, IsOptional, IsBoolean, Length, IsIn, IsNumber } from 'class-validator';

export class CreateConceptoDto {
  @IsString()
  @Length(1, 20)
  codigo: string;

  @IsString()
  @Length(1, 150)
  descripcion: string;

  @IsString()
  @IsIn(['tasa', 'recargo', 'exencion'])
  tipo: 'tasa' | 'recargo' | 'exencion';

  @IsBoolean()
  @IsOptional()
  es_porcentaje?: boolean;

  @IsNumber()
  valor: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
