import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "nepsis-shield:st-michael-intro-seen:animated-icon-v3";

function AnimatedSaintMichaelIcon() {
  return (
    <svg
      viewBox="0 0 360 420"
      className="michael-icon relative h-full w-full overflow-visible"
      role="img"
      aria-label="Animated Orthodox-style icon of St. Michael raising a sword with wings"
    >
      <defs>
        <radialGradient id="iconGoldGlow" cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#fff4bf" />
          <stop offset="48%" stopColor="#d7a43a" />
          <stop offset="100%" stopColor="#6d4214" />
        </radialGradient>
        <linearGradient id="iconPanel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f9e6a4" />
          <stop offset="48%" stopColor="#c88d2d" />
          <stop offset="100%" stopColor="#553412" />
        </linearGradient>
        <linearGradient id="wingIconGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff6c7" />
          <stop offset="45%" stopColor="#d6a13a" />
          <stop offset="100%" stopColor="#7b4a16" />
        </linearGradient>
        <linearGradient id="robeIconBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#395f9f" />
          <stop offset="52%" stopColor="#203d76" />
          <stop offset="100%" stopColor="#101b37" />
        </linearGradient>
        <linearGradient id="mantleIconRed" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#bd4937" />
          <stop offset="52%" stopColor="#86291f" />
          <stop offset="100%" stopColor="#481312" />
        </linearGradient>
        <linearGradient id="lorosGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff2b8" />
          <stop offset="52%" stopColor="#cf972b" />
          <stop offset="100%" stopColor="#7a4614" />
        </linearGradient>
        <linearGradient id="swordSteel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="44%" stopColor="#d7dee5" />
          <stop offset="100%" stopColor="#7d8792" />
        </linearGradient>
        <filter id="iconShadow" x="-25%" y="-25%" width="150%" height="150%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000000" floodOpacity="0.28" />
        </filter>
      </defs>

      <g filter="url(#iconShadow)">
        <path
          className="michael-icon-panel"
          d="M52 391V117C52 54 104 18 180 18s128 36 128 99v274H52Z"
          fill="url(#iconPanel)"
          stroke="hsl(var(--primary) / 0.45)"
          strokeWidth="5"
        />
        <path
          d="M70 371V120c0-50 42-83 110-83s110 33 110 83v251H70Z"
          fill="none"
          stroke="hsl(var(--background) / 0.42)"
          strokeWidth="3"
        />
        <path
          d="M75 88c58-37 151-37 210 0"
          fill="none"
          stroke="hsl(var(--primary) / 0.38)"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>

      <g className="michael-inscription" fill="hsl(var(--background) / 0.74)" fontFamily="serif" fontWeight="700">
        <text x="85" y="114" fontSize="18">ΑΡΧ</text>
        <text x="229" y="114" fontSize="18">ΜΙΧ</text>
      </g>

      <g className="michael-wing michael-wing-left">
        <path
          d="M158 154C111 67 51 73 36 188c34-36 66-42 103-19-42 1-76 18-101 54 45-16 78-10 103 18-32 2-57 16-74 42 40-13 75-7 107 18 10-50 4-99-16-147Z"
          fill="url(#wingIconGold)"
          stroke="#6f4316"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M134 165c-34-21-63-15-88 18M138 198c-39-8-70 4-95 32M142 232c-30-1-55 12-74 42"
          fill="none"
          stroke="hsl(var(--background) / 0.54)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M156 154c-12 43-13 88-3 135"
          fill="none"
          stroke="#8c571d"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </g>

      <g className="michael-wing michael-wing-right">
        <path
          d="M202 154c47-87 107-81 122 34-34-36-66-42-103-19 42 1 76 18 101 54-45-16-78-10-103 18 32 2 57 16 74 42-40-13-75-7-107 18-10-50-4-99 16-147Z"
          fill="url(#wingIconGold)"
          stroke="#6f4316"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M226 165c34-21 63-15 88 18M222 198c39-8 70 4 95 32M218 232c30-1 55 12 74 42"
          fill="none"
          stroke="hsl(var(--background) / 0.54)"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M204 154c12 43 13 88 3 135"
          fill="none"
          stroke="#8c571d"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </g>

      <circle className="michael-halo" cx="180" cy="135" r="57" fill="url(#iconGoldGlow)" stroke="#fff0b4" strokeWidth="4" />
      <circle cx="180" cy="135" r="46" fill="none" stroke="#8a561d" strokeWidth="3" />
      <path d="M180 82v106M128 135h104" stroke="hsl(var(--background) / 0.32)" strokeLinecap="round" strokeWidth="3" />

      <g className="michael-body">
        <path
          className="michael-mantle"
          d="M120 198c18-37 38-54 60-54s42 17 60 54l23 160c-48 28-118 28-166 0l23-160Z"
          fill="url(#mantleIconRed)"
          stroke="#5c2116"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M145 199c10-24 22-37 35-37s25 13 35 37l15 146c-29 15-71 15-100 0l15-146Z"
          fill="url(#robeIconBlue)"
          stroke="hsl(var(--background) / 0.42)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M160 169l47 175M201 170l-46 175"
          fill="none"
          stroke="url(#lorosGold)"
          strokeLinecap="round"
          strokeWidth="14"
        />
        <path
          d="M160 169l47 175M201 170l-46 175"
          fill="none"
          stroke="hsl(var(--background) / 0.35)"
          strokeLinecap="round"
          strokeDasharray="2 14"
          strokeWidth="4"
        />
        <path
          d="M139 223c27 14 55 14 82 0M137 272c29 13 58 13 87 0"
          fill="none"
          stroke="hsl(var(--primary) / 0.42)"
          strokeLinecap="round"
          strokeWidth="4"
        />

        <g className="michael-face">
          <ellipse cx="180" cy="134" rx="24" ry="30" fill="#d9a260" stroke="#62371d" strokeWidth="3" />
          <path d="M154 121c10-31 42-35 55 1-18-13-36-13-55-1Z" fill="#5b321e" />
          <path d="M166 135c5-3 10-3 15 0M190 135c5-3 10-3 15 0" stroke="#442518" strokeLinecap="round" strokeWidth="3" />
          <path d="M180 137c-2 8-2 13 0 17" stroke="#7a4424" strokeLinecap="round" strokeWidth="2" />
          <path d="M170 160c7 5 14 5 21 0" fill="none" stroke="#56301d" strokeLinecap="round" strokeWidth="3" />
        </g>
      </g>

      <g className="michael-left-arm">
        <path d="M142 203c-18 21-29 45-34 74" fill="none" stroke="#d9a260" strokeLinecap="round" strokeWidth="12" />
        <path d="M98 251l43 17-19 48-44-17 20-48Z" fill="#253a6b" stroke="#d8a43a" strokeWidth="4" />
        <path d="M108 264l20 8M101 282l20 8" stroke="hsl(var(--background) / 0.42)" strokeLinecap="round" strokeWidth="3" />
      </g>

      <g className="michael-sword-arm">
        <path d="M221 196c15 1 28 16 36 44" fill="none" stroke="#d9a260" strokeLinecap="round" strokeWidth="12" />
        <path d="M252 42l13 151-13 32-13-32 13-151Z" fill="url(#swordSteel)" stroke="#f7fbff" strokeWidth="2" />
        <path d="M223 193h58" stroke="#d7a33a" strokeLinecap="round" strokeWidth="11" />
        <path d="M252 198v48" stroke="#7d4717" strokeLinecap="round" strokeWidth="9" />
        <circle cx="252" cy="250" r="8" fill="#d7a33a" />
        <path d="M235 190c11 9 23 9 34 0" fill="none" stroke="#d9a260" strokeLinecap="round" strokeWidth="10" />
        <path className="sword-shine" d="M252 58l4 118" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" opacity="0.65" />
      </g>

      <path
        className="michael-ground"
        d="M92 374c48 22 128 22 176 0"
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
          0%, 100% { filter: drop-shadow(0 1.8rem 2.5rem hsl(var(--primary)/0.22)); }
          50% { filter: drop-shadow(0 2rem 3.5rem hsl(var(--primary)/0.38)); }
        }
        @keyframes starDrift {
          from { transform: translateX(-8vw); opacity: 0; }
          25% { opacity: .9; }
          to { transform: translateX(22vw); opacity: 0; }
        }
        @keyframes wingFlapLeft {
          0%, 100% { transform: rotate(-5deg) translateY(0) scaleX(1); }
          45% { transform: rotate(7deg) translateY(8px) scaleX(.96); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: rotate(5deg) translateY(0) scaleX(1); }
          45% { transform: rotate(-7deg) translateY(8px) scaleX(.96); }
        }
        @keyframes swordRaiseIcon {
          0% { transform: rotate(-15deg) translate(-12px, 20px); }
          24% { transform: rotate(-4deg) translate(-4px, 6px); }
          52%, 100% { transform: rotate(4deg) translate(0, -8px); }
        }
        @keyframes mantleSway {
          0%, 100% { transform: translateX(-1px); }
          50% { transform: translateX(2px); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: .9; transform: scale(.985); }
          50% { opacity: 1; transform: scale(1.025); }
        }
        @keyframes iconPanelPulse {
          0%, 100% { opacity: .95; }
          50% { opacity: 1; }
        }
        @keyframes groundPulse {
          0%, 100% { opacity: .34; transform: scaleX(.92); }
          50% { opacity: .72; transform: scaleX(1.04); }
        }
        @keyframes swordShine {
          0%, 100% { opacity: .36; }
          50% { opacity: .9; }
        }
        .michael-flight { animation: michaelFlight 4.05s cubic-bezier(.22, .9, .22, 1) forwards; }
        .michael-icon { animation: iconGlow 1.4s ease-in-out infinite; }
        .michael-icon-panel { animation: iconPanelPulse 1.6s ease-in-out infinite; }
        .michael-wing { transform-box: fill-box; }
        .michael-wing-left { transform-origin: 86% 37%; animation: wingFlapLeft .7s ease-in-out infinite; }
        .michael-wing-right { transform-origin: 14% 37%; animation: wingFlapRight .7s ease-in-out infinite; }
        .michael-sword-arm { transform-box: fill-box; transform-origin: 28% 78%; animation: swordRaiseIcon 1.8s cubic-bezier(.2, .9, .2, 1) infinite alternate; }
        .michael-mantle { transform-box: fill-box; transform-origin: 50% 18%; animation: mantleSway 1.4s ease-in-out infinite; }
        .michael-halo { transform-box: fill-box; transform-origin: center; animation: haloPulse 1.4s ease-in-out infinite; }
        .michael-ground { transform-box: fill-box; transform-origin: center; animation: groundPulse 1.4s ease-in-out infinite; }
        .sword-shine { animation: swordShine .9s ease-in-out infinite; }
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
