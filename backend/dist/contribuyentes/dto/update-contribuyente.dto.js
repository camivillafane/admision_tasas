"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContribuyenteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_contribuyente_dto_1 = require("./create-contribuyente.dto");
class UpdateContribuyenteDto extends (0, mapped_types_1.PartialType)(create_contribuyente_dto_1.CreateContribuyenteDto) {
}
exports.UpdateContribuyenteDto = UpdateContribuyenteDto;
//# sourceMappingURL=update-contribuyente.dto.js.map