import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="text-center py-12" data-testid="loading-state">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mb-4">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Creating Your Perfect Itinerary</h3>
      <p className="text-gray-600">AI is analyzing destinations, weather, and routes...</p>
    </div>
  );
}
