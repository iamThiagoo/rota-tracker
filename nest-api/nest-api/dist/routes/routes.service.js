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
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const directions_service_1 = require("../maps/directions/directions.service");
let RoutesService = class RoutesService {
    constructor(prismaService, directionsService) {
        this.prismaService = prismaService;
        this.directionsService = directionsService;
    }
    async create(createRouteDto) {
        const { available_travel_modes, geocoded_waypoints, routes, request } = await this.directionsService.getDirections(createRouteDto.source_id, createRouteDto.destination_id);
        const legs = routes[0].legs[0];
        return this.prismaService.route.create({
            data: {
                name: createRouteDto.name,
                source: {
                    name: legs.start_address,
                    location: {
                        lat: legs.start_location.lat,
                        lng: legs.start_location.lng,
                    },
                },
                destination: {
                    name: legs.end_address,
                    location: {
                        lat: legs.end_location.lat,
                        lng: legs.end_location.lng,
                    },
                },
                duration: legs.duration.value,
                distance: legs.distance.value,
                directions: JSON.parse(JSON.stringify({
                    available_travel_modes,
                    geocoded_waypoints,
                    routes,
                    request,
                })),
            },
        });
    }
    findAll() {
        return this.prismaService.route.findMany();
    }
    findOne(id) {
        return this.prismaService.route.findUniqueOrThrow({
            where: { id },
        });
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        directions_service_1.DirectionsService])
], RoutesService);
//# sourceMappingURL=routes.service.js.map