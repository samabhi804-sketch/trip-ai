import { RequestHandler } from "express";
import { searchFlights } from "./flights";
import { FlightSearchRequest } from "./flights";

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

// Mock AI responses database
const destinationResponses = {
  greeting: [
    "Hello! I'm your Destination Research Agent. I specialize in finding the perfect travel destinations based on your preferences. Where would you like to explore?",
    "Welcome! I'm here to help you discover amazing destinations. Tell me what type of experience you're looking for - adventure, relaxation, culture, or something else?"
  ],
  tokyo: [
    "Excellent choice! Tokyo is a fascinating blend of ultra-modern and traditional culture. You'll experience cutting-edge technology, incredible cuisine, beautiful temples, and vibrant neighborhoods like Shibuya and Harajuku.",
    "Tokyo is amazing! From the serene temples of Asakusa to the bustling streets of Shinjuku, you'll find endless discoveries. The food scene is world-class, and there's something for every interest."
  ],
  paris: [
    "Magnifique! Paris is the city of lights, art, and romance. You'll love the iconic landmarks like the Eiffel Tower, world-class museums like the Louvre, charming neighborhoods, and incredible cafés.",
    "Paris is absolutely magical! The city offers unparalleled art, architecture, cuisine, and culture. From strolling along the Seine to exploring Montmartre, every corner tells a story."
  ],
  newYork: [
    "The Big Apple awaits! New York City is an urban playground with world-famous attractions, Broadway shows, incredible food scenes, amazing museums, and that unique NYC energy that never sleeps.",
    "New York is the ultimate city experience! From Central Park to the Metropolitan Museum, from Broadway to Brooklyn, you'll find endless entertainment, culture, and unforgettable moments."
  ]
};

const itineraryResponses = {
  tokyo: [
    "Perfect! For Tokyo, I recommend: Day 1 - Asakusa Temple & Tokyo Skytree, Day 2 - Shibuya & Harajuku exploration, Day 3 - Imperial Palace & Ginza, Day 4 - Day trip to Mount Fuji, Day 5 - Tsukiji Market & Akihabara electronics district.",
    "Great choice! Here's a fantastic Tokyo itinerary: Start with traditional Tokyo (Senso-ji Temple), experience modern Tokyo (Shibuya Crossing), enjoy cultural sites (Imperial Palace), take a Mount Fuji excursion, and explore unique neighborhoods like Akihabara."
  ],
  paris: [
    "Wonderful! For Paris: Day 1 - Eiffel Tower & Seine River cruise, Day 2 - Louvre Museum & Tuileries Garden, Day 3 - Notre-Dame & Latin Quarter, Day 4 - Versailles day trip, Day 5 - Montmartre & Sacré-Cœur, Day 6 - Champs-Élysées shopping.",
    "Excellent! Your Paris adventure: Begin with iconic landmarks (Eiffel Tower, Arc de Triomphe), dive into art and history (Louvre, Musée d'Orsay), explore charming neighborhoods (Montmartre, Marais), and take a magical Versailles day trip."
  ]
};

const bookingResponses = {
  flights: [
    "I'm searching Skyscanner for the best flight deals to your destination. I'll compare prices across multiple airlines and find options that fit your budget and schedule preferences.",
    "Let me check current flight prices and availability. I'll look for the best combinations of price, convenience, and airline reliability for your trip dates."
  ],
  budget: [
    "Based on your budget, I can find excellent flight options. I'll prioritize value while ensuring comfortable travel times and reliable airlines.",
    "With your budget range, I'll search for the sweet spot between price and convenience. I can also suggest alternative dates if they offer better deals."
  ]
};

