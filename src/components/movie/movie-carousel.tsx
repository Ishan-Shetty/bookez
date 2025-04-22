"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "~/trpc/react";
import { MovieCard } from "./movie-card";
import { Button } from "~/components/ui/button";

export function MovieCarousel() {
  const { data: movies, isLoading } = api.movie.getAll.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  const showNext = () => {
    if (!movies || movies.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const showPrev = () => {
    if (!movies || movies.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  // Auto advance slides
  useEffect(() => {
    if (!movies || movies.length <= 3) return;
    const interval = setInterval(showNext, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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

  // Calculate how many movies to show based on screen size
  const moviesPerPage = 4;
  const currentMovies = [];

  for (let i = 0; i < moviesPerPage; i++) {
    if (movies.length <= i) break;
    const index = (currentIndex + i) % movies.length;
    currentMovies.push(movies[index]);
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentMovies.map((movie) => (
          <div key={movie.id} className="transition-all duration-300">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      
      {movies.length > moviesPerPage && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-gray-100"
            onClick={showPrev}
            aria-label="Previous movies"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-gray-100"
            onClick={showNext}
            aria-label="Next movies"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}
