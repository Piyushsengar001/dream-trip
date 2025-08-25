import { useState } from "react";
import { ItineraryForm } from "../components/itinerary-form";
import { ItineraryResults } from "../components/itinerary-results";
import { LoadingState } from "../components/loading-state";
import { Plane } from "lucide-react";

interface ItineraryData {
  id: string;
  destination: string;
  budget: string;
  days: string;
  itinerary: any;
  weather: any;
  coordinates: { lat: number; lng: number };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleItineraryGenerated = (data: ItineraryData) => {
    setItineraryData(data);
    setIsLoading(false);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-blue-100/20" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          {/* Travel icon in top left */}
          <div className="absolute top-8 left-8">
            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
              <Plane className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6">
              Plan Your Dream Trip with AI ✈️
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Generate personalized, day-by-day travel itineraries powered by artificial intelligence
            </p>

            <ItineraryForm 
              onLoading={setIsLoading}
              onSuccess={handleItineraryGenerated}
              onError={handleError}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
              <p className="text-red-800" data-testid="text-error">{error}</p>
            </div>
          )}

          {isLoading && <LoadingState />}

          {itineraryData && !isLoading && (
            <ItineraryResults data={itineraryData} />
          )}

          {/* Bottom text */}
          <div className="absolute bottom-8 left-8 text-sm text-gray-500">
            plan your dream vacation? ✨
          </div>
        </div>
      </main>
    </div>
  );
}
