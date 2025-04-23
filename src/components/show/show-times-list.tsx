"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {  Clock, MapPin, Ticket } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Image from "next/image"; // Add import for Next.js Image component
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency, formatTime } from "~/lib/utils";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";


interface ShowTimesListProps {
  theaterId?: string;
  movieId?: string;
}



export function ShowTimesList({ theaterId, movieId }: ShowTimesListProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Use refetchInterval to ensure shows are refreshed periodically
  // Modified to not filter by date, so all shows are fetched
  const { data: shows, isLoading } = api.show.getFiltered.useQuery(
    { 
      theaterId,
      movieId,
      // Remove date filter to show all available shows
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

  // Get the next 7 days for date selection
  const dateOptions = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dateOptions.push(date);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 animate-pulse rounded bg-muted"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border bg-muted/50"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!shows || shows.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {dateOptions.map((date) => (
            <Button
              key={date.toISOString()}
              variant={selectedDate && date.toDateString() === selectedDate.toDateString() ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDate(date)}
              className="min-w-24 flex-col items-center py-2"
            >
              <span className="text-xs font-medium">{format(date, "EEE")}</span>
              <span className="text-sm">{format(date, "MMM d")}</span>
            </Button>
          ))}
        </div>
        
        <Alert>
          <AlertDescription className="flex flex-col items-center justify-center py-6 text-center">
            <Ticket className="mb-2 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">No showtimes available</p>
            <p className="text-sm text-muted-foreground">
              No shows available for this movie. Please check back later.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group shows by theater and date for better organization
  const showsByTheaterAndDate = shows.reduce<Record<string, Record<string, typeof shows>>>((acc, show) => {
    const theaterId = show.theater.id;
    const showDate = new Date(show.startTime).toDateString();
    
    if (!acc[theaterId]) {
      acc[theaterId] = {};
    }
    if (!acc[theaterId][showDate]) {
      acc[theaterId][showDate] = [];
    }
    acc[theaterId][showDate].push(show);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {dateOptions.map((date) => (
          <Button
            key={date.toISOString()}
            variant={selectedDate && date.toDateString() === selectedDate.toDateString() ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDate(date)}
            className="min-w-24 flex-col items-center py-2"
          >
            <span className="text-xs font-medium">{format(date, "EEE")}</span>
            <span className="text-sm">{format(date, "MMM d")}</span>
          </Button>
        ))}
      </div>
      
      <div className="space-y-6">
        {Object.entries(showsByTheaterAndDate).map(([theaterId, dateShows]) => (
          <Card key={theaterId} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3 pt-4">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    {Object.values(dateShows)[0]![0]!.theater.name}
                    <p className="text-xs font-normal text-muted-foreground">
                      {Object.values(dateShows)[0]![0]!.theater.location}
                    </p>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {Object.entries(dateShows).map(([dateString, shows]) => (
                <div key={dateString} className="mb-6 last:mb-0">
                  <h3 className="mb-3 text-sm font-medium">
                    {format(new Date(dateString), "EEEE, MMMM d")}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {shows.map((show) => (
                      <div 
                        key={show.id}
                        className="flex flex-col rounded-lg border p-3 transition-colors hover:border-primary hover:bg-accent/50"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{formatTime(show.startTime)}</span>
                          </div>
                          <Badge variant="outline">{show.screen.name}</Badge>
                        </div>
                        <div className="mb-3 text-xs text-muted-foreground">
                          {format(new Date(show.startTime), "EEEE, MMMM d")}
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-medium">{formatCurrency(show.price)}</span>
                          <Button 
                            size="sm"
                            onClick={() => handleBookShow(show.id)}
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
