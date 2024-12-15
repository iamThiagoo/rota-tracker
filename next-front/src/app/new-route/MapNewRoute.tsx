"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { DirectionsData } from "../../utils/models";

export type MapNewRouteProps = {
  directionsData: DirectionsData;
};

export function MapNewRoute(props: MapNewRouteProps) {
  const { directionsData } = props;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !directionsData) {
      return;
    }

    map.removeAllRoutes();
    map.addRouteWithIcons({
      routeId: "1",
      startMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionsData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
    });
  }, [map, directionsData]);

  return <div className="border border-gray-100 text-white rounded-xl w-9/12" ref={mapContainerRef} />;
}