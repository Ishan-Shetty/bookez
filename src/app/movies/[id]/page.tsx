import { notFound } from "next/navigation";
import { HydrateClient, api } from "~/trpc/server";
import { MovieDetail } from "~/components/movie/movie-detail";
import { ShowTimesList } from "~/components/show/show-times-list";

export interface MoviePageProps {
  params: { id: string };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = params;
  
  try {
    const movie = await api.movie.getById.query({ id });
    
    if (!movie) {
      notFound();
    }
    
    return (
      <HydrateClient>
        <div className="container py-8">
          <MovieDetail movie={movie} />
          
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Available Shows</h2>
            <ShowTimesList movieId={id} />
          </div>
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
