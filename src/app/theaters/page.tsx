import { HydrateClient } from "~/trpc/server";
import { TheatersList } from "~/components/theater/theaters-list";

export default function TheatersPage() {
  return (
    <HydrateClient>
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Theaters</h1>
        <TheatersList />
      </div>
    </HydrateClient>
  );
}
