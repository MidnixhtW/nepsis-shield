import * as Slider from "@radix-ui/react-slider";

export function ReaderFontSizeSlider({ value, onChange, label = "Bible font size" }: { value: number; onChange: (value: number) => void; label?: string }) {
  return (
    <Slider.Root value={[value]} min={14} max={22} step={1} onValueChange={([next]) => onChange(next)} className="relative flex w-full touch-none select-none items-center py-2">
      <Slider.Track className="relative h-2 w-full grow rounded-full bg-secondary">
        <Slider.Range className="absolute h-full rounded-full bg-primary" />
      </Slider.Track>
      <Slider.Thumb aria-label={label} aria-valuetext={`${value} pixels`} className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
    </Slider.Root>
  );
}
