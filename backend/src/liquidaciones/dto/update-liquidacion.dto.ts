import { IsString, IsIn, IsOptional, IsDateString, IsArray, ValidateNested, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleLiquidacionDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  concepto_id: number;

  @IsNumber()
  @Type(() => Number)
  cantidad: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  base_imponible?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  monto?: number;
}

export class UpdateLiquidacionDto {
  @IsString()
  @IsOptional()
  tipo_evento?: string;

  @IsDateString()
  @IsOptional()
  fecha_evento?: string;

  @IsDateString()
  @IsOptional()
  fecha_vencimiento?: string;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'pagada', 'vencida', 'anulada'])
  estado?: 'pendiente' | 'pagada' | 'vencida' | 'anulada';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleLiquidacionDto)
  @IsOptional()
  detalles?: DetalleLiquidacionDto[];
}
