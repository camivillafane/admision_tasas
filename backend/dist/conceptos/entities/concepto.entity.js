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
exports.Concepto = void 0;
const typeorm_1 = require("typeorm");
const liquidacion_detalle_entity_1 = require("../../liquidaciones/entities/liquidacion-detalle.entity");
let Concepto = class Concepto {
    id;
    codigo;
    descripcion;
    tipo;
    es_porcentaje;
    valor;
    activo;
    detalles;
};
exports.Concepto = Concepto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Concepto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 20 }),
    __metadata("design:type", String)
], Concepto.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Concepto.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Concepto.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Concepto.prototype, "es_porcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 4 }),
    __metadata("design:type", Number)
], Concepto.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Concepto.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => liquidacion_detalle_entity_1.LiquidacionDetalle, (detalle) => detalle.concepto),
    __metadata("design:type", Array)
], Concepto.prototype, "detalles", void 0);
exports.Concepto = Concepto = __decorate([
    (0, typeorm_1.Entity)('conceptos')
], Concepto);
//# sourceMappingURL=concepto.entity.js.map