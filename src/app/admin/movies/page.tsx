import { type Metadata } from "next";
import Link from "next/link";
import { api } from "~/trpc/server";
import { MovieList } from "~/components/admin/movies/movie-list";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Manage Movies | Admin Dashboard",
  description: "Add, edit and delete movies in the system",
};

export default async function AdminMoviesPage() {
  // Fix the API call to use the correct method
  const movies = await api.movie.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Link href="/admin/movies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
        </Link>
      </div>

      <MovieList movies={movies || []} />
    </div>
  );
}
