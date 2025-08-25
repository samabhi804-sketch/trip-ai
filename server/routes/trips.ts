import { RequestHandler } from "express";

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

// Mock database - in a real app, this would be a proper database
let trips: Trip[] = [
  {
    id: 'trip-001',
    title: 'Amazing Tokyo Adventure',
    destination: 'Tokyo, Japan',
    dates: 'March 15-22, 2024',
    duration: '7 days',
    travelers: 2,
    budget: 3500,
    spent: 2800,
    status: 'confirmed',
    bookingProgress: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    itinerary: [
      {
        day: 1,
        date: 'March 16, 2024',
        activities: [
          {
            id: '1-1',
            time: '3:45 PM',
            title: 'Arrive at Tokyo Narita',
            description: 'Flight JL 012 arrival',
            location: 'Narita International Airport',
            type: 'flight',
            status: 'upcoming'
          },
          {
            id: '1-2',
            time: '6:00 PM',
            title: 'Check-in at Hotel',
            description: 'Park Hyatt Tokyo',
            location: 'Shinjuku, Tokyo',
            type: 'hotel',
            status: 'booked'
          },
          {
            id: '1-3',
            time: '8:00 PM',
            title: 'Welcome Dinner',
            description: 'Traditional kaiseki at Kikunoi',
            location: 'Higashiyama, Kyoto',
            type: 'restaurant',
            duration: '2 hours',
            price: 120,
            status: 'booked'
          }
        ]
      },
      {
        day: 2,
        date: 'March 17, 2024',
        activities: [
          {
            id: '2-1',
            time: '9:00 AM',
            title: 'Tokyo City Tour',
            description: 'Guided tour of Senso-ji Temple, Tokyo Skytree',
            location: 'Asakusa & Sumida',
            type: 'activity',
            duration: '6 hours',
            price: 85,
            status: 'booked'
          },
          {
            id: '2-2',
            time: '7:00 PM',
            title: 'Shibuya Crossing Experience',
            description: 'Experience the world\'s busiest intersection',
            location: 'Shibuya, Tokyo',
            type: 'activity',
            duration: '2 hours',
            status: 'upcoming'
          }
        ]
      }
    ],
    flights: [
      {
        id: 'flight-1',
        airline: 'Japan Airlines',
        flightNumber: 'JL 012',
        departure: {
          airport: 'LAX',
          city: 'Los Angeles',
          time: '11:30 AM',
          date: 'Mar 15'
        },
        arrival: {
          airport: 'NRT',
          city: 'Tokyo',
          time: '3:45 PM',
          date: 'Mar 16'
        },
        duration: '11h 15m',
        price: 850,
        status: 'booked'
      },
      {
        id: 'flight-2',
        airline: 'Japan Airlines',
        flightNumber: 'JL 013',
        departure: {
          airport: 'NRT',
          city: 'Tokyo',
          time: '6:20 PM',
          date: 'Mar 22'
        },
        arrival: {
          airport: 'LAX',
          city: 'Los Angeles',
          time: '11:15 AM',
          date: 'Mar 22'
        },
        duration: '9h 55m',
        price: 850,
        status: 'booked'
      }
    ],
    bookings: [
      {
        id: 'booking-1',
        type: 'hotel',
        title: 'Park Hyatt Tokyo',
        description: 'Deluxe Room, City View - 7 nights',
        price: 1890,
        status: 'confirmed',
        date: 'March 16-22, 2024'
      },
      {
        id: 'booking-2',
        type: 'activity',
        title: 'Tokyo City Tour',
        description: 'Full day guided tour',
        price: 85,
        status: 'confirmed',
        date: 'March 17, 2024'
      }
    ]
  }
];

export const getTripById: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = trips.find(t => t.id === tripId);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    res.json(trip);
  } catch (error) {
    console.error('Error getting trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllTrips: RequestHandler = (req, res) => {
  try {
    // Return basic trip info without full details
    const tripSummaries = trips.map(trip => ({
      id: trip.id,
      title: trip.title,
      destination: trip.destination,
      dates: trip.dates,
      duration: trip.duration,
      travelers: trip.travelers,
      budget: trip.budget,
      spent: trip.spent,
      status: trip.status,
      bookingProgress: trip.bookingProgress,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt
    }));
    
    res.json(tripSummaries);
  } catch (error) {
    console.error('Error getting trips:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTrip: RequestHandler = (req, res) => {
  try {
    const { title, destination, dates, travelers, budget } = req.body;
    
    if (!title || !destination) {
      return res.status(400).json({ error: 'Title and destination are required' });
    }
    
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title,
      destination,
      dates: dates || '',
      duration: '', // Will be calculated
      travelers: travelers || 1,
      budget: budget || 0,
      spent: 0,
      status: 'planning',
      bookingProgress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itinerary: [],
      flights: [],
      bookings: []
    };
    
    trips.push(newTrip);
    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTrip: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    const updates = req.body;
    
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    trips[tripIndex] = {
      ...trips[tripIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json(trips[tripIndex]);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTrip: RequestHandler = (req, res) => {
  try {
    const { tripId } = req.params;
    
    const tripIndex = trips.findIndex(t => t.id === tripId);
    if (tripIndex === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    trips.splice(tripIndex, 1);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
