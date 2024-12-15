import { sample, shuffle } from "lodash";
import type { DirectionsResponseData } from "@googlemaps/google-maps-services-js";

export class Map {
  public map: google.maps.Map;
  private routes: { [routeId: string]: MapRoute } = {};

  constructor(element: HTMLElement, options: google.maps.MapOptions) {
    this.map = new google.maps.Map(element, {
      ...options,
      /*styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],*/
    });
  }

  async addRoute(routeOptions: {
    routeId: string;
    startMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions;
    endMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions;
    carMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    directionsResponseData?: DirectionsResponseData & { request: any };
  }) {
    if (routeOptions.routeId in this.routes) {
      throw new MapRouteExistsError();
    }

    const { startMarkerOptions, endMarkerOptions, carMarkerOptions } =
      routeOptions;

    const route = new MapRoute({
      startMarkerOptions: { ...startMarkerOptions, map: this.map },
      endMarkerOptions: { ...endMarkerOptions, map: this.map },
      carMarkerOptions: { ...carMarkerOptions, map: this.map },
    });
    this.routes[routeOptions.routeId] = route;

    await route.calculateRoute(routeOptions.directionsResponseData);

    this.fitBounds();
  }

  async addRouteWithIcons(routeOptions: {
    routeId: string;
    startMarkerOptions: Omit<
      google.maps.marker.AdvancedMarkerElementOptions,
      "icon"
    >;
    endMarkerOptions: Omit<
      google.maps.marker.AdvancedMarkerElementOptions,
      "icon"
    >;
    carMarkerOptions: Omit<
      google.maps.marker.AdvancedMarkerElementOptions,
      "icon"
    >;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    directionsResponseData?: DirectionsResponseData & { request: any };
  }) {
    const color = sample(shuffle(colors)) as string;
    return this.addRoute({
      ...routeOptions,
      startMarkerOptions: {
        ...routeOptions.startMarkerOptions,
        content: makeMarkerIcon(color),
      },
      endMarkerOptions: {
        ...routeOptions.endMarkerOptions,
        content: makeMarkerIcon(color),
      },
      carMarkerOptions: {
        ...routeOptions.carMarkerOptions,
        content: makeCarIcon(color),
      },
      directionsResponseData: routeOptions.directionsResponseData,
    });
  }

  private fitBounds() {
    const bounds = new google.maps.LatLngBounds();

    Object.keys(this.routes).forEach((id: string) => {
      const route = this.routes[id];
      bounds.extend(route.startMarker.position!);
      bounds.extend(route.endMarker.position!);
    });

    this.map.fitBounds(bounds);
  }

  moveCar(routeId: string, position: google.maps.LatLngLiteral) {
    this.routes[routeId].carMarker.position = {
      lat: position.lat,
      lng: position.lng,
    };
  }

  removeRoute(id: string) {
    if (!this.hasRoute(id)) {
      return;
    }
    const route = this.routes[id];
    route.delete();
    delete this.routes[id];
  }

  removeAllRoutes() {
    Object.keys(this.routes).forEach((id) => this.removeRoute(id));
  }

  hasRoute(id: string) {
    return id in this.routes;
  }

  getRoute(id: string) {
    return this.routes[id];
  }
}

export class MapRouteExistsError extends Error {}

export class MapRoute {
  public startMarker: google.maps.marker.AdvancedMarkerElement;
  public endMarker: google.maps.marker.AdvancedMarkerElement;
  public carMarker: google.maps.marker.AdvancedMarkerElement;

  public directionsRenderer: google.maps.DirectionsRenderer;

