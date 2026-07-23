import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync } from 'bcryptjs';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const existe = await this.usuarioRepository.findOne({ where: { username: dto.username } });
    if (existe) {
      throw new BadRequestException(`El usuario '${dto.username}' ya existe`);
    }

    const usuario = this.usuarioRepository.create({
      username: dto.username,
      password_hash: hashSync(dto.password, 10),
      nombre: dto.nombre,
      activo: dto.activo ?? true,
    });

    return this.usuarioRepository.save(usuario);
  }

  findAll() {
    return this.usuarioRepository.find({ order: { username: 'ASC' } });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);

    if (dto.username && dto.username !== usuario.username) {
      const existe = await this.usuarioRepository.findOne({ where: { username: dto.username } });
      if (existe) throw new BadRequestException(`El usuario '${dto.username}' ya existe`);
      usuario.username = dto.username;
    }

    if (dto.nombre) usuario.nombre = dto.nombre;
    if (dto.activo !== undefined) usuario.activo = dto.activo;
    if (dto.password) usuario.password_hash = hashSync(dto.password, 10);

    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    return this.usuarioRepository.remove(usuario);
  }
}
