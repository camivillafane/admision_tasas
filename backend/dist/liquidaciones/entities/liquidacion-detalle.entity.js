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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidacionDetalle = void 0;
const typeorm_1 = require("typeorm");
const liquidacion_entity_1 = require("./liquidacion.entity");
const concepto_entity_1 = require("../../conceptos/entities/concepto.entity");
let LiquidacionDetalle = class LiquidacionDetalle {
    id;
    liquidacion_id;
    liquidacion;
    concepto_id;
    concepto;
    cantidad;
    base_imponible;
    monto;
};
exports.LiquidacionDetalle = LiquidacionDetalle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LiquidacionDetalle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LiquidacionDetalle.prototype, "liquidacion_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => liquidacion_entity_1.Liquidacion, (liquidacion) => liquidacion.detalles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'liquidacion_id' }),
    __metadata("design:type", liquidacion_entity_1.Liquidacion)
], LiquidacionDetalle.prototype, "liquidacion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LiquidacionDetalle.prototype, "concepto_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => concepto_entity_1.Concepto, (concepto) => concepto.detalles),
    (0, typeorm_1.JoinColumn)({ name: 'concepto_id' }),
    __metadata("design:type", concepto_entity_1.Concepto)
], LiquidacionDetalle.prototype, "concepto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], LiquidacionDetalle.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], LiquidacionDetalle.prototype, "base_imponible", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], LiquidacionDetalle.prototype, "monto", void 0);
exports.LiquidacionDetalle = LiquidacionDetalle = __decorate([
    (0, typeorm_1.Entity)('liquidaciones_detalles')
], LiquidacionDetalle);
//# sourceMappingURL=liquidacion-detalle.entity.js.map