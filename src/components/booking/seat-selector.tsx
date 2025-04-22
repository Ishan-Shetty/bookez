"use client";

import { type Seat } from "@prisma/client";
import { cn } from "~/lib/utils";

type SeatSelectorProps = {
  rows: number;
  columns: number;
  seats: Seat[];
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string | null) => void;
};

export function SeatSelector({
  rows,
  columns,
  seats,
  selectedSeatId,
  onSeatSelect,
}: SeatSelectorProps) {
  // Create a map of seat positions for easier lookup
  const seatMap: Record<string, Seat> = {};
  
  seats.forEach((seat) => {
    const key = `${seat.row}:${seat.number}`;
    seatMap[key] = seat;
  });

  const rowLabels = Array.from({ length: rows }, (_, i) => 
    String.fromCharCode(65 + i)
  );

  const handleSeatClick = (seat: Seat | undefined) => {
    if (!seat || seat.isBooked) return;
    
    if (selectedSeatId === seat.id) {
      onSeatSelect(null);
    } else {
      onSeatSelect(seat.id);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 w-full rounded-lg bg-gray-200 p-2 text-center text-sm font-medium text-gray-800">
        SCREEN
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        {rowLabels.map((rowLabel) => (
          <div key={rowLabel} className="flex items-center">
            <div className="mr-3 w-6 text-right font-medium">{rowLabel}</div>
            
            <div className="flex space-x-2">
              {Array.from({ length: columns }, (_, i) => {
                const seatNum = i + 1;
                const seatKey = `${rowLabel}:${seatNum}`;
                const seat = seatMap[seatKey];
                
                return (
                  <button
                    key={`${rowLabel}-${seatNum}`}
                    type="button"
                    disabled={seat?.isBooked}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded",
                      "transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                      {
                        "bg-primary text-primary-foreground hover:bg-primary/90": 
                          seat?.id === selectedSeatId,
                        "bg-muted text-muted-foreground hover:bg-muted/80": 
                          seat && !seat.isBooked && seat.id !== selectedSeatId,
                        "cursor-not-allowed bg-gray-300 text-gray-500": 
                          !seat || seat.isBooked,
                      }
                    )}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seatNum}
                  </button>
                );
              })}
            </div>
            
            <div className="ml-3 w-6 font-medium">{rowLabel}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-muted"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-gray-300"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-4 w-4 rounded bg-primary"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}
