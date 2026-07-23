import { IsInt, IsString, IsDateString, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleLiquidacionDto {
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

export class CreateLiquidacionDto {
  @IsInt()
  @Type(() => Number)
  contribuyente_id: number;

  @IsString()
  tipo_evento: string;

  @IsDateString()
  fecha_evento: string;

  @IsDateString()
  fecha_vencimiento: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleLiquidacionDto)
  detalles: DetalleLiquidacionDto[];
}
