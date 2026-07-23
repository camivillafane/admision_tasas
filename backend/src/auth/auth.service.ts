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
    this.logger.log(`Intento de login para usuario: ${dto.username}`);

    let usuario: Usuario | null;
    try {
      usuario = await this.usuarioRepository.findOne({
        where: { username: dto.username },
      });
    } catch (err) {
      this.logger.error(`Error al buscar usuario en la base de datos: ${err.message}`);
      throw new UnauthorizedException('Error de conexion a la base de datos');
    }

    if (!usuario) {
      this.logger.warn(`Usuario no encontrado: ${dto.username}`);
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (!usuario.activo) {
      this.logger.warn(`Usuario inactivo: ${dto.username}`);
      throw new UnauthorizedException('Usuario inactivo');
    }

    const passwordValid = compareSync(dto.password, usuario.password_hash);
    if (!passwordValid) {
      this.logger.warn(`Password incorrecto para usuario: ${dto.username}`);
      throw new UnauthorizedException('Credenciales invalidas');
    }

    this.logger.log(`Login exitoso para usuario: ${dto.username}`);
    const payload = { sub: usuario.id, username: usuario.username, nombre: usuario.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, username: usuario.username, nombre: usuario.nombre },
    };
  }
}
