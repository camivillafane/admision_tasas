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
exports.ConceptosController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const conceptos_service_1 = require("./conceptos.service");
const create_concepto_dto_1 = require("./dto/create-concepto.dto");
const update_concepto_dto_1 = require("./dto/update-concepto.dto");
let ConceptosController = class ConceptosController {
    conceptosService;
    constructor(conceptosService) {
        this.conceptosService = conceptosService;
    }
    create(dto) {
        return this.conceptosService.create(dto);
    }
    findAll() {
        return this.conceptosService.findAll();
    }
    findOne(id) {
        return this.conceptosService.findOne(+id);
    }
    update(id, dto) {
        return this.conceptosService.update(+id, dto);
    }
    remove(id) {
        return this.conceptosService.remove(+id);
    }
};
exports.ConceptosController = ConceptosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_concepto_dto_1.CreateConceptoDto]),
    __metadata("design:returntype", void 0)
], ConceptosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConceptosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConceptosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_concepto_dto_1.UpdateConceptoDto]),
    __metadata("design:returntype", void 0)
], ConceptosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConceptosController.prototype, "remove", null);
exports.ConceptosController = ConceptosController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('conceptos'),
    __metadata("design:paramtypes", [conceptos_service_1.ConceptosService])
], ConceptosController);
//# sourceMappingURL=conceptos.controller.js.map