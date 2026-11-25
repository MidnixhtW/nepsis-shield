import { useState } from "react";
import { format } from "date-fns";
import { currentSeason, type ChurchCalendar } from "@/lib/fastingSeasons";
import { dayIcon } from "@/lib/dayIcon";
import { ShareCardButton } from "@/components/app/ShareCardButton";
import type { DailyData } from "@/lib/orthocal";

// The top of Today: the day's icon across the full width, framed like a panel on an iconostasis. Nothing is written on
// the icon itself, so no word covers a holy face. Under it, left aligned, the feast or season in red, as feasts are
// printed in the Church's calendar, one sentence for the day, the fast and the tone, then the credit and Share.
// The date itself is in the header.
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

  const words = (
    <>
      <Heading className={"text-balance text-3xl leading-tight shortphone:text-2xl sm:text-4xl " + (ordinary ? "" : "text-cinnabar")}>{heading}</Heading>
      {line ? <p className="scripture-text mt-1 text-balance text-base text-foreground/90">{line}</p> : null}
      {fast || tone ? (
        <ul aria-label="At a glance" className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-foreground/75">
          {fast ? (
            <li className="meta-label inline-flex min-h-7 items-center gap-2">
              <span aria-hidden className={"h-2 w-2 rounded-full " + FAST_DOT[fast.kind]} />
              <span className="sr-only">Fasting today: </span>
              {fast.label}
            </li>
          ) : null}
          {tone ? <li className="meta-label inline-flex min-h-7 items-center tabular-nums">Tone {tone}</li> : null}
        </ul>
      ) : null}
    </>
  );

  return (
    <section aria-label="Today's feast or season" className="pb-2 pt-1">
      {!failed ? (
        <>
          <img
            src={icon.imageUrl}
            alt={icon.alt}
            onError={() => setFailed(true)}
            className="icon-panel block aspect-[5/4] max-h-[40vh] w-full bg-card object-cover object-[50%_16%] shortphone:max-h-[30vh] sm:aspect-[4/3] sm:max-h-[52vh]"
          />
          <div className="mt-4 px-1">{words}</div>
        </>
      ) : (
        <div className="px-1">{words}</div>
      )}
      <div className="mt-1 flex items-center justify-between gap-4 px-1 text-sm text-foreground/75">
        <a href={icon.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-0 items-center truncate underline underline-offset-2 hover:text-foreground">
          Icon: {icon.credit}
        </a>
        <ShareCardButton
          card={{
            eyebrow: format(today, "EEEE, MMMM d"),
            text: ordinary && firstSaint ? `Today we remember ${firstSaint}` : icon.title,
            imageUrl: icon.imageUrl,
          }}
          fileName="today.png"
        />
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
