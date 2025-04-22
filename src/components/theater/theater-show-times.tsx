"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatCurrency, formatTime } from "~/lib/utils";
import { type RouterOutputs } from "~/trpc/react";

// Define types based on actual API response structure
type Show = RouterOutputs["show"]["getFiltered"][number];
type Movie = Show["movie"];

type ShowTimesProps = {
  theaterId: string;
};

export function ShowTimes({ theaterId }: ShowTimesProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const { data: shows, isLoading } = api.show.getFiltered.useQuery({
    theaterId,
    date: selectedDate,
  });
  
  // Generate date options for the next 7 days
  const dateOptions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateOptions.push(date);
  }
  
  if (isLoading) {
    return <div className="animate-pulse h-48 rounded-lg bg-gray-100"></div>;
  }
  
  if (!shows || shows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-muted-foreground">No shows available at this theater on the selected date.</p>
        <p className="mt-2 text-sm">Please select a different date or check back later.</p>
      </div>
    );
  }
  
  // Group shows by movie
  const showsByMovie = shows.reduce<Record<string, { movie: Movie; shows: Show[] }>>((acc, show) => {
    if (!acc[show.movieId]) {
      acc[show.movieId] = {
        movie: show.movie,
        shows: [],
      };
    }
    acc[show.movieId]!.shows.push(show);
    return acc;
  }, {});
  
  return (
    <div>
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <CalendarDays className="text-muted-foreground h-5 w-5" />
        {dateOptions.map((date) => (
          <Button
            key={date.toISOString()}
            variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
            size="sm"
            className="flex min-w-[100px] flex-col"
            onClick={() => setSelectedDate(date)}
          >
            <span className="text-xs">{format(date, "EEE")}</span>
            <span>{format(date, "MMM d")}</span>
          </Button>
        ))}
      </div>
      
      <div className="space-y-8">
        {Object.values(showsByMovie).map(({ movie, shows }) => (
          <div key={movie.id} className="grid grid-cols-1 gap-4 md:grid-cols-[100px_1fr] overflow-hidden rounded-lg border border-gray-200">
            <div className="hidden h-[150px] relative md:block">
              {movie.posterUrl ? (
                <Image 
                  src={movie.posterUrl as string}
                  alt={movie.title}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-center text-xs text-gray-500 p-2">
                  {movie.title}
                </div>
              )}
            </div>
            <div>
              <div className="bg-gray-50 p-4">
                <Link href={`/movies/${movie.id}`}>
                  <h3 className="text-lg font-medium hover:text-purple-700 hover:underline">{movie.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}min
                </p>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-3">
                  {shows.map((show) => (
                    <Link key={show.id} href={`/booking/${show.id}`}>
                      <Button variant="outline" className="flex flex-col">
                        <span className="text-sm font-medium">{formatTime(show.startTime)}</span>
                        <span className="text-xs text-muted-foreground">
                          {show.screen.name} · {formatCurrency(Number(show.price ?? 10.00))}
                        </span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
