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
