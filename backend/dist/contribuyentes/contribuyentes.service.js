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
exports.ContribuyentesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contribuyente_entity_1 = require("./entities/contribuyente.entity");
let ContribuyentesService = class ContribuyentesService {
    contribuyenteRepository;
    constructor(contribuyenteRepository) {
        this.contribuyenteRepository = contribuyenteRepository;
    }
    create(dto) {
        const contribuyente = this.contribuyenteRepository.create(dto);
        return this.contribuyenteRepository.save(contribuyente);
    }
    findAll(query) {
        const where = {};
        if (query) {
            where.cuit = (0, typeorm_2.Like)(`%${query}%`);
        }
        return this.contribuyenteRepository.find({ where, order: { apellido: 'ASC', nombre: 'ASC' } });
    }
    async findOne(id) {
        const contribuyente = await this.contribuyenteRepository.findOne({ where: { id } });
        if (!contribuyente)
            throw new common_1.NotFoundException('Contribuyente no encontrado');
        return contribuyente;
    }
    async update(id, dto) {
        const contribuyente = await this.findOne(id);
        Object.assign(contribuyente, dto);
        return this.contribuyenteRepository.save(contribuyente);
    }
    async remove(id) {
        const contribuyente = await this.findOne(id);
        return this.contribuyenteRepository.remove(contribuyente);
    }
};
exports.ContribuyentesService = ContribuyentesService;
exports.ContribuyentesService = ContribuyentesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contribuyente_entity_1.Contribuyente)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContribuyentesService);
//# sourceMappingURL=contribuyentes.service.js.map