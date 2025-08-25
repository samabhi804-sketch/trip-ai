import { RequestHandler } from "express";

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  maxPrice?: number;
}

export interface FlightSearchResponse {
  flights: FlightResult[];
  searchMeta: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    searchTime: string;
    totalResults: number;
  };
}

export interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  departure: {
    airport: string;
    iata: string;
    city: string;
    country: string;
    time: string;
    date: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    iata: string;
    city: string;
    country: string;
    time: string;
    date: string;
    terminal?: string;
  };
  duration: string;
  stops: number;
  price: {
    total: number;
    currency: string;
    breakdown: {
      base: number;
      taxes: number;
      fees: number;
    };
  };
  class: string;
  amenities: string[];
  bookingLink: string;
  provider: string;
  carbonEmission: number; // kg CO2
  deals?: {
    type: 'priceAlert' | 'lastMinute' | 'earlyBird';
    message: string;
    savings: number;
  };
}

// Mock flight data generator
const airlines = [
  'American Airlines', 'Delta Air Lines', 'United Airlines', 'JetBlue Airways',
  'Southwest Airlines', 'Alaska Airlines', 'Spirit Airlines', 'Frontier Airlines',
  'Japan Airlines', 'ANA', 'Emirates', 'Qatar Airways', 'Lufthansa', 'British Airways',
  'Air France', 'KLM', 'Singapore Airlines', 'Cathay Pacific'
];

const aircraftTypes = [
  'Boeing 737', 'Boeing 777', 'Boeing 787', 'Airbus A320', 'Airbus A330', 
  'Airbus A350', 'Airbus A380', 'Boeing 747', 'Embraer E175'
];

const amenities = [
  'WiFi', 'In-flight Entertainment', 'Power Outlets', 'USB Ports',
  'Meal Service', 'Beverages', 'Extra Legroom', 'Priority Boarding',
  'Carry-on Included', 'Checked Bag Included'
];

function generateMockFlights(
  origin: string, 
  destination: string, 
  departureDate: string,
  passengers: number,
  maxPrice?: number
): FlightResult[] {
  const flights: FlightResult[] = [];
  const numberOfFlights = Math.floor(Math.random() * 12) + 8; // 8-20 flights
  
  for (let i = 0; i < numberOfFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = `${getAirlineCode(airline)} ${Math.floor(Math.random() * 9000) + 1000}`;
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Generate departure time (6 AM to 11 PM)
    const departureHour = Math.floor(Math.random() * 17) + 6;
    const departureMinute = Math.floor(Math.random() * 60);
    const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`;
    
    // Generate flight duration (2-15 hours depending on route)
    const baseMinutes = getBaseDuration(origin, destination);
    const variation = Math.floor(Math.random() * 120) - 60; // ±1 hour variation
    const totalMinutes = baseMinutes + variation;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const duration = `${hours}h ${minutes}m`;
    
    // Calculate arrival time
    const arrivalHour = (departureHour + hours + Math.floor((departureMinute + minutes) / 60)) % 24;
    const arrivalMinute = (departureMinute + minutes) % 60;
    const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
    
    // Generate stops (0-2 stops, mostly 0-1)
    const stops = Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : 2;
    
    // Generate price based on multiple factors
    const basePrice = getBasePrice(origin, destination);
    const stopsPenalty = stops * 50;
    const timePenalty = (departureHour < 8 || departureHour > 20) ? -30 : 0; // Red-eye discount
    const airlineFactor = getAirlinePriceFactor(airline);
    const randomVariation = Math.floor(Math.random() * 200) - 100;
    
    let totalPrice = Math.floor((basePrice + stopsPenalty + timePenalty) * airlineFactor + randomVariation);
    
    // Apply passenger multiplier
    totalPrice = totalPrice * passengers;
    
    // Filter by max price if specified
    if (maxPrice && totalPrice > maxPrice) continue;
    
    const taxes = Math.floor(totalPrice * 0.15);
    const fees = Math.floor(Math.random() * 50) + 20;
    const base = totalPrice - taxes - fees;
    
    // Generate amenities (3-7 amenities per flight)
    const flightAmenities = [];
    const amenityCount = Math.floor(Math.random() * 5) + 3;
    for (let j = 0; j < amenityCount; j++) {
      const amenity = amenities[Math.floor(Math.random() * amenities.length)];
      if (!flightAmenities.includes(amenity)) {
        flightAmenities.push(amenity);
      }
    }
    
    // Generate deals for some flights
    let deals = undefined;
    if (Math.random() < 0.3) {
      const dealTypes = ['priceAlert', 'lastMinute', 'earlyBird'] as const;
      const dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)];
      const savings = Math.floor(Math.random() * 150) + 50;
      
      deals = {
        type: dealType,
        message: getDealMessage(dealType, savings),
        savings
      };
    }
    
    const flight: FlightResult = {
      id: `flight-${Date.now()}-${i}`,
      airline,
      flightNumber,
      aircraft,
      departure: {
        airport: getAirportName(origin),
        iata: origin.toUpperCase(),
        city: getCityName(origin),
        country: getCountryName(origin),
        time: departureTime,
        date: departureDate,
        terminal: Math.random() < 0.5 ? `Terminal ${Math.floor(Math.random() * 5) + 1}` : undefined
      },
      arrival: {
        airport: getAirportName(destination),
        iata: destination.toUpperCase(),
        city: getCityName(destination),
        country: getCountryName(destination),
        time: arrivalTime,
        date: departureDate, // Same day for simplicity
        terminal: Math.random() < 0.5 ? `Terminal ${Math.floor(Math.random() * 5) + 1}` : undefined
      },
      duration,
      stops,
      price: {
        total: totalPrice,
        currency: 'USD',
        breakdown: { base, taxes, fees }
      },
      class: 'Economy',
      amenities: flightAmenities,
      bookingLink: `https://skyscanner.com/booking/${flightNumber.replace(' ', '-')}`,
      provider: 'Skyscanner',
      carbonEmission: Math.floor(totalMinutes * 0.12 + Math.random() * 50), // Mock carbon calculation
      deals
    };
    
    flights.push(flight);
  }
  
  // Sort by price
  return flights.sort((a, b) => a.price.total - b.price.total);
}

