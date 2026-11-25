import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import { DayIconBanner } from "@/components/app/DayIconBanner";
import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ONBOARDING_KEY } from "@/components/app/QuickStartDialog";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { getStoredItem } from "@/lib/deviceStorage";
import { BEEN_HERE_KEY } from "@/lib/recentPlaces";

// Someone who has set up their rule, or who opened the installed app, goes straight to Today.
function shouldSkipHome() {
  if (Capacitor.isNativePlatform()) return true;
  if (getStoredItem<boolean>(ONBOARDING_KEY)) return true;
  if (getStoredItem<boolean>(BEEN_HERE_KEY)) return true;
  try {
    return window.matchMedia("(display-mode: standalone)").matches;
  } catch {
    return false;
  }
}

function StartButton() {
  return (
    <Button asChild className="h-14 rounded-full px-8 text-base font-bold text-primary-foreground">
      <Link to="/today">Start now, it&rsquo;s free</Link>
    </Button>
  );
}

// The opening is today, as the Church keeps it: the day's icon and feast, the fast and tone, and the readings. The
// icon changes every day, so the page is never the same twice.
// Shown once the page is running in the browser (the calendar is the visitor's own day); before that, and for search
// engines, the plain statement of what the app is.
function TodayHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <TodayHeroLive /> : <HeroStatement />;
}

function HeroStatement() {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-12 pt-12 text-center sm:pt-20">
      <h1 className="text-balance text-4xl leading-[1.1] sm:text-6xl">Orthodox prayer for every day</h1>
      <p className="scripture-text mx-auto mt-5 text-lg text-muted-foreground">
        Morning, evening and night prayers, the day&rsquo;s readings and saints, and the fasts of the Church year.
      </p>
    </div>
  );
}

function TodayHeroLive() {
  const { today, settings, query } = useDailyCalendar();
  const readings = query.data
    ? [query.data.readings.epistle, query.data.readings.gospel]
        .filter(Boolean)
        .map((reading) => reading?.display ?? reading?.short_display ?? reading?.description)
        .join(" and ")
    : "";
  return (
    <section aria-label="Today" className="mx-auto max-w-2xl px-5 pb-14 pt-6 sm:pt-10">
      <DayIconBanner
        today={today}
        calendar={settings.calendarMode}
        saints={query.data?.saints}
        tone={query.data?.tone?.value}
        fasting={query.data?.fasting}
      />
      {readings ? <p className="scripture-text mt-4 px-1 text-base text-muted-foreground">Today&rsquo;s readings: {readings}.</p> : null}
    </section>
  );
}

export default function Home() {
  if (shouldSkipHome()) return <Navigate to="/today" replace />;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="premium-icon-mark h-10 w-10">
            <OrthodoxCrossIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-semibold tracking-[-0.02em]">Nepsis Shield</span>
        </Link>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/today" state={LOOK_AROUND_STATE}>Open the app</Link>
        </Button>
      </header>

      <main id="main-content">
        <TodayHero />

        {/* Then what the app is, in a sentence, one way in, and a page of the prayer book itself. */}
        <section aria-labelledby="what-it-is" className="border-t border-border/60">
          <div className="mx-auto grid max-w-6xl items-start gap-x-16 gap-y-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <h2 id="what-it-is" className="text-balance text-3xl leading-tight sm:text-5xl">Orthodox prayer for every day</h2>
              <p className="scripture-text mt-5 text-lg text-muted-foreground">
                Morning, evening and night prayers, the day&rsquo;s readings and saints, and the fasts of the Church year. Free, with
                no account, and it works with no signal.
              </p>
              <p className="scripture-text mt-4 text-lg text-muted-foreground">
                <em>Nepsis</em> is the Church&rsquo;s word for watchfulness: keeping the heart awake to God.
              </p>
              <div className="mt-8">
                <StartButton />
              </div>
            </div>
            <figure className="border-t border-border/60 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0" aria-label="From the morning prayers">
              <p className="rubric">Make the sign of the Cross, and begin.</p>
              <p className="scripture-text drop-cap mt-3 text-xl sm:text-2xl">
                In the name of the Father, and of the Son, and of the Holy Spirit. Amen.
              </p>
              <p className="scripture-text mt-3 text-xl sm:text-2xl">Glory to Thee, our God, glory to Thee.</p>
              <p className="rubric mt-6">O Heavenly King</p>
              <p className="scripture-text mt-2 text-lg text-foreground/90">
                O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings
                and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.
              </p>
            </figure>
          </div>
        </section>

      </main>

      <footer className="border-t border-border/50">
        <nav aria-label="Site" className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-8 text-sm text-muted-foreground sm:px-8">
          <Link to="/feasts" className="hover:text-foreground">Feasts and fasts</Link>
          <Link to="/saint-prayers" className="hover:text-foreground">Prayers to the saints</Link>
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
