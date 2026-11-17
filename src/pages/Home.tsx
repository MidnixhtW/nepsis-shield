import { Link, Navigate } from "react-router";
import { Capacitor } from "@capacitor/core";
import { Smartphone } from "lucide-react";
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

function StartButtons({ center = false }: { center?: boolean }) {
  return (
    <div className={center ? "flex flex-col items-center gap-3 sm:flex-row sm:justify-center" : "flex flex-col gap-3 sm:flex-row"}>
      <Button asChild className="gold-foil h-14 rounded-full px-8 text-base font-bold text-primary-foreground">
        <Link to="/today">
          Start now, it&rsquo;s free
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
    title: "Early career",
    body: "Five minutes of morning prayer before the inbox, and a way back to calm when a meeting goes badly.",
  },
  {
    title: "Studying",
    body: "A two-minute rule that survives exam weeks, and evening prayers that help you put the phone down.",
  },
  {
    title: "Serving",
    body: "Military, police, fire, EMS, dispatch and chaplains get shift-length prayers and a reset built for the job.",
  },
  {
    title: "Late nights",
    body: "Compline, the Jesus Prayer with a prayer-rope counter, and a stillness timer for when sleep won’t come.",
  },
];

const features = [
  {
    title: "Prayers you can keep",
    body: "Morning, evening and night prayers in four lengths, prayed full-screen one step at a time, with read-aloud. You never lose your place.",
  },
  {
    title: "Readings, saints and feasts",
    body: "The day’s Epistle and Gospel, the saints and feasts, and the whole Bible, following the Church calendar, New or Old.",
  },
  {
    title: "The fasts, day by day",
    body: "Today’s fast at a glance, and a day-by-day companion through Great Lent and every fast of the year, with a short prayer for each day.",
  },
];

const habits = [
  {
    title: "A quiet record",
    body: "A quiet week of dots shows the days you prayed. Miss one and it is simply empty; nothing resets, nothing scolds.",
  },
  {
    title: "Reminders at your hours",
    body: "Morning, evening and night reminders in the Android app, whether you wake at five or finish a late shift.",
  },
  {
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
          <span className="font-display text-base font-semibold tracking-[-0.02em]">Nepsis Shield</span>
        </Link>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/today" state={LOOK_AROUND_STATE}>Open the app</Link>
        </Button>
      </header>

      <main id="main-content">
        {/* The opening is a page of the prayer book itself: what the app is, before anything is said about it. */}
        <section className="mx-auto max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20">
          <h1 className="text-balance text-4xl leading-[1.1] sm:text-6xl">Orthodox prayer for every day</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Morning, evening and night prayers, the day&rsquo;s readings and saints, and the fasts of the Church year. Free, with no
            account, and it works with no signal.
          </p>
          <div className="mt-8">
            <StartButtons />
          </div>

          <figure className="mt-14 border-t border-border/60 pt-8" aria-label="From the morning prayers">
            <p className="rubric">Make the sign of the Cross, and begin.</p>
            <p className="scripture-text drop-cap mt-3 text-xl leading-relaxed sm:text-2xl">
              In the name of the Father, and of the Son, and of the Holy Spirit. Amen.
            </p>
            <p className="scripture-text mt-3 text-xl leading-relaxed sm:text-2xl">Glory to Thee, our God, glory to Thee.</p>
            <p className="rubric mt-6">O Heavenly King</p>
            <p className="scripture-text mt-2 text-lg leading-relaxed text-foreground/90">
              O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings
              and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.
            </p>
          </figure>
        </section>

        <section aria-labelledby="real-life" className="border-y border-border/50 bg-card/30">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 id="real-life" className="max-w-2xl text-3xl sm:text-4xl">A rule small enough to keep</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Each prayer comes in four lengths, from one minute to a full rule, so it fits a school day, a long shift or a sleepless night.
            </p>
            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {lives.map((item) => (
                <article key={item.title}>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="features" className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div>
              <h2 id="features" className="max-w-xl text-3xl sm:text-4xl">The day as the Church keeps it</h2>
              <ul className="mt-8 grid gap-7">
                {features.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-xl">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mx-auto w-full max-w-[17rem] sm:max-w-xs">
              <div className="rounded-[2.75rem] border border-border/60 bg-black p-2.5">
                <img
                  src="/home/today.jpg"
                  alt="The Today screen: the day's icon and feast, the prayers for the hour, and the fasting season's day."
                  width={540}
                  height={1080}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-[2.2rem]"
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="consistency" className="border-y border-border/50 bg-card/30">
          <div className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="mx-auto w-full max-w-[17rem] sm:max-w-xs">
              <div className="rounded-[2.75rem] border border-border/60 bg-black p-2.5">
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
              <h2 id="consistency" className="text-3xl sm:text-4xl">No streaks, no guilt</h2>
              <ul className="mt-8 grid gap-7">
                {habits.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-xl">{item.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="begin" className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 id="begin" className="text-3xl sm:text-4xl">Begin with two minutes</h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            <em>Nepsis</em> is the Church&rsquo;s word for watchfulness: keeping the heart awake to God. Tomorrow morning, open the app and
            pray the short morning prayers.
          </p>
          <div className="mt-8">
            <StartButtons />
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
