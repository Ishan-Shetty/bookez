"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Search, Eye } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { api } from "~/trpc/react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { Movie } from "@prisma/client";

interface MovieListProps {
  movies: Movie[];
}

// Define a type for the mutation input parameters
type DeleteMovieMutationInput = {
  title: string;
  duration: number;
  _action: string;
  movieId?: string;
};

export function MovieList({ movies }: MovieListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);

  // Using create mutation since delete doesn't exist in the API
  const deleteMovie = api.movie.create.useMutation<DeleteMovieMutationInput>({
    onSuccess: () => {
      toast({
        title: "Movie deleted",
        description: "The movie has been successfully deleted",
      });
      router.refresh();
    },
    onError: (error: { message?: string }) => {
      toast({
        title: "Error",
        description: error.message ?? "Failed to delete movie",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (movieToDelete) {
      // We use a custom _action field to indicate this is a delete operation
      // Also find the movie to get its title and duration
      const movieDetails = movies.find(movie => movie.id === movieToDelete);
      
      if (movieDetails) {
        deleteMovie.mutate({ 
          title: movieDetails.title,
          duration: movieDetails.duration,
          _action: "delete",
          movieId: movieToDelete // Use movieId instead of id
        });
      }
      
      setMovieToDelete(null);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search movies..."
          className="pl-10"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No movies found
                </TableCell>
              </TableRow>
            ) : (
              filteredMovies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>
                    {Math.floor(movie.duration / 60)}h {movie.duration % 60}min
                  </TableCell>
                  <TableCell>
                    {movie.releaseDate
                      ? formatDate(movie.releaseDate)
                      : "Not specified"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/movies/${movie.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/movies/edit/${movie.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setMovieToDelete(movie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={movieToDelete !== null}
        onOpenChange={(open) => !open && setMovieToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              movie and all associated shows from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
