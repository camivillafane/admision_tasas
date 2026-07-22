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
exports.Pago = void 0;
const typeorm_1 = require("typeorm");
const liquidacion_entity_1 = require("../../liquidaciones/entities/liquidacion.entity");
let Pago = class Pago {
    id;
    liquidacion_id;
    liquidacion;
    fecha_pago;
    monto;
    medio_pago;
    observaciones;
};
exports.Pago = Pago;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pago.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pago.prototype, "liquidacion_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => liquidacion_entity_1.Liquidacion, (liquidacion) => liquidacion.pagos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'liquidacion_id' }),
    __metadata("design:type", liquidacion_entity_1.Liquidacion)
], Pago.prototype, "liquidacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Pago.prototype, "fecha_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], Pago.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "medio_pago", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Pago.prototype, "observaciones", void 0);
exports.Pago = Pago = __decorate([
    (0, typeorm_1.Entity)('pagos')
], Pago);
//# sourceMappingURL=pago.entity.js.map