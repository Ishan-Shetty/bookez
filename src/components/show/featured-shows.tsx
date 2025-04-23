"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import Image from "next/image"; // Import Next.js Image component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function FeaturedShows() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  
  // Fix the query to always provide a valid object parameter
  const { data: shows, isLoading } = api.show.getAll.useQuery(
    { date: selectedDate ? new Date(selectedDate) : new Date() },
    { 
      refetchOnMount: true, 
      refetchOnWindowFocus: true,
      refetchInterval: 30000,
      refetchOnReconnect: true
    }
  );
  
  // Get the next 7 days for date selection
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: format(date, "yyyy-MM-dd"),
      label: i === 0 ? "Today" : format(date, "EEE, MMM d")
    };
  });
  
  const handleBookShow = (showId: string) => {
    router.push(`/booking/${showId}`);
  };
  
  // Update the title to reflect the selected date
  const getDateTitle = () => {
    if (selectedDate === format(new Date(), "yyyy-MM-dd")) {
      return "Shows Today";
    }
    const date = new Date(selectedDate);
    return `Shows for ${format(date, "EEEE, MMMM d")}`;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-[200px] animate-pulse rounded bg-muted"></div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Fix the condition to check for empty shows array
  if (!shows || shows.length === 0) {
    return (
      <div className="space-y-4">
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a date" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No shows available for this date.</p>
        </div>
      </div>
    );
  }
  
  // Get unique movies
  const uniqueMovies = Array.from(
    new Set(shows.map(show => show.movie.id))
  ).map(movieId => {
    return shows.find(show => show.movie.id === movieId)?.movie;
  }).filter(Boolean).slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">{getDateTitle()}</h2>
        <Select value={selectedDate} onValueChange={setSelectedDate}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a date" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Show a message when there are no shows for the selected date */}
      {shows.length === 0 && (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No shows available for this date.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
          >
            View today&apos;s shows
          </Button>
        </div>
      )}
      
      {/* Only render the grid when there are shows */}
      {shows.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {uniqueMovies.map(movie => {
            const movieShows = shows.filter(show => show.movie.id === movie?.id);
            return (
              <Card key={movie?.id} className="overflow-hidden">
                <div className="aspect-[16/9] relative overflow-hidden">
                  {movie?.posterUrl ? (
                    <Image
                      src={movie.posterUrl}
                      alt={movie?.title ?? 'Movie poster'}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={true}
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                      {movie?.title ?? "Movie Title"}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-semibold">{movie?.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {Math.floor((movie?.duration ?? 0) / 60)}h {(movie?.duration ?? 0) % 60}m
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Showtimes:</p>
                    <div className="flex flex-wrap gap-2">
                      {movieShows.slice(0, 3).map(show => (
                        <Button
                          key={show.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookShow(show.id)}
                          className="flex items-center"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {format(new Date(show.startTime), "h:mm a")}
                        </Button>
                      ))}
                    </div>
                    {movieShows.length > 3 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0"
                        onClick={() => router.push(`/movies/${movie?.id}`)}
                      >
                        View all times
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}