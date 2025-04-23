"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { formatCurrency, formatTime } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "~/components/ui/tabs";

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
    return <ShowTimesSkeleton />;
  }
  
  if (!shows || shows.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No shows available for this movie on the selected date.</p>
        <p className="mt-2 text-sm">Please select a different date or check back later.</p>
      </div>
    );
  }
  
  // Group shows by theater for better organization
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
          <div className="space-y-6">
            {Object.values(showsByTheater).map(({ theater, shows }) => (
              <div key={theater.id} className="overflow-hidden rounded-lg border">
                <div className="bg-muted/30 p-4">
                  <h3 className="text-lg font-medium">{theater.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{theater.location}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-3">
                    {shows.map((show) => (
                      <Link key={show.id} href={`/booking/${show.id}`}>
                        <Button 
                          variant="outline" 
                          className="flex flex-col hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <span className="text-base font-medium">{formatTime(show.startTime)}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ShowTimesSkeleton() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20" />
        ))}
      </div>
      
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <Skeleton className="h-16 w-full" />
            <div className="p-4">
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-14 w-24" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
