import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

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

  async register(dto: RegisterDto) {
    const existe = await this.usuarioRepository.findOne({
      where: { username: dto.username },
    });

    if (existe) {
      throw new BadRequestException('El usuario ya existe');
    }

    const usuario = this.usuarioRepository.create({
      username: dto.username,
      password_hash: hashSync(dto.password, 10),
      nombre: dto.nombre,
    });

    const saved = await this.usuarioRepository.save(usuario);

    const payload = { sub: saved.id, username: saved.username, nombre: saved.nombre };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: { id: saved.id, username: saved.username, nombre: saved.nombre },
    };
  }
}
