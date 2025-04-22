"use client";

import { type Movie } from "@prisma/client";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { formatTime } from "~/lib/utils";
import { Button } from "../ui/button";

type MovieCardProps = {
  movie: Movie;
  showViewDetails?: boolean;
};

export function MovieCard({ movie, showViewDetails = true }: MovieCardProps) {
  const { id, title, posterUrl, duration, description } = movie;
  
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;
  const formattedDuration = 
    `${durationHours > 0 ? `${durationHours}h ` : ''}${durationMinutes}min`;

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md">
      <Link href={`/movies/${id}`} className="block">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={posterUrl ?? `https://via.placeholder.com/300x450?text=${encodeURIComponent(title)}`}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/movies/${id}`}>
          <h3 className="line-clamp-1 text-xl font-bold hover:text-purple-700">{title}</h3>
        </Link>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>{formattedDuration}</span>
        </div>
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
      {showViewDetails && (
        <CardFooter className="border-t p-4 pt-2">
          <Link href={`/movies/${id}`} className="w-full">
            <Button variant="default" className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
