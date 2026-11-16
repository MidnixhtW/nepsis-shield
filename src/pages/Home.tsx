import type { ReactNode } from "react";
import { Link, Navigate } from "react-router";
import { Capacitor } from "@capacitor/core";
import {
  ArrowRight,
  BellRing,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CloudOff,
  GraduationCap,
  Leaf,
  MoonStar,
  ScrollText,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ONBOARDING_KEY } from "@/components/app/QuickStartDialog";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { getStoredItem } from "@/lib/deviceStorage";

// Someone who has set up their rule, or who opened the installed app, goes straight to Today.
function shouldSkipHome() {
  if (Capacitor.isNativePlatform()) return true;
  if (getStoredItem<boolean>(ONBOARDING_KEY)) return true;
  try {
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return false;
  }
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{children}</p>;
}

function StartButtons({ center = false }: { center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center gap-3 sm:flex-row sm:justify-center" : "flex flex-col gap-3 sm:flex-row"}>
      <Button asChild className="gold-foil h-14 rounded-full px-8 text-base font-bold text-primary-foreground">
        <Link to="/today">
          Start now, it&rsquo;s free <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button asChild variant="outline" className="h-14 rounded-full border-primary/35 bg-background/40 px-7 text-base backdrop-blur">
        <Link to="/download">
          <Smartphone className="mr-2 h-5 w-5" /> Install on your phone
        </Link>
      </Button>
    </div>
  );
}

// Real situations the app is built around. These are descriptions, not quotes from users.
const lives = [
  {
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    title: "Early career",
    body: "Five minutes of morning prayer before the inbox, and a way back to calm when a meeting goes badly.",
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: "Studying",
    body: "A two-minute rule that survives exam weeks, and evening prayers that help you put the phone down.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Serving",
    body: "Military, police, fire, EMS, dispatch and chaplains get shift-length prayers and a reset built for the job.",
  },
  {
    icon: <MoonStar className="h-5 w-5" />,
    title: "Late nights",
    body: "Compline, the Jesus Prayer with a prayer-rope counter, and a stillness timer for when sleep won’t come.",
  },
];

const features = [
  {
    icon: <ScrollText className="h-5 w-5" />,
    title: "Your rule, simplified",
    body: "Morning, evening and night prayers in four lengths, prayed full-screen one step at a time, with read-aloud. You never lose your place.",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "The mind of the Church",
    body: "The day’s Epistle and Gospel, the saints and feasts, and the whole Bible, following the Church calendar, New or Old.",
  },
  {
    icon: <Leaf className="h-5 w-5" />,
    title: "Fasting made clear",
    body: "Today’s fast at a glance, and a day-by-day companion through Great Lent and every fast of the year, with a short prayer for each day.",
  },
];

const habits = [
  {
    icon: <CalendarDays className="h-5 w-5" />,
    title: "No streaks to protect",
    body: "A quiet week of dots shows the days you prayed. Miss one and it is simply empty; nothing resets, nothing scolds.",
  },
  {
    icon: <BellRing className="h-5 w-5" />,
    title: "Reminders at your hours",
    body: "Morning, evening and night reminders in the Android app, whether you wake at five or finish a late shift.",
  },
  {
    icon: <CloudOff className="h-5 w-5" />,
    title: "Works with no signal",
    body: "Prayers live on your phone, and the next two weeks of the calendar are saved ahead. No account, and your notes stay with you.",
  },
];

export default function Home() {
  if (shouldSkipHome()) return <Navigate to="/today" replace />;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="premium-icon-mark h-10 w-10">
            <OrthodoxCrossIcon className="h-5 w-5" />
          </span>
          <span className="font-serif text-base font-semibold tracking-[-0.02em]">Nepsis Shield</span>
        </Link>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/today" state={LOOK_AROUND_STATE}>Open the app</Link>
        </Button>
      </header>

      <main id="main-content">
        {/* 1. Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-10rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl motion-safe:animate-drift" />
            <div className="absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:px-8 sm:pb-28 sm:pt-24">
            <Eyebrow>Orthodox prayer · Scripture · Watchfulness</Eyebrow>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">Ancient faith for modern focus.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              A companion for Orthodox prayer, the day&rsquo;s Scripture, and a daily rule small enough to keep. Built for your pocket.
            </p>
            <div className="mt-10">
              <StartButtons center />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Free · No account · Works offline</p>
          </div>
        </section>

        {/* 2. Built for real life */}
        <section aria-labelledby="real-life" className="border-y border-border/50 bg-card/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-20">
            <div className="max-w-2xl">
              <Eyebrow>Built for real life</Eyebrow>
              <h2 id="real-life" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Built for the realities of modern life.</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Early-career burnout, university stress, military service, or a phone that never stops: Nepsis Shield keeps your prayer rule close.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {lives.map((item) => (
                <article key={item.title} className="rounded-3xl border border-primary/15 bg-background/50 p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Features */}
        <section aria-labelledby="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow>Everything you need, nothing extra</Eyebrow>
            <h2 id="features" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Prayer, Scripture and the fasts in one quiet place.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((item) => (
              <article key={item.title} className="candlelight-card rounded-[2rem] border p-6 backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">{item.icon}</span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Habit and resilience */}
        <section aria-labelledby="consistency" className="border-y border-border/50 bg-card/30">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="mx-auto w-full max-w-[17rem] sm:max-w-xs">
              <div className="rounded-[2.75rem] border border-primary/25 bg-black p-2.5 shadow-[0_40px_90px_hsl(0_0%_0%/0.45)]">
                <img
                  src="/home/full-screen-prayer.webp"
                  alt="The app showing the morning prayer full-screen, with read-aloud and Back and Next buttons."
                  width={540}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-[2.2rem]"
                />
              </div>
            </div>
            <div>
              <Eyebrow>Consistency</Eyebrow>
              <h2 id="consistency" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Build consistency without the guilt.</h2>
              <ul className="mt-8 grid gap-5">
                {habits.map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. Closing call */}
        <section aria-labelledby="begin" className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-8 sm:py-28">
            <h2 id="begin" className="text-3xl font-semibold tracking-tight sm:text-5xl">Take your prayer off the screen and into your day.</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              <em>Nepsis</em> is watchfulness: a quiet, steady attention to God that the Church has practiced for centuries. Begin with two minutes.
            </p>
            <div className="mt-10">
              <StartButtons center />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <nav aria-label="Site" className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-muted-foreground sm:px-8">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/download" className="hover:text-foreground">Install</Link>
          <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms</Link>
          <span>Under the protection of St Michael the Archangel</span>
        </nav>
      </footer>
    </div>
  );
}
