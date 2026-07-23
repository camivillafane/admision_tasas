"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidacionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const liquidaciones_service_1 = require("./liquidaciones.service");
const liquidaciones_controller_1 = require("./liquidaciones.controller");
const pdf_service_1 = require("./pdf.service");
const liquidacion_entity_1 = require("./entities/liquidacion.entity");
const liquidacion_detalle_entity_1 = require("./entities/liquidacion-detalle.entity");
const concepto_entity_1 = require("../conceptos/entities/concepto.entity");
let LiquidacionesModule = class LiquidacionesModule {
};
exports.LiquidacionesModule = LiquidacionesModule;
exports.LiquidacionesModule = LiquidacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([liquidacion_entity_1.Liquidacion, liquidacion_detalle_entity_1.LiquidacionDetalle, concepto_entity_1.Concepto])],
        controllers: [liquidaciones_controller_1.LiquidacionesController],
        providers: [liquidaciones_service_1.LiquidacionesService, pdf_service_1.PdfService],
    })
], LiquidacionesModule);
//# sourceMappingURL=liquidaciones.module.js.map