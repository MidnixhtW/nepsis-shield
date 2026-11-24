import { useState } from "react";
import { format } from "date-fns";
import { currentSeason, type ChurchCalendar } from "@/lib/fastingSeasons";
import { dayIcon } from "@/lib/dayIcon";
import { ShareCardButton } from "@/components/app/ShareCardButton";

// The top of Today: the day's icon first, whole (kept smaller on phones so Begin shows without scrolling), the way one venerates the icon on entering church. Below
// it, the day's feast or season in red, as feasts are printed in the Church's calendar, and one sentence for the rest
// of the day: its tone, the day of the fast, the saint remembered. The date itself is in the header.
export function DayIconBanner({
  today,
  calendar,
  saints,
  tone,
}: {
  today: Date;
  calendar: ChurchCalendar;
  saints?: string[];
  tone?: number;
}) {
  const icon = dayIcon(today, calendar);
  const [failed, setFailed] = useState(false);
  const firstSaint = saints?.find(Boolean);
  const ordinary = icon.title === "Today";
  const heading = ordinary && firstSaint ? firstSaint : ordinary ? format(today, "EEEE, MMMM d") : icon.title;

  const active = currentSeason(today, calendar);
  const line = [
    tone ? `Tone ${tone}` : "",
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
          className="mx-auto h-auto max-h-[min(15rem,30vh)] sm:max-h-[min(24rem,52vh)] lg:max-h-[min(22rem,36vh)] w-auto max-w-full rounded-md object-contain shadow-[0_18px_48px_hsl(0_0%_0%/0.45)]"
        />
      ) : null}
      <h1 className={"mx-auto mt-5 max-w-2xl text-balance text-3xl leading-tight sm:text-4xl " + (ordinary ? "" : "text-cinnabar")}>
        {heading}
      </h1>
      {line ? <p className="scripture-text mx-auto mt-2 max-w-xl text-balance text-base text-foreground/85">{line}</p> : null}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-foreground/75">
        <ShareCardButton
          card={{
            eyebrow: format(today, "EEEE, MMMM d"),
            text: ordinary && firstSaint ? `Today we remember ${firstSaint}` : icon.title,
            imageUrl: icon.imageUrl,
          }}
          fileName="today.png"
        />
        <a href={icon.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
          Icon: {icon.credit}
        </a>
      </div>
    </section>
  );
}
