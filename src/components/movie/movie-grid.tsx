"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { MovieCard } from "./movie-card";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";

export function MovieGrid() {
  const { data: movies, isLoading } = api.movie.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[360px] animate-pulse rounded-lg bg-muted"></div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return <p className="text-center text-muted-foreground">No movies available.</p>;
  }

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (movie.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search movies..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredMovies.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">
          No movies found matching &quot;{searchQuery}&quot;
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
