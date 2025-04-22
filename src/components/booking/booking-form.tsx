"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Show } from "@prisma/client";
import { api } from "~/trpc/react";
import { formatCurrency, formatDate, formatTime } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { SeatSelector } from "./seat-selector";
import { useToast } from "~/hooks/use-toast";
import { useSession } from "next-auth/react";

type BookingFormProps = {
  show: Show & {
    movie: { title: string; duration: number };
    theater: { name: string; location: string };
    screen: { id: string; name: string; rows: number; columns: number };
  };
  userId: string;
};

export function BookingForm({ show, userId }: BookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useSession();
  const [selectedSeatId, setSelectedSeatId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { data: seats, isLoading: isLoadingSeats } = api.seat.getByScreenId.useQuery({
    screenId: show.screen.id
  });

  const createPayment = api.payment.create.useMutation({
    onSuccess: (payment) => {
      if (selectedSeatId) {
        createBooking.mutate({
          userId,
          showId: show.id,
          seatId: selectedSeatId,
          paymentId: payment.id,
        });
      }
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: error.message || "There was a problem processing your payment",
        variant: "destructive",
      });
    }
  });

  const createBooking = api.booking.create.useMutation({
    onSuccess: (booking) => {
      setIsProcessing(false);
      
      // Mark the seat as booked
      api.seat.updateBookingStatus.mutate({
        id: booking.seatId,
        isBooked: true
      });
      
      toast({
        title: "Booking successful!",
        description: "Your ticket has been booked successfully.",
      });
      
      router.push(`/dashboard/bookings/${booking.id}`);
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Booking failed",
        description: error.message || "There was a problem creating your booking",
        variant: "destructive",
      });
    }
  });

  const handleBooking = () => {
    // Check authentication status before proceeding
    if (status !== "authenticated") {
      toast({
        title: "Authentication required",
        description: "Please sign in to book tickets",
        variant: "destructive",
      });
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/booking/${show.id}`)}`);
      return;
    }

    if (!selectedSeatId) {
      toast({
        title: "No seat selected",
        description: "Please select a seat to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // First create a payment record
    createPayment.mutate({
      userId,
      amount: show.price,
      method: "CARD",  // Default method
      status: "COMPLETED", // Simulate completed payment
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_350px]">
      <div>
        <div className="mb-6 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Movie Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Movie:</span> {show.movie.title}
            </p>
            <p>
              <span className="font-semibold">Theater:</span> {show.theater.name}
            </p>
            <p>
              <span className="font-semibold">Screen:</span> {show.screen.name}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formatDate(show.startTime)}
            </p>
            <p>
              <span className="font-semibold">Time:</span> {formatTime(show.startTime)}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Select Your Seat</h2>
          {isLoadingSeats ? (
            <div className="animate-pulse rounded-lg bg-muted p-10 text-center">
              Loading seats...
            </div>
          ) : (
            <SeatSelector 
              rows={show.screen.rows} 
              columns={show.screen.columns}
              seats={seats || []}
              selectedSeatId={selectedSeatId}
              onSeatSelect={setSelectedSeatId}
            />
          )}
        </div>
      </div>

      <div>
        <div className="sticky top-8 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Booking Summary</h2>
          
          <div className="mb-6 space-y-4">
            <div className="flex justify-between">
              <span>Ticket Price</span>
              <span>{formatCurrency(show.price)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(show.price)}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleBooking}
            disabled={!selectedSeatId || isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Confirm & Pay"}
          </Button>
          
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By confirming, you agree to our terms and cancellation policy.
          </p>
        </div>
      </div>
    </div>
  );
}
