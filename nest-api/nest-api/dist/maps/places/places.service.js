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
exports.PlacesService = void 0;
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PlacesService = class PlacesService {
    constructor(googleMapsClient, configService) {
        this.googleMapsClient = googleMapsClient;
        this.configService = configService;
    }
    async findPlaces(text) {
        const { data } = await this.googleMapsClient.findPlaceFromText({
            params: {
                input: text,
                inputtype: google_maps_services_js_1.PlaceInputType.textQuery,
                fields: ['formatted_address', 'geometry', 'name', 'place_id'],
                key: this.configService.get('GOOGLE_MAPS_API_KEY'),
            },
        });
        return data;
    }
};
exports.PlacesService = PlacesService;
exports.PlacesService = PlacesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [google_maps_services_js_1.Client,
        config_1.ConfigService])
], PlacesService);
//# sourceMappingURL=places.service.js.map