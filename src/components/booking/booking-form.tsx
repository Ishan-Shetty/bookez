"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { formatCurrency, formatDate, formatTime } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/hooks/use-toast";
import { Clock, Film, MapPin } from "lucide-react";
import Image from "next/image";
import { type Seat } from "~/components/booking/seat-selector";

// Define proper types for the components
interface Screen {
  id: string;
  name: string;
}

interface Theater {
  id: string;
  name: string;
  location: string;
}

interface MovieSimple {
  id: string;
  title: string;
  posterUrl: string | null;
}

interface Show {
  id: string;
  startTime: Date;
  price: number;
  movie: MovieSimple;
  theater: Theater;
  screen: Screen;
}

interface BookingFormProps {
  show: Show;
  userId: string;
}

export function BookingForm({ show, userId }: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  // We'll keep seatDetails but use it in the UI
  const [seatDetails, setSeatDetails] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  // We'll keep bookedSeats but use it for analytics or display
  const [bookedSeats] = useState(0);
  const [, setAvailableSeats] = useState(0);
  
  const { data: seats, isLoading: isLoadingSeats } = api.seat.getByScreenId.useQuery(
    { screenId: show.screen.id }
  );

  // Use useEffect to handle the seats data safely
  useEffect(() => {
    if (seats) {
      const availableSeatsCount = seats.filter((seat) => !seat.isBooked).length;
      setAvailableSeats(availableSeatsCount);
    }
  }, [seats]);
  
  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Booking successful!",
        description: "Your tickets have been booked successfully.",
      });
      // Redirect to booking confirmation page
      router.push(`/dashboard/bookings/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    },
  });
  
  const handleBooking = () => {
    if (!selectedSeatId) {
      toast({
        title: "Select a seat",
        description: "Please select a seat to continue",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    createBooking.mutate({
      showId: show.id,
      seatId: selectedSeatId,
      userId,
      paymentId: "temporary-payment-id" // Add the required paymentId
    });
  };
  
  // Organize seats by row in a safer way
  const seatsByRow: Record<string, Seat[]> = {};
  
  if (seats) {
    seats.forEach((seat) => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row]?.push(seat);
    });
  }
  
  // Sort rows alphabetically or numerically
  const sortedRows = Object.keys(seatsByRow).sort();

  // Find the selected seat safely
  const selectedSeat = selectedSeatId && seats 
    ? seats.find((s) => s.id === selectedSeatId) 
    : null;

  const handleSeatSelect = useCallback((seatId: string | null) => {
    if (!seats) return;
    
    const seatToSelect = seatId 
      ? seats.find((s) => s.id === seatId) 
      : null;
    
    if (seatToSelect && !seatToSelect.isBooked) {
      setSelectedSeatId(seatToSelect.id);
      setSeatDetails(`Row ${seatToSelect.row}, Seat ${seatToSelect.number}`);
    } else {
      setSelectedSeatId(null);
      setSeatDetails("");
    }
  }, [seats]);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Seat selection section */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Your Seat</CardTitle>
            <CardDescription>
              Choose a seat from the available options below
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isLoadingSeats ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i}
                    className="h-12 animate-pulse rounded-md bg-muted"
                  ></div>
                ))}
              </div>
            ) : !seats || seats.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No seats available for this show.</p>
                <p className="mt-2 text-sm">Please select a different show time.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mx-auto mb-8 rounded-md bg-muted p-2 text-center text-sm">
                  SCREEN
                </div>
                
                {sortedRows.map((row) => (
                  <div key={row} className="flex flex-wrap items-center gap-3">
                    <div className="w-6 font-medium">
                      {row}
                    </div>
                    {seatsByRow[row]?.sort((a, b) => a.number - b.number).map((seat) => (
                      <button
                        key={seat.id}
                        className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors
                          ${seat.isBooked 
                            ? 'cursor-not-allowed bg-muted text-muted-foreground opacity-50' 
                            : seat.id === selectedSeatId
                              ? 'border-primary bg-primary text-primary-foreground' 
                              : 'hover:border-primary'}`}
                        onClick={() => !seat.isBooked && handleSeatSelect(seat.id)}
                        disabled={seat.isBooked}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                ))}
                
                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-primary"></div>
                    <span className="text-sm">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-muted opacity-50"></div>
                    <span className="text-sm">Booked</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Booking summary section */}
      <div>
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="aspect-[2/3] h-32 flex-shrink-0 overflow-hidden rounded-md relative">
                <Image 
                  src={show.movie.posterUrl ?? `https://via.placeholder.com/120x180?text=${encodeURIComponent(show.movie.title)}`}
                  alt={show.movie.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </div>
              
              <div>
                <h3 className="font-semibold">{show.movie.title}</h3>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                    <span>{formatTime(show.startTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <Film className="mr-1.5 h-3.5 w-3.5" />
                    <span>{show.screen.name}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1.5 h-3.5 w-3.5" />
                    <span>{show.theater.name}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm">Date:</span>
                <span className="font-medium">{formatDate(show.startTime)}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm">Selected seat:</span>
                <span className="font-medium">
                  {selectedSeat 
                    ? `${selectedSeat.row}-${selectedSeat.number}`
                    : "None"}
                </span>
              </div>
              {/* Display seat details here */}
              {seatDetails && (
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm">Seat details:</span>
                  <span className="font-medium">{seatDetails}</span>
                </div>
              )}
              {/* Display some analytics */}
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm">Available seats:</span>
                <span className="font-medium">
                  {seats?.length ? seats.length - bookedSeats : 0} / {seats?.length ?? 0}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ticket price:</span>
                <span>{formatCurrency(show.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Booking fee:</span>
                <span>{formatCurrency(2.00)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(show.price + 2.00)}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleBooking} 
              disabled={!selectedSeatId || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm and Pay"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
