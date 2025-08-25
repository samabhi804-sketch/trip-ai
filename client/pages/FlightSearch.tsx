import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ArrowLeft, 
  Plane, 
  Search, 
  MapPin, 
  Users, 
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
  ExternalLink,
  Leaf
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FlightSearchRequest, FlightSearchResponse, FlightResult } from "@shared/api";

export default function FlightSearch() {
  const navigate = useNavigate();
  
  // Search form state
  const [origin, setOrigin] = useState("LAX");
  const [destination, setDestination] = useState("NRT");
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState("1");
  const [flightClass, setFlightClass] = useState<'economy' | 'business' | 'first'>('economy');
  const [maxPrice, setMaxPrice] = useState("");
  
  // Search results state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FlightSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!origin || !destination || !departureDate) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const searchRequest: FlightSearchRequest = {
        origin,
        destination,
        departureDate: format(departureDate, 'yyyy-MM-dd'),
        returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : undefined,
        passengers: parseInt(passengers),
        class: flightClass,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined
      };

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to search flights');
      }

      const results: FlightSearchResponse = await response.json();
      setSearchResults(results);
    } catch (err) {
      console.error('Flight search error:', err);
      setError('Failed to search flights. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatDuration = (duration: string) => {
    return duration.replace('h', 'hr').replace('m', 'min');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
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
                  <p className="text-xs text-muted-foreground">Flight Search</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Flights</span>
            </CardTitle>
            <CardDescription>
              Find the best flight deals powered by Skyscanner
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Origin */}
              <div className="space-y-2">
                <Label htmlFor="origin">From</Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LAX">LAX - Los Angeles</SelectItem>
                    <SelectItem value="JFK">JFK - New York</SelectItem>
                    <SelectItem value="ORD">ORD - Chicago</SelectItem>
                    <SelectItem value="MIA">MIA - Miami</SelectItem>
                    <SelectItem value="SFO">SFO - San Francisco</SelectItem>
                    <SelectItem value="SEA">SEA - Seattle</SelectItem>
                    <SelectItem value="BOS">BOS - Boston</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">To</Label>
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NRT">NRT - Tokyo</SelectItem>
                    <SelectItem value="CDG">CDG - Paris</SelectItem>
                    <SelectItem value="LHR">LHR - London</SelectItem>
                    <SelectItem value="DXB">DXB - Dubai</SelectItem>
                    <SelectItem value="SIN">SIN - Singapore</SelectItem>
                    <SelectItem value="HKG">HKG - Hong Kong</SelectItem>
                    <SelectItem value="FRA">FRA - Frankfurt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <Label>Departure</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {departureDate ? format(departureDate, "MMM dd") : "Pick date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Passengers */}
              <div className="space-y-2">
                <Label>Passengers</Label>
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'passenger' : 'passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Class */}
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={flightClass} onValueChange={(value: any) => setFlightClass(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Max Price (Optional)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="e.g., 1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <Label className="invisible">Search</Label>
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Search Flights
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {searchResults.searchMeta.totalResults} flights found
              </h2>
              <p className="text-sm text-muted-foreground">
                From {searchResults.searchMeta.origin} to {searchResults.searchMeta.destination}
              </p>
            </div>

            <div className="space-y-4">
              {searchResults.flights.map((flight) => (
                <Card key={flight.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Flight Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Airline & Flight Number */}
                        <div>
                          <h3 className="font-semibold">{flight.airline}</h3>
                          <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                          <p className="text-xs text-muted-foreground">{flight.aircraft}</p>
                        </div>

                        {/* Departure */}
                        <div className="text-center">
                          <div className="text-2xl font-bold">{flight.departure.time}</div>
                          <div className="text-sm font-medium">{flight.departure.iata}</div>
                          <div className="text-xs text-muted-foreground">{flight.departure.city}</div>
                        </div>

                        {/* Duration & Stops */}
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <div className="flex-1 h-0.5 bg-border relative">
                              <Plane className="w-3 h-3 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                          </div>
                          <div className="text-sm font-medium">{formatDuration(flight.duration)}</div>
                          <div className="text-xs text-muted-foreground">
                            {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                          <div className="text-2xl font-bold">{flight.arrival.time}</div>
                          <div className="text-sm font-medium">{flight.arrival.iata}</div>
                          <div className="text-xs text-muted-foreground">{flight.arrival.city}</div>
                        </div>
                      </div>

                      {/* Price & Booking */}
                      <div className="ml-6 text-right">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {formatPrice(flight.price.total)}
                        </div>
                        
                        {/* Deal Badge */}
                        {flight.deals && (
                          <Badge variant="secondary" className="mb-2 bg-green-100 text-green-800">
                            <Zap className="w-3 h-3 mr-1" />
                            Save {formatPrice(flight.deals.savings)}
                          </Badge>
                        )}

                        {/* Amenities */}
                        <div className="flex flex-wrap justify-end gap-1 mb-3">
                          {flight.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {flight.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{flight.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Carbon Emission */}
                        <div className="flex items-center justify-end text-xs text-muted-foreground mb-3">
                          <Leaf className="w-3 h-3 mr-1" />
                          {flight.carbonEmission}kg CO₂
                        </div>

                        <Button className="w-full" asChild>
                          <a href={flight.bookingLink} target="_blank" rel="noopener noreferrer">
                            Book Now
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
