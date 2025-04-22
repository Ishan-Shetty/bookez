import { notFound, redirect } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { BookingDetails } from "~/components/dashboard/booking-details";
import { TRPCError } from "@trpc/server";

interface BookingDetailsPageProps {
  params: { id: string };
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  const { id } = params;
  
  // Try to get the session, with error handling for JWT issues
  let session;
  try {
    session = await getServerAuthSession();
  } catch (error) {
    console.error("Authentication error:", error);
    // If we have a JWT error, clear any cookies and redirect to sign in
    const callbackUrl = encodeURIComponent(`/dashboard/bookings/${id}`);
    redirect(`/auth/signin?callbackUrl=${callbackUrl}&error=session`);
  }
  
  if (!session) {
    const callbackUrl = encodeURIComponent(`/dashboard/bookings/${id}`);
    redirect(`/auth/signin?callbackUrl=${callbackUrl}`);
  }
  
  try {
    // Call the procedure directly without .query and include necessary relations
    const booking = await api.booking.getById({ 
      id,
      includeRelations: true // Add parameter to include all required relations
    });
    
    if (!booking) {
      notFound();
    }
    
    // Verify the booking belongs to this user or the user is an admin
    if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
      // If unauthorized, redirect to dashboard instead of showing 404
      redirect("/dashboard");
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
    console.error("Failed to fetch booking:", error instanceof Error ? error.message : String(error));
    
    // Check for specific error types and handle accordingly
    if (error instanceof TRPCError) {
      if (error.code === "NOT_FOUND") {
        notFound();
      } else if (error.code === "UNAUTHORIZED" || error.code === "FORBIDDEN") {
        // If there's an auth issue with the API call, redirect to sign in
        const callbackUrl = encodeURIComponent(`/dashboard/bookings/${id}`);
        redirect(`/auth/signin?callbackUrl=${callbackUrl}&error=permission`);
      }
    }
    
    // For other errors, show notFound page
    notFound();
  }
}
