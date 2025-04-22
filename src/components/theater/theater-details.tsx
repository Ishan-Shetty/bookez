"use client";

import { type Theater } from "@prisma/client";
import { MapPin } from "lucide-react";
import { api } from "~/trpc/react";

type TheaterDetailsProps = {
  theater: Theater;
};

export function TheaterDetails({ theater }: TheaterDetailsProps) {
  const { id, name, location } = theater;
  const { data: screens } = api.screen.getByTheaterId.useQuery({ theaterId: id });

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">{name}</h1>
      
      <div className="mb-8 flex items-center text-muted-foreground">
        <MapPin className="mr-2 h-5 w-5" />
        <span>{location}</span>
      </div>
      
      {screens && screens.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Available Screens</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {screens.map((screen) => (
              <div key={screen.id} className="rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium">{screen.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {screen.rows} rows × {screen.columns} columns
                </p>
                <p className="text-sm text-muted-foreground">
                  {screen.rows * screen.columns} seats total
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