// Helper functions
function getAirlineCode(airline: string): string {
  const codes: Record<string, string> = {
    'American Airlines': 'AA',
    'Delta Air Lines': 'DL',
    'United Airlines': 'UA',
    'JetBlue Airways': 'B6',
    'Southwest Airlines': 'WN',
    'Alaska Airlines': 'AS',
    'Spirit Airlines': 'NK',
    'Frontier Airlines': 'F9',
    'Japan Airlines': 'JL',
    'ANA': 'NH',
    'Emirates': 'EK',
    'Qatar Airways': 'QR',
    'Lufthansa': 'LH',
    'British Airways': 'BA',
    'Air France': 'AF',
    'KLM': 'KL',
    'Singapore Airlines': 'SQ',
    'Cathay Pacific': 'CX'
  };
  return codes[airline] || 'XX';
}

function getBaseDuration(origin: string, destination: string): number {
  // Mock duration calculation based on common routes (in minutes)
  const routes: Record<string, number> = {
    'LAX-NRT': 665, 'NRT-LAX': 600, // Los Angeles - Tokyo
    'LAX-CDG': 690, 'CDG-LAX': 720, // Los Angeles - Paris
    'LAX-JFK': 315, 'JFK-LAX': 360, // Los Angeles - New York
    'LAX-LHR': 660, 'LHR-LAX': 690, // Los Angeles - London
    'JFK-CDG': 450, 'CDG-JFK': 480, // New York - Paris
    'JFK-NRT': 840, 'NRT-JFK': 780, // New York - Tokyo
    'JFK-LHR': 420, 'LHR-JFK': 450  // New York - London
  };
  
  const routeKey = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  return routes[routeKey] || 480; // Default 8 hours
}

function getBasePrice(origin: string, destination: string): number {
  // Mock base prices for different routes
  const prices: Record<string, number> = {
    'LAX-NRT': 850, 'NRT-LAX': 850,
    'LAX-CDG': 750, 'CDG-LAX': 750,
    'LAX-JFK': 350, 'JFK-LAX': 350,
    'LAX-LHR': 800, 'LHR-LAX': 800,
    'JFK-CDG': 650, 'CDG-JFK': 650,
    'JFK-NRT': 950, 'NRT-JFK': 950,
    'JFK-LHR': 550, 'LHR-JFK': 550
  };
  
  const routeKey = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  return prices[routeKey] || 500;
}

