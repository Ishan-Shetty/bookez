import { notFound, redirect } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { BookingForm } from "~/components/booking/booking-form";
import { getServerAuthSession } from "~/server/auth";

interface BookingPageProps {
  params: {
    showId: string;
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { showId } = params;
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect(`/auth/signin?redirect=/booking/${showId}`);
  }

  try {
    const show = await api.show.getById.query({ id: showId });
    
    if (!show) {
      notFound();
    }
    
    return (
      <HydrateClient>
        <div className="container py-8">
          <h1 className="mb-8 text-3xl font-bold">Book Tickets</h1>
          <BookingForm show={show} userId={session.user.id} />
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
