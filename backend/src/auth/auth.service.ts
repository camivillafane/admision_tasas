import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync } from 'bcryptjs';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { username: dto.username, activo: true },
    });

    if (!usuario || !compareSync(dto.password, usuario.password_hash)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, username: usuario.username, nombre: usuario.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, username: usuario.username, nombre: usuario.nombre },
    };
  }
}
