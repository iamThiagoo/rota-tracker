import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import WordRotate from "@/components/ui/word-rotate";
import { NewRouteForm } from "./NewRouteForm";
import { MapNewRoute } from "./MapNewRoute";

export async function searchDirections(source: string, destination: string) {
    const { placeSourceId, placeDestinationId } = await getPlacesIds(source, destination);
    const directionsResponse = await fetch(`http://localhost:3001/directions?originId=${placeSourceId}&destinationId=${placeDestinationId}`, {
        // cache: "force-cache",
        // next: {
        //     revalidate: 60 * 60 * 24
        // }
    });

    if (!directionsResponse.ok) throw new Error("Failed to fetch directions data");
    const directionData = await directionsResponse.json();
    return {
        directionData,
        placeSourceId,
        placeDestinationId,
    }
}

export async function getPlacesIds(source: string, destination: string) {
    const [sourceResponse, destinationResponse] = await Promise.all([
        fetch(`http://localhost:3001/places?text=${source}`, {
            // cache: "force-cache",
            // next: {
            //     revalidate: 60 * 60 * 24
            // }
        }),
        fetch(`http://localhost:3001/places?text=${destination}`, {
            // cache: "force-cache",
            // next: {
            //     revalidate: 60 * 60 * 24
            // }
        }),
    ])
    
    if (!sourceResponse.ok) throw new Error("Failed to fetch source data")
    if (!destinationResponse.ok) throw new Error("Failed to fetch destination data")
    const [sourceData, destinationData] = await Promise.all([
        sourceResponse.json(),
        destinationResponse.json()
    ])
    
    const placeSourceId = sourceData.candidates[0].place_id;
    const placeDestinationId = destinationData.candidates[0].place_id;
    return { placeSourceId, placeDestinationId };
}

export async function NewRoutePage({searchParams} : {searchParams: Promise<{source: string, destination: string}>}) {
    let directionsData : any = null;
    let placeSourceId : any = null;
    let placeDestinationId : any = null;

    const { source, destination } = await searchParams;
    const result = source && destination ? await searchDirections(source, destination) : null;

    if (result) {
        directionsData = result.directionData;
        placeSourceId = result.placeSourceId;
        placeDestinationId = result.placeDestinationId;
    }

    return (
        <main className="mt-20">
            <section className="flex gap-x-10 min-h-new-route-page">
                <div className="flex flex-col w-5/12">
                    <WordRotate
                        className="text-violet-500 text-4xl font-bold"
                        words={["Nova Rota"]}
                    />
                    <WordRotate
                        className="text-gray-200 text-lg"
                        words={["Cadastre uma nova rota para rastreio."]}
                    />
                    <form className="mt-3" method="get">
                        <div>
                            <Label htmlFor="text" className="text-base text-gray-300">Origem</Label>
                            <Input type="search" name="source" id="source" defaultValue={source} placeholder="Informe a origem da rota" className="py-5 mt-2 text-white border-2" />
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="text" className="text-base text-gray-300">Destino</Label>
                            <Input type="search" name="destination" id="destination" defaultValue={destination} placeholder="Informe o destino da rota" className="py-5 mt-2 text-white border-2" />
                        </div>

                        <div className="mt-8 w-full">
                            <button type="submit" className="w-full py-2.5 bg-[#7F56D9] rounded-lg border border-[#7F56D9] text-white select-none hover:duration-500 hover:bg-[#885de4] active:transition-all active:duration-300 active:scale-105">
                                Pesquisar
                            </button>
                        </div>
                    </form>

                    { directionsData && (
                        <div className="border border-white text-white mt-10 px-4 py-5 rounded-lg flex flex-col">
                            <h2 className="text-xl font-bold">Detalhes da Rota</h2>

                            <div className="my-4 flex flex-col gap-2">
                                <p>
                                    <strong>Origem: </strong> 
                                    <span className="text-gray-300">{ directionsData.routes[0].legs[0].start_address }</span>
                                </p>
                                <p>
                                    <strong>Destino: </strong> 
                                    <span className="text-gray-300">{ directionsData.routes[0].legs[0].end_address }</span>
                                </p>
                                <p>
                                    <strong>Distância: </strong> 
                                    <span className="text-gray-300">{ directionsData.routes[0].legs[0].distance.text }</span>
                                </p>
                                <p>
                                    <strong>Duração: </strong> 
                                    <span className="text-gray-300">{ directionsData.routes[0].legs[0].duration.text }</span>
                                </p>
                            </div>
                            
                            <NewRouteForm>
                                {placeSourceId && (
                                    <Input type="hidden" name="sourceId" defaultValue={placeSourceId} />
                                )}

                                {placeDestinationId && (
                                    <Input type="hidden" name="destinationId" defaultValue={placeDestinationId} />
                                )}

                                <button type="submit" className="w-full py-2.5 rounded-lg border-2 border-[#7F56D9] text-white select-none hover:duration-500 hover:bg-[#885de4] active:transition-all active:duration-300 active:scale-105">
                                    Adicionar Rota
                                </button>
                            </NewRouteForm>
                        </div>
                    )}
                </div>

                <MapNewRoute directionsData={directionsData} />
            </section>
        </main>
    );
}

export default NewRoutePage;