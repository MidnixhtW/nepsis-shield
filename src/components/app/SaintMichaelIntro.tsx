import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "nepsis-shield:st-michael-intro-seen:simple-complex-v4";

function AnimatedSaintMichaelIcon() {
  return (
    <svg
      viewBox="0 0 360 420"
      className="michael-icon relative h-full w-full overflow-visible"
      role="img"
      aria-label="Animated icon of St. Michael raising a sword with wings"
    >
      <defs>
        <radialGradient id="haloGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff5bf" />
          <stop offset="58%" stopColor="#d8a236" />
          <stop offset="100%" stopColor="#8a571b" />
        </radialGradient>
        <linearGradient id="wingGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff0ad" />
          <stop offset="100%" stopColor="#9b641e" />
        </linearGradient>
        <linearGradient id="robeBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#355f9f" />
          <stop offset="100%" stopColor="#14203f" />
        </linearGradient>
        <linearGradient id="mantleRed" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#bc4634" />
          <stop offset="100%" stopColor="#531716" />
        </linearGradient>
        <linearGradient id="swordSteel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#d8dee5" />
          <stop offset="100%" stopColor="#7c8792" />
        </linearGradient>
      </defs>

      <circle className="michael-aura" cx="180" cy="190" r="150" fill="hsl(var(--primary) / 0.12)" />
      <circle className="michael-halo" cx="180" cy="126" r="55" fill="url(#haloGold)" />
      <circle cx="180" cy="126" r="43" fill="none" stroke="hsl(var(--background) / 0.38)" strokeWidth="3" />
      <path d="M180 78v96M132 126h96" stroke="hsl(var(--background) / 0.25)" strokeLinecap="round" strokeWidth="3" />

      <g className="michael-wing michael-wing-left">
        <path
          d="M158 159C112 70 50 82 35 196c34-39 70-43 108-13-46 0-80 19-103 58 43-17 78-9 105 25-34-1-61 13-80 42 41-13 79-6 114 23 8-63 1-121-21-172Z"
          fill="url(#wingGold)"
          stroke="#6d4318"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M139 172c-40-16-72-7-96 26M143 212c-39-4-69 9-91 40M147 252c-31 3-56 18-75 46"
          fill="none"
          stroke="hsl(var(--background) / 0.45)"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>

      <g className="michael-wing michael-wing-right">
        <path
          d="M202 159c46-89 108-77 123 37-34-39-70-43-108-13 46 0 80 19 103 58-43-17-78-9-105 25 34-1 61 13 80 42-41-13-79-6-114 23-8-63-1-121 21-172Z"
          fill="url(#wingGold)"
          stroke="#6d4318"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M221 172c40-16 72-7 96 26M217 212c39-4 69 9 91 40M213 252c31 3 56 18 75 46"
          fill="none"
          stroke="hsl(var(--background) / 0.45)"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </g>

      <g className="michael-body">
        <path
          className="michael-mantle"
          d="M123 190c17-32 36-47 57-47s40 15 57 47l27 170c-49 29-119 29-168 0l27-170Z"
          fill="url(#mantleRed)"
          stroke="#5b2018"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M145 198c10-23 22-35 35-35s25 12 35 35l16 146c-30 17-72 17-102 0l16-146Z"
          fill="url(#robeBlue)"
          stroke="hsl(var(--background) / 0.42)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          className="michael-loros"
          d="M162 170l42 172M201 171l-43 171"
          fill="none"
          stroke="#d8a236"
          strokeLinecap="round"
          strokeWidth="12"
        />
        <path
          d="M139 235c27 12 55 12 82 0M137 284c30 12 58 12 87 0"
          fill="none"
          stroke="hsl(var(--primary) / 0.38)"
          strokeLinecap="round"
          strokeWidth="4"
        />

        <ellipse cx="180" cy="126" rx="23" ry="29" fill="#d8a05f" stroke="#63391f" strokeWidth="3" />
        <path d="M156 113c11-28 38-31 49 1-16-10-32-10-49-1Z" fill="#57331f" />
        <path d="M166 128c5-3 10-3 15 0M190 128c5-3 10-3 15 0" stroke="#402515" strokeLinecap="round" strokeWidth="3" />
        <path d="M171 151c6 4 13 4 19 0" fill="none" stroke="#56301d" strokeLinecap="round" strokeWidth="3" />
      </g>

      <g className="michael-shield-arm">
        <path d="M141 205c-19 22-31 48-36 78" fill="none" stroke="#d8a05f" strokeLinecap="round" strokeWidth="12" />
        <path className="michael-shield" d="M98 253l45 17-18 54-47-18 20-53Z" fill="#213b70" stroke="#d8a236" strokeWidth="4" />
      </g>

      <g className="michael-sword-arm">
        <path d="M221 196c18 5 30 21 37 49" fill="none" stroke="#d8a05f" strokeLinecap="round" strokeWidth="12" />
        <path d="M253 40l13 156-13 33-13-33 13-156Z" fill="url(#swordSteel)" stroke="#f9fbff" strokeWidth="2" />
        <path d="M224 196h58" stroke="#d8a236" strokeLinecap="round" strokeWidth="11" />
        <path d="M253 201v50" stroke="#80501a" strokeLinecap="round" strokeWidth="9" />
        <circle cx="253" cy="255" r="8" fill="#d8a236" />
        <path className="sword-shine" d="M253 58l4 122" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
      </g>

      <g className="michael-light-rays" stroke="hsl(var(--primary) / 0.35)" strokeLinecap="round" strokeWidth="4">
        <path d="M180 25v24" />
        <path d="M106 60l15 19" />
        <path d="M254 60l-15 19" />
        <path d="M62 142l26 6" />
        <path d="M298 142l-26 6" />
      </g>

      <path
        className="michael-ground"
        d="M88 372c51 22 133 22 184 0"
        fill="none"
        stroke="hsl(var(--primary) / 0.42)"
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
          0%, 100% { filter: drop-shadow(0 1.8rem 2.5rem hsl(var(--primary)/0.24)); }
          50% { filter: drop-shadow(0 2.2rem 3.6rem hsl(var(--primary)/0.42)); }
        }
        @keyframes starDrift {
          from { transform: translateX(-8vw); opacity: 0; }
          25% { opacity: .9; }
          to { transform: translateX(22vw); opacity: 0; }
        }
        @keyframes wingFlapLeft {
          0%, 100% { transform: rotate(-7deg) translateY(0) scaleX(1); }
          32% { transform: rotate(9deg) translateY(9px) scaleX(.96); }
          64% { transform: rotate(-2deg) translateY(3px) scaleX(1.02); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: rotate(7deg) translateY(0) scaleX(1); }
          32% { transform: rotate(-9deg) translateY(9px) scaleX(.96); }
          64% { transform: rotate(2deg) translateY(3px) scaleX(1.02); }
        }
        @keyframes swordRaise {
          0% { transform: rotate(-17deg) translate(-12px, 21px); }
          24% { transform: rotate(-3deg) translate(-4px, 5px); }
          55% { transform: rotate(6deg) translate(0, -9px); }
          100% { transform: rotate(3deg) translate(0, -5px); }
        }
        @keyframes bodyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes mantleSway {
          0%, 100% { transform: translateX(-2px) skewX(-1deg); }
          50% { transform: translateX(3px) skewX(1deg); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: .9; transform: scale(.985); }
          50% { opacity: 1; transform: scale(1.035); }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: .45; transform: scale(.96); }
          50% { opacity: .85; transform: scale(1.05); }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: .25; transform: scale(.94); }
          50% { opacity: .8; transform: scale(1.04); }
        }
        @keyframes shieldTap {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          50% { transform: rotate(3deg) translateY(-3px); }
        }
        @keyframes swordShine {
          0%, 100% { opacity: .25; }
          50% { opacity: .95; }
        }
        @keyframes groundPulse {
          0%, 100% { opacity: .34; transform: scaleX(.92); }
          50% { opacity: .72; transform: scaleX(1.04); }
        }
        .michael-flight { animation: michaelFlight 4.05s cubic-bezier(.22, .9, .22, 1) forwards; }
        .michael-icon { animation: iconGlow 1.4s ease-in-out infinite; }
        .michael-aura { transform-box: fill-box; transform-origin: center; animation: auraPulse 1.5s ease-in-out infinite; }
        .michael-halo { transform-box: fill-box; transform-origin: center; animation: haloPulse 1.25s ease-in-out infinite; }
        .michael-wing { transform-box: fill-box; }
        .michael-wing-left { transform-origin: 86% 36%; animation: wingFlapLeft .62s ease-in-out infinite; }
        .michael-wing-right { transform-origin: 14% 36%; animation: wingFlapRight .62s ease-in-out infinite; }
        .michael-body { transform-box: fill-box; transform-origin: center; animation: bodyFloat 1.2s ease-in-out infinite; }
        .michael-mantle { transform-box: fill-box; transform-origin: 50% 18%; animation: mantleSway 1.25s ease-in-out infinite; }
        .michael-loros { animation: swordShine 1.1s ease-in-out infinite; }
        .michael-sword-arm { transform-box: fill-box; transform-origin: 28% 78%; animation: swordRaise 1.7s cubic-bezier(.2, .9, .2, 1) infinite alternate; }
        .michael-shield { transform-box: fill-box; transform-origin: center; animation: shieldTap 1.2s ease-in-out infinite; }
        .michael-light-rays { transform-box: fill-box; transform-origin: center; animation: rayPulse 1.35s ease-in-out infinite; }
        .sword-shine { animation: swordShine .82s ease-in-out infinite; }
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
        <div className="michael-flight relative h-[19rem] w-[16.5rem] sm:h-[26rem] sm:w-[22rem]" aria-hidden>
          <div className="absolute inset-4 rounded-full bg-primary/10 blur-3xl" />
          <AnimatedSaintMichaelIcon />
        </div>

        <div className="pointer-events-none absolute top-[calc(50%+10rem)] w-[min(34rem,calc(100vw-2rem))] rounded-3xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur sm:top-[calc(50%+13rem)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Holy Archangel Michael</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Defend us and pray to God for us.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entering Nepsis Shield</p>
        </div>
      </div>
    </div>
  );
}
