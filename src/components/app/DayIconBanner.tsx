import { useState } from "react";
import { format } from "date-fns";
import type { ChurchCalendar } from "@/lib/fastingSeasons";
import { dayIcon } from "@/lib/dayIcon";
import { ShareCardButton } from "@/components/app/ShareCardButton";

// The top of Today: the day's icon first, whole and large, the way one venerates the icon on entering church. Below
// it, the day's feast or season in red, as feasts are printed in the Church's calendar, or the first saint of the day.
export function DayIconBanner({ today, calendar, saints }: { today: Date; calendar: ChurchCalendar; saints?: string[] }) {
  const icon = dayIcon(today, calendar);
  const [failed, setFailed] = useState(false);
  const firstSaint = saints?.find(Boolean);
  const ordinary = icon.title === "Today";
  const heading = ordinary && firstSaint ? firstSaint : icon.title;

  return (
    <section aria-label="Today's feast or season" className="px-1 pb-2 pt-1 text-center">
      {!failed ? (
        <img
          src={icon.imageUrl}
          alt={icon.alt}
          onError={() => setFailed(true)}
          className="mx-auto h-auto max-h-[min(24rem,52vh)] w-auto max-w-full rounded-md object-contain shadow-[0_18px_48px_hsl(0_0%_0%/0.45)]"
        />
      ) : null}
      <p className="mt-5 text-sm text-muted-foreground">{format(today, "EEEE, MMMM d")}</p>
      <h1 className={"mx-auto mt-1 max-w-2xl text-balance text-3xl leading-tight sm:text-4xl " + (ordinary ? "" : "text-cinnabar")}>
        {heading}
      </h1>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
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
