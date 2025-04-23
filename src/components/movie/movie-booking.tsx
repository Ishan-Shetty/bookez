"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, InfoIcon } from "lucide-react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatCurrency, formatTime } from "~/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type MovieBookingProps = {
  movieId: string;
};

export function MovieBooking({ movieId }: MovieBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: shows, isLoading } = api.show.getFiltered.useQuery({
    movieId,
    date: selectedDate,
  });
  
  // Generate date options for the next 7 days
  const dateOptions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateOptions.push(date);
  }
  
  // Group shows by theater
  const showsByTheater: Record<string, typeof shows[number][]> = {};
  
  if (shows && shows.length > 0) {
    shows.forEach((show) => {
      const theaterId = show.theater.id;
      if (!showsByTheater[theaterId]) {
        showsByTheater[theaterId] = [];
      }
      showsByTheater[theaterId].push(show);
    });
  }

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Select Showtime</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5" />
          Available Showtimes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={format(selectedDate, "yyyy-MM-dd")} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-7 bg-muted/50">
            {dateOptions.map((date) => (
              <TabsTrigger 
                key={date.toISOString()} 
                value={format(date, "yyyy-MM-dd")}
                onClick={() => setSelectedDate(date)}
                className="flex flex-col py-2 text-center"
              >
                <span className="text-xs font-medium">{format(date, "EEE")}</span>
                <span className="text-sm">{format(date, "MMM d")}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={format(selectedDate, "yyyy-MM-dd")}>
            {!shows || shows.length === 0 ? (
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <InfoIcon className="mx-auto mb-2 h-5 w-5" />
                <h5 className="mb-1 font-medium">No shows available</h5>
                <p className="text-sm text-muted-foreground">
                  No showtimes available for this movie on the selected date.
                  Please select a different date or check back later.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(showsByTheater).map(([theaterId, theaterShows]) => (
                  <div key={theaterId} className="overflow-hidden rounded-lg border">
                    <div className="bg-muted/50 p-4">
                      <h3 className="text-lg font-medium">
                        {theaterShows[0]?.theater.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {theaterShows[0]?.theater.location}
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-3">
                        {theaterShows.map((show) => (
                          <Link key={show.id} href={`/booking/${show.id}`}>
                            <Button variant="outline" className="flex flex-col">
                              <span className="text-base font-medium">
                                {formatTime(show.startTime)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {show.screen.name} • {formatCurrency(show.price)}
                              </span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
