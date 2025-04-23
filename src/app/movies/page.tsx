"use client";

import { api } from "~/trpc/react";
import Link from "next/link";
import Image from "next/image";

export default function MoviesPage() {
  const { data: movies, isLoading } = api.movie.getAll.useQuery();
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Movies</h1>
        <div className="text-center">
          <div className="animate-pulse">Loading movies...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movies</h1>
        {/* Removed the "Add New Movie" button that was here */}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies?.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {movie.posterUrl ? (
                <div className="relative h-64 w-full">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-64 w-full flex items-center justify-center">
                  <p className="text-gray-500">No poster</p>
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-1">{movie.title}</h2>
                <p className="text-sm text-gray-600">{movie.duration} minutes</p>
              </div>
            </div>
          </Link>
        ))}
        
        {movies?.length === 0 && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No movies found. Add your first movie!</p>
          </div>
        )}
      </div>
    </div>
  );
}
