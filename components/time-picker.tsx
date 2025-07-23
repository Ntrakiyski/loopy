// components/time-picker.tsx

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimePickerProps {
  label: string;
  valueMs: number;
  onChange: (valueMs: number) => void;
}

// Utility to convert MM:SS.ms string to milliseconds
const timeStringToMs = (timeStr: string): number | null => {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return null;

  const secondsAndMs = parts[1].split('.');
  const minutes = Number(parts[0]);
  const seconds = Number(secondsAndMs[0]);
  const milliseconds = secondsAndMs.length > 1 ? Number(secondsAndMs[1].padEnd(3, '0').slice(0, 3)) : 0;

  if (isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds) || seconds >= 60) {
    return null;
  }

  return (minutes * 60 * 1000) + (seconds * 1000) + milliseconds;
};

// Utility to convert milliseconds to MM:SS.ms string
const msToTimeString = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
};

export const TimePicker = ({ label, valueMs, onChange }: TimePickerProps) => {
  const [displayValue, setDisplayValue] = useState(msToTimeString(valueMs));
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // Update display value if the prop changes from outside, but only if the user is not currently typing something invalid
    if (isValid) {
      setDisplayValue(msToTimeString(valueMs));
    }
  }, [valueMs, isValid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayValue = e.target.value;
    setDisplayValue(newDisplayValue);

    const parsedMs = timeStringToMs(newDisplayValue);
    if (parsedMs !== null) {
      setIsValid(true);
      onChange(parsedMs);
    } else {
      setIsValid(false);
    }
  };

  const handleBlur = () => {
    // On blur, reformat to the canonical MM:SS.ms format to ensure consistency
    setDisplayValue(msToTimeString(valueMs));
    setIsValid(true);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={!isValid ? 'border-red-500 focus-visible:ring-red-500' : ''}
        placeholder="MM:SS.ms"
      />
    </div>
  );
};