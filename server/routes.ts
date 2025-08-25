import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateItinerary } from "./services/gemini";
import { getWeatherData, formatWeatherForItinerary } from "./services/weather";
import { getLocationCoordinates } from "./services/maptiler";
import { tripFormSchema } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/itinerary", async (req, res) => {
    try {
      const validatedData = tripFormSchema.parse(req.body);
      const { destination, budget, days } = validatedData;
      
      // Get location coordinates
      const coordinates = await getLocationCoordinates(destination);
      
      // Get weather data
      const weatherData = await getWeatherData(destination, parseInt(days));
      const formattedWeather = formatWeatherForItinerary(weatherData);
      
      // Generate itinerary with AI
      const itineraryData = await generateItinerary({
        destination,
        budget,
        days: parseInt(days),
        weather: formattedWeather,
        coordinates,
      });
      
      // Store the itinerary
      const storedItinerary = await storage.createItinerary({
        destination,
        budget,
        days,
        itinerary: itineraryData,
        weather: formattedWeather,
      });
      
      res.json({
        id: storedItinerary.id,
        destination,
        budget,
        days,
        itinerary: itineraryData,
        weather: formattedWeather,
        coordinates,
      });
    } catch (error) {
      console.error("Error generating itinerary:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate itinerary" 
      });
    }
  });

  app.get("/api/itinerary/:id", async (req, res) => {
    try {
      const itinerary = await storage.getItinerary(req.params.id);
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      res.json(itinerary);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
