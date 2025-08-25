import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trip } from "@shared/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  Navigation,
  Hotel,
  Camera,
  Utensils,
  ArrowLeft,
  Download,
  Share2,
  Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FlightDetails {
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

interface ItineraryDay {
  day: number;
  date: string;
  activities: {
    id: string;
    time: string;
    title: string;
    description: string;
    location: string;
    type: 'flight' | 'hotel' | 'activity' | 'restaurant';
    icon: any;
    duration?: string;
    price?: number;
    status: 'completed' | 'upcoming' | 'booked';
  }[];
}

export default function TripDetails() {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();

  const [tripData, setTripData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        if (!tripId) {
          setError('Trip ID not provided');
          return;
        }

        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Trip not found');
          } else {
            setError('Failed to load trip data');
          }
          return;
        }

        const trip: Trip = await response.json();
        setTripData(trip);
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The requested trip could not be found.'}</p>
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Use data from API
  const flights = tripData.flights;
  const itinerary = tripData.itinerary;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'flight': return Plane;
      case 'hotel': return Hotel;
      case 'restaurant': return Utensils;
      case 'activity': return Camera;
      default: return Navigation;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-teal-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-travel rounded-lg flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                    TripMind AI
                  </h1>
                  <p className="text-xs text-muted-foreground">Trip Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Trip
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{tripData.title}</h1>
              <div className="flex items-center space-x-6 mt-2 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{tripData.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{tripData.dates}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{tripData.travelers} travelers</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(tripData.status)} variant="secondary">
              <CheckCircle className="w-4 h-4 mr-2" />
              {tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
            </Badge>
          </div>

          {/* Progress and Budget Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Booking Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={tripData.bookingProgress} className="h-2" />
                  <p className="text-2xl font-bold">{tripData.bookingProgress}%</p>
                  <p className="text-sm text-muted-foreground">Almost there!</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Budget Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold">${tripData.spent.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ ${tripData.budget.toLocaleString()}</span>
                  </div>
                  <Progress value={(tripData.spent / tripData.budget) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    ${(tripData.budget - tripData.spent).toLocaleString()} remaining
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Trip Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{tripData.duration}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>3 days remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            {itinerary.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {day.day}
                    </div>
                    <span>Day {day.day} - {day.date}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-teal-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-sky-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-foreground">{activity.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{activity.time}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{activity.location}</span>
                                  </div>
                                  {activity.duration && (
                                    <div className="flex items-center space-x-1">
                                      <span>{activity.duration}</span>
                                    </div>
                                  )}
                                  {activity.price && (
                                    <div className="flex items-center space-x-1">
                                      <DollarSign className="w-4 h-4" />
                                      <span>${activity.price}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge className={getStatusColor(activity.status)} variant="secondary">
                                {activity.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="space-y-6">
            {flights.map((flight) => (
              <Card key={flight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Plane className="w-5 h-5" />
                      <span>{flight.airline} - {flight.flightNumber}</span>
                    </CardTitle>
                    <Badge className={getStatusColor(flight.status)} variant="secondary">
                      {flight.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Departure */}
                    <div className="text-center">
                      <div className="text-2xl font-bold">{flight.departure.time}</div>
                      <div className="text-sm text-muted-foreground">{flight.departure.date}</div>
                      <div className="mt-2">
                        <div className="font-semibold">{flight.departure.airport}</div>
                        <div className="text-sm text-muted-foreground">{flight.departure.city}</div>
                      </div>
                    </div>

                    {/* Flight Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <div className="flex-1 h-0.5 bg-border"></div>
                        <Plane className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 h-0.5 bg-border"></div>
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                      <div className="text-sm text-muted-foreground">{flight.duration}</div>
                      <div className="text-lg font-semibold mt-2">${flight.price}</div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                      <div className="text-2xl font-bold">{flight.arrival.time}</div>
                      <div className="text-sm text-muted-foreground">{flight.arrival.date}</div>
                      <div className="mt-2">
                        <div className="font-semibold">{flight.arrival.airport}</div>
                        <div className="text-sm text-muted-foreground">{flight.arrival.city}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripData.bookings.map((booking) => {
                const getBookingIcon = (type: string) => {
                  switch (type) {
                    case 'hotel': return Hotel;
                    case 'activity': return Camera;
                    case 'restaurant': return Utensils;
                    case 'transport': return Plane;
                    default: return Hotel;
                  }
                };

                const BookingIcon = getBookingIcon(booking.type);

                return (
                  <Card key={booking.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookingIcon className="w-5 h-5" />
                        <span>{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground">{booking.description}</p>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)} variant="secondary">
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-semibold">${booking.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {tripData.bookings.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
                    <p className="text-muted-foreground">Your bookings will appear here once you start planning your trip.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
