import { HydrateClient } from "~/trpc/server";
import { MoviesGrid } from "~/components/movie/movies-grid";

export default function MoviesPage() {
  return (
    <HydrateClient>
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Movies</h1>
        <MoviesGrid />
      </div>
    </HydrateClient>
  );
}
