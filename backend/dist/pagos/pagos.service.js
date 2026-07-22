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
exports.PagosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pago_entity_1 = require("./entities/pago.entity");
const liquidacion_entity_1 = require("../liquidaciones/entities/liquidacion.entity");
let PagosService = class PagosService {
    pagoRepository;
    liquidacionRepository;
    constructor(pagoRepository, liquidacionRepository) {
        this.pagoRepository = pagoRepository;
        this.liquidacionRepository = liquidacionRepository;
    }
    async create(dto) {
        const liquidacion = await this.liquidacionRepository.findOne({
            where: { id: dto.liquidacion_id },
            relations: ['pagos'],
        });
        if (!liquidacion)
            throw new common_1.NotFoundException('Liquidación no encontrada');
        if (liquidacion.estado === 'anulada') {
            throw new common_1.BadRequestException('No se puede registrar un pago sobre una liquidación anulada');
        }
        if (liquidacion.estado === 'pagada') {
            throw new common_1.BadRequestException('La liquidación ya está pagada');
        }
        const totalPagado = (liquidacion.pagos || []).reduce((sum, p) => sum + Number(p.monto), 0);
        const restante = Number((Number(liquidacion.total) - totalPagado).toFixed(2));
        if (Number(dto.monto) > restante) {
            throw new common_1.BadRequestException(`El monto excede el saldo pendiente de $${restante.toFixed(2)}`);
        }
        const pago = this.pagoRepository.create({
            liquidacion_id: dto.liquidacion_id,
            monto: Number(dto.monto),
            fecha_pago: dto.fecha_pago ? new Date(dto.fecha_pago) : new Date(),
            medio_pago: dto.medio_pago,
            observaciones: dto.observaciones,
        });
        const saved = await this.pagoRepository.save(pago);
        const nuevoTotalPagado = Number((totalPagado + Number(dto.monto)).toFixed(2));
        if (nuevoTotalPagado >= Number(liquidacion.total)) {
            liquidacion.estado = 'pagada';
            await this.liquidacionRepository.save(liquidacion);
        }
        return saved;
    }
    findAll() {
        return this.pagoRepository.find({
            relations: ['liquidacion', 'liquidacion.contribuyente'],
            order: { id: 'DESC' },
        });
    }
    async findOne(id) {
        const pago = await this.pagoRepository.findOne({
            where: { id },
            relations: ['liquidacion', 'liquidacion.contribuyente'],
        });
        if (!pago)
            throw new common_1.NotFoundException('Pago no encontrado');
        return pago;
    }
    async remove(id) {
        const pago = await this.findOne(id);
        const liquidacion = await this.liquidacionRepository.findOne({
            where: { id: pago.liquidacion_id },
        });
        await this.pagoRepository.remove(pago);
        if (liquidacion && liquidacion.estado === 'pagada') {
            liquidacion.estado = 'pendiente';
            await this.liquidacionRepository.save(liquidacion);
        }
        return { eliminado: true };
    }
};
exports.PagosService = PagosService;
exports.PagosService = PagosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pago_entity_1.Pago)),
    __param(1, (0, typeorm_1.InjectRepository)(liquidacion_entity_1.Liquidacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PagosService);
//# sourceMappingURL=pagos.service.js.map