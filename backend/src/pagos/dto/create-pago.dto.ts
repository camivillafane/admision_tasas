import { IsInt, IsNumber, IsOptional, IsString, Length, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePagoDto {
  @IsInt()
  @Type(() => Number)
  liquidacion_id: number;

  @IsNumber()
  @Type(() => Number)
  monto: number;

  @IsDateString()
  @IsOptional()
  fecha_pago?: string;

  @IsString()
  @Length(1, 50)
  @IsOptional()
  medio_pago?: string;

  @IsString()
  @Length(1, 500)
  @IsOptional()
  observaciones?: string;
}