function getAirlinePriceFactor(airline: string): number {
  const factors: Record<string, number> = {
    'Spirit Airlines': 0.7,
    'Frontier Airlines': 0.75,
    'Southwest Airlines': 0.85,
    'JetBlue Airways': 0.9,
    'Alaska Airlines': 0.95,
    'American Airlines': 1.0,
    'Delta Air Lines': 1.05,
    'United Airlines': 1.0,
    'Emirates': 1.3,
    'Qatar Airways': 1.25,
    'Singapore Airlines': 1.2,
    'ANA': 1.15,
    'Japan Airlines': 1.15,
    'Lufthansa': 1.1,
    'British Airways': 1.1,
    'Air France': 1.05,
    'KLM': 1.05,
    'Cathay Pacific': 1.15
  };
  return factors[airline] || 1.0;
}

function getAirportName(iata: string): string {
  const airports: Record<string, string> = {
    'LAX': 'Los Angeles International Airport',
    'JFK': 'John F. Kennedy International Airport',
    'NRT': 'Narita International Airport',
    'CDG': 'Charles de Gaulle Airport',
    'LHR': 'Heathrow Airport',
    'DXB': 'Dubai International Airport',
    'SIN': 'Singapore Changi Airport',
    'HKG': 'Hong Kong International Airport'
  };
  return airports[iata.toUpperCase()] || `${iata.toUpperCase()} Airport`;
}

function getCityName(iata: string): string {
  const cities: Record<string, string> = {
    'LAX': 'Los Angeles',
    'JFK': 'New York',
    'NRT': 'Tokyo',
    'CDG': 'Paris',
    'LHR': 'London',
    'DXB': 'Dubai',
    'SIN': 'Singapore',
    'HKG': 'Hong Kong'
  };
  return cities[iata.toUpperCase()] || iata.toUpperCase();
}

function getCountryName(iata: string): string {
  const countries: Record<string, string> = {
    'LAX': 'United States',
    'JFK': 'United States',
    'NRT': 'Japan',
    'CDG': 'France',
    'LHR': 'United Kingdom',
    'DXB': 'United Arab Emirates',
    'SIN': 'Singapore',
    'HKG': 'Hong Kong'
  };
  return countries[iata.toUpperCase()] || 'Unknown';
}

function getDealMessage(dealType: string, savings: number): string {
  switch (dealType) {
    case 'priceAlert':
      return `Price dropped $${savings}! Book now to save.`;
    case 'lastMinute':
      return `Last-minute deal! Save $${savings} on this flight.`;
    case 'earlyBird':
      return `Early bird special! Save $${savings} by booking in advance.`;
    default:
      return `Special deal! Save $${savings}.`;
  }
}

// API endpoint handlers
export const searchFlights: RequestHandler = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      class: flightClass = 'economy',
      maxPrice
    }: FlightSearchRequest = req.body;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        error: 'Origin, destination, and departure date are required'
      });
    }

    // Simulate API delay
    const delay = Math.floor(Math.random() * 1500) + 500; // 0.5-2 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    const flights = generateMockFlights(origin, destination, departureDate, passengers, maxPrice);

    const response: FlightSearchResponse = {
      flights,
      searchMeta: {
        origin,
        destination,
        departureDate,
        returnDate,
        passengers,
        searchTime: new Date().toISOString(),
        totalResults: flights.length
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFlightDetails: RequestHandler = async (req, res) => {
  try {
    const { flightId } = req.params;
    
    if (!flightId) {
      return res.status(400).json({ error: 'Flight ID is required' });
    }

    // In a real implementation, this would fetch from a database
    // For now, we'll generate a mock flight with the given ID
    const mockFlight = generateMockFlights('LAX', 'NRT', '2024-03-15', 1)[0];
    mockFlight.id = flightId;

    res.json(mockFlight);
  } catch (error) {
    console.error('Error getting flight details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
