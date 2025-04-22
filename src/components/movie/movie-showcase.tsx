"use client";

import { api } from "~/trpc/react";
import { MovieCard } from "./movie-card";

export function MovieShowcase() {
  const { data: movies, isLoading } = api.movie.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[400px] animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return <div className="text-center">No movies available</div>;
  }

  // Display only the first 4 movies
  const displayMovies = movies.slice(0, 4);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {displayMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
