import { useEffect, useState } from "react";
import { Shield, Sparkles, Sword, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

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
        @keyframes wingBeatLeft {
          0%, 100% { transform: rotate(-24deg) skewY(10deg) scaleY(1); }
          50% { transform: rotate(-39deg) skewY(12deg) scaleY(.9); }
        }
        @keyframes wingBeatRight {
          0%, 100% { transform: rotate(24deg) skewY(-10deg) scaleY(1); }
          50% { transform: rotate(39deg) skewY(-12deg) scaleY(.9); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: .58; transform: scale(1); }
          50% { opacity: .95; transform: scale(1.08); }
        }
        @keyframes starDrift {
          from { transform: translateX(-8vw); opacity: 0; }
          25% { opacity: .9; }
          to { transform: translateX(22vw); opacity: 0; }
        }
        .michael-flight { animation: michaelFlight 4.05s cubic-bezier(.22, .9, .22, 1) forwards; }
        .wing-left { transform-origin: 100% 65%; animation: wingBeatLeft .72s ease-in-out infinite; }
        .wing-right { transform-origin: 0% 65%; animation: wingBeatRight .72s ease-in-out infinite; }
        .halo-pulse { animation: haloPulse 1.35s ease-in-out infinite; }
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
        <div className="michael-flight relative h-64 w-64 sm:h-80 sm:w-80" aria-hidden>
          <div className="halo-pulse absolute left-1/2 top-9 h-28 w-28 -translate-x-1/2 rounded-full border border-primary/50 bg-primary/10 shadow-[0_0_70px_hsl(var(--primary)/0.32)] sm:top-12 sm:h-36 sm:w-36" />

          <div className="wing-left absolute left-4 top-20 h-32 w-28 rounded-[80%_18%_80%_20%] border border-primary/35 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent shadow-lg sm:left-7 sm:top-24 sm:h-40 sm:w-36" />
          <div className="wing-right absolute right-4 top-20 h-32 w-28 rounded-[18%_80%_20%_80%] border border-primary/35 bg-gradient-to-bl from-primary/25 via-primary/10 to-transparent shadow-lg sm:right-7 sm:top-24 sm:h-40 sm:w-36" />

          <div className="absolute left-1/2 top-14 grid h-40 w-32 -translate-x-1/2 place-items-center rounded-[45%_45%_38%_38%] border border-primary/45 bg-background/80 shadow-2xl backdrop-blur sm:top-16 sm:h-52 sm:w-40">
            <div className="absolute -top-5 h-12 w-12 rounded-full border border-primary/45 bg-primary/10 shadow-[0_0_32px_hsl(var(--primary)/0.34)]" />
            <Shield className="absolute top-10 h-20 w-20 text-primary/85 sm:top-14 sm:h-24 sm:w-24" />
            <OrthodoxCrossIcon className="absolute top-[4.55rem] h-10 w-10 text-primary sm:top-[5.7rem] sm:h-12 sm:w-12" />
          </div>

          <Sword className="absolute left-9 top-36 h-24 w-24 -rotate-45 text-accent drop-shadow sm:left-12 sm:top-44 sm:h-32 sm:w-32" />
        </div>

        <div className="pointer-events-none absolute top-[calc(50%+9.5rem)] w-[min(34rem,calc(100vw-2rem))] rounded-3xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur sm:top-[calc(50%+11rem)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Holy Archangel Michael</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Defend us and pray to God for us.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entering Nepsis Shield</p>
        </div>
      </div>
    </div>
  );
}
