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
import { Badge } from "../ui/badge";

// Define the expected booking shape based on your API response
interface Booking {
  id: string;
  bookingTime?: Date;
  show: {
    movie: { title: string };
    theater: { name: string };
    startTime: Date;
    price: number;
  };
  payment?: {
    status: string;
  };
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Movie</TableHead>
            <TableHead>Theater</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No recent bookings
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {booking.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{booking.show.movie.title}</TableCell>
                <TableCell>{booking.show.theater.name}</TableCell>
                <TableCell>
                  {formatDate(booking.show.startTime)}
                  <br />
                  <span className="text-xs text-muted-foreground">
                    {formatTime(booking.show.startTime)}
                  </span>
                </TableCell>
                <TableCell>{formatCurrency(booking.show.price)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.payment?.status === "COMPLETED"
                        ? "success"
                        : booking.payment?.status === "PENDING"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {booking.payment?.status ?? "UNKNOWN"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
