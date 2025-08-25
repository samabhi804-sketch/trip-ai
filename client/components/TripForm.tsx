import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Users, DollarSign, Plane } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Trip } from "@shared/api";

interface TripFormProps {
  onTripCreated?: (trip: Trip) => void;
  onCancel?: () => void;
  initialData?: Partial<Trip>;
}

export default function TripForm({ onTripCreated, onCancel, initialData }: TripFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [destination, setDestination] = useState(initialData?.destination || "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.dates ? new Date(initialData.dates.split('-')[0]) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.dates ? new Date(initialData.dates.split('-')[1]) : undefined
  );
  const [travelers, setTravelers] = useState(initialData?.travelers?.toString() || "1");
  const [budget, setBudget] = useState(initialData?.budget?.toString() || "");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Trip title is required";
    }

    if (!destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required";
    }

    if (startDate && endDate && startDate >= endDate) {
      newErrors.dateRange = "End date must be after start date";
    }

    if (!travelers || parseInt(travelers) < 1) {
      newErrors.travelers = "At least 1 traveler is required";
    }

    if (budget && parseInt(budget) < 0) {
      newErrors.budget = "Budget cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tripData = {
        title: title.trim(),
        destination: destination.trim(),
        dates: startDate && endDate ? 
          `${format(startDate, 'MMM dd')}-${format(endDate, 'dd, yyyy')}` : '',
        travelers: parseInt(travelers),
        budget: budget ? parseInt(budget) : 0,
      };

      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const newTrip: Trip = await response.json();
      
      if (onTripCreated) {
        onTripCreated(newTrip);
      } else {
        // Navigate to the new trip
        navigate(`/trip/${newTrip.id}`);
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plane className="w-6 h-6 text-primary" />
          <span>Plan Your Trip</span>
        </CardTitle>
        <CardDescription>
          Tell us about your dream destination and we'll help you plan the perfect trip
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Trip Title</Label>
            <Input
              id="title"
              placeholder="e.g., Amazing Tokyo Adventure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="destination"
                placeholder="e.g., Tokyo, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className={cn("pl-10", errors.destination ? "border-destructive" : "")}
              />
            </div>
            {errors.destination && (
              <p className="text-sm text-destructive">{errors.destination}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.startDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick end date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate}</p>
              )}
            </div>
          </div>

          {errors.dateRange && (
            <p className="text-sm text-destructive">{errors.dateRange}</p>
          )}

          {/* Travelers and Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelers">Number of Travelers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select value={travelers} onValueChange={setTravelers}>
                  <SelectTrigger className={cn("pl-10", errors.travelers && "border-destructive")}>
                    <SelectValue placeholder="Select travelers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'traveler' : 'travelers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.travelers && (
                <p className="text-sm text-destructive">{errors.travelers}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g., 3000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={cn("pl-10", errors.budget && "border-destructive")}
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Trip...
                </>
              ) : (
                'Create Trip'
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
