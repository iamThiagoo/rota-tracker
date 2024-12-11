import { PlacesService } from './places.service';
export declare class PlacesController {
    private readonly placesService;
    constructor(placesService: PlacesService);
    findPlaces(text: string): Promise<import("@googlemaps/google-maps-services-js").FindPlaceFromTextResponseData>;
}
