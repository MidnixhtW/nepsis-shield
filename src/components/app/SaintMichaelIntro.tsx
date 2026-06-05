import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "nepsis-shield:st-michael-intro-seen:animated-v2";

function AnimatedSaintMichael() {
  return (
    <svg
      viewBox="0 0 360 360"
      className="michael-icon relative h-full w-full overflow-visible"
      role="img"
      aria-label="Animated icon of St. Michael raising a sword with wings"
    >
      <defs>
        <radialGradient id="michaelHalo" cx="50%" cy="43%" r="46%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.52)" />
          <stop offset="56%" stopColor="hsl(var(--primary) / 0.12)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
        </radialGradient>
        <linearGradient id="wingGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff4bf" />
          <stop offset="48%" stopColor="#d8a93a" />
          <stop offset="100%" stopColor="#8f5f18" />
        </linearGradient>
        <linearGradient id="robeBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#355c9e" />
          <stop offset="100%" stopColor="#172341" />
        </linearGradient>
        <linearGradient id="cloakRed" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#b3402f" />
          <stop offset="100%" stopColor="#5d1b18" />
        </linearGradient>
        <linearGradient id="swordSteel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#cfd7df" />
          <stop offset="100%" stopColor="#7e8994" />
        </linearGradient>
      </defs>

      <circle className="michael-halo" cx="180" cy="165" r="150" fill="url(#michaelHalo)" />
      <circle cx="180" cy="133" r="52" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="5" />
      <circle cx="180" cy="133" r="42" fill="none" stroke="hsl(var(--primary) / 0.22)" strokeWidth="2" />

      <g className="michael-wing michael-wing-left">
        <path
          d="M157 144C93 65 32 77 21 179c35-38 70-43 116-17-49-7-88 9-119 52 51-20 89-16 122 13-40-4-70 10-89 39 46-17 86-12 122 15 8-46 4-91-16-137Z"
          fill="url(#wingGold)"
          stroke="hsl(var(--primary) / 0.38)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M132 155C88 130 55 137 30 178M136 189c-46-11-82 1-109 31M139 224c-36-4-65 8-86 36"
          fill="none"
          stroke="hsl(var(--background) / 0.62)"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>

      <g className="michael-wing michael-wing-right">
        <path
          d="M203 144c64-79 125-67 136 35-35-38-70-43-116-17 49-7 88 9 119 52-51-20-89-16-122 13 40-4 70 10 89 39-46-17-86-12-122 15-8-46-4-91 16-137Z"
          fill="url(#wingGold)"
          stroke="hsl(var(--primary) / 0.38)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M228 155c44-25 77-18 102 23M224 189c46-11 82 1 109 31M221 224c36-4 65 8 86 36"
          fill="none"
          stroke="hsl(var(--background) / 0.62)"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>

      <g className="michael-cloak">
        <path
          d="M151 172c-35 33-51 73-50 120 36-20 61-19 77 4 18-35 14-76-27-124Z"
          fill="url(#cloakRed)"
          stroke="hsl(var(--background) / 0.45)"
          strokeWidth="3"
        />
        <path
          d="M209 172c35 33 51 73 50 120-36-20-61-19-77 4-18-35-14-76 27-124Z"
          fill="url(#cloakRed)"
          stroke="hsl(var(--background) / 0.45)"
          strokeWidth="3"
        />
      </g>

      <g className="michael-body">
        <path
          d="M145 161c9-16 20-26 35-26s27 10 36 26l15 104c-32 18-69 18-101 0l15-104Z"
          fill="url(#robeBlue)"
          stroke="hsl(var(--primary) / 0.42)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M151 183c19 13 39 13 58 0M180 139v136M150 230c20 11 40 11 60 0"
          fill="none"
          stroke="hsl(var(--primary) / 0.55)"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle cx="180" cy="112" r="24" fill="#dba85a" stroke="hsl(var(--background) / 0.55)" strokeWidth="4" />
        <path
          d="M156 105c12-30 38-31 50 0-15-11-33-11-50 0Z"
          fill="#5f3520"
        />
        <path d="M172 117c6 5 12 5 18 0" fill="none" stroke="#57321f" strokeLinecap="round" strokeWidth="3" />
        <path
          d="M138 173c-16 15-25 35-28 60"
          fill="none"
          stroke="#dba85a"
          strokeLinecap="round"
          strokeWidth="11"
        />
        <path
          d="M222 171c14 11 22 24 25 41"
          fill="none"
          stroke="#dba85a"
          strokeLinecap="round"
          strokeWidth="11"
        />
      </g>

      <g className="michael-sword">
        <path d="M239 40l12 143-12 30-12-30 12-143Z" fill="url(#swordSteel)" stroke="#eef4f8" strokeWidth="2" />
        <path d="M212 184h54" stroke="#d7a33a" strokeLinecap="round" strokeWidth="10" />
        <path d="M239 188v45" stroke="#8c571d" strokeLinecap="round" strokeWidth="9" />
        <circle cx="239" cy="237" r="8" fill="#d7a33a" />
        <path d="M224 180c12 7 22 7 30 0" fill="none" stroke="#dba85a" strokeLinecap="round" strokeWidth="10" />
      </g>

      <path
        className="michael-ground"
        d="M98 302c44 20 120 20 164 0"
        fill="none"
        stroke="hsl(var(--primary) / 0.4)"
        strokeLinecap="round"
        strokeWidth="6"
      />
    </svg>
  );
}

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
        @keyframes wingFlapLeft {
          0%, 100% { transform: rotate(-9deg) translateY(0); }
          48% { transform: rotate(10deg) translateY(7px); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: rotate(9deg) translateY(0); }
          48% { transform: rotate(-10deg) translateY(7px); }
        }
        @keyframes swordLift {
          0% { transform: rotate(-26deg) translate(-16px, 28px); }
          22% { transform: rotate(-5deg) translate(-5px, 6px); }
          46%, 78% { transform: rotate(7deg) translate(0, -7px); }
          100% { transform: rotate(4deg) translate(0, -2px); }
        }
        @keyframes cloakSway {
          0%, 100% { transform: translateX(-2px) skewX(-1deg); }
          50% { transform: translateX(3px) skewX(1.5deg); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: .74; transform: scale(.98); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes groundPulse {
          0%, 100% { opacity: .35; transform: scaleX(.92); }
          50% { opacity: .72; transform: scaleX(1.04); }
        }
        .michael-flight { animation: michaelFlight 4.05s cubic-bezier(.22, .9, .22, 1) forwards; }
        .michael-icon { animation: iconGlow 1.4s ease-in-out infinite; }
        .michael-wing { transform-box: fill-box; }
        .michael-wing-left { transform-origin: 82% 38%; animation: wingFlapLeft .46s ease-in-out infinite; }
        .michael-wing-right { transform-origin: 18% 38%; animation: wingFlapRight .46s ease-in-out infinite; }
        .michael-sword { transform-box: fill-box; transform-origin: 36% 86%; animation: swordLift 1.65s cubic-bezier(.2, .9, .2, 1) infinite alternate; }
        .michael-cloak { transform-box: fill-box; transform-origin: 50% 22%; animation: cloakSway 1.2s ease-in-out infinite; }
        .michael-halo { transform-box: fill-box; transform-origin: center; animation: haloPulse 1.4s ease-in-out infinite; }
        .michael-ground { transform-box: fill-box; transform-origin: center; animation: groundPulse 1.4s ease-in-out infinite; }
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
          <AnimatedSaintMichael />
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
