import { type Metadata } from "next";
import { api } from "~/trpc/server";
import { DashboardCard } from "~/components/admin/dashboard-card";
import { Icons } from "~/components/ui/icons";
import { RecentBookings } from "~/components/admin/recent-bookings";

export const metadata: Metadata = {
  title: "Admin Dashboard | BookEZ",
  description: "Movie ticket booking system admin dashboard",
};

export default async function AdminDashboardPage() {
  
  try {
    const movies = await api.movie.getAll();
    const theaters = await api.theater.getAll();
    
    // Fix the booking API call - use getAll or another existing endpoint
    const bookings = await api.booking.getAll(); // Assuming this is the correct method to get all bookings`
    
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Movies"
            value={movies?.length ?? 0}
            icon={<Icons.movie className="h-8 w-8" />}
            description="Movies in the database"
            linkHref="/admin/movies"
            linkText="View all movies"
          />
          
          <DashboardCard
            title="Total Theaters"
            value={theaters?.length ?? 0}
            icon={<Icons.theater className="h-8 w-8" />}
            description="Theaters in the database"
            linkHref="/admin/theaters"
            linkText="View all theaters"
          />
          
          <DashboardCard
            title="Recent Bookings"
            value={bookings ? bookings.length : 0}
            icon={<Icons.ticket className="h-8 w-8" />}
            description="Recent bookings"
            linkHref="/admin/bookings"
            linkText="View all bookings"
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Recent Bookings</h2>
          <RecentBookings bookings={bookings ?? []} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-destructive">Error loading dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }
}
