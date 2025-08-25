interface MapData {
  type: string;
  features: Array<{
    type: string;
    properties: {
      name: string;
      country: string;
    };
    geometry: {
      type: string;
      coordinates: [number, number];
    };
  }>;
}

export async function getLocationCoordinates(location: string): Promise<{ lat: number; lng: number }> {
  const apiKey = process.env.MAPTILER_API_KEY;
  if (!apiKey) {
    throw new Error("Maptiler API key not configured");
  }

  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Maptiler API error: ${response.statusText}`);
  }

  const data: MapData = await response.json();
  
  if (data.features.length === 0) {
    throw new Error(`Location not found: ${location}`);
  }

  const coordinates = data.features[0].geometry.coordinates;
  return { lat: coordinates[1], lng: coordinates[0] };
}

export function generateMapUrl(lat: number, lng: number, zoom: number = 12): string {
  const apiKey = process.env.MAPTILER_API_KEY;
  return `https://api.maptiler.com/maps/basic-v2/static/${lng},${lat},${zoom}/400x300.png?key=${apiKey}`;
}
