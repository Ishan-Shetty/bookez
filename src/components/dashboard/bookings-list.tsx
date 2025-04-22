"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { formatDate, formatTime } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Table } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";


// Define proper types for Booking and related interfaces
interface Movie {
  title: string;
}

interface Theater {
  name: string;
}

interface Seat {
  row: string;
  number: number;
}

interface Show {
  movie: Movie;
  theater: Theater;
  startTime: Date;
}

interface Booking {
  id: string;
  show: Show;
  seat: Seat;
}

type BookingsListProps = {
  userId: string;
};

export function BookingsList({ userId }: BookingsListProps) {
  const { data: bookings, isLoading } = api.booking.getByUserId.useQuery({
    userId,
  });

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="mb-4 text-muted-foreground">No bookings found</p>
        <Link href="/movies">
          <Button>Book a Movie</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Movie</TableHead>
              <TableHead>Theater</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Seat</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking: Booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.show.movie.title}</TableCell>
                <TableCell>{booking.show.theater.name}</TableCell>
                <TableCell>{formatDate(booking.show.startTime)}</TableCell>
                <TableCell>{formatTime(booking.show.startTime)}</TableCell>
                <TableCell>
                  {booking.seat.row}-{booking.seat.number}
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/bookings/${booking.id}`}>
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
