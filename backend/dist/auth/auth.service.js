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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const usuario_entity_1 = require("../usuarios/entities/usuario.entity");
let AuthService = AuthService_1 = class AuthService {
    usuarioRepository;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(usuarioRepository, jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }
    async login(dto) {
        let usuario;
        try {
            usuario = await this.usuarioRepository.findOne({
                where: { username: dto.username },
            });
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Error de conexion a la base de datos');
        }
        if (!usuario || !usuario.activo) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        if (!(0, bcryptjs_1.compareSync)(dto.password, usuario.password_hash)) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const payload = { sub: usuario.id, username: usuario.username, nombre: usuario.nombre };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: { id: usuario.id, username: usuario.username, nombre: usuario.nombre },
        };
    }
    async register(dto) {
        const existe = await this.usuarioRepository.findOne({
            where: { username: dto.username },
        });
        if (existe) {
            throw new common_1.BadRequestException('El usuario ya existe');
        }
        const usuario = this.usuarioRepository.create({
            username: dto.username,
            password_hash: (0, bcryptjs_1.hashSync)(dto.password, 10),
            nombre: dto.nombre,
        });
        const saved = await this.usuarioRepository.save(usuario);
        const payload = { sub: saved.id, username: saved.username, nombre: saved.nombre };
        return {
            access_token: this.jwtService.sign(payload),
            usuario: { id: saved.id, username: saved.username, nombre: saved.nombre },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map