"use client";

import WordRotate from "@/components/ui/word-rotate";
import { useMap } from "@/hooks/useMap";
import { socket } from "@/utils/socker-io";
import { useEffect, useRef } from "react";

export function AdminPage() {
  const mapContainerRef: any = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map) {
      return;
    }

    socket.connect();

    socket.on(
      `server:points:list`,
      async (data: { route_id: string; lat: number; lng: number }) => {
        console.log(data);
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
    };
  }, [map]);

  return (
    <main className="mt-20">
      <section className="flex gap-x-10 min-h-new-route-page">
        <div className="flex flex-col w-5/12">
          <WordRotate
            className="text-violet-500 text-4xl font-bold"
            words={["Área Admin"]}
          />
          <WordRotate
            className="text-gray-200 text-lg"
            words={["Acompanhe todas as suas rotas disponíveis."]}
          />
        </div>

        <div
          className="border border-gray-100 text-white rounded-xl w-9/12"
          ref={mapContainerRef}
        />
      </section>
    </main>
  );
}

export default AdminPage;
