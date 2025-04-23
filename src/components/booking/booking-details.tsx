"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ChevronLeft, Clock, Film, MapPin } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/lib/utils";
import { SeatLayout } from "./seat-layout";

interface BookingDetailsProps {
  showId: string;
}

export function BookingDetails({ showId }: BookingDetailsProps) {
  const router = useRouter();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  
  const { data: show, isLoading: showLoading } = api.show.getById.useQuery({ id: showId });
  const { data: seats, isLoading: seatsLoading } = api.seat.getByShowId.useQuery({ showId });
  
  const isLoading = showLoading || seatsLoading;
  
  const handleSeatSelect = (seatId: string) => {
    setSelectedSeatId(seatId === selectedSeatId ? null : seatId);
  };
  
  const handleBookTicket = () => {
    if (selectedSeatId) {
      // In a real application, you would create the booking here
      // For now, we'll just redirect to a success page
      router.push(`/booking/success?showId=${showId}&seatId=${selectedSeatId}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-60 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }
  
  if (!show) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">Show details not found.</p>
        <Link href="/movies" className="mt-4 inline-block">
          <Button>Browse Movies</Button>
        </Link>
      </div>
    );
  }
  
  const { movie, theater, screen, startTime, price } = show;
  
  return (
    <div className="space-y-8">
      <Link href={`/movies/${movie.id}`}>
        <Button variant="ghost" size="sm" className="pl-0">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Movie
        </Button>
      </Link>
      
      <div className="rounded-lg border">
        <div className="bg-primary p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold md:text-3xl">{movie.title}</h1>
        </div>
        
        <div className="p-6">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <Film className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{theater.name}</p>
                  <p className="text-sm text-muted-foreground">{screen.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">{theater.location}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{format(new Date(startTime), "EEEE, MMMM d")}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(startTime), "h:mm a")}
                  </p>
                </div>
              </div>
              
              <p className="font-medium">
                Ticket Price: {formatCurrency(price)}
              </p>
            </div>
          </div>
          
          <div className="mb-8 rounded-lg border p-4">
            <h2 className="mb-6 text-center text-xl font-semibold">Select Your Seat</h2>
            {seats && seats.length > 0 ? (
              <SeatLayout 
                seats={seats} 
                selectedSeatId={selectedSeatId} 
                onSeatSelect={handleSeatSelect} 
              />
            ) : (
              <p className="text-center text-muted-foreground">No seats available for this show.</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              size="lg" 
              disabled={!selectedSeatId} 
              onClick={handleBookTicket}
            >
              {selectedSeatId ? `Book Ticket (${formatCurrency(price)})` : "Select a seat to continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
