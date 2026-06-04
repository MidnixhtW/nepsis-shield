import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "nepsis-shield:st-michael-intro-seen";

export function SaintMichaelIntro() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || window.sessionStorage.getItem(INTRO_KEY)) return;

    setVisible(true);
    const leaveTimer = window.setTimeout(() => setLeaving(true), 3200);
    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_KEY, "true");
      setVisible(false);
    }, 4050);

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
        "fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-background text-foreground transition-opacity duration-300 " +
        (leaving ? "opacity-0" : "opacity-100")
      }
      role="dialog"
      aria-label="St. Michael intro"
      aria-modal="true"
    >
      <style>{`
        @keyframes michaelFlight {
          0% { transform: translate3d(-54vw, 18vh, 0) scale(.76) rotate(-8deg); opacity: 0; }
          16% { transform: translate3d(-8vw, 2vh, 0) scale(1) rotate(0deg); opacity: 1; }
          58% { transform: translate3d(0, 0, 0) scale(1.04) rotate(0deg); opacity: 1; }
          76% { transform: translate3d(12vw, -8vh, 0) scale(.94) rotate(8deg); opacity: 1; }
          100% { transform: translate3d(72vw, -42vh, 0) scale(.52) rotate(18deg); opacity: 0; }
        }
        @keyframes iconGlow {
          0%, 100% { filter: drop-shadow(0 1.8rem 2.5rem hsl(var(--primary)/0.22)); }
          50% { filter: drop-shadow(0 2rem 3.5rem hsl(var(--primary)/0.38)); }
        }
        @keyframes starDrift {
          from { transform: translateX(-8vw); opacity: 0; }
          25% { opacity: .9; }
          to { transform: translateX(22vw); opacity: 0; }
        }
        .michael-flight { animation: michaelFlight 4.05s cubic-bezier(.22, .9, .22, 1) forwards; }
        .michael-icon { animation: iconGlow 1.4s ease-in-out infinite; }
        .star-drift { animation: starDrift 2.8s ease-in-out infinite; }
      `}</style>

      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.18),transparent_28rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.55))]" />
      <div aria-hidden className="absolute inset-0 opacity-35 field-grid" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
      <div aria-hidden className="absolute left-[12%] top-[22%] star-drift text-primary/45">
        <Sparkles className="h-6 w-6" />
      </div>
      <div aria-hidden className="absolute left-[28%] top-[66%] star-drift text-accent/45 [animation-delay:.65s]">
        <Sparkles className="h-4 w-4" />
      </div>
      <div aria-hidden className="absolute left-[56%] top-[18%] star-drift text-primary/35 [animation-delay:1.1s]">
        <Sparkles className="h-5 w-5" />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-4 top-4 z-10 rounded-2xl text-muted-foreground hover:text-foreground"
        onClick={skipIntro}
      >
        <X className="mr-2 h-4 w-4" /> Skip
      </Button>

      <div className="relative grid place-items-center px-6 text-center">
        <div className="michael-flight relative h-[18rem] w-[18rem] sm:h-[24rem] sm:w-[24rem]" aria-hidden>
          <div className="absolute inset-4 rounded-full bg-primary/10 blur-3xl" />
          <img
            src="/assets/st-michael-icon-intro.png"
            alt=""
            className="michael-icon relative h-full w-full object-contain"
            draggable={false}
          />
        </div>

        <div className="pointer-events-none absolute top-[calc(50%+9.5rem)] w-[min(34rem,calc(100vw-2rem))] rounded-3xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur sm:top-[calc(50%+12rem)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Holy Archangel Michael</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Defend us and pray to God for us.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entering Nepsis Shield</p>
        </div>
      </div>
    </div>
  );
}
