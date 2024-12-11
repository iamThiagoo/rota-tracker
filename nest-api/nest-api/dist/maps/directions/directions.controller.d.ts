import { DirectionsService } from './directions.service';
export declare class DirectionsController {
    private readonly directionsService;
    constructor(directionsService: DirectionsService);
    getDirections(originId: string, destinationId: string): Promise<{
        request: {
            origin: {
                place_id: import("@googlemaps/google-maps-services-js").LatLng;
                locations: {
                    lat: number;
                    lng: number;
                };
            };
            destination: {
                place_id: import("@googlemaps/google-maps-services-js").LatLng;
                locations: {
                    lat: number;
                    lng: number;
                };
                mode: import("@googlemaps/google-maps-services-js").TravelMode;
            };
        };
        geocoded_waypoints: import("@googlemaps/google-maps-services-js").GeocodedWaypoint[];
        routes: import("@googlemaps/google-maps-services-js").DirectionsRoute[];
        available_travel_modes: string[];
        status: import("@googlemaps/google-maps-services-js").Status;
        error_message: string;
        html_attributions?: string[];
        next_page_token?: string;
    }>;
}
