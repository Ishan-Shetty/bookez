"use client";

import { cn } from "~/lib/utils";

export type Seat = {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
  screenId: string;
};

interface SeatSelectorProps {
  rows: number;
  columns: number;
  seats: Seat[];
  selectedSeatId: string | null;
  onSeatSelect: (seatId: string | null) => void;
}

export function SeatSelector({
  rows,
  columns,
  seats,
  selectedSeatId,
  onSeatSelect,
}: SeatSelectorProps) {
  const renderSeats = () => {
    const seatMap = [];
    
    // Create a map for easier lookup
    const seatLookup = seats.reduce<Record<string, Seat>>((acc, seat) => {
      acc[`${seat.row}-${seat.number}`] = seat;
      return acc;
    }, {});
    
    // Generate row labels (A, B, C, etc.)
    const rowLabels = Array.from({ length: rows }, (_, i) => 
      String.fromCharCode(65 + i)
    );
    
    for (let r = 0; r < rows; r++) {
      const row = [];
      const rowLabel = rowLabels[r];
      
      // Add row label at the beginning
      row.push(
        <div 
          key={`row-label-${r}`} 
          className="flex h-8 w-8 items-center justify-center font-medium text-muted-foreground"
        >
          {rowLabel}
        </div>
      );
      
      for (let c = 1; c <= columns; c++) {
        const seatKey = `${rowLabel}-${c}`;
        const seat = seatLookup[seatKey];
        
        if (!seat) {
          // If seat doesn't exist in the database, render an empty space
          row.push(
            <div 
              key={`empty-${r}-${c}`} 
              className="m-1 h-8 w-8"
            />
          );
          continue;
        }
        
        const isSelected = selectedSeatId === seat.id;
        const isBooked = seat.isBooked;
        
        row.push(
          <button 
            key={seat.id}
            disabled={isBooked}
            onClick={() => onSeatSelect(isSelected ? null : seat.id)}
            className={cn(
              "m-1 flex h-8 w-8 items-center justify-center rounded text-sm transition-colors",
              isBooked 
                ? "cursor-not-allowed bg-gray-300 text-gray-500" 
                : isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-white hover:bg-primary/20 border border-gray-300"
            )}
            aria-label={`Seat ${rowLabel}${c}`}
            title={isBooked ? "This seat is already booked" : `Seat ${rowLabel}${c}`}
          >
            {c}
          </button>
        );
      }
      
      seatMap.push(
        <div key={`row-${r}`} className="mb-2 flex">
          {row}
        </div>
      );
    }
    
    return seatMap;
  };

  return (
    <div>
      <div className="mb-8 rounded-lg border p-4">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-8 w-full max-w-md rounded-lg bg-gray-200 p-2 text-center text-sm font-medium">
            Screen
          </div>
          
          <div className="mb-4 flex flex-wrap justify-center">
            {renderSeats()}
          </div>
        </div>
        
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded border border-gray-300 bg-white"></div>
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
    </div>
  );
}
