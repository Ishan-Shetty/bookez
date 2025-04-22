"use client";

import { type Movie } from "@prisma/client";
import { Clock, Calendar } from "lucide-react";
import { formatDate } from "~/lib/utils";

type MovieDetailsProps = {
  movie: Movie;
};

export function MovieDetails({ movie }: MovieDetailsProps) {
  const { title, posterUrl, duration, description, releaseDate } = movie;
  
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;
  const formattedDuration = 
    `${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes}min`;

  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-lg shadow-md">
        <img
          src={posterUrl ?? `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h1>
        
        <div className="mb-6 flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            <span>{formattedDuration}</span>
          </div>
          
          {releaseDate && (
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span>Released: {formatDate(releaseDate)}</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="mb-3 text-xl font-semibold">Synopsis</h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            {description || "No description available for this movie."}
          </p>
        </div>
      </div>
    </div>
  );
}
