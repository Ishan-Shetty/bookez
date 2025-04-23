"use client";

import Image from "next/image";
import { Clock, Calendar, Star, Film } from "lucide-react";
import { ShowTimes } from "~/components/movie/show-times";
import { Badge } from "~/components/ui/badge";
import { formatDuration } from "~/lib/utils";
import type { MovieWithDetails } from "~/types";

type MovieDetailsProps = {
  movie: MovieWithDetails;
};

export function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Hero section with backdrop and basic info */}
      <div className="relative overflow-hidden rounded-xl bg-muted/30 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container flex flex-col gap-6 px-4 py-8 md:flex-row md:items-start md:py-12 lg:px-8">
          {/* Movie poster */}
          <div className="flex-shrink-0">
            <div className="overflow-hidden rounded-lg border-2 border-white/10 shadow-lg">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                width={240}
                height={360}
                className="h-auto w-full max-w-[240px] object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Movie information */}
          <div className="flex-1 space-y-4 text-white">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3">
              {movie.rating && (
                <Badge className="flex items-center gap-1 bg-yellow-500 px-2 py-1 text-black">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="font-medium">{movie.rating}/10</span>
                </Badge>
              )}
              
              {movie.duration && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
              )}
              
              {movie.releaseDate && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
              )}
              
              {movie.language && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Film className="h-3.5 w-3.5" />
                  <span>{movie.language}</span>
                </div>
              )}
            </div>
            
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: string) => (
                  <Badge key={genre} variant="outline" className="border-white/20 text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="pt-2">
              <h3 className="mb-1 text-lg font-semibold">About the movie</h3>
              <p className="text-sm leading-relaxed text-gray-200">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Show times section */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <ShowTimes movieId={movie.id} />
      </div>
      
      {/* Additional movie details */}
      {(movie.cast?.length > 0 || movie.director) && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-6">
            {movie.director && (
              <div>
                <h3 className="mb-2 text-xl font-semibold">Director</h3>
                <p>{movie.director}</p>
              </div>
            )}
            
            {movie.cast && movie.cast.length > 0 && (
              <div>
                <h3 className="mb-3 text-xl font-semibold">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor: string) => (
                    <Badge 
                      key={actor} 
                      variant="secondary" 
                      className="rounded-full px-3 py-1 text-sm font-normal"
                    >
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
