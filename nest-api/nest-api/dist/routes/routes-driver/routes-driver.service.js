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
exports.RoutesDriverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RoutesDriverService = class RoutesDriverService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    processRoute(dto) {
        return this.prismaService.routeDriver.upsert({
            include: {
                route: true,
            },
            where: { route_id: dto.route_id },
            create: {
                route_id: dto.route_id,
                points: {
                    set: {
                        location: {
                            lat: dto.lat,
                            lng: dto.lng,
                        },
                    },
                },
            },
            update: {
                points: {
                    push: {
                        location: {
                            lat: dto.lat,
                            lng: dto.lng,
                        },
                    },
                },
            },
        });
    }
};
exports.RoutesDriverService = RoutesDriverService;
exports.RoutesDriverService = RoutesDriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoutesDriverService);
//# sourceMappingURL=routes-driver.service.js.map