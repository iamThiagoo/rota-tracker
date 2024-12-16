import WordRotate from "@/components/ui/word-rotate";
import { RouteModel } from "../../utils/models";
import { MapDriver } from "./MapDriver";
import { Label } from "@/components/ui/label";

export async function getRoutes() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/routes`, {
    cache: "force-cache",
    next: {
      tags: ["routes"],
    },
  });

  return response.json();
}

export async function getRoute(routeId : string) : Promise<RouteModel> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/routes/${routeId}`, {
    cache: "force-cache",
    next: {
      tags: [`routes-${routeId}`, 'routes'],
    },
  });

  return response.json();
}

export async function DriverPage({searchParams} : {searchParams : Promise<{route_id : string}>}) {
  const routes = await getRoutes();
  const {route_id} = await searchParams
  let start_location = {lat: 0, lng: 0};
  let end_location = {lat: 0, lng: 0};

  if (route_id) {
    const route = await getRoute(route_id);
    const leg = route.directions.routes[0].legs[0];

    start_location = {
      lat: leg.start_location.lat,
      lng: leg.start_location.lng,
    }

    end_location = {
      lat: leg.end_location.lat,
      lng: leg.end_location.lng,
    }
  }

  return (
    <main className="mt-20">
      <section className="flex gap-x-10 min-h-new-route-page">
        <div className="flex flex-col w-5/12">
          <WordRotate
            className="text-violet-500 text-4xl font-bold"
            words={["Iniciar Viagem"]}
          />
          <WordRotate
            className="text-gray-200 text-lg"
            words={[
              "O motorista seleciona uma rota e, em seguida, pode iniciar sua viagem.",
            ]}
          />
          <form className="mt-3" method="get">
            <Label className="text-base text-gray-300">Rotas Disponíveis</Label>
            <select
              id="route_id"
              name="route_id"
              defaultValue={route_id}
              className="mb-2 p-2 mt-2 w-full border rounded bg-default text-contrast bg-zinc-900 text-white"
            >
              <option key="0" value="">
                Selecione uma rota
              </option>
              {routes.map((route: RouteModel) => (
                <option key={route.id} value={route.id}>
                  {route.name}
                </option>
              ))}
            </select>

            <div className="mt-8 w-full">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#7F56D9] rounded-lg border border-[#7F56D9] text-white select-none hover:duration-500 hover:bg-[#885de4] active:transition-all active:duration-300 active:scale-105"
              >
                Iniciar
              </button>
            </div>
          </form>
        </div>

        <MapDriver route_id={route_id} start_location={start_location} end_location={end_location} />
      </section>
    </main>
  );
}

export default DriverPage;
