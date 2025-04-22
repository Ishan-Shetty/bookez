"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Theater } from "@prisma/client";

interface TheaterSelectorProps {
  theaters: Theater[];
  selectedTheaterId?: string | null;
}

export function TheaterSelector({ theaters, selectedTheaterId }: TheaterSelectorProps) {
  const router = useRouter();

  const handleTheaterChange = (theaterId: string) => {
    router.push(`/admin/screens?theaterId=${theaterId}`);
  };

  return (
    <Select value={selectedTheaterId ?? ""} onValueChange={handleTheaterChange}>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select a theater" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Theaters</SelectLabel>
          {theaters.map((theater) => (
            <SelectItem key={theater.id} value={theater.id}>
              {theater.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
