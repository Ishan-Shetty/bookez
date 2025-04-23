"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { api } from "~/trpc/react";
import { MovieCard } from "./movie-card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function MoviesGrid() {
  const { data: movies, isLoading } = api.movie.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-[400px] animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No movies available</p>
      </div>
    );
  }

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (movie.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort the movies
  if (sortOrder === "title-asc") {
    filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === "title-desc") {
    filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortOrder === "duration-asc") {
    filteredMovies.sort((a, b) => a.duration - b.duration);
  } else if (sortOrder === "duration-desc") {
    filteredMovies.sort((a, b) => b.duration - a.duration);
  } else if (sortOrder === "newest") {
    filteredMovies.sort((a, b) => {
      if (!a.releaseDate) return 1;
      if (!b.releaseDate) return -1;
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex w-full items-center sm:w-[200px]">
          <Filter className="mr-2 h-5 w-5 text-muted-foreground" />
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Release Date (Newest)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
              <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">
            No movies found matching &quot;{searchQuery}&quot;
          </p>
        </div>
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
