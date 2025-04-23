"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import Image from "next/image"; // Add import for Next.js Image component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface ShowTimesListProps {
  theaterId?: string;
  movieId?: string;
}

interface ShowMovie {
  id: string;
  title: string;
  posterUrl?: string | null;
  duration: number;
}

interface ShowTheater {
  id: string;
  name: string;
}

interface ShowScreen {
  id: string;
  name: string;
}


export function ShowTimesList({ theaterId, movieId }: ShowTimesListProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Use refetchInterval to ensure shows are refreshed periodically
  const { data: shows, isLoading } = api.show.getAll.useQuery(
    { 
      theaterId,
      movieId,
      date: selectedDate 
    }, 
    { 
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: 30000 // Refetch every 30 seconds
    }
  );
  
  // Force a refetch when component mounts
  useEffect(() => {
    // Immediately trigger a router refresh when component mounts
    router.refresh();
  }, [router]);

  const handleBookShow = (showId: string) => {
    router.push(`/booking/${showId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No shows available for this date.</p>
        </div>
      </div>
    );
  }

  // Group shows by movie
  const showsByMovie = shows.reduce<Record<string, { movie: ShowMovie, times: Array<{ id: string, startTime: Date, price: number, theater: ShowTheater, screen: ShowScreen }> }>>((acc, show) => {
    const movieId = show.movie.id;
    if (!acc[movieId]) {
      acc[movieId] = {
        movie: show.movie,
        times: []
      };
    }
    acc[movieId].times.push({
      id: show.id,
      startTime: show.startTime,
      price: show.price,
      theater: show.theater,
      screen: show.screen
    });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-8">
        {Object.values(showsByMovie).map(({ movie, times }) => (
          <div key={movie.id} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-12 overflow-hidden rounded relative">
                {movie.posterUrl ? (
                  <Image 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    fill
                    sizes="48px"
                    className="object-cover" 
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 text-xs">
                    {movie.title.substring(0, 10)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {times.map((time) => (
                <div key={time.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(time.startTime), "h:mm a")}</span>
                  </div>
                  <div className="mb-3 text-sm text-muted-foreground">
                    {time.theater.name} • Screen {time.screen.name}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleBookShow(time.id)}
                  >
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
