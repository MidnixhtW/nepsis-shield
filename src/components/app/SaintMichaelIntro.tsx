import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_KEY = "nepsis-shield:st-michael-intro-seen:premium-icon-v5";

function AnimatedSaintMichaelIcon() {
  return (
    <svg
      viewBox="0 0 420 500"
      className="michael-icon relative h-full w-full overflow-visible"
      role="img"
      aria-label="Animated icon of St. Michael raising a sword with wings"
    >
      <defs>
        <radialGradient id="michaelAura" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.34)" />
          <stop offset="58%" stopColor="hsl(var(--primary) / 0.12)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
        </radialGradient>
        <linearGradient id="iconGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff7c7" />
          <stop offset="31%" stopColor="#e4bc58" />
          <stop offset="64%" stopColor="#a96c22" />
          <stop offset="100%" stopColor="#4c2a0d" />
        </linearGradient>
        <linearGradient id="wingGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff8cc" />
          <stop offset="42%" stopColor="#d9a43c" />
          <stop offset="100%" stopColor="#74400f" />
        </linearGradient>
        <linearGradient id="robeBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4771b3" />
          <stop offset="48%" stopColor="#244984" />
          <stop offset="100%" stopColor="#101833" />
        </linearGradient>
        <linearGradient id="mantleRed" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#d05a42" />
          <stop offset="54%" stopColor="#8a2a20" />
          <stop offset="100%" stopColor="#3e1110" />
        </linearGradient>
        <linearGradient id="lorosGold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff4b8" />
          <stop offset="50%" stopColor="#d8a236" />
          <stop offset="100%" stopColor="#7d4712" />
        </linearGradient>
        <linearGradient id="swordSteel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#dce4eb" />
          <stop offset="71%" stopColor="#aab5bf" />
          <stop offset="100%" stopColor="#697581" />
        </linearGradient>
        <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000000" floodOpacity="0.32" />
        </filter>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle className="michael-aura" cx="210" cy="230" r="188" fill="url(#michaelAura)" />

      <g className="michael-rays" stroke="hsl(var(--primary) / 0.38)" strokeLinecap="round" strokeWidth="4">
        <path d="M210 30v34" />
        <path d="M120 60l18 30" />
        <path d="M300 60l-18 30" />
        <path d="M64 156l34 8" />
        <path d="M356 156l-34 8" />
        <path d="M84 306l31-13" />
        <path d="M336 306l-31-13" />
      </g>

      <g className="michael-figure" filter="url(#premiumShadow)">
        <g className="michael-wing michael-wing-left">
          <path
            d="M190 183C139 75 58 83 38 222c39-48 83-55 131-19-55 4-98 29-128 75 53-23 96-15 129 24-41 1-75 19-100 55 52-18 101-9 147 33 12-77 3-146-27-207Z"
            fill="url(#wingGold)"
            stroke="#674018"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M162 191c-45-18-84-7-116 35M168 236c-49-5-88 12-116 51M174 283c-42 5-75 25-101 61"
            fill="none"
            stroke="hsl(var(--background) / 0.48)"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            className="feather-shine"
            d="M185 181c-19 60-22 121-9 183"
            fill="none"
            stroke="#fff4b6"
            strokeLinecap="round"
            strokeWidth="3"
            opacity="0.65"
          />
        </g>

        <g className="michael-wing michael-wing-right">
          <path
            d="M230 183c51-108 132-100 152 39-39-48-83-55-131-19 55 4 98 29 128 75-53-23-96-15-129 24 41 1 75 19 100 55-52-18-101-9-147 33-12-77-3-146 27-207Z"
            fill="url(#wingGold)"
            stroke="#674018"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M258 191c45-18 84-7 116 35M252 236c49-5 88 12 116 51M246 283c42 5 75 25 101 61"
            fill="none"
            stroke="hsl(var(--background) / 0.48)"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <path
            className="feather-shine"
            d="M235 181c19 60 22 121 9 183"
            fill="none"
            stroke="#fff4b6"
            strokeLinecap="round"
            strokeWidth="3"
            opacity="0.65"
          />
        </g>

        <circle className="michael-halo" cx="210" cy="150" r="68" fill="url(#iconGold)" />
        <circle cx="210" cy="150" r="53" fill="none" stroke="hsl(var(--background) / 0.42)" strokeWidth="4" />
        <path d="M210 92v116M152 150h116" stroke="hsl(var(--background) / 0.24)" strokeLinecap="round" strokeWidth="4" />

        <g className="michael-body">
          <path
            className="michael-mantle"
            d="M138 225c20-44 44-64 72-64s52 20 72 64l31 198c-60 36-146 36-206 0l31-198Z"
            fill="url(#mantleRed)"
            stroke="#4e1a15"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M165 232c13-34 28-51 45-51s32 17 45 51l18 170c-37 22-89 22-126 0l18-170Z"
            fill="url(#robeBlue)"
            stroke="hsl(var(--background) / 0.4)"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            className="michael-loros"
            d="M186 190l50 204M236 190l-51 204"
            fill="none"
            stroke="url(#lorosGold)"
            strokeLinecap="round"
            strokeWidth="15"
          />
          <path
            d="M185 190l50 204M236 190l-51 204"
            fill="none"
            stroke="#fff0ad"
            strokeDasharray="2 17"
            strokeLinecap="round"
            strokeWidth="4"
            opacity="0.7"
          />
          <path
            d="M159 278c35 16 70 16 105 0M154 335c38 17 76 17 114 0"
            fill="none"
            stroke="hsl(var(--primary) / 0.42)"
            strokeLinecap="round"
            strokeWidth="4"
          />

          <g className="michael-face">
            <ellipse cx="210" cy="150" rx="27" ry="34" fill="#d99d5b" stroke="#62371d" strokeWidth="4" />
            <path d="M181 135c13-36 45-39 58 1-19-13-38-13-58-1Z" fill="#56331f" />
            <path d="M194 153c5-3 10-3 15 0M219 153c5-3 10-3 15 0" stroke="#3d2316" strokeLinecap="round" strokeWidth="3" />
            <path d="M210 155c-2 8-2 14 0 20" stroke="#72411f" strokeLinecap="round" strokeWidth="2.5" />
            <path d="M199 181c7 5 15 5 22 0" fill="none" stroke="#56301d" strokeLinecap="round" strokeWidth="3.5" />
          </g>
        </g>

        <g className="michael-shield-arm">
          <path d="M164 238c-25 28-41 62-48 101" fill="none" stroke="#d99d5b" strokeLinecap="round" strokeWidth="14" />
          <path className="michael-shield" d="M108 304l58 22-24 68-60-24 26-66Z" fill="#213e78" stroke="#d8a236" strokeWidth="5" />
          <path d="M123 321l27 10M113 348l27 10" stroke="hsl(var(--background) / 0.35)" strokeLinecap="round" strokeWidth="4" />
        </g>

        <g className="michael-sword-arm">
          <path d="M256 228c24 8 41 32 50 72" fill="none" stroke="#d99d5b" strokeLinecap="round" strokeWidth="14" />
          <path d="M304 42l16 188-16 40-16-40 16-188Z" fill="url(#swordSteel)" stroke="#f7fbff" strokeWidth="2.5" />
          <path d="M270 230h69" stroke="#d8a236" strokeLinecap="round" strokeWidth="13" />
          <path d="M304 237v59" stroke="#7e4b16" strokeLinecap="round" strokeWidth="10" />
          <circle cx="304" cy="303" r="10" fill="#d8a236" />
          <path className="sword-shine" d="M304 64l5 146" stroke="#ffffff" strokeLinecap="round" strokeWidth="4" />
        </g>
      </g>

      <path
        className="michael-ground"
        d="M92 445c67 27 169 27 236 0"
        fill="none"
        stroke="hsl(var(--primary) / 0.42)"
        strokeLinecap="round"
        strokeWidth="7"
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
    const leaveTimer = window.setTimeout(() => setLeaving(true), 3400);
    const hideTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_KEY, "true");
      setVisible(false);
    }, 4300);

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
          0% { transform: translate3d(-58vw, 18vh, 0) scale(.72) rotate(-7deg); opacity: 0; }
          16% { transform: translate3d(-9vw, 2vh, 0) scale(.98) rotate(-1deg); opacity: 1; }
          56% { transform: translate3d(0, 0, 0) scale(1.04) rotate(0deg); opacity: 1; }
          76% { transform: translate3d(10vw, -7vh, 0) scale(.95) rotate(6deg); opacity: 1; }
          100% { transform: translate3d(72vw, -43vh, 0) scale(.52) rotate(16deg); opacity: 0; }
        }
        @keyframes iconGlow {
          0%, 100% { filter: drop-shadow(0 1.8rem 2.5rem hsl(var(--primary)/0.24)); }
          50% { filter: drop-shadow(0 2.4rem 4rem hsl(var(--primary)/0.44)); }
        }
        @keyframes starDrift {
          from { transform: translateX(-8vw); opacity: 0; }
          24% { opacity: .9; }
          to { transform: translateX(22vw); opacity: 0; }
        }
        @keyframes wingFlapLeft {
          0%, 100% { transform: rotate(-6deg) translateY(0) scaleX(1); }
          30% { transform: rotate(8deg) translateY(10px) scaleX(.965); }
          62% { transform: rotate(-2deg) translateY(3px) scaleX(1.018); }
        }
        @keyframes wingFlapRight {
          0%, 100% { transform: rotate(6deg) translateY(0) scaleX(1); }
          30% { transform: rotate(-8deg) translateY(10px) scaleX(.965); }
          62% { transform: rotate(2deg) translateY(3px) scaleX(1.018); }
        }
        @keyframes swordRaise {
          0% { transform: rotate(-18deg) translate(-14px, 24px); }
          22% { transform: rotate(-5deg) translate(-5px, 7px); }
          52% { transform: rotate(6deg) translate(1px, -10px); }
          100% { transform: rotate(3deg) translate(0, -6px); }
        }
        @keyframes figureFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes mantleSway {
          0%, 100% { transform: translateX(-2px) skewX(-.7deg); }
          50% { transform: translateX(3px) skewX(.9deg); }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: .92; transform: scale(.985); }
          50% { opacity: 1; transform: scale(1.035); }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: .48; transform: scale(.96); }
          50% { opacity: .9; transform: scale(1.05); }
        }
        @keyframes rayPulse {
          0%, 100% { opacity: .24; transform: scale(.94); }
          50% { opacity: .82; transform: scale(1.045); }
        }
        @keyframes shieldSettle {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          50% { transform: rotate(2.5deg) translateY(-4px); }
        }
        @keyframes shinePulse {
          0%, 100% { opacity: .28; }
          50% { opacity: .95; }
        }
        @keyframes groundPulse {
          0%, 100% { opacity: .34; transform: scaleX(.92); }
          50% { opacity: .72; transform: scaleX(1.04); }
        }
        .michael-flight { animation: michaelFlight 4.3s cubic-bezier(.22, .9, .22, 1) forwards; }
        .michael-icon { animation: iconGlow 1.5s ease-in-out infinite; }
        .michael-figure { transform-box: fill-box; transform-origin: center; animation: figureFloat 1.45s ease-in-out infinite; }
        .michael-aura { transform-box: fill-box; transform-origin: center; animation: auraPulse 1.55s ease-in-out infinite; }
        .michael-rays { transform-box: fill-box; transform-origin: center; animation: rayPulse 1.45s ease-in-out infinite; }
        .michael-halo { transform-box: fill-box; transform-origin: center; animation: haloPulse 1.3s ease-in-out infinite; }
        .michael-wing { transform-box: fill-box; }
        .michael-wing-left { transform-origin: 88% 34%; animation: wingFlapLeft .66s ease-in-out infinite; }
        .michael-wing-right { transform-origin: 12% 34%; animation: wingFlapRight .66s ease-in-out infinite; }
        .michael-mantle { transform-box: fill-box; transform-origin: 50% 17%; animation: mantleSway 1.3s ease-in-out infinite; }
        .michael-loros, .feather-shine { animation: shinePulse 1.1s ease-in-out infinite; }
        .michael-sword-arm { transform-box: fill-box; transform-origin: 27% 80%; animation: swordRaise 1.75s cubic-bezier(.2, .9, .2, 1) infinite alternate; }
        .michael-shield { transform-box: fill-box; transform-origin: center; animation: shieldSettle 1.25s ease-in-out infinite; }
        .sword-shine { animation: shinePulse .78s ease-in-out infinite; }
        .michael-ground { transform-box: fill-box; transform-origin: center; animation: groundPulse 1.4s ease-in-out infinite; }
        .star-drift { animation: starDrift 2.8s ease-in-out infinite; }
      `}</style>

      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.2),transparent_29rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.55))]" />
      <div aria-hidden className="absolute inset-0 opacity-35 field-grid" />
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[min(32rem,86vmin)] w-[min(32rem,86vmin)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20" />
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
        className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-10 rounded-2xl bg-background/45 text-muted-foreground backdrop-blur hover:text-foreground sm:right-4 sm:top-[calc(env(safe-area-inset-top)+1rem)]"
        onClick={skipIntro}
      >
        <X className="mr-2 h-4 w-4" /> Skip
      </Button>

      <div className="relative z-[1] flex h-full w-full flex-col items-center justify-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-[calc(env(safe-area-inset-top)+3.25rem)] text-center sm:gap-4 sm:px-6">
        <div className="michael-flight relative h-[min(40dvh,20rem)] w-[min(70vw,17rem)] max-[380px]:h-[min(36dvh,17rem)] sm:h-[min(52dvh,30rem)] sm:w-[min(78vw,25rem)]" aria-hidden>
          <div className="absolute inset-6 rounded-full bg-primary/10 blur-3xl" />
          <AnimatedSaintMichaelIcon />
        </div>

        <div className="pointer-events-none w-full max-w-[34rem] rounded-3xl border border-border/60 bg-background/75 p-3 shadow-xl backdrop-blur sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs sm:tracking-[0.22em]">Holy Archangel Michael</p>
          <h1 className="mt-1 text-lg font-semibold leading-tight tracking-tight min-[360px]:text-xl sm:text-2xl">Defend us and pray to God for us.</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">Entering Nepsis Shield</p>
        </div>
      </div>

    </div>
  );
}
