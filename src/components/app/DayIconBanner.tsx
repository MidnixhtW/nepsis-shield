import { useState } from "react";
import { format } from "date-fns";
import { currentSeason, type ChurchCalendar } from "@/lib/fastingSeasons";
import { dayIcon } from "@/lib/dayIcon";
import { ShareCardButton } from "@/components/app/ShareCardButton";
import type { DailyData } from "@/lib/orthocal";

// The top of Today: the day's icon first, whole (kept smaller on phones so Begin shows without scrolling), the way one venerates the icon on entering church. Below
// it, the day's feast or season in red, as feasts are printed in the Church's calendar, and one sentence for the rest
// of the day: its tone, the day of the fast, the saint remembered. The date itself is in the header.
export function DayIconBanner({
  today,
  calendar,
  saints,
  tone,
  fasting,
  headingLevel = "h1",
  westernSeason,
}: {
  today: Date;
  calendar: ChurchCalendar;
  saints?: string[];
  tone?: number;
  fasting?: DailyData["fasting"];
  /** h2 where the page already has its own h1 (the landing page). */
  headingLevel?: "h1" | "h2";
  /** For Western Rite users: the Western season ("Advent, first week"), said first. */
  westernSeason?: string;
}) {
  const Heading = headingLevel;
  const icon = dayIcon(today, calendar);
  const [failed, setFailed] = useState(false);
  const firstSaint = saints?.find(Boolean);
  const ordinary = icon.title === "Today";
  const heading = ordinary && firstSaint ? firstSaint : ordinary ? format(today, "EEEE, MMMM d") : icon.title;

  const active = currentSeason(today, calendar);
  const fast = fasting ? fastBadge(fasting) : null;
  const line = [
    westernSeason ?? "",
    active
      ? icon.title === active.season.name
        ? `Day ${active.index + 1} of ${active.season.length}`
        : `${active.season.name}, day ${active.index + 1} of ${active.season.length}`
      : "",
    !ordinary && firstSaint ? `We remember ${firstSaint}` : "",
  ]
    .filter(Boolean)
    .map((part) => `${part}.`)
    .join(" ");

  return (
    <section aria-label="Today's feast or season" className="px-1 pb-2 pt-1 text-center">
      {!failed ? (
        <img
          src={icon.imageUrl}
          alt={icon.alt}
          onError={() => setFailed(true)}
          className="mx-auto h-auto max-h-[min(13rem,26vh)] shortphone:max-h-[20vh] sm:max-h-[min(24rem,52vh)] lg:max-h-[min(22rem,36vh)] w-auto max-w-full rounded-md object-contain shadow-[0_18px_48px_hsl(0_0%_0%/0.45)]"
        />
      ) : null}
      <Heading className={"mx-auto mt-5 max-w-2xl text-balance text-3xl leading-tight shortphone:mt-2 shortphone:text-2xl sm:text-4xl " + (ordinary ? "" : "text-cinnabar")}>
        {heading}
      </Heading>
      {line ? <p className="scripture-text mx-auto mt-2 max-w-xl text-balance text-base text-foreground/85">{line}</p> : null}
      {fast || tone ? (
        // The day's rule and tone in small capitals, the way a printed Church calendar sets them under the feast.
        <ul aria-label="At a glance" className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-muted-foreground shortphone:mt-2">
          {fast ? (
            <li className="meta-label inline-flex min-h-8 items-center gap-2">
              <span aria-hidden className={"h-2 w-2 rounded-full " + FAST_DOT[fast.kind]} />
              <span className="sr-only">Fasting today: </span>
              {fast.label}
            </li>
          ) : null}
          {tone ? <li className="meta-label inline-flex min-h-8 items-center tabular-nums">Tone {tone}</li> : null}
        </ul>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-foreground/75 shortphone:mt-1">
        <ShareCardButton
          card={{
            eyebrow: format(today, "EEEE, MMMM d"),
            text: ordinary && firstSaint ? `Today we remember ${firstSaint}` : icon.title,
            imageUrl: icon.imageUrl,
          }}
          fileName="today.png"
        />
        <a href={icon.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-foreground">
          Icon: {icon.credit}
        </a>
      </div>
    </section>
  );
}

// The day's fast in a word, the way the printed Church calendars mark it: crimson for a strict fast, gold when the
// fast is relaxed (wine and oil, fish), green when there is no fast. The label also says it, so the colour is a help only.
type FastKind = "strict" | "relaxed" | "free";
const FAST_DOT: Record<FastKind, string> = { strict: "bg-[#B23A4A]", relaxed: "bg-[#C5A059]", free: "bg-[#3F8F78]" };

export function fastBadge(fasting: DailyData["fasting"]): { label: string; kind: FastKind } {
  if (!fasting.level) return { label: "No fast today", kind: "free" };
  const exception = fasting.exception?.trim();
  if (exception) {
    if (/meat fast/i.test(exception)) return { label: "Dairy allowed, no meat", kind: "relaxed" };
    if (/fast free|no fast/i.test(exception)) return { label: "No fast today", kind: "free" };
    const allowed = exception.replace(/\s+(are|is)\s+allowed\.?$/i, "").trim();
    const sentence = allowed.charAt(0).toUpperCase() + allowed.slice(1).toLowerCase();
    return { label: `${sentence} allowed`, kind: "relaxed" };
  }
  return { label: "Strict fast", kind: "strict" };
}
