"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, addDays, isSameDay } from "date-fns";
import { CalendarDays, Clock, MapPin, CreditCard } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatCurrency, formatTime } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import type { Show } from "~/types";

type ShowTimesProps = {
  movieId: string;
};

type GroupedShows = Record<string, {
  theater: {
    id: string;
    name: string;
    location: string;
  };
  shows: Show[];
}>;

export function ShowTimes({ movieId }: ShowTimesProps) {
  // Generate date options for the next 5 days starting from today
  const dateOptions = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 0; i < 5; i++) {
      dates.push(addDays(today, i));
    }
    
    return dates;
  }, []);
  
  const [selectedDate, setSelectedDate] = useState<Date>(dateOptions[0]);
  
  const { data: allShows, isLoading } = api.show.getFiltered.useQuery({
    movieId,
    date: selectedDate,
  });
  
  if (isLoading) {
    return <ShowTimesSkeleton />;
  }
  
  // Group shows by theater for better organization
  const showsByTheater = allShows?.reduce((acc: GroupedShows, show) => {
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
  }, {} as GroupedShows) ?? {};
  
  const hasShows = allShows && allShows.length > 0;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-background pt-2 pb-4">
        <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <CalendarDays className="h-5 w-5 text-primary" />
          Show Times
        </h3>
        
        <div className="flex overflow-x-auto pb-2">
          {dateOptions.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <Button
                key={date.toISOString()}
                variant={isSelected ? "default" : "outline"}
                className={`mr-2 min-w-[100px] flex-col rounded-full border px-4 py-2 ${
                  isSelected ? "" : "border-muted-foreground/20"
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs font-normal">{format(date, "EEE")}</span>
                <span className="text-base font-medium">{format(date, "d MMM")}</span>
                {isToday && (
                  <Badge variant="outline" className="mt-1 px-2 py-0 text-xs font-normal">
                    Today
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      <div className="pt-2">
        {hasShows ? (
          <div className="space-y-6">
            {Object.values(showsByTheater).map(({ theater, shows }) => (
              <Card key={theater.id} className="overflow-hidden border-muted-foreground/20">
                <div className="bg-muted/30 p-4">
                  <h3 className="text-lg font-semibold">{theater.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{theater.location}</span>
                  </div>
                </div>
                <CardContent className="p-4 pt-4">
                  <h4 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" /> 
                    Available Shows
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {shows.map((show) => (
                      <Link key={show.id} href={`/booking/${show.id}`} className="group">
                        <Button 
                          variant="outline" 
                          className="flex h-auto flex-col gap-1 border-muted-foreground/30 p-3 transition-all group-hover:border-primary group-hover:text-primary"
                        >
                          <span className="text-base font-medium">{formatTime(show.startTime)}</span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>{show.screen.name}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50"></span>
                            <span className="flex items-center gap-0.5">
                              <CreditCard className="h-3 w-3" />
                              {formatCurrency(show.price)}
                            </span>
                          </div>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-muted-foreground/20 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No shows available</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no shows scheduled for this movie on {format(selectedDate, "EEEE, MMMM d")}.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please select a different date or check back later.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function ShowTimesSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="flex gap-2 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-[100px]" />
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <Skeleton className="h-16 w-full" />
            <div className="p-4">
              <Skeleton className="mb-3 h-4 w-32" />
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 w-24" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
