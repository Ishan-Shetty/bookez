import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { HydrateClient, api } from "~/trpc/server";
import { MovieDetails } from "~/components/movie/movie-details";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

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
          <div className="mb-6">
            <Link href="/movies">
              <Button variant="ghost" size="sm" className="pl-0">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Movies
              </Button>
            </Link>
          </div>
          
          <MovieDetails movie={movie} />
        </div>
      </HydrateClient>
    );
  } catch (error) {
    notFound();
  }
}
