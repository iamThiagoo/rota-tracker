"use client";

import { useRef } from "react";
import { useMap } from "../../hooks/useMap";

export function MapDriver() {
  const mapContainerRef : any = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  return <div className="border border-gray-100 text-white rounded-xl w-9/12" ref={mapContainerRef} />;
}