import { useState } from "react";
import { format } from "date-fns";
import type { ChurchCalendar } from "@/lib/fastingSeasons";
import { dayIcon } from "@/lib/dayIcon";
import { ShareCardButton } from "@/components/app/ShareCardButton";

// The top of Today: the day's feast or season with its icon, shown whole (icons are never cropped),
// over a soft, blurred wash of the same icon.
export function DayIconBanner({ today, calendar, saints }: { today: Date; calendar: ChurchCalendar; saints?: string[] }) {
  const icon = dayIcon(today, calendar);
  const [failed, setFailed] = useState(false);
  const firstSaint = saints?.find(Boolean);
  const ordinary = icon.title === "Today";

  return (
    <section aria-label="Today's feast or season" className="relative isolate overflow-hidden rounded-3xl border border-accent/25 bg-card">
      {!failed ? (
        <img
          src={icon.imageUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover opacity-35 blur-2xl"
        />
      ) : null}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-card via-card/85 to-card/30" />
      <div className="flex items-center gap-4 p-5 sm:gap-6 sm:p-6">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{format(today, "EEEE, MMMM d")}</p>
          <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {ordinary && firstSaint ? "Today we remember" : icon.title}
          </h1>
          {ordinary && firstSaint ? (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-foreground/85">{firstSaint}</p>
          ) : null}
          <div className="mt-3">
            <ShareCardButton
              card={{
                eyebrow: format(today, "EEEE, MMMM d"),
                text: ordinary && firstSaint ? `Today we remember ${firstSaint}` : icon.title,
                commonsFile: icon.file,
              }}
              fileName="today.png"
            />
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
            Icon:{" "}
            <a href={icon.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              {icon.credit}
            </a>
          </p>
        </div>
        {!failed ? (
          <img
            src={icon.imageUrl}
            alt={icon.alt}
            onError={() => setFailed(true)}
            className="h-36 w-auto max-w-[42%] shrink-0 rounded-xl object-contain shadow-[0_12px_32px_hsl(0_0%_0%/0.45)] sm:h-48"
          />
        ) : null}
      </div>
    </section>
  );
}
