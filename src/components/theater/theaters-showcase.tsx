"use client";

import { api } from "~/trpc/react";
import { TheaterCard } from "./theater-card";

type TheatersListProps = {
  limit?: number;
}

export function TheatersList({ limit }: TheatersListProps) {
  const { data: theaters, isLoading } = api.theater.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit || 3 }).map((_, i) => (
          <div key={i} className="h-[180px] animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (!theaters || theaters.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <p className="text-muted-foreground">No theaters available</p>
      </div>
    );
  }

  const displayTheaters = limit ? theaters.slice(0, limit) : theaters;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayTheaters.map((theater) => (
        <TheaterCard key={theater.id} theater={theater} />
      ))}
    </div>
  );
}
