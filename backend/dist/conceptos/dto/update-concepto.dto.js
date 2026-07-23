"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConceptoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_concepto_dto_1 = require("./create-concepto.dto");
class UpdateConceptoDto extends (0, mapped_types_1.PartialType)(create_concepto_dto_1.CreateConceptoDto) {
}
exports.UpdateConceptoDto = UpdateConceptoDto;
//# sourceMappingURL=update-concepto.dto.js.map