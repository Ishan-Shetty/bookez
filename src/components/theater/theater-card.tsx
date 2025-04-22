"use client";

import { type Theater } from "@prisma/client";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "../ui/button";

type TheaterCardProps = {
  theater: Theater;
};

export function TheaterCard({ theater }: TheaterCardProps) {
  const { id, name, location } = theater;

  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-2 flex items-start text-muted-foreground">
          <MapPin className="mr-1 mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{location}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4 pt-2">
        <Link href={`/theaters/${id}`} className="w-full">
          <Button variant="default" className="w-full">
            View Shows
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
