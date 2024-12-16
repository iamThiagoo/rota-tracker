"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "@/utils/socker-io";
import { start } from "repl";

export type MapDriverProps = {
  route_id: string | null;
  start_location: {
    lat: number;
    lng: number;
  } | null,
  end_location: {
    lat: number;
    lng: number;
  } | null
};

export function MapDriver(props: MapDriverProps) {
  const mapContainerRef : any = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !props.route_id || !props.start_location || !props.end_location) return;

    // @ts-ignore
    socket.disconnect ? socket.connect() :socket.offAny();

    socket.on("connect", () => {
      console.log("connect");
      socket.emit(`client:points`, { route_id: props.route_id });
    })
    
    socket.on(
      `server:points/${props.route_id}:list`,
      async (data: { route_id: string; lat: number; lng: number }) => {
        if (!map.hasRoute(data.route_id)) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_NEST_API_URL}/routes/${data.route_id}`
          );
          const route = await response.json();
          map.addRouteWithIcons({
            routeId: data.route_id,
            startMarkerOptions: {
              position: route.directions.routes[0].legs[0].start_location,
            },
            endMarkerOptions: {
              position: route.directions.routes[0].legs[0].end_location,
            },
            carMarkerOptions: {
              position: route.directions.routes[0].legs[0].start_location,
            },
          });
        }
        map.moveCar(data.route_id, { lat: data.lat, lng: data.lng });
      }
    );

    return () => {
      socket.disconnect();
    }
  }, [props.route_id, props.start_location, props.end_location, map])

  return <div className="border border-gray-100 text-white rounded-xl w-9/12" ref={mapContainerRef} />;
}