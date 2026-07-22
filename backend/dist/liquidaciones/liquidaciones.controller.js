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
exports.LiquidacionesController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const liquidaciones_service_1 = require("./liquidaciones.service");
const pdf_service_1 = require("./pdf.service");
const create_liquidacion_dto_1 = require("./dto/create-liquidacion.dto");
const update_liquidacion_dto_1 = require("./dto/update-liquidacion.dto");
let LiquidacionesController = class LiquidacionesController {
    liquidacionesService;
    pdfService;
    constructor(liquidacionesService, pdfService) {
        this.liquidacionesService = liquidacionesService;
        this.pdfService = pdfService;
    }
    create(dto) {
        return this.liquidacionesService.create(dto);
    }
    findAll() {
        return this.liquidacionesService.findAll();
    }
    findOne(id) {
        return this.liquidacionesService.findOne(+id);
    }
    update(id, dto) {
        return this.liquidacionesService.update(+id, dto);
    }
    remove(id) {
        return this.liquidacionesService.remove(+id);
    }
    async pdf(id, res) {
        const liquidacion = await this.liquidacionesService.findOne(+id);
        const buffer = await this.pdfService.generar(liquidacion);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=liquidacion-${id}.pdf`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }
};
exports.LiquidacionesController = LiquidacionesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_liquidacion_dto_1.CreateLiquidacionDto]),
    __metadata("design:returntype", void 0)
], LiquidacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LiquidacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiquidacionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_liquidacion_dto_1.UpdateLiquidacionDto]),
    __metadata("design:returntype", void 0)
], LiquidacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LiquidacionesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/pdf'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LiquidacionesController.prototype, "pdf", null);
exports.LiquidacionesController = LiquidacionesController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('liquidaciones'),
    __metadata("design:paramtypes", [liquidaciones_service_1.LiquidacionesService,
        pdf_service_1.PdfService])
], LiquidacionesController);
//# sourceMappingURL=liquidaciones.controller.js.map