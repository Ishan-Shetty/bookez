"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "~/trpc/react";
import { MovieCard } from "./movie-card";
import { Button } from "~/components/ui/button";

export function FeaturedMovies() {
  const { data: movies, isLoading } = api.movie.getAll.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  const showNext = () => {
    if (!movies || movies.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const showPrev = () => {
    if (!movies || movies.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!movies || movies.length <= 1) return;
    
    const timer = setInterval(() => {
      showNext();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [movies]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[400px] animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return <div className="text-center">No movies available</div>;
  }

  // Show up to 3 movies at a time in a carousel
  const visibleMovies = [];
  for (let i = 0; i < Math.min(3, movies.length); i++) {
    const index = (currentIndex + i) % movies.length;
    visibleMovies.push(movies[index]);
  }

  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleMovies.map((movie) => (
          <div key={movie.id} className="transition-all duration-300">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      
      {movies.length > 3 && (
        <>
          <button
            onClick={showPrev}
            className="absolute -left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
            aria-label="Previous movies"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={showNext}
            className="absolute -right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
            aria-label="Next movies"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
