import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { BookingsList } from "~/components/admin/bookings/bookings-list";

export const metadata: Metadata = {
  title: "Manage Bookings | Admin Dashboard",
  description: "View and manage customer bookings",
};

export default async function AdminBookingsPage() {
  try {
    const bookings = await api.booking.getAll();
    
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <BookingsList bookings={bookings || []} />
      </div>
    );
  } catch (error) {
    console.error("Error loading bookings:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-destructive">Failed to load bookings. Please try again later.</p>
        </div>
      </div>
    );
  }
}
