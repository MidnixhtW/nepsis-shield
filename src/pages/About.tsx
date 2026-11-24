import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { CURRENT_VERSION } from "@/lib/releaseInfo";
import { CONTACT_URL } from "@/lib/publicSite";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-border/80 pt-8">
      <h2 id={id} className="text-2xl">{title}</h2>
      <div className="scripture-text mt-4 grid gap-4 text-base text-foreground/90">{children}</div>
    </section>
  );
}

function Source({ name, href, children }: { name: string; href: string; children: ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline underline-offset-4">
        {name}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <span className="text-muted-foreground">. {children}</span>
    </li>
  );
}

// About, set like the front matter of a prayer book: what it is, what it is not, who made it. Where the texts come
// from sits folded at the end, for anyone who wants it.
export default function About() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-2xl items-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Button asChild variant="ghost" className="rounded-full px-3">
          <Link to="/today" state={LOOK_AROUND_STATE}>
            <ArrowLeft aria-hidden className="h-4 w-4" /> Today
          </Link>
        </Button>
      </header>

      <main id="main-content" className="mx-auto grid max-w-2xl gap-12 px-5 pb-20 pt-8 sm:pt-12">
        <div>
          <h1 className="text-balance text-4xl leading-tight sm:text-5xl">About Nepsis Shield</h1>
          <p className="scripture-text mt-4 text-lg text-muted-foreground">
            An Orthodox prayer companion for keeping watch. <em>Nepsis</em> is the Church&rsquo;s word for watchfulness: staying awake to
            God and guarding the heart.
          </p>
        </div>

        <Section id="what-it-is" title="What it is">
          <p>
            Everyone keeps watch over something, whether a family, a household, their own heart, or a post. The app gives daily prayer,
            Scripture, the saints and the fasts to all of them, under the protection of St Michael the Archangel.
          </p>
          <p>
            Some people keep watch over others for a living: military, police, fire, EMS, dispatch, corrections and chaplains. For them
            the app adds the Life &amp; Service Guide, the warrior saints and the Canon for the Fallen. Choose a service role in Settings
            to see that support first.
          </p>
          <p>
            The prayers and calendar follow the Orthodox Church, and every Christian is welcome to pray with it. Eastern Catholics
            (Byzantine, Melkite, Ruthenian, Ukrainian) pray these same prayers, though the calendar and some commemorations may differ,
            so follow your parish; in Settings you can choose Melkite or Byzantine Catholic. For Western Rite Orthodox parishes the app
            includes the Rosary and the Angelus, which Catholics can pray too.
          </p>
        </Section>

        <Section id="what-it-is-not" title="What it is not">
          <p>
            It is a devotional aid: prayer, Scripture, prompts for life and service, and your own notes. It does not replace your
            priest or spiritual father, pastoral care, the sacraments, or emergency and mental health care. For guidance, confession
            and questions of doctrine or practice, ask your priest; if you are not Orthodox, your pastor or chaplain.
          </p>
          <p>
            If you may harm yourself or someone else, call emergency services or a crisis line now (988 in the U.S.), or tell a
            trusted leader, chaplain or clinician.
          </p>
          <p className="text-muted-foreground">
            Nepsis Shield is independent. It is not an official app of the Orthodox Church in America (OCA) and is not endorsed by or
            affiliated with it. &ldquo;Orthodox Church in America&rdquo; and &ldquo;OCA&rdquo; are trademarks of their owners and are
            named only to identify sources. Provided as is, without warranties.
          </p>
        </Section>

        <Section id="who-made-it" title="Who made it">
          <p>
            Made by Empathik, free, with no ads, purchases or accounts. For questions, corrections and privacy requests, write on{" "}
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
              the project&rsquo;s GitHub page<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
          <p className="flex flex-wrap gap-x-5 font-sans text-sm">
            <Link to="/release-notes" className="inline-flex min-h-11 items-center underline underline-offset-4">What&rsquo;s new in {CURRENT_VERSION}</Link>
            <Link to="/privacy-policy" className="inline-flex min-h-11 items-center underline underline-offset-4">Privacy Policy</Link>
            <Link to="/terms" className="inline-flex min-h-11 items-center underline underline-offset-4">Terms of Use</Link>
            <Link to="/cookies" className="inline-flex min-h-11 items-center underline underline-offset-4">Cookie Policy</Link>
            <Link to="/download" className="inline-flex min-h-11 items-center underline underline-offset-4">Install</Link>
          </p>
        </Section>

        <details className="group border-t border-border/80 pt-6">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-lg font-display [&::-webkit-details-marker]:hidden">
            Where the texts come from
            <span aria-hidden className="text-muted-foreground transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <ul className="scripture-text mt-4 grid gap-3 text-base">
            <Source name="orthocal.info" href="https://orthocal.info">
              The Church calendar: saints, fasts, tones and the day&rsquo;s readings, New and Old Calendar. The next two weeks are kept
              on your phone, so Today opens with no signal.
            </Source>
            <Source name="Orthodox Church in America" href="https://www.oca.org">
              Links to prayers, articles and the daily readings pages.
            </Source>
            <Source name="bible-api.com and bolls.life" href="https://bolls.life">
              Public Bible libraries that supply the Scripture text for each reading.
            </Source>
            <Source name="Wikimedia Commons" href="https://commons.wikimedia.org">
              The icons on Today, public-domain works kept on this site, each linked to its Commons page.
            </Source>
            <li className="text-muted-foreground">
              New King James Version® copyright © 1982 by Thomas Nelson. Brenton&rsquo;s Septuagint, the KJV, the WEB and the
              Douay-Rheims are in the public domain. Prayers are credited where they appear.
            </li>
          </ul>
        </details>
      </main>
    </div>
  );
}
