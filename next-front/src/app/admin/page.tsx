"use client";

import WordRotate from "@/components/ui/word-rotate";
import { useMap } from "@/hooks/useMap";
import { useEffect, useRef } from "react";

export function AdminPage() {
  const mapContainerRef: any = useRef<HTMLDivElement>(null);
  useMap(mapContainerRef);

  return <main className="mt-20">
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

      <div className="border border-gray-100 text-white rounded-xl w-9/12" ref={mapContainerRef} />
    </section>
  </main>;
}

export default AdminPage;
