"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatCurrency, formatTime } from "~/lib/utils";

type ShowTimesProps = {
  movieId: string;
};

export function ShowTimes({ movieId }: ShowTimesProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
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
  
  if (isLoading) {
    return <div className="animate-pulse h-48 rounded-lg bg-gray-100"></div>;
  }
  
  if (!shows || shows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-6 text-center">
        <p className="text-muted-foreground">No shows available for this movie on the selected date.</p>
        <p className="mt-2 text-sm">Please select a different date or check back later.</p>
      </div>
    );
  }
  
  // Group shows by theater
  const showsByTheater = shows.reduce((acc, show) => {
    if (!acc[show.theaterId]) {
      acc[show.theaterId] = {
        theater: {
          id: show.theater.id,
          name: show.theater.name,
          location: show.theater.location,
        },
        shows: [],
      };
    }
    acc[show.theaterId]!.shows.push(show);
    return acc;
  }, {} as Record<string, { theater: { id: string; name: string; location: string }; shows: typeof shows }>);
  
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
      
      <div className="space-y-6">
        {Object.values(showsByTheater).map(({ theater, shows }) => (
          <div key={theater.id} className="overflow-hidden rounded-lg border border-gray-200">
            <div className="bg-gray-50 p-4">
              <h3 className="text-lg font-medium">{theater.name}</h3>
              <p className="text-sm text-muted-foreground">{theater.location}</p>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-3">
                {shows.map((show) => (
                  <Link key={show.id} href={`/booking/${show.id}`}>
                    <Button variant="outline" className="flex flex-col">
                      <span className="text-sm font-medium">{formatTime(show.startTime)}</span>
                      <span className="text-xs text-muted-foreground">
                        {show.screen.name} · {formatCurrency(show.price)}
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
