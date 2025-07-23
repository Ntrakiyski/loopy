// components/curve-select.tsx

'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Curve } from '@/player/Fade';

interface CurveSelectProps {
  label: string;
  value: Curve;
  onChange: (curve: Curve) => void;
}

export const CurveSelect = ({ label, value, onChange }: CurveSelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={label}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={label}>
          <SelectValue placeholder="Select curve" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="crossfade">Seamless Crossfade</SelectItem>
          <SelectItem value="linear">Linear</SelectItem>
          <SelectItem value="easeInExpo">Exponential In (Slow-Fast)</SelectItem>
          <SelectItem value="easeOutExpo">Exponential Out (Fast-Slow)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};