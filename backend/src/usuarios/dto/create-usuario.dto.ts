import { IsString, Length, IsBoolean, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @Length(3, 50)
  username: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsString()
  @Length(1, 150)
  nombre: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
