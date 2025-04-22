import { notFound } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { TheaterDetail } from "~/components/theater/theater-detail";
import { ShowTimesList } from "~/components/show/show-times-list";

export interface TheaterPageProps {
  params: { id: string };
}

export default async function TheaterPage({ params }: TheaterPageProps) {
  const { id } = params;
  
  try {
    const theater = await api.theater.getById.query({ id });
    
    if (!theater) {
      notFound();
    }
    
    return (
      <HydrateClient>
        <div className="container py-8">
          <TheaterDetail theater={theater} />
          
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Upcoming Shows</h2>
            <ShowTimesList theaterId={id} />
          </div>
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
