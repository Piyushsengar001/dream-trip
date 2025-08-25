# Travel Itinerary Generator

## Overview

This is a full-stack web application that generates personalized travel itineraries using AI. Users can input their destination, budget, and trip duration to receive a comprehensive travel plan that includes weather forecasts, activity recommendations, and budget breakdowns. The application leverages Google's Gemini AI for intelligent itinerary generation, combined with weather and mapping services to provide contextual recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: In-memory storage with interface for future database integration
- **Development Setup**: Vite middleware integration for seamless development experience

### Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Simple itineraries table storing destination, budget, days, and JSON fields for itinerary and weather data
- **Migration**: Drizzle-kit for schema migrations
- **Current State**: Using in-memory storage with database-ready schema for easy migration

### AI Integration
- **Provider**: Google Gemini AI for intelligent itinerary generation
- **Functionality**: Generates detailed day-by-day travel plans considering weather, budget constraints, and local attractions
- **Input Processing**: Combines user preferences with real-time weather data and location coordinates

### Authentication & Security
- **Current State**: No authentication implemented
- **Architecture**: Prepared for session-based authentication with connect-pg-simple for PostgreSQL session storage
- **Security**: CORS configuration and input validation with Zod schemas

## External Dependencies

### AI Services
- **Google Gemini AI**: Core AI service for generating personalized travel itineraries
- **API Integration**: Handles complex prompt engineering to create structured travel plans

### Weather Services
- **WeatherAPI**: Provides current weather conditions and forecasts for destinations
- **Integration**: Weather data is incorporated into AI prompts for contextual recommendations

### Mapping Services
- **MapTiler**: Geocoding service to convert location names to coordinates
- **Static Maps**: Generates map images for itinerary visualization
- **Route Planning**: Prepared infrastructure for route optimization between destinations

### Database Services
- **Neon Database**: Configured for PostgreSQL hosting with serverless architecture
- **Connection**: Uses @neondatabase/serverless for optimized database connections

### Development Tools
- **Replit Integration**: Custom vite plugins for Replit environment optimization
- **Error Handling**: Runtime error overlay for development debugging
- **Build Process**: ESBuild for server-side bundling and Vite for client-side optimization

### UI Component Library
- **Radix UI**: Accessible component primitives for complex UI elements
- **shadcn/ui**: Pre-built component library built on Radix UI with Tailwind CSS
- **Icons**: Lucide React for consistent iconography throughout the application