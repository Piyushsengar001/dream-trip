import { type Itinerary, type InsertItinerary } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getItinerary(id: string): Promise<Itinerary | undefined>;
  createItinerary(itinerary: Omit<InsertItinerary, 'id'> & { itinerary?: any; weather?: any }): Promise<Itinerary>;
}

export class MemStorage implements IStorage {
  private itineraries: Map<string, Itinerary>;

  constructor() {
    this.itineraries = new Map();
  }

  async getItinerary(id: string): Promise<Itinerary | undefined> {
    return this.itineraries.get(id);
  }

  async createItinerary(insertItinerary: Omit<InsertItinerary, 'id'> & { itinerary?: any; weather?: any }): Promise<Itinerary> {
    const id = randomUUID();
    const itinerary: Itinerary = { 
      ...insertItinerary, 
      id,
      itinerary: insertItinerary.itinerary || null,
      weather: insertItinerary.weather || null,
      createdAt: new Date(),
    };
    this.itineraries.set(id, itinerary);
    return itinerary;
  }
}

export const storage = new MemStorage();
