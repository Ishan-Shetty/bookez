"use client";

import { cn } from "~/lib/utils";

interface Seat {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
}

interface SeatLayoutProps {
  seats: Seat[];
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string) => void;
}

export function SeatLayout({ seats, selectedSeatId, onSeatSelect }: SeatLayoutProps) {
  // Group seats by row for better display
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();
  
  return (
    <div className="space-y-8">
      <div className="mx-auto mb-8 w-3/4 rounded-t-3xl bg-gray-300 p-2 text-center text-sm font-medium text-gray-800">
        SCREEN
      </div>
      
      <div className="space-y-3">
        {sortedRows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2 text-center">
            <div className="w-6 font-medium">{row}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {seatsByRow[row]
                .sort((a, b) => a.number - b.number)
                .map((seat) => (
                  <button
                    key={seat.id}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors",
                      seat.isBooked 
                        ? "cursor-not-allowed bg-gray-200 text-gray-400" 
                        : selectedSeatId === seat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-white hover:bg-gray-100"
                    )}
                    onClick={() => !seat.isBooked && onSeatSelect(seat.id)}
                    disabled={seat.isBooked}
                  >
                    {seat.number}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm bg-white border"></div>
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm bg-primary"></div>
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-sm bg-gray-200"></div>
          <span className="text-sm">Booked</span>
        </div>
      </div>
    </div>
  );
}
