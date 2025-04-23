import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import { MovieDetails } from "~/components/movie/movie-details";
import { ShowTimes } from "~/components/movie/show-times";

interface MoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  try {
    const movie = await api.movie.getById({ id: params.id });
    
    return {
      title: movie ? `${movie.title} | BookEZ` : "Movie Details | BookEZ",
      description: movie?.description ?? "View movie details and book tickets",
    };
  } catch (error) {
    return {
      title: "Movie Details | BookEZ",
      description: "View movie details and book tickets",
    };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = params;
  
  try {
    const movie = await api.movie.getById({ id });
    
    if (!movie) {
      notFound();
    }
    
    return (
      <HydrateClient>
        <div className="container py-8">
          <MovieDetails movie={movie} />
          
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Show Times</h2>
            <ShowTimes movieId={id} />
          </div>
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
