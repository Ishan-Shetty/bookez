"use client";

import { type Theater } from "@prisma/client";
import { MapPin } from "lucide-react";
import { api } from "~/trpc/react";

type TheaterDetailProps = {
  theater: Theater;
};

export function TheaterDetail({ theater }: TheaterDetailProps) {
  const { id, name, location } = theater;
  const { data: screens } = api.screen.getByTheaterId.useQuery({ theaterId: id });

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold md:text-4xl">{name}</h1>
      
      <div className="mb-6 flex items-center text-muted-foreground">
        <MapPin className="mr-2 h-5 w-5" />
        <span>{location}</span>
      </div>
      
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Screens</h2>
        
        {!screens || screens.length === 0 ? (
          <div className="rounded-lg border p-6 text-center">
            <p className="text-muted-foreground">No screens available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {screens.map((screen) => (
              <div key={screen.id} className="rounded-lg border p-4">
                <h3 className="font-medium">{screen.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {screen.rows} rows × {screen.columns} columns
                </p>
                <p className="text-sm text-muted-foreground">
                  {screen.rows * screen.columns} seats
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
