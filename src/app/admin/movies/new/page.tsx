import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { MovieForm } from "~/components/admin/movies/movie-form";

export const metadata: Metadata = {
  title: "Add New Movie | Admin Dashboard",
  description: "Add a new movie to the system",
};

export default function NewMoviePage() {
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

      <h1 className="text-3xl font-bold">Add New Movie</h1>
      <MovieForm />
    </div>
  );
}
