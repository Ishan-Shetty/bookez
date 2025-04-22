import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { api } from "~/trpc/server";
import { MovieForm } from "~/components/admin/movies/movie-form";
import { Button } from "~/components/ui/button";

interface EditMoviePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditMoviePageProps): Promise<Metadata> {
  try {
    const movie = await api.movie.getById({ id: params.id });
    return {
      title: movie ? `Edit ${movie.title} | Admin Dashboard` : "Edit Movie | Admin Dashboard",
      description: "Edit movie details",
    };
  } catch (error) {
    console.log(error);
    return {
      title: "Edit Movie | Admin Dashboard",
      description: "Edit movie details",
    };
  }
}

export default async function EditMoviePage({ params }: EditMoviePageProps) {
  try {
    const movie = await api.movie.getById({ id: params.id });

    if (!movie) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/movies">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Movies
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Edit Movie: {movie.title}</h1>
        <MovieForm movie={movie} />
      </div>
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
}
