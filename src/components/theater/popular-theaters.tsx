"use client";

import { api } from "~/trpc/react";
import { TheaterCard } from "./theater-card";

export function PopularTheaters() {
  const { data: theaters, isLoading } = api.theater.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-lg bg-gray-200"></div>
        ))}
      </div>
    );
  }

  if (!theaters || theaters.length === 0) {
    return <div className="text-center">No theaters available</div>;
  }

  // Display only the first 3 theaters
  const displayTheaters = theaters.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayTheaters.map((theater) => (
        <TheaterCard key={theater.id} theater={theater} />
      ))}
    </div>
  );
}
