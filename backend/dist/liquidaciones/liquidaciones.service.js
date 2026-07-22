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
exports.LiquidacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const liquidacion_entity_1 = require("./entities/liquidacion.entity");
const liquidacion_detalle_entity_1 = require("./entities/liquidacion-detalle.entity");
const concepto_entity_1 = require("../conceptos/entities/concepto.entity");
let LiquidacionesService = class LiquidacionesService {
    liquidacionRepository;
    detalleRepository;
    conceptoRepository;
    constructor(liquidacionRepository, detalleRepository, conceptoRepository) {
        this.liquidacionRepository = liquidacionRepository;
        this.detalleRepository = detalleRepository;
        this.conceptoRepository = conceptoRepository;
    }
    async create(dto) {
        const detalles = await Promise.all(dto.detalles.map(async (d) => {
            const concepto = await this.conceptoRepository.findOne({ where: { id: d.concepto_id } });
            if (!concepto)
                throw new common_1.NotFoundException(`Concepto ${d.concepto_id} no encontrado`);
            const monto = d.monto ?? Number(concepto.valor) * Number(d.cantidad);
            return this.detalleRepository.create({
                concepto_id: d.concepto_id,
                cantidad: d.cantidad,
                monto: Number(monto.toFixed(2)),
            });
        }));
        const total = detalles.reduce((sum, d) => sum + d.monto, 0);
        const liquidacion = this.liquidacionRepository.create({
            contribuyente_id: dto.contribuyente_id,
            tipo_evento: dto.tipo_evento,
            fecha_evento: new Date(dto.fecha_evento),
            fecha_vencimiento: new Date(dto.fecha_vencimiento),
            total,
            detalles,
        });
        return this.liquidacionRepository.save(liquidacion);
    }
    findAll() {
        return this.liquidacionRepository.find({
            relations: ['contribuyente', 'detalles', 'detalles.concepto'],
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const liquidacion = await this.liquidacionRepository.findOne({
            where: { id },
            relations: ['contribuyente', 'detalles', 'detalles.concepto'],
        });
        if (!liquidacion)
            throw new common_1.NotFoundException('Liquidación no encontrada');
        return liquidacion;
    }
    async update(id, dto) {
        const liquidacion = await this.findOne(id);
        if (dto.estado)
            liquidacion.estado = dto.estado;
        return this.liquidacionRepository.save(liquidacion);
    }
    async remove(id) {
        const liquidacion = await this.findOne(id);
        return this.liquidacionRepository.remove(liquidacion);
    }
};
exports.LiquidacionesService = LiquidacionesService;
exports.LiquidacionesService = LiquidacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(liquidacion_entity_1.Liquidacion)),
    __param(1, (0, typeorm_1.InjectRepository)(liquidacion_detalle_entity_1.LiquidacionDetalle)),
    __param(2, (0, typeorm_1.InjectRepository)(concepto_entity_1.Concepto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LiquidacionesService);
//# sourceMappingURL=liquidaciones.service.js.map