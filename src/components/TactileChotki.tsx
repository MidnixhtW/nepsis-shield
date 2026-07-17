import { useEffect, useState } from "react";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const totalBeads = 12;

export default function TactileChotki() {
  const [count, setCount] = useState(0);
  const [beadIndex, setBeadIndex] = useState(0);
  const [target, setTarget] = useState(33);

  const triggerHaptic = async (style: "light" | "heavy") => {
    try {
      if (style === "light") {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
    } catch {
      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate(style === "light" ? 15 : 150);
      }
    }
  };

  const handlePullKnot = () => {
    setCount((prev) => prev + 1);
    setBeadIndex((prev) => (prev + 1) % totalBeads);
    triggerHaptic("light");
  };

  useEffect(() => {
    if (count > 0 && count % target === 0) {
      triggerHaptic("heavy");
    }
  }, [count, target]);

  return (
    <div className="candlelight-card mx-auto max-w-sm rounded-3xl border p-6 text-center backdrop-blur-md">
      <h3 className="font-serif text-xl font-semibold tracking-wide text-primary">
        Sacred Watchfulness
      </h3>
      <p className="mt-1 text-xs italic text-muted-foreground">"Lord Jesus Christ, have mercy on me."</p>

      <div className="my-5 flex justify-center space-x-2">
        {[33, 50, 100].map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
              target === t
                ? "gold-foil border-primary/50 text-primary-foreground"
                : "border-primary/15 text-muted-foreground hover:border-primary/35 hover:text-primary"
            }`}
          >
            {t} Knots
          </button>
        ))}
      </div>

      <div className="relative mx-auto my-6 flex h-56 w-56 items-center justify-center">
        <div className="absolute h-52 w-52 rounded-full bg-amber-500/10 blur-3xl" />
        <button
          onClick={handlePullKnot}
          className="absolute flex h-36 w-36 flex-col items-center justify-center rounded-full border border-primary/25 bg-gradient-to-br from-card via-background to-slate-950 shadow-inner transition-transform active:scale-95 focus:outline-none"
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Knots</span>
          <span className="font-serif text-4xl font-bold text-primary">{count}</span>
          <span className="mt-1 text-[9px] text-muted-foreground">Goal: {target}</span>
        </button>

        {Array.from({ length: totalBeads }).map((_, i) => {
          const angle = (i * 360) / totalBeads;
          const isActive = i === beadIndex;
          return (
            <div
              key={i}
              className="absolute h-4 w-4 rounded-full transition-all duration-300"
              style={{
                transform: `rotate(${angle}deg) translate(92px) rotate(-${angle}deg)`,
                background: isActive
                  ? "linear-gradient(135deg, #fde68a, #d97706 48%, #78350f)"
                  : "linear-gradient(135deg, #44403c, #1c1917)",
                boxShadow: isActive ? "0 0 16px rgba(217, 119, 6, 0.75)" : "none",
                border: "1px solid rgba(251, 191, 36, 0.25)",
              }}
            />
          );
        })}
      </div>

      <button
        onClick={() => {
          setCount(0);
          setBeadIndex(0);
        }}
        className="text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        Reset Prayer Rope
      </button>
    </div>
  );
}
