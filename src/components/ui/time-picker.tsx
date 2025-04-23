"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { Input } from "./input";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function TimePickerDemo({ 
  value = "12:00", 
  onChange,
  disabled = false 
}: TimePickerProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="time"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}
