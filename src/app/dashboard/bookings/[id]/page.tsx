import { notFound, redirect } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { BookingDetails } from "~/components/dashboard/booking-details";

interface BookingDetailsPageProps {
  params: { id: string };
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = params;
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect(`/auth/signin?callbackUrl=/dashboard/bookings/${id}`);
  }
  
  try {
    const booking = await api.booking.getById.query({ id });
    
    if (!booking) {
      notFound();
    }
    
    // Verify the booking belongs to this user or the user is an admin
    if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
      notFound();
    }
    
    return (
      <HydrateClient>
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Booking Details</h1>
          <BookingDetails booking={booking} />
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
