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
    dataSource;
    constructor(liquidacionRepository, detalleRepository, conceptoRepository, dataSource) {
        this.liquidacionRepository = liquidacionRepository;
        this.detalleRepository = detalleRepository;
        this.conceptoRepository = conceptoRepository;
        this.dataSource = dataSource;
    }
    async generarNumero() {
        const result = await this.liquidacionRepository.query("SELECT ISNULL(MAX(CAST(SUBSTRING(numero, 5, 8) AS INT)), 0) + 1 AS siguiente FROM liquidaciones WHERE numero LIKE 'LIQ-%'");
        const siguiente = result[0]?.siguiente ?? 1;
        return `LIQ-${String(siguiente).padStart(8, '0')}`;
    }
    async calcularDetalles(detallesInput) {
        if (!detallesInput || detallesInput.length === 0) {
            throw new common_1.BadRequestException('La liquidación debe tener al menos un detalle');
        }
        return Promise.all(detallesInput.map(async (d) => {
            const concepto = await this.conceptoRepository.findOne({ where: { id: d.concepto_id } });
            if (!concepto)
                throw new common_1.NotFoundException(`Concepto ${d.concepto_id} no encontrado`);
            if (!concepto.activo)
                throw new common_1.BadRequestException(`Concepto ${concepto.codigo} está inactivo`);
            let monto;
            let base = null;
            if (d.monto !== undefined && d.monto !== null) {
                monto = Number(d.monto);
            }
            else if (concepto.es_porcentaje) {
                if (d.base_imponible === undefined || d.base_imponible === null) {
                    throw new common_1.BadRequestException(`El concepto ${concepto.codigo} requiere una base imponible porque es porcentaje`);
                }
                base = Number(d.base_imponible);
                const valor = Number(concepto.valor);
                monto = base * (valor / 100);
                if (concepto.tipo === 'exencion')
                    monto = monto * -1;
            }
            else {
                monto = Number(concepto.valor) * Number(d.cantidad);
                if (concepto.tipo === 'exencion')
                    monto = monto * -1;
            }
            return {
                concepto_id: d.concepto_id,
                cantidad: Number(d.cantidad),
                base_imponible: base,
                monto: Number(monto.toFixed(2)),
            };
        }));
    }
    async create(dto) {
        const detalles = await this.calcularDetalles(dto.detalles);
        const total = Number(detalles.reduce((sum, d) => sum + d.monto, 0).toFixed(2));
        if (total < 0) {
            throw new common_1.BadRequestException('El total de la liquidación no puede ser negativo');
        }
        const numero = await this.generarNumero();
        const liquidacion = this.liquidacionRepository.create({
            numero,
            contribuyente_id: dto.contribuyente_id,
            tipo_evento: dto.tipo_evento,
            fecha_evento: new Date(dto.fecha_evento),
            fecha_vencimiento: new Date(dto.fecha_vencimiento),
            total,
            detalles: detalles,
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
            relations: ['contribuyente', 'detalles', 'detalles.concepto', 'pagos'],
        });
        if (!liquidacion)
            throw new common_1.NotFoundException('Liquidación no encontrada');
        return liquidacion;
    }
    async update(id, dto) {
        const liquidacion = await this.findOne(id);
        if (liquidacion.estado === 'pagada' || liquidacion.estado === 'anulada') {
            throw new common_1.BadRequestException('No se puede modificar una liquidación pagada o anulada');
        }
        if (dto.estado) {
            const transicionesValidas = {
                pendiente: ['pagada', 'vencida', 'anulada'],
                vencida: ['pagada', 'anulada'],
                pagada: [],
                anulada: [],
            };
            if (!transicionesValidas[liquidacion.estado].includes(dto.estado)) {
                throw new common_1.BadRequestException(`No se puede cambiar el estado de '${liquidacion.estado}' a '${dto.estado}'`);
            }
            liquidacion.estado = dto.estado;
        }
        if (dto.tipo_evento)
            liquidacion.tipo_evento = dto.tipo_evento;
        if (dto.fecha_evento)
            liquidacion.fecha_evento = new Date(dto.fecha_evento);
        if (dto.fecha_vencimiento)
            liquidacion.fecha_vencimiento = new Date(dto.fecha_vencimiento);
        if (dto.detalles && dto.detalles.length > 0) {
            const nuevosDetalles = await this.calcularDetalles(dto.detalles);
            const total = Number(nuevosDetalles.reduce((sum, d) => sum + d.monto, 0).toFixed(2));
            if (total < 0) {
                throw new common_1.BadRequestException('El total de la liquidación no puede ser negativo');
            }
            await this.dataSource.transaction(async (manager) => {
                await manager.delete(liquidacion_detalle_entity_1.LiquidacionDetalle, { liquidacion_id: id });
                const detallesEntities = nuevosDetalles.map((d) => manager.create(liquidacion_detalle_entity_1.LiquidacionDetalle, { ...d, liquidacion_id: id }));
                await manager.save(detallesEntities);
            });
            liquidacion.total = total;
        }
        return this.liquidacionRepository.save(liquidacion);
    }
    async remove(id) {
        const liquidacion = await this.findOne(id);
        if (liquidacion.estado === 'pagada') {
            throw new common_1.BadRequestException('No se puede eliminar una liquidación pagada');
        }
        return this.liquidacionRepository.remove(liquidacion);
    }
    async marcarVencidas() {
        const hoy = new Date().toISOString().split('T')[0];
        const result = await this.liquidacionRepository
            .createQueryBuilder()
            .update(liquidacion_entity_1.Liquidacion)
            .set({ estado: 'vencida' })
            .where("estado = 'pendiente'")
            .andWhere("fecha_vencimiento < :hoy", { hoy })
            .execute();
        return { afectadas: result.affected || 0 };
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
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LiquidacionesService);
//# sourceMappingURL=liquidaciones.service.js.map