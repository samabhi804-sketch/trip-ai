/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * AI Agent Chat API types
 */
export interface ChatRequest {
  message: string;
  agentType: 'destination' | 'itinerary' | 'booking';
  conversationHistory: Array<{
    sender: 'user' | 'agent';
    content: string;
    timestamp: string;
  }>;
  tripData: {
    destination: string;
    dates: string;
    budget: string;
    travelers: number;
  };
}

export interface ChatResponse {
  response: string;
  agentType: 'destination' | 'itinerary' | 'booking';
  tripUpdates?: {
    destination?: string;
    dates?: string;
    budget?: string;
    travelers?: number;
  };
  suggestedNextAgent?: 'destination' | 'itinerary' | 'booking';
  confidence: number;
}

/**
 * Trip Management API types
 */
export interface Trip {
  id: string;
  title: string;
  destination: string;
  dates: string;
  duration: string;
  travelers: number;
  budget: number;
  spent: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  bookingProgress: number;
  createdAt: string;
  updatedAt: string;
  itinerary: ItineraryDay[];
  flights: Flight[];
  bookings: Booking[];
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  type: 'flight' | 'hotel' | 'activity' | 'restaurant';
  duration?: string;
  price?: number;
  status: 'completed' | 'upcoming' | 'booked' | 'cancelled';
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  status: 'booked' | 'pending' | 'cancelled';
}

export interface Booking {
  id: string;
  type: 'hotel' | 'activity' | 'restaurant' | 'transport';
  title: string;
  description: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  date: string;
}

export interface TripSummary {
  id: string;
  title: string;
  destination: string;
  dates: string;
  duration: string;
  travelers: number;
  budget: number;
  spent: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  bookingProgress: number;
  createdAt: string;
  updatedAt: string;
}
