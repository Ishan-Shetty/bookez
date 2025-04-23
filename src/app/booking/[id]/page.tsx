import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import { BookingDetails } from "~/components/booking/booking-details";

interface BookingPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  try {
    const show = await api.show.getById({ id: params.id });
    
    return {
      title: show ? `Book Tickets: ${show.movie.title} | BookEZ` : "Book Tickets | BookEZ",
      description: "Select seats and complete your booking",
    };
  } catch (error) {
    return {
      title: "Book Tickets | BookEZ",
      description: "Select seats and complete your booking",
    };
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { id } = params;
  
  try {
    const show = await api.show.getById({ id });
    
    if (!show) {
      notFound();
    }
    
    return (
      <HydrateClient>
        <div className="container py-8">
          <BookingDetails showId={id} />
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
