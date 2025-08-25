import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface ItineraryInput {
  destination: string;
  budget: string;
  days: number;
  weather: any;
  coordinates: { lat: number; lng: number };
}

interface DayActivity {
  time: string;
  title: string;
  description: string;
  cost?: string;
  category: string;
}

interface ItineraryDay {
  title: string;
  budget: string;
  activities: DayActivity[];
}

interface ItineraryResponse {
  overview: {
    destination: string;
    totalDays: number;
    totalBudget: string;
    highlights: string[];
  };
  days: ItineraryDay[];
  budgetBreakdown: {
    accommodation: string;
    food: string;
    activities: string;
    transportation: string;
  };
  tips: string[];
}

export async function generateItinerary(input: ItineraryInput): Promise<ItineraryResponse> {
  const { destination, budget, days, weather, coordinates } = input;

  const systemPrompt = `You are an expert travel planner. Create a detailed, personalized travel itinerary based on the provided information. 

Consider the following:
- Weather conditions and seasonal activities
- Budget constraints and cost-effective recommendations
- Popular attractions and hidden gems
- Local culture, food, and experiences
- Practical transportation and timing
- Realistic daily budgets and activity costs

Provide a well-structured itinerary with specific activities, timings, costs, and practical advice.`;

  const userPrompt = `Create a ${days}-day travel itinerary for ${destination} with a total budget of ${budget}.

Weather forecast: ${JSON.stringify(weather)}
Location coordinates: ${coordinates.lat}, ${coordinates.lng}

Requirements:
- Daily activities with specific times and costs
- Budget breakdown across categories
- Consider weather conditions for activity recommendations
- Include mix of must-see attractions and local experiences
- Provide realistic cost estimates in local currency
- Include transportation recommendations
- Add practical tips for travelers

Structure the response as a complete travel guide with daily schedules.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            overview: {
              type: "object",
              properties: {
                destination: { type: "string" },
                totalDays: { type: "number" },
                totalBudget: { type: "string" },
                highlights: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["destination", "totalDays", "totalBudget", "highlights"]
            },
            days: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  budget: { type: "string" },
                  activities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        time: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                        cost: { type: "string" },
                        category: { type: "string" }
                      },
                      required: ["time", "title", "description", "category"]
                    }
                  }
                },
                required: ["title", "budget", "activities"]
              }
            },
            budgetBreakdown: {
              type: "object",
              properties: {
                accommodation: { type: "string" },
                food: { type: "string" },
                activities: { type: "string" },
                transportation: { type: "string" }
              },
              required: ["accommodation", "food", "activities", "transportation"]
            },
            tips: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["overview", "days", "budgetBreakdown", "tips"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const itineraryData: ItineraryResponse = JSON.parse(rawJson);
    
    // Validate the response has the expected structure
    if (!itineraryData.days || !Array.isArray(itineraryData.days)) {
      throw new Error("Invalid itinerary structure received from AI");
    }

    // Ensure we have the right number of days
    if (itineraryData.days.length !== days) {
      console.warn(`Expected ${days} days, got ${itineraryData.days.length} days from AI`);
    }

    return itineraryData;

  } catch (error) {
    console.error("Gemini AI Error:", error);
    
    // Provide a fallback error response rather than throwing
    throw new Error(`Failed to generate itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateItinerarySummary(destination: string, days: number): Promise<string> {
  const prompt = `Create a brief, engaging summary for a ${days}-day trip to ${destination}. Include key highlights and what makes this destination special. Keep it under 100 words.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || `Discover the amazing ${destination} in ${days} days!`;
  } catch (error) {
    console.error("Error generating summary:", error);
    return `Explore ${destination} over ${days} unforgettable days.`;
  }
}