function extractTripData(message: string, currentTrip: any): any {
  const updates: any = {};
  const lowerMessage = message.toLowerCase();
  
  // Destination extraction
  if (lowerMessage.includes('tokyo') || lowerMessage.includes('japan')) {
    updates.destination = 'Tokyo, Japan';
  } else if (lowerMessage.includes('paris') || lowerMessage.includes('france')) {
    updates.destination = 'Paris, France';
  } else if (lowerMessage.includes('new york') || lowerMessage.includes('nyc')) {
    updates.destination = 'New York, USA';
  } else if (lowerMessage.includes('london') || lowerMessage.includes('uk')) {
    updates.destination = 'London, UK';
  }
  
  // Date extraction
  const datePattern = /(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i;
  const dateMatch = message.match(datePattern);
  if (dateMatch) {
    updates.dates = message;
  }
  
  // Budget extraction
  const budgetPattern = /\$?(\d{1,5})/;
  const budgetMatch = message.match(budgetPattern);
  if (budgetMatch && lowerMessage.includes('budget')) {
    updates.budget = budgetMatch[1];
  }
  
  return updates;
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

export const handleChatWithAgent: RequestHandler = (req, res) => {
  try {
    const { message, agentType, conversationHistory, tripData }: ChatRequest = req.body;
    
    if (!message || !agentType) {
      return res.status(400).json({ error: 'Message and agentType are required' });
    }
    
    const lowerMessage = message.toLowerCase();
    let response = '';
    let tripUpdates = {};
    let suggestedNextAgent: 'destination' | 'itinerary' | 'booking' | undefined;
    let confidence = 0.8;
    
    // Extract any trip data from the message
    tripUpdates = extractTripData(message, tripData);
    
    switch (agentType) {
      case 'destination':
        if (lowerMessage.includes('tokyo') || lowerMessage.includes('japan')) {
          response = getRandomResponse(destinationResponses.tokyo);
          suggestedNextAgent = 'itinerary';
          confidence = 0.9;
        } else if (lowerMessage.includes('paris') || lowerMessage.includes('france')) {
          response = getRandomResponse(destinationResponses.paris);
          suggestedNextAgent = 'itinerary';
          confidence = 0.9;
        } else if (lowerMessage.includes('new york') || lowerMessage.includes('nyc')) {
          response = getRandomResponse(destinationResponses.newYork);
          suggestedNextAgent = 'itinerary';
          confidence = 0.9;
        } else if (conversationHistory.length <= 1) {
          response = getRandomResponse(destinationResponses.greeting);
          confidence = 0.7;
        } else {
          response = "I'd love to help you find the perfect destination! Could you tell me what type of experience you're looking for? Beach relaxation, city exploration, cultural immersion, or adventure?";
          confidence = 0.6;
        }
        break;
        
      case 'itinerary':
        if ((tripData.destination || tripUpdates.destination)?.toLowerCase().includes('tokyo')) {
          response = getRandomResponse(itineraryResponses.tokyo);
          suggestedNextAgent = 'booking';
          confidence = 0.9;
        } else if ((tripData.destination || tripUpdates.destination)?.toLowerCase().includes('paris')) {
          response = getRandomResponse(itineraryResponses.paris);
          suggestedNextAgent = 'booking';
          confidence = 0.9;
        } else if (tripData.destination || tripUpdates.destination) {
          response = `Excellent! I'm creating a detailed itinerary for your ${tripData.destination || tripUpdates.destination} trip. I'll include must-see attractions, local restaurants, cultural experiences, and the best ways to get around. This comprehensive plan will maximize your time and experiences!`;
          suggestedNextAgent = 'booking';
          confidence = 0.8;
        } else {
          response = "I need to know your destination first to create a personalized itinerary. Let me connect you with our Destination Research Agent to help you choose the perfect place!";
          suggestedNextAgent = 'destination';
          confidence = 0.7;
        }
        break;
        
      case 'booking':
        if (tripData.destination && tripData.dates) {
          // Try to extract airport codes for flight search
          const originCode = getAirportCode(lowerMessage) || 'LAX'; // Default to LAX
          const destinationCode = getDestinationCode(tripData.destination);

          if (destinationCode) {
            // Perform actual flight search
            const searchRequest: FlightSearchRequest = {
              origin: originCode,
              destination: destinationCode,
              departureDate: extractDepartureDate(tripData.dates),
              passengers: 1, // Default for now
              class: 'economy',
              maxPrice: tripData.budget ? parseInt(tripData.budget) * 0.3 : undefined // Assume 30% of budget for flights
            };

            // This would normally be an async call, but for simplicity we'll mention the search
            response = `Great! I'm searching for flights from ${originCode} to ${destinationCode} for your ${tripData.destination} trip on ${tripData.dates}. I found several options through Skyscanner - let me show you the best deals available${tripData.budget ? ` within your budget of $${tripData.budget}` : ''}. I'll prioritize flights with good value, convenient timing, and reliable airlines.`;
            confidence = 0.9;
          } else {
            response = getRandomResponse(bookingResponses.flights) + ` For your ${tripData.destination} trip, I'm checking flights for ${tripData.dates}${tripData.budget ? ` within your $${tripData.budget} budget` : ''}.`;
            confidence = 0.8;
          }
        } else if (tripData.budget || tripUpdates.budget) {
          response = getRandomResponse(bookingResponses.budget);
          confidence = 0.8;
        } else {
          response = "I need your destination and travel dates to search for the best flight options. Once you provide these details, I can find great deals through Skyscanner and other travel partners.";
          suggestedNextAgent = tripData.destination ? 'itinerary' : 'destination';
          confidence = 0.7;
        }
        break;
        
      default:
        response = "I'm here to help with your travel planning! How can I assist you today?";
        confidence = 0.5;
    }
    
    const chatResponse: ChatResponse = {
      response,
      agentType,
      tripUpdates: Object.keys(tripUpdates).length > 0 ? tripUpdates : undefined,
      suggestedNextAgent,
      confidence
    };
    
    res.json(chatResponse);
    
  } catch (error) {
    console.error('Error in chat agent:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
