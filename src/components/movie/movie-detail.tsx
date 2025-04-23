"use client";

import { Calendar } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { ShowTimesList } from "~/components/show/show-times-list";
import Image from "next/image";

interface MovieDetailProps {
  movie: {
    id: string;
    title: string;
    posterUrl?: string | null;
    duration: number;
    description?: string | null;
    releaseDate?: Date | null;
  };
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const { id, title, posterUrl, duration, description, releaseDate } = movie;
  
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;
  const formattedDuration = 
    `${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes}min`;

  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-lg shadow-md md:mx-0">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            width={300}
            height={450}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-[450px] w-[300px] items-center justify-center bg-gray-200 text-gray-500">
            {title}
          </div>
        )}
      </div>
      
      <div>
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h1>
        
        <div className="mb-6 flex flex-wrap gap-4 text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            {releaseDate ? formatDate(releaseDate) : "Release date not specified"}
          </div>
          <div className="flex items-center">
            <span className="mr-1">⏱️</span> {formattedDuration}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Synopsis</h2>
          <p className="text-muted-foreground">{description ?? "No description available."}</p>
        </div>
        
        <div>
          <h2 className="mb-4 text-xl font-semibold">Available Showtimes</h2>
          <div className="mt-4">
            <ShowTimesList movieId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
