"use client";

import { api } from "~/trpc/react";
import TRPCErrorBoundary from "./ErrorBoundary";

// Define proper type for show data from the API
interface ShowWithRelations {
  id: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  price: number;
  startTime: Date; // Note: DB schema uses startTime not showTime
  movie: {
    id: string;
    title: string;
  };
  theater: {
    id: string;
    name: string;
  };
  screen: {
    id: string;
    name: string;
  };
  bookings?: {
    id: string;
  }[];
}

export function AdminShowList() {
  const { data: shows, isLoading, error } = api.show.getAllForAdmin.useQuery(undefined, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  if (isLoading) return <p>Loading shows...</p>;
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-700 font-medium">Error loading shows</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }
  
  if (!shows || shows.length === 0) {
    return <p>No shows available.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theater</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screen</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Show Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shows.map((show: ShowWithRelations) => (
            <tr key={show.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{show.movie.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{show.theater.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{show.screen.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {new Date(show.startTime).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">${show.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {show.bookings?.length ?? 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {/* Add edit/delete buttons here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ShowManagement() {
  return (
    <TRPCErrorBoundary>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Show Management</h2>
        <AdminShowList />
      </div>
    </TRPCErrorBoundary>
  );
}
