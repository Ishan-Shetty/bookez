"use client";

import Link from "next/link";
import { formatDate, formatTime, formatCurrency } from "~/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface Payment {
  status: string;
}

interface Booking {
  id: string;
  bookingTime: Date;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
  show: {
    movie: { 
      title: string;
    };
    theater: {
      name: string;
    };
    startTime: Date;
    price: number;
  };
  payment?: Payment;
  seat: {
    row: string;
    number: number;
  };
}

interface BookingsListProps {
  bookings: Booking[];
}

export function BookingsList({ bookings }: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Movie</TableHead>
              <TableHead>Theater</TableHead>
              <TableHead>Show Time</TableHead>
              <TableHead>Seat</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {booking.user?.name || "N/A"}
                  {booking.user?.email && (
                    <div className="text-xs text-muted-foreground">
                      {booking.user.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>{booking.show.movie.title}</TableCell>
                <TableCell>{booking.show.theater.name}</TableCell>
                <TableCell>
                  {formatDate(booking.show.startTime)}
                  <div className="text-xs text-muted-foreground">
                    {formatTime(booking.show.startTime)}
                  </div>
                </TableCell>
                <TableCell>
                  {booking.seat.row}-{booking.seat.number}
                </TableCell>
                <TableCell>{formatCurrency(booking.show.price)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.payment?.status === "COMPLETED"
                        ? "success"
                        : booking.payment?.status === "PENDING"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {booking.payment?.status ?? "UNKNOWN"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
