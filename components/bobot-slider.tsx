import { Slider } from "@/components/slider";

export function BobotSlider() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between px-4 font-medium">
        <p>Kiri</p>
        <p>Kanan</p>
      </div>
      <Slider
        defaultValue={[75]}
        max={100}
        step={1}
        className="mx-auto w-full max-w-sm"
      />
    </div>
  );
}
