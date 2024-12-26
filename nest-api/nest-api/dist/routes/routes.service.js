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
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const directions_service_1 = require("../maps/directions/directions.service");
const kafkaLib = require("@confluentinc/kafka-javascript");
let RoutesService = class RoutesService {
    constructor(prismaService, directionsService, kafkaProducer) {
        this.prismaService = prismaService;
        this.directionsService = directionsService;
        this.kafkaProducer = kafkaProducer;
    }
    async create(createRouteDto) {
        const { available_travel_modes, geocoded_waypoints, routes, request } = await this.directionsService.getDirections(createRouteDto.source_id, createRouteDto.destination_id);
        const legs = routes[0].legs[0];
        const route = await this.prismaService.route.create({
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
        await this.kafkaProducer.send({
            topic: 'route',
            messages: [
                {
                    value: JSON.stringify({
                        event: 'RouteCreated',
                        id: route.id,
                        distance: legs.distance.value,
                        directions: legs.steps.reduce((acc, step) => {
                            acc.push({
                                lat: step.start_location.lat,
                                lng: step.start_location.lng,
                            });
                            acc.push({
                                lat: step.end_location.lat,
                                lng: step.end_location.lng,
                            });
                            return acc;
                        }, []),
                    }),
                },
            ],
        });
        return route;
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
    __param(2, (0, common_1.Inject)('KAFKA_PRODUCER')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        directions_service_1.DirectionsService, Object])
], RoutesService);
//# sourceMappingURL=routes.service.js.map