import { useEffect, useState } from "react";

// The reset's own pattern: in for 4, hold for 2, out for 6. The ring grows, rests and shrinks with it (transform only,
// so it stays smooth on any phone), and the word beneath says which part of the breath it is. With reduced motion the
// ring keeps still and the words alone lead.
const PHASES = [
  { word: "Breathe in", seconds: 4 },
  { word: "Hold", seconds: 2 },
  { word: "Breathe out", seconds: 6 },
] as const;

export function BreathingRing() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase((value) => (value + 1) % PHASES.length), PHASES[phase].seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <div className="grid place-items-center gap-3 py-4" aria-hidden>
      <div className="relative grid h-36 w-36 place-items-center">
        <span className="breath-ring absolute inset-0 rounded-full border-2 border-accent/60 bg-accent/10" />
        <span className="absolute inset-[38%] rounded-full bg-accent/40" />
      </div>
      <p className="text-base font-semibold">{PHASES[phase].word}</p>
    </div>
  );
}
