import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateLiquidacionDto {
  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'pagada', 'vencida', 'anulada'])
  estado?: 'pendiente' | 'pagada' | 'vencida' | 'anulada';
}
