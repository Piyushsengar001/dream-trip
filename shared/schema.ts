import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const itineraries = pgTable("itineraries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  destination: text("destination").notNull(),
  budget: text("budget").notNull(),
  days: text("days").notNull(),
  itinerary: json("itinerary").default(null),
  weather: json("weather").default(null),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertItinerarySchema = createInsertSchema(itineraries).pick({
  destination: true,
  budget: true,
  days: true,
});

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;

// Form validation schema
export const tripFormSchema = insertItinerarySchema.extend({
  destination: z.string().min(1, "Destination is required"),
  budget: z.string().min(1, "Budget is required"),
  days: z.string().min(1, "Days is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 30,
    "Days must be a number between 1 and 30"
  ),
});

export type TripFormData = z.infer<typeof tripFormSchema>;
