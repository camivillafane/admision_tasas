"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const usuario_entity_1 = require("./entities/usuario.entity");
let UsuariosService = class UsuariosService {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async create(dto) {
        const existe = await this.usuarioRepository.findOne({ where: { username: dto.username } });
        if (existe) {
            throw new common_1.BadRequestException(`El usuario '${dto.username}' ya existe`);
        }
        const usuario = this.usuarioRepository.create({
            username: dto.username,
            password_hash: (0, bcryptjs_1.hashSync)(dto.password, 10),
            nombre: dto.nombre,
            activo: dto.activo ?? true,
        });
        return this.usuarioRepository.save(usuario);
    }
    findAll() {
        return this.usuarioRepository.find({ order: { username: 'ASC' } });
    }
    async findOne(id) {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return usuario;
    }
    async update(id, dto) {
        const usuario = await this.findOne(id);
        if (dto.username && dto.username !== usuario.username) {
            const existe = await this.usuarioRepository.findOne({ where: { username: dto.username } });
            if (existe)
                throw new common_1.BadRequestException(`El usuario '${dto.username}' ya existe`);
            usuario.username = dto.username;
        }
        if (dto.nombre)
            usuario.nombre = dto.nombre;
        if (dto.activo !== undefined)
            usuario.activo = dto.activo;
        if (dto.password)
            usuario.password_hash = (0, bcryptjs_1.hashSync)(dto.password, 10);
        return this.usuarioRepository.save(usuario);
    }
    async remove(id) {
        const usuario = await this.findOne(id);
        return this.usuarioRepository.remove(usuario);
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map