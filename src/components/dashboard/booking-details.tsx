import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, TicketIcon, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatCurrency, formatDate, formatTime } from "~/lib/format";

// Define proper types for the Booking and related interfaces
interface Movie {
  title: string;
  duration: number;
  posterUrl?: string | null;
}

interface Theater {
  name: string;
  location: string;
}

interface Screen {
  name: string;
}

interface Seat {
  row: string;
  number: number;
  isBooked: boolean;
}

interface Payment {
  amount: number;
  status: string;
  paymentMethod: string;
}

interface Show {
  movie: Movie;
  theater: Theater;
  screen: Screen;
  startTime: Date;
  price: number;
}

interface Booking {
  id: string;
  show: Show;
  seat: Seat;
  payment: Payment;
}

interface BookingDetailsProps {
  booking: Booking;
}

export function BookingDetails({ booking }: BookingDetailsProps) {
  const show = booking.show;
  const seat = booking.seat;
  const payment = booking.payment;
  const movie = show.movie;
  const theater = show.theater;
  const startTime = show.startTime;
  const price = show.price;

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center">
            <TicketIcon className="mr-2 h-5 w-5" />
            Movie Ticket
          </CardTitle>
          <p className="text-sm opacity-90">Booking #{booking.id.substring(0, 8)}</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p className="text-muted-foreground">Duration: {movie.duration} minutes</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p>{formatDate(startTime)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time</p>
                  <p>{formatTime(startTime)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Theater</p>
                  <p>{theater.name}</p>
                  <p className="text-sm text-muted-foreground">{theater.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Seat</p>
                  <p>
                    Row {seat.row}, Seat {seat.number}
                  </p>
                  <p className="text-sm text-muted-foreground">Screen: {show.screen.name}</p>
                </div>
              </div>
              
              <div className="rounded-md bg-muted p-4">
                <p className="mb-2 text-sm font-medium">Payment Information</p>
                <div className="flex items-center justify-between">
                  <span>Ticket Price</span>
                  <span>{formatCurrency(price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Booking Fee</span>
                  <span>{formatCurrency(2.00)}</span>
                </div>
                <div className="my-2 border-t border-border"></div>
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Payment Method: {payment.paymentMethod} • Status: {payment.status}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          Need to contact support about this booking?
        </p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  );
}
