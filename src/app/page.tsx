"use client";  

import Link from "next/link";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bookez - Movie Ticket Booking</title>
        <meta
          name="description"
          content="Book your movie tickets easily with Bookez. Browse movies, get exclusive offers, and enjoy a seamless booking experience."
        />
      </Head>

     
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white p-6">
          <h1 className="text-5xl font-bold mb-6">Book Your Movie Tickets</h1>
          <p className="text-lg mb-8 text-gray-300 max-w-lg text-center">
            Experience the best movies with seamless booking and exclusive offers.
          </p>
          <div className="flex gap-4">
            <Link
              href="/movies"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all"
              aria-label="Browse available movies"
            >
              Browse Movies
            </Link>
            <button
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white text-lg font-semibold rounded-lg transition-all"
              onClick={() => signIn("google")}
            >
              Login
            </button>
          </div>
        </main>
  
    </>
  );
}
