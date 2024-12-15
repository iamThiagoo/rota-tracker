'use server';

import { error } from "console";

export async function createRouteAction(state: any, formData: FormData) {
    const { sourceId, destinationId } = Object.fromEntries(formData);
    const directionsResponse = await fetch(`http://localhost:3001/directions?originId=${sourceId}&destinationId=${destinationId}`, {
        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24
        }
    });

    if (!directionsResponse.ok) { error: "Failed to fetch directions data" };
    const directionData = await directionsResponse.json();
    const startAddress = directionData.routes[0].legs[0].start_address;
    const endAddress = directionData.routes[0].legs[0].end_address;
    const response = await fetch('http://localhost:3001/routes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: `${startAddress} - ${endAddress}`,
            source_id: directionData.request.origin.place_id.replace("place_id:", ""),
            destination_id: directionData.request.destination.place_id.replace("place_id:", ""),
        })
    })

    if (!response.ok) {
        console.error(await response.text());
        return { error: "Failed to create route" };
    }

    return { success: true };
}