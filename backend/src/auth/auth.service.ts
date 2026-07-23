import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    let usuario: Usuario | null;
    try {
      usuario = await this.usuarioRepository.findOne({
        where: { username: dto.username },
      });
    } catch (err) {
      throw new UnauthorizedException('Error de conexion a la base de datos');
    }

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!compareSync(dto.password, usuario.password_hash)) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload = { sub: usuario.id, username: usuario.username, nombre: usuario.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, username: usuario.username, nombre: usuario.nombre },
    };
  }
}
