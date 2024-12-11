"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRouteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_route_dto_1 = require("./create-route.dto");
class UpdateRouteDto extends (0, mapped_types_1.PartialType)(create_route_dto_1.CreateRouteDto) {
}
exports.UpdateRouteDto = UpdateRouteDto;
//# sourceMappingURL=update-route.dto.js.map