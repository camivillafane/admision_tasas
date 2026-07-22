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
exports.CreateLiquidacionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DetalleLiquidacionDto {
    concepto_id;
    cantidad;
    monto;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], DetalleLiquidacionDto.prototype, "concepto_id", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], DetalleLiquidacionDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DetalleLiquidacionDto.prototype, "monto", void 0);
class CreateLiquidacionDto {
    contribuyente_id;
    tipo_evento;
    fecha_evento;
    fecha_vencimiento;
    detalles;
}
exports.CreateLiquidacionDto = CreateLiquidacionDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateLiquidacionDto.prototype, "contribuyente_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLiquidacionDto.prototype, "tipo_evento", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLiquidacionDto.prototype, "fecha_evento", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLiquidacionDto.prototype, "fecha_vencimiento", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DetalleLiquidacionDto),
    __metadata("design:type", Array)
], CreateLiquidacionDto.prototype, "detalles", void 0);
//# sourceMappingURL=create-liquidacion.dto.js.map