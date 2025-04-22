"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { api } from "~/trpc/react";
import { TheaterCard } from "./theater-card";
import { Input } from "~/components/ui/input";

export function TheatersList() {
  const { data: theaters, isLoading } = api.theater.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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

  const filteredTheaters = theaters.filter(theater => 
    theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theater.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search theaters by name or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredTheaters.length === 0 ? (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">No theaters found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredTheaters.map((theater) => (
            <TheaterCard key={theater.id} theater={theater} />
          ))}
        </div>
      )}
    </div>
  );
}
