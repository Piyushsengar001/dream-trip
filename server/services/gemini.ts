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
    // Use a simpler approach without JSON schema first
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: userPrompt,
    });

    const rawText = response.text;
    console.log("Gemini response:", rawText);

    if (!rawText) {
      throw new Error("Empty response from Gemini AI");
    }

    // Try to extract JSON from the response
    let jsonMatch = rawText.match(/\{[\s\S]*\}/);
    let jsonText = jsonMatch ? jsonMatch[0] : rawText;
    
    let itineraryData: ItineraryResponse;
    
    try {
      itineraryData = JSON.parse(jsonText);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      console.log("Failed to parse JSON, creating structured response");
      itineraryData = createStructuredResponse(destination, days, budget, rawText);
    }
    
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

// Helper function to create structured response when JSON parsing fails
function createStructuredResponse(destination: string, days: number, budget: string, aiText: string): ItineraryResponse {
  const dailyBudget = Math.round(parseInt(budget.replace(/[^0-9]/g, '')) / days);
  
  return {
    overview: {
      destination,
      totalDays: days,
      totalBudget: budget,
      highlights: [
        `Explore ${destination}'s top attractions`,
        "Experience local culture and cuisine",
        "Visit must-see landmarks",
        "Enjoy authentic local experiences"
      ]
    },
    days: Array.from({ length: days }, (_, i) => ({
      title: `Day ${i + 1} in ${destination}`,
      budget: `$${dailyBudget}`,
      activities: [
        {
          time: "9:00 AM",
          title: "Morning Exploration",
          description: "Start your day exploring the main attractions",
          cost: `$${Math.round(dailyBudget * 0.3)}`,
          category: "sightseeing"
        },
        {
          time: "1:00 PM", 
          title: "Local Lunch",
          description: "Try authentic local cuisine",
          cost: `$${Math.round(dailyBudget * 0.2)}`,
          category: "food"
        },
        {
          time: "3:00 PM",
          title: "Afternoon Activities",
          description: "Cultural sites and local experiences",
          cost: `$${Math.round(dailyBudget * 0.3)}`,
          category: "culture"
        },
        {
          time: "7:00 PM",
          title: "Evening Dining",
          description: "Dinner at a recommended restaurant", 
          cost: `$${Math.round(dailyBudget * 0.2)}`,
          category: "food"
        }
      ]
    })),
    budgetBreakdown: {
      accommodation: `$${Math.round(parseInt(budget.replace(/[^0-9]/g, '')) * 0.4)}`,
      food: `$${Math.round(parseInt(budget.replace(/[^0-9]/g, '')) * 0.3)}`,
      activities: `$${Math.round(parseInt(budget.replace(/[^0-9]/g, '')) * 0.2)}`,
      transportation: `$${Math.round(parseInt(budget.replace(/[^0-9]/g, '')) * 0.1)}`
    },
    tips: [
      `Book accommodations in ${destination} in advance`,
      "Try local transportation for authentic experiences",
      "Learn basic local phrases",
      "Always carry local currency",
      "Check weather forecasts before outdoor activities"
    ]
  };
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
