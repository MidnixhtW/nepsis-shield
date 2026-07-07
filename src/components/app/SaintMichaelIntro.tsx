import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "nepsis-shield:st-michael-intro-seen:realistic-v1";
const MICHAEL_IMAGE = "/assets/archangel-michael-realistic.png";

export function SaintMichaelIntro() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.sessionStorage.getItem(INTRO_KEY)) return;

    setVisible(true);
    const leaveTimer = window.setTimeout(() => setLeaving(true), 3600);
    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_KEY, "true");
      setVisible(false);
    }, 4600);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  function skipIntro() {
    window.sessionStorage.setItem(INTRO_KEY, "true");
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 280);
  }

  if (!visible) return null;

  return (
    <div
      className={
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background text-foreground transition-opacity duration-500 " +
        (leaving ? "opacity-0" : "opacity-100")
      }
      role="dialog"
      aria-label="St. Michael intro"
      aria-modal="true"
    >
      <style>{`
        @keyframes michaelReveal {
          0% { opacity: 0; transform: translateY(18px) scale(1.08); filter: blur(7px) saturate(.9); }
          18% { opacity: 1; transform: translateY(0) scale(1.015); filter: blur(0) saturate(1.04); }
          68% { opacity: 1; transform: translateY(-4px) scale(1); filter: blur(0) saturate(1.06); }
          100% { opacity: 1; transform: translateY(-7px) scale(.985); filter: blur(0) saturate(1); }
        }
        @keyframes candleGlow {
          0%, 100% { opacity: .46; transform: scale(.94); }
          50% { opacity: .86; transform: scale(1.08); }
        }
        @keyframes haloBreath {
          0%, 100% { opacity: .42; transform: translate(-50%, -50%) scale(.94); }
          50% { opacity: .78; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes lightSweep {
          from { transform: translateX(-130%) rotate(14deg); opacity: 0; }
          22% { opacity: .38; }
          to { transform: translateX(130%) rotate(14deg); opacity: 0; }
        }
        @keyframes starDrift {
          from { transform: translate3d(-8vw, 1vh, 0); opacity: 0; }
          24% { opacity: .85; }
          to { transform: translate3d(20vw, -2vh, 0); opacity: 0; }
        }
        .michael-realistic { animation: michaelReveal 4.4s cubic-bezier(.2,.86,.2,1) both; }
        .michael-glow { animation: candleGlow 2.6s ease-in-out infinite; }
        .michael-halo-light { animation: haloBreath 2.8s ease-in-out infinite; }
        .michael-sweep { animation: lightSweep 3.9s ease-in-out .35s both; }
        .star-drift { animation: starDrift 3.2s ease-in-out infinite; }
      `}</style>

      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.24),transparent_28rem),radial-gradient(circle_at_50%_8%,hsl(42_92%_64%/.14),transparent_18rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.56))]" />
      <div aria-hidden className="absolute inset-0 opacity-30 field-grid" />
      <div aria-hidden className="michael-glow absolute left-1/2 top-1/2 h-[min(36rem,92vmin)] w-[min(36rem,92vmin)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/12 blur-3xl" />
      <div aria-hidden className="michael-halo-light absolute left-1/2 top-[39%] h-[min(24rem,62vmin)] w-[min(24rem,62vmin)] rounded-full border border-primary/25 bg-[radial-gradient(circle,hsl(var(--primary)/0.18),transparent_66%)]" />
      <div aria-hidden className="absolute inset-y-[-20%] left-1/2 w-20 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl michael-sweep" />

      <div aria-hidden className="absolute left-[12%] top-[22%] star-drift text-primary/45">
        <Sparkles className="h-6 w-6" />
      </div>
      <div aria-hidden className="absolute left-[28%] top-[68%] star-drift text-accent/45 [animation-delay:.7s]">
        <Sparkles className="h-4 w-4" />
      </div>
      <div aria-hidden className="absolute left-[58%] top-[16%] star-drift text-primary/35 [animation-delay:1.15s]">
        <Sparkles className="h-5 w-5" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-10 rounded-2xl bg-background/50 text-muted-foreground backdrop-blur hover:text-foreground sm:right-4 sm:top-[calc(env(safe-area-inset-top)+1rem)]"
        onClick={skipIntro}
      >
        <X className="mr-2 h-4 w-4" /> Skip
      </Button>

      <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+3.25rem)] text-center sm:gap-4 sm:px-6">
        <div className="michael-realistic relative h-[min(48dvh,30rem)] w-[min(78vw,24rem)] overflow-hidden rounded-[2rem] border border-primary/25 bg-card/50 shadow-2xl shadow-primary/15 max-[380px]:h-[min(42dvh,24rem)] sm:h-[min(56dvh,34rem)] sm:w-[min(72vw,27rem)]" aria-hidden>
          <img
            src={MICHAEL_IMAGE}
            alt=""
            className="h-full w-full scale-[1.02] object-cover object-center"
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0_36%,hsl(var(--background)/0.08)_62%,hsl(var(--background)/0.36)_100%)]" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/20" />
        </div>

        <div className="pointer-events-none w-full max-w-[34rem] rounded-3xl border border-border/60 bg-background/78 p-3 shadow-xl backdrop-blur-md sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs sm:tracking-[0.22em]">Holy Archangel Michael</p>
          <h1 className="mt-1 text-lg font-semibold leading-tight tracking-tight min-[360px]:text-xl sm:text-2xl">Defend us and pray to God for us.</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Entering Nepsis Shield</p>
        </div>
      </div>
    </div>
  );
}
