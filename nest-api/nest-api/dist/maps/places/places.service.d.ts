import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
export declare class PlacesService {
    private googleMapsClient;
    private configService;
    constructor(googleMapsClient: GoogleMapsClient, configService: ConfigService);
    findPlaces(text: string): Promise<import("@googlemaps/google-maps-services-js").FindPlaceFromTextResponseData>;
}
