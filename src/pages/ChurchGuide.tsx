import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { GREAT_FEASTS } from "@/content/greatFeasts";
import {
  GUIDE_FASTS,
  GUIDE_SAINTS,
  guidePage,
  nextFeastDate,
  saintFeast,
  upcomingFast,
  type GuidePage,
} from "@/lib/churchGuide";
import { fixedDate, journeyDay, type SeasonId } from "@/lib/fastingSeasons";
import { ocaLivesUrl } from "@/content/myPatrons";
import { ocaSaintSearchUrl } from "@/lib/patronSaints";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { SITE_ORIGIN } from "@/lib/routeMeta";
import NotFound from "@/pages/NotFound";

const LONG = "EEEE, MMMM d, yyyy";

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

// These pages are not in the app's own route list (that would put the saints list in every download), so each sets
// its title, description and canonical address itself when it opens. The build writes the same into its HTML file.
function useGuideMeta(page: GuidePage) {
  useEffect(() => {
    const url = `${SITE_ORIGIN}${page.path}`;
    document.title = page.title;
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[name="twitter:title"]', "content", page.title);
    setMeta('meta[name="description"]', "content", page.description);
  }, [page]);
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6">
        <Link to="/" className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="premium-icon-mark h-10 w-10">
            <OrthodoxCrossIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-base font-semibold">Nepsis Shield</span>
        </Link>
        <Button asChild variant="ghost" className="rounded-full">
          <Link to="/today" state={LOOK_AROUND_STATE}>
            Open the app
          </Link>
        </Button>
      </header>
      <main id="main-content" className="mx-auto max-w-3xl px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        {children}
      </main>
      <footer className="border-t border-border/50">
        <nav aria-label="Site" className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-8 text-sm text-foreground/75 sm:px-8">
          <Link to="/feasts" className="hover:text-foreground">Feasts and fasts</Link>
          <Link to="/saint-prayers" className="hover:text-foreground">Prayers to the saints</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/download" className="hover:text-foreground">Install</Link>
        </nav>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border/60 py-7">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-3 grid gap-3 text-base leading-relaxed">{children}</div>
    </section>
  );
}

function KeepItInTheApp({ line }: { line: string }) {
  return (
    <section className="border-t border-border/60 py-8 text-center">
      <p className="scripture-text mx-auto max-w-lg text-lg">{line}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button asChild className="h-12 rounded-full px-7 text-base font-semibold">
          <Link to="/today">Open Nepsis Shield, free</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 rounded-full px-6">
          <Link to="/download">Install on your phone</Link>
        </Button>
      </div>
      <p className="mt-3 text-sm text-foreground/75">No account. It works with no signal.</p>
    </section>
  );
}

function Breadcrumb({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="text-sm font-semibold text-accent underline-offset-2 hover:underline">
      {label}
    </Link>
  );
}

// ---- Feast --------------------------------------------------------------------------------------------------------