  constructor(options: {
    startMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions;
    endMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions;
    carMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions;
  }) {
    const { startMarkerOptions, endMarkerOptions, carMarkerOptions } = options;
    this.startMarker = new google.maps.marker.AdvancedMarkerElement(
      startMarkerOptions
    );
    this.endMarker = new google.maps.marker.AdvancedMarkerElement(
      endMarkerOptions
    );
    this.carMarker = new google.maps.marker.AdvancedMarkerElement(
      carMarkerOptions
    );

    const svg = this.startMarker.content as SVGAElement;
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: svg.getAttribute("fill"),
        strokeOpacity: 0.5,
        strokeWeight: 5,
      },
    });
    this.directionsRenderer.setMap(this.startMarker.map as google.maps.Map);
  }

  async calculateRoute(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    directionsResponseData?: DirectionsResponseData & { request: any }
  ) {
    if (directionsResponseData) {
      const directionsResult = convertDirectionsResponseToDirectionsResult(
        directionsResponseData
      );
      this.directionsRenderer.setDirections(directionsResult);
      return;
    }

    const startPosition = this.startMarker.position as google.maps.LatLng;
    const endPosition = this.endMarker.position as google.maps.LatLng;

    const result = await new google.maps.DirectionsService().route({
      origin: startPosition,
      destination: endPosition,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    this.directionsRenderer.setDirections(result);
  }

  delete() {
    this.startMarker.map = null;
    this.endMarker.map = null;
    this.carMarker.map = null;
    this.directionsRenderer.setMap(null);
  }
}

export const makeCarIcon = (color: string) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("style", "margin-top: 1px");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", color);

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute(
    "d",
    "M23.5 7c.276 0 .5.224.5.5v.511c0 .793-.926.989-1.616.989l-1.086-2h2.202zm-1.441 3.506c.639 1.186.946 2.252.946 3.666 0 1.37-.397 2.533-1.005 3.981v1.847c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1h-13v1c0 .552-.448 1-1 1h-1.5c-.552 0-1-.448-1-1v-1.847c-.608-1.448-1.005-2.611-1.005-3.981 0-1.414.307-2.48.946-3.666.829-1.537 1.851-3.453 2.93-5.252.828-1.382 1.262-1.707 2.278-1.889 1.532-.275 2.918-.365 4.851-.365s3.319.09 4.851.365c1.016.182 1.45.507 2.278 1.889 1.079 1.799 2.101 3.715 2.93 5.252zm-16.059 2.994c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm10 1c0-.276-.224-.5-.5-.5h-7c-.276 0-.5.224-.5.5s.224.5.5.5h7c.276 0 .5-.224.5-.5zm2.941-5.527s-.74-1.826-1.631-3.142c-.202-.298-.515-.502-.869-.566-1.511-.272-2.835-.359-4.441-.359s-2.93.087-4.441.359c-.354.063-.667.267-.869.566-.891 1.315-1.631 3.142-1.631 3.142 1.64.313 4.309.497 6.941.497s5.301-.184 6.941-.497zm2.059 4.527c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-18.298-6.5h-2.202c-.276 0-.5.224-.5.5v.511c0 .793.926.989 1.616.989l1.086-2z"
  );
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-opacity", "1");
  path.setAttribute("stroke-width", "1");
  path.setAttribute("fill-opacity", "1");

  svg.appendChild(path);

  const div = document.createElement("div");
  //relative
  div.style.position = "absolute";
  // div.style.width = "32px";
  // div.style.height = "32px";

  div.appendChild(svg);

  return div;
};

export const makeMarkerIcon = (color: string) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "62");
  svg.setAttribute("height", "62");
  svg.setAttribute("viewBox", "0 0 92 92");
  svg.setAttribute("fill", color);

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute(
    "d",
    "M66.9,41.8c0-11.3-9.1-20.4-20.4-20.4c-11.3,0-20.4,9.1-20.4,20.4c0,11.3,20.4,32.4,20.4,32.4S66.9,53.1,66.9,41.8z M37,41.4c0-5.2,4.3-9.5,9.5-9.5c5.2,0,9.5,4.2,9.5,9.5c0,5.2-4.2,9.5-9.5,9.5C41.3,50.9,37,46.6,37,41.4z"
  );
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-opacity", "1");
  path.setAttribute("stroke-width", "1");
  path.setAttribute("fill-opacity", "1");

  svg.appendChild(path);

  return svg;
};

const colors = [
  "#7f56d9",
];

function convertDirectionsResponseToDirectionsResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directionsResponse: DirectionsResponseData & { request: any }
): google.maps.DirectionsResult {
  const copy = { ...directionsResponse };

  return {
    available_travel_modes:
      copy.available_travel_modes as google.maps.TravelMode[],
    geocoded_waypoints: copy.geocoded_waypoints,
    status: copy.status,
    request: copy.request,
    //@ts-expect-error - types are incorrect
    routes: copy.routes.map((route) => {
      const bounds = new google.maps.LatLngBounds(
        route.bounds.southwest,
        route.bounds.northeast
      );
      return {
        bounds,
        overview_path: google.maps.geometry.encoding.decodePath(
          route.overview_polyline.points
        ),
        overview_polyline: route.overview_polyline,
        warnings: route.warnings,
        copyrights: route.copyrights,
        summary: route.summary,
        waypoint_order: route.waypoint_order,
        fare: route.fare,
        legs: route.legs.map((leg) => ({
          ...leg,
          start_location: new google.maps.LatLng(
            leg.start_location.lat,
            leg.start_location.lng
          ),
          end_location: new google.maps.LatLng(
            leg.end_location.lat,
            leg.end_location.lng
          ),
          steps: leg.steps.map((step) => ({
            path: google.maps.geometry.encoding.decodePath(
              step.polyline.points
            ),
            start_location: new google.maps.LatLng(
              step.start_location.lat,
              step.start_location.lng
            ),
          })),
        })),
      };
    }),
  };
}