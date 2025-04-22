"use client";

import { useState } from "react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatCurrency, formatTime } from "~/lib/utils";

type Props = {
  movieId?: string;
  theaterId?: string;
};

export function ShowsList({ movieId, theaterId }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { data: shows, isLoading } = api.show.getFiltered.useQuery({
    movieId,
    theaterId,
    date: selectedDate,
  });

  const dateOptions = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dateOptions.push(date);
  }

  if (isLoading) {
    return <div className="animate-pulse rounded-lg bg-muted p-6">Loading shows...</div>;
  }

  if (!shows || shows.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="mb-4 text-muted-foreground">No shows available for the selected date.</p>
        <p className="text-sm">Try selecting another date or check back later.</p>
      </div>
    );
  }

  // Group shows by theater
  const showsByTheater: Record<string, typeof shows> = {};
  
  shows.forEach((show) => {
    const theaterId = show.theater.id;
    if (!showsByTheater[theaterId]) {
      showsByTheater[theaterId] = [];
    }
    showsByTheater[theaterId]!.push(show);
  });

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <CalendarDays className="mr-1 h-5 w-5 text-muted-foreground" />
        {dateOptions.map((date) => (
          <Button
            key={date.toISOString()}
            variant={
              selectedDate.toDateString() === date.toDateString()
                ? "default"
                : "outline"
            }
            size="sm"
            className="flex min-w-[100px] flex-col px-3"
            onClick={() => setSelectedDate(date)}
          >
            <span className="text-xs">
              {format(date, "EEE")}
            </span>
            <span>
              {format(date, "MMM d")}
            </span>
          </Button>
        ))}
      </div>

      <div className="space-y-8">
        {Object.entries(showsByTheater).map(([theaterId, theaterShows]) => (
          <div key={theaterId} className="rounded-lg border">
            <div className="border-b bg-muted/50 p-4">
              <h3 className="text-lg font-medium">
                {theaterShows[0]!.theater.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {theaterShows[0]!.theater.location}
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
    </div>
  );
}