function FeastPage({ slug }: { slug: string }) {
  const feast = GREAT_FEASTS.find((item) => item.slug === slug)!;
  const now = new Date();
  const next = nextFeastDate(feast, now, "gregorian");
  const nextOld = nextFeastDate(feast, now, "julian");
  const following = nextFeastDate(feast, new Date(next.getFullYear() + 1, 0, 1), "gregorian");
  return (
    <article>
      <Breadcrumb to="/feasts" label="Feasts and fasts" />
      <h1 className="mt-3 text-balance text-4xl text-cinnabar sm:text-5xl">{feast.name}</h1>
      <p className="scripture-text mt-3 text-lg text-foreground/85">
        {feast.fixed
          ? `Next kept on ${format(next, LONG)} on the New Calendar, and ${format(nextOld, LONG)} on the Old Calendar.`
          : `Next kept on ${format(next, LONG)}, on both the New and the Old Calendar, since it follows Pascha.`}
      </p>
      {feast.greeting ? (
        <p className="mt-4 text-lg">
          The greeting: <span className="text-cinnabar">{feast.greeting.greeting}</span> And the answer:{" "}
          <span className="text-cinnabar">{feast.greeting.response}</span>
        </p>
      ) : null}
      <div className="h-6" />
      <Section title="The feast">
        {feast.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Section>
      <Section title="Dates">
        <ul className="grid gap-1">
          <li>{format(next, LONG)}{feast.fixed ? " (New Calendar)" : ""}</li>
          {feast.fixed ? <li>{format(nextOld, LONG)} (Old Calendar)</li> : null}
          <li>{format(following, LONG)}{feast.fixed ? " (New Calendar, the year after)" : " (the year after)"}</li>
        </ul>
      </Section>
      <Section title="The services and hymns">
        <p>The day&rsquo;s readings, hymns and lives of the saints are on the Orthodox Church in America&rsquo;s calendar.</p>
        <a href={ocaLivesUrl(next)} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1.5 font-semibold text-accent underline-offset-2 hover:underline">
          The feast on the OCA calendar <ExternalLink aria-hidden className="h-4 w-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Section>
      <KeepItInTheApp line="Keep the feast with the day's prayers, readings and saints, every morning and evening." />
    </article>
  );
}

// ---- Fast ---------------------------------------------------------------------------------------------------------

function FastPage({ id }: { id: SeasonId }) {
  const now = new Date();
  const season = upcomingFast(id, now, "gregorian");
  const seasonOld = upcomingFast(id, now, "julian");
  if (!season) return <NotFound />;
  const days = Array.from({ length: season.length }, (_, index) => ({ index, day: journeyDay(season, index, "gregorian") }));
  return (
    <article>
      <Breadcrumb to="/feasts" label="Feasts and fasts" />
      <h1 className="mt-3 text-balance text-4xl text-cinnabar sm:text-5xl">
        The {season.name} {season.start.getFullYear()}
      </h1>
      <p className="scripture-text mt-3 text-lg text-foreground/85">
        {format(season.start, "MMMM d")} to {format(season.end, LONG)} on the New Calendar
        {seasonOld && seasonOld.start.getTime() !== season.start.getTime()
          ? `, and ${format(seasonOld.start, "MMMM d")} to ${format(seasonOld.end, LONG)} on the Old Calendar`
          : ", on both calendars"}
        . {season.length} days.
      </p>
      <div className="h-6" />
      <Section title="The fast">
        <p>{season.summary}</p>
      </Section>
      <Section title="How it is kept">
        <p>{season.fastingNote}</p>
        <p className="text-foreground/80">Ask your priest how to keep it with your health, work and duty in mind.</p>
      </Section>
      <Section title="Day by day">
        <ol className="grid gap-5">
          {days.map(({ index, day }) => (
            <li key={index}>
              <p className="text-sm text-foreground/75">
                Day {index + 1}, {format(new Date(season.start.getFullYear(), season.start.getMonth(), season.start.getDate() + index), "EEEE, MMMM d")}
              </p>
              <p className="font-semibold">{day.title}</p>
              {day.prayer ? <p className="scripture-text mt-1">{day.prayer.text}</p> : null}
              <p className="mt-1 text-foreground/85">{day.practice}</p>
            </li>
          ))}
        </ol>
      </Section>
      <KeepItInTheApp line={`Keep the ${season.name} day by day: each morning the app opens on that day's prayer and practice.`} />
    </article>
  );
}

// ---- Saint --------------------------------------------------------------------------------------------------------

function SaintPage({ slug }: { slug: string }) {
  const saint = GUIDE_SAINTS.find((item) => item.slug === slug)!;
  const feast = saintFeast(saint);
  const year = new Date().getFullYear();
  return (
    <article>
      <Breadcrumb to="/saint-prayers" label="Prayers to the saints" />
      <h1 className="mt-3 text-balance text-4xl text-cinnabar sm:text-5xl">Prayer to {saint.name.replace(/^Holy /, "the Holy ")}</h1>
      <p className="scripture-text mt-3 text-lg text-foreground/85">
        Asked for help {saint.needs.map((item) => item.note.replace(/\.$/, "").replace(/^For /, "for ")).join("; ")}.
      </p>
      <div className="h-6" />
      <Section title="The prayer">
        <p className="scripture-text drop-cap text-xl leading-relaxed">{saint.prayer}</p>
      </Section>
      {feast ? (
        <Section title="Feast day">
          <p>
            {format(fixedDate(year, feast.month, feast.day, "gregorian"), "MMMM d")} on the New Calendar,{" "}
            {format(fixedDate(year, feast.month, feast.day, "julian"), "MMMM d")} on the Old Calendar.
          </p>
        </Section>
      ) : null}
      <Section title="The life">
        <a href={ocaSaintSearchUrl(saint.search)} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1.5 font-semibold text-accent underline-offset-2 hover:underline">
          Read the life on the OCA website <ExternalLink aria-hidden className="h-4 w-4" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Section>
      <KeepItInTheApp line="Keep this prayer with you, add the saint's feast as a name-day reminder, and pray each day with the Church." />
    </article>
  );
}

// ---- Indexes ------------------------------------------------------------------------------------------------------

function FeastsIndex() {
  const now = new Date();
  const feasts = GREAT_FEASTS.map((feast) => ({ feast, next: nextFeastDate(feast, now, "gregorian") })).sort((a, b) => a.next.getTime() - b.next.getTime());
  const fasts = GUIDE_FASTS.map((id) => upcomingFast(id, now, "gregorian")).filter((season) => season !== null);
  return (
    <article>
      <h1 className="text-balance text-4xl sm:text-5xl">Feasts and fasts of the Orthodox Church</h1>
      <p className="scripture-text mt-3 text-lg text-foreground/85">Pascha, the Twelve Great Feasts and the fasts of the year, soonest first. Dates are on the New Calendar; each page gives the Old Calendar too.</p>
      <div className="h-6" />
      <Section title="The great feasts">
        <ul className="grid gap-2">
          {feasts.map(({ feast, next }) => (
            <li key={feast.slug}>
              <Link to={`/feasts/${feast.slug}`} className="font-semibold underline-offset-2 hover:underline">{feast.name}</Link>
              <span className="text-foreground/75">, {format(next, "MMMM d, yyyy")}</span>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="The fasts">
        <ul className="grid gap-2">
          {fasts.map((season) => (
            <li key={season!.id}>
              <Link to={`/fasts/${season!.id}`} className="font-semibold underline-offset-2 hover:underline">The {season!.name}</Link>
              <span className="text-foreground/75">, {format(season!.start, "MMMM d")} to {format(season!.end, "MMMM d, yyyy")}</span>
            </li>
          ))}
        </ul>
      </Section>
      <KeepItInTheApp line="Each day the app opens on the day's icon, feast or fast, readings and saints." />
    </article>
  );
}

function SaintsIndex() {
  const saints = [...GUIDE_SAINTS].sort((a, b) => a.name.replace(/^(Saints?|Holy) /, "").localeCompare(b.name.replace(/^(Saints?|Holy) /, "")));
  return (
    <article>
      <h1 className="text-balance text-4xl sm:text-5xl">Prayers to the saints</h1>
      <p className="scripture-text mt-3 text-lg text-foreground/85">Short prayers to the saints Orthodox Christians ask for help, each with what they are asked for.</p>
      <div className="h-6" />
      <Section title={`${saints.length} saints`}>
        <ul className="grid gap-3">
          {saints.map((saint) => (
            <li key={saint.slug}>
              <Link to={`/saints/${saint.slug}`} className="font-semibold underline-offset-2 hover:underline">{saint.name}</Link>
              <p className="text-foreground/75">{saint.needs.map((item) => item.need).join(", ")}</p>
            </li>
          ))}
        </ul>
      </Section>
      <KeepItInTheApp line="Find the saint for any need, and keep the saints of each day, in the app." />
    </article>
  );
}

/** Every guide page, chosen by address; also used by the build to pre-render each one. */
export function ChurchGuidePage({ path }: { path: string }) {
  const page = guidePage(path);
  if (!page) return <NotFound />;
  return <GuideBody page={page} />;
}

function GuideBody({ page }: { page: GuidePage }) {
  useGuideMeta(page);
  return (
    <Shell>
      {page.kind === "hub" && page.slug === "feasts" ? <FeastsIndex /> : null}
      {page.kind === "hub" && page.slug === "saint-prayers" ? <SaintsIndex /> : null}
      {page.kind === "feast" ? <FeastPage slug={page.slug} /> : null}
      {page.kind === "fast" ? <FastPage id={page.slug as SeasonId} /> : null}
      {page.kind === "saint" ? <SaintPage slug={page.slug} /> : null}
    </Shell>
  );
}

export default function ChurchGuide() {
  const { pathname } = useLocation();
  return <ChurchGuidePage path={pathname} />;
}
