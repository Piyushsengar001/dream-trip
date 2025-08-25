import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Calendar, DollarSign, Cloud, Sun, CloudRain, Download, Share, Edit } from "lucide-react";

interface ItineraryResultsProps {
  data: {
    id: string;
    destination: string;
    budget: string;
    days: string;
    itinerary: any;
    weather: any;
    coordinates: { lat: number; lng: number };
  };
}

export function ItineraryResults({ data }: ItineraryResultsProps) {
  const { destination, budget, days, itinerary, weather } = data;

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) return <CloudRain className="h-6 w-6" />;
    if (condition.toLowerCase().includes('cloud')) return <Cloud className="h-6 w-6" />;
    return <Sun className="h-6 w-6" />;
  };

  return (
    <div className="itinerary-results mt-12" data-testid="itinerary-results">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Personalized {days}-Day {destination} Adventure
        </h2>
        <p className="text-gray-600">Budget: {budget} • Generated with AI • Weather included</p>
      </div>

      {/* Trip Overview Card */}
      <Card className="bg-white rounded-2xl shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trip Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">{destination}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">{days} days</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">{budget} total budget</span>
                </div>
                <div className="flex items-center">
                  <Cloud className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-gray-700">
                    {weather?.current?.condition || "Weather data available"}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto">
              <div className="w-full h-full bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-purple-700">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Interactive map will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      {weather?.forecast && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">{days}-Day Weather Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weather.forecast.slice(0, parseInt(days)).map((day: any, index: number) => (
                <div key={index} className="text-center" data-testid={`weather-day-${index}`}>
                  <div className="text-sm font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  {getWeatherIcon(day.condition)}
                  <div className="text-sm">{Math.round(day.maxTemp)}°/{Math.round(day.minTemp)}°</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Itinerary */}
      {itinerary?.days && (
        <div className="space-y-6">
          {itinerary.days.map((day: any, index: number) => (
            <Card key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden" data-testid={`day-${index + 1}`}>
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6">
                <h3 className="text-2xl font-bold">Day {index + 1}: {day.title}</h3>
                <p className="text-purple-100">Budget for today: {day.budget}</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {day.activities?.map((activity: any, actIndex: number) => (
                    <div key={actIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg" data-testid={`activity-${index}-${actIndex}`}>
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {activity.time || `${9 + actIndex * 2}AM`}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                        <p className="text-gray-600">{activity.description}</p>
                        {activity.cost && (
                          <p className="text-sm text-green-600 mt-1">Cost: {activity.cost}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Budget Summary */}
      {itinerary?.budgetBreakdown && (
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl mt-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Budget Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(itinerary.budgetBreakdown).map(([category, amount]: [string, any]) => (
                <div key={category} className="text-center" data-testid={`budget-${category}`}>
                  <div className="text-2xl font-bold">{amount}</div>
                  <div className="text-green-100 capitalize">{category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all" data-testid="button-download">
          <Download className="h-4 w-4 mr-2" />
          Download PDF Itinerary
        </Button>
        <Button variant="outline" className="flex-1 border-2 border-purple-600 text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all" data-testid="button-share">
          <Share className="h-4 w-4 mr-2" />
          Share Itinerary
        </Button>
        <Button variant="outline" className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all" data-testid="button-customize">
          <Edit className="h-4 w-4 mr-2" />
          Customize Trip
        </Button>
      </div>
    </div>
  );
}
