interface RouteData {
  routes: Array<{
    legs: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      start_address: string;
      end_address: string;
      steps: Array<{
        html_instructions: string;
        distance: {
          text: string;
          value: number;
        };
        duration: {
          text: string;
          value: number;
        };
      }>;
    }>;
  }>;
}

export async function getRouteData(origin: string, destination: string): Promise<RouteData> {
  const apiKey = process.env.ROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Router API key not configured");
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Router API error: ${response.statusText}`);
  }

  return await response.json();
}

export function calculateOptimalRoutes(destinations: string[]) {
  // This would implement route optimization logic
  // For now, return destinations in order
  return destinations;
}
