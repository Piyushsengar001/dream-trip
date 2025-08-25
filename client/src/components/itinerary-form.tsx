import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Card, CardContent } from "./ui/card";
import { MapPin, DollarSign, Calendar, Sparkles, Mic } from "lucide-react";
import { tripFormSchema, type TripFormData } from "../../../shared/schema";
import { apiRequest } from "../lib/queryClient";

interface ItineraryFormProps {
  onLoading: (loading: boolean) => void;
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

export function ItineraryForm({ onLoading, onSuccess, onError }: ItineraryFormProps) {
  const form = useForm<TripFormData>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      destination: "",
      budget: "",
      days: "",
    },
  });

  const onSubmit = async (data: TripFormData) => {
    try {
      onLoading(true);
      onError("");
      
      const response = await apiRequest("POST", "/api/itinerary", data);
      const result = await response.json();
      
      onSuccess(result);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to generate itinerary");
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-4xl mx-auto border-0">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-itinerary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                      Destination
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="e.g. Paris"
                          className="w-full px-4 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                          data-testid="input-destination"
                          {...field}
                        />
                        <Mic className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                      Budget
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. $1500"
                        className="w-full px-4 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                        data-testid="input-budget"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 text-purple-500 mr-2" />
                      Days
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g. 7"
                        className="w-full px-4 py-4 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                        data-testid="input-days"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit"
              className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg text-lg"
              data-testid="button-generate"
            >
              <Sparkles className="h-5 w-5 mr-3" />
              Generate AI Itinerary
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
