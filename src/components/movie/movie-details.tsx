"use client";

import { type Movie } from "@prisma/client";
import { Clock, Calendar } from "lucide-react";
import { formatDate } from "~/lib/utils";
import Image from "next/image";

interface MovieDetailsProps {
  movie: Movie;
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const { title, description, posterUrl, duration, releaseDate } = movie;
  
  // Format duration to hours and minutes
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const formattedDuration = `${hours > 0 ? `${hours}h ` : ''}${minutes}min`;

  return (
    <div className="grid gap-8 md:grid-cols-12">
      {/* Movie poster */}
      <div className="md:col-span-4 lg:col-span-3">
        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg relative">
          <Image 
            src={posterUrl ?? `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </div>
      </div>

      {/* Movie details */}
      <div className="md:col-span-8 lg:col-span-9">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h1>
        
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {releaseDate && (
            <div className="flex items-center">
              <Calendar className="mr-1.5 h-4 w-4" />
              <span>{formatDate(releaseDate)}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>{formattedDuration}</span>
          </div>
        </div>
        
        {description && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
