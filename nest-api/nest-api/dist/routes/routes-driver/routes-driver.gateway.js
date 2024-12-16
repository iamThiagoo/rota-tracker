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
exports.RoutesDriverGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const routes_service_1 = require("../routes.service");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let RoutesDriverGateway = class RoutesDriverGateway {
    constructor(routesService) {
        this.routesService = routesService;
    }
    async handleMessage(client, payload) {
        const { route_id } = payload;
        const route = await this.routesService.findOne(route_id);
        const { steps } = route.directions.routes[0].legs[0];
        for (const step of steps) {
            const { lat, lng } = step.start_location;
            client.emit(`server:points/${route_id}:list`, {
                route_id,
                lat,
                lng,
            });
            client.broadcast.emit('server:points:list', {
                route_id,
                lat,
                lng,
            });
            await sleep(2000);
            const { lat: lat2, lng: lng2 } = step.end_location;
            client.emit(`server:new-points/${route_id}:list`, {
                route_id,
                lat: lat2,
                lng: lng2,
            });
            client.broadcast.emit('server:points:list', {
                route_id,
                lat,
                lng,
            });
            await sleep(2000);
        }
    }
};
exports.RoutesDriverGateway = RoutesDriverGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('client:points'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RoutesDriverGateway.prototype, "handleMessage", null);
exports.RoutesDriverGateway = RoutesDriverGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [routes_service_1.RoutesService])
], RoutesDriverGateway);
//# sourceMappingURL=routes-driver.gateway.js.map