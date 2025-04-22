import { type Seat } from "./seat";
import { type Show } from "./show";
import { type Payment } from "./payment";

export interface Booking {
  id: string;
  userId: string;
  showId: string;
  seatId: string;
  paymentId: string;
  bookingTime: Date;
  show: Show;
  seat: Seat;
  payment: Payment;
}

export interface Show {
  id: string;
  startTime: Date;
  price: number;
  movie: {
    id: string;
    title: string;
    duration: number;
    posterUrl?: string | null;
  };
  theater: {
    id: string;
    name: string;
    location: string;
  };
  screen: {
    id: string;
    name: string;
  };
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
}
