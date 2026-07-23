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
exports.Liquidacion = void 0;
const typeorm_1 = require("typeorm");
const contribuyente_entity_1 = require("../../contribuyentes/entities/contribuyente.entity");
const liquidacion_detalle_entity_1 = require("./liquidacion-detalle.entity");
let Liquidacion = class Liquidacion {
    id;
    contribuyente_id;
    contribuyente;
    tipo_evento;
    fecha_evento;
    fecha_emision;
    fecha_vencimiento;
    total;
    estado;
    detalles;
};
exports.Liquidacion = Liquidacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Liquidacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Liquidacion.prototype, "contribuyente_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contribuyente_entity_1.Contribuyente, (contribuyente) => contribuyente.liquidaciones),
    (0, typeorm_1.JoinColumn)({ name: 'contribuyente_id' }),
    __metadata("design:type", contribuyente_entity_1.Contribuyente)
], Liquidacion.prototype, "contribuyente", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Liquidacion.prototype, "tipo_evento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Liquidacion.prototype, "fecha_evento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CAST(GETDATE() AS DATE)' }),
    __metadata("design:type", Date)
], Liquidacion.prototype, "fecha_emision", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Liquidacion.prototype, "fecha_vencimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Liquidacion.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'pendiente' }),
    __metadata("design:type", String)
], Liquidacion.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => liquidacion_detalle_entity_1.LiquidacionDetalle, (detalle) => detalle.liquidacion, { cascade: true }),
    __metadata("design:type", Array)
], Liquidacion.prototype, "detalles", void 0);
exports.Liquidacion = Liquidacion = __decorate([
    (0, typeorm_1.Entity)('liquidaciones')
], Liquidacion);
//# sourceMappingURL=liquidacion.entity.js.map