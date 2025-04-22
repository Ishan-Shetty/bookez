import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { MovieCarousel } from "~/components/movie/movie-carousel";
import { TheatersList } from "~/components/theater/theaters-showcase";

export default function HomePage() {
  return (
    <HydrateClient>
      <div className="container py-6 md:py-10">
        {/* Hero Section */}
        <section className="relative mb-12 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 px-6 py-12 text-white shadow-lg md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Book Your Perfect Movie Experience
            </h1>
            <p className="mb-6 text-lg text-gray-100">
              Find the latest movies and book tickets for your favorite theaters with ease
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/movies">
                <Button size="lg" className="min-w-[140px] bg-white text-purple-700 hover:bg-gray-100">
                  Browse Movies
                </Button>
              </Link>
              <Link href="/theaters">
                <Button variant="outline" size="lg" className="min-w-[140px] border-white text-white hover:bg-white/10">
                  Find Theaters
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Movies Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">
            Popular Movies
          </h2>
          <MovieCarousel />
        </section>

        {/* Popular Theaters Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Theaters Near You</h2>
            <Link href="/theaters" className="text-purple-600 hover:underline">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <TheatersList limit={3} />
        </section>

        {/* How It Works Section */}
        <section className="rounded-xl bg-gray-50 p-8">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">How It Works</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Browse Movies</h3>
              <p className="text-muted-foreground">
                Explore our collection of latest and upcoming movies
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Select Seats</h3>
              <p className="text-muted-foreground">
                Choose your preferred seats from our interactive seating plan
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Enjoy the Show</h3>
              <p className="text-muted-foreground">
                Get instant confirmation and enjoy your movie experience
              </p>
            </div>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
