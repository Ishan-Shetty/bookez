"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { TheaterCard } from "./theater-card";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";

export function TheaterList() {
  const { data: theaters, isLoading } = api.theater.getAll.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[180px] animate-pulse rounded-lg bg-muted"></div>
        ))}
      </div>
    );
  }

  if (!theaters || theaters.length === 0) {
    return <p className="text-center text-muted-foreground">No theaters available.</p>;
  }

  const filteredTheaters = theaters.filter(theater => 
    theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theater.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          placeholder="Search theaters by name or location..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredTheaters.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">
          No theaters found matching &quot;{searchQuery}&quot;
        </p>
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
