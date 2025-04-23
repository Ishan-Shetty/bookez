"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Home } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const showId = searchParams.get("showId");
  const seatId = searchParams.get("seatId");
  
  const { data: show, isLoading: showLoading } = api.show.getById.useQuery(
    { id: showId! },
    { enabled: !!showId }
  );
  
  const { data: seat, isLoading: seatLoading } = api.seat.getById.useQuery(
    { id: seatId! },
    { enabled: !!seatId }
  );
  
  useEffect(() => {
    if (!showId || !seatId) {
      router.push("/movies");
    }
  }, [showId, seatId, router]);
  
  const isLoading = showLoading || seatLoading;
  
  if (isLoading) {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-8">
        <div className="h-20 w-full animate-pulse rounded-lg bg-muted max-w-md" />
      </div>
    );
  }
  
  if (!show || !seat) {
    return (
      <div className="container py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Booking Details Not Found</h1>
        <Link href="/movies">
          <Button>Browse Movies</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-8">
      <div className="w-full max-w-md rounded-lg border p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        
        <h1 className="mb-2 text-2xl font-bold">Booking Confirmed!</h1>
        <p className="mb-6 text-muted-foreground">
          Your ticket for {show.movie.title} has been booked successfully.
        </p>
        
        <div className="mb-8 rounded-lg bg-muted p-4 text-left">
          <p className="mb-1"><strong>Movie:</strong> {show.movie.title}</p>
          <p className="mb-1"><strong>Theater:</strong> {show.theater.name}</p>
          <p className="mb-1"><strong>Screen:</strong> {show.screen.name}</p>
          <p className="mb-1"><strong>Date & Time:</strong> {new Date(show.startTime).toLocaleString()}</p>
          <p className="mb-1"><strong>Seat:</strong> {seat.row}-{seat.number}</p>
        </div>
        
        <div className="space-x-4">
          <Link href="/dashboard/bookings">
            <Button variant="outline">View My Bookings</Button>
          </Link>
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
