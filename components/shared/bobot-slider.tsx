// components/bobot-slider.tsx
import { Slider } from "@/components/shared/slider";

interface BobotSliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (val: number) => void;
}

export function BobotSlider({
  leftLabel,
  rightLabel,
  value,
  onChange,
}: BobotSliderProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex justify-between px-1 text-xs font-bold text-slate-800">
        <p>{leftLabel}</p>
        <p>{rightLabel}</p>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        max={100}
        step={1}
        className="w-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
