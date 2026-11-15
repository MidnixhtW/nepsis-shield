import { Link } from "react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PrayerTime } from "@/content/dailyPrayerSteps";
import { useDailyCalendar } from "@/hooks/useDailyCalendar";

const NEXT_LINE: Record<PrayerTime, string> = {
  morning: "Evening prayers come later today.",
  evening: "Night prayers come before sleep.",
  night: "Rest in peace. Morning prayers will be here when you wake.",
};

// The Church's prayer is common prayer: these same words are said this hour across the world. No one is counted.
const CHURCH_LINE: Record<PrayerTime, string> = {
  morning: "The Church prays these same prayers this morning, in every land and language.",
  evening: "The Church prays these same prayers this evening, in every land and language.",
  night: "The Church prays these same prayers tonight, in every land and language.",
};

/** The quiet screen after the last step of prayer: glory to God, the Church praying alongside, today's feast or saint, what comes next. */
export function PrayerFinished({ time, prayerName, onDone }: { time: PrayerTime; prayerName: string; onDone: () => void }) {
  const { query } = useDailyCalendar();
  const saint = query.data?.saints[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid w-full max-w-xl justify-items-center px-6 py-16 text-center sm:py-24">
          <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full border-2 border-accent text-accent">
            <Check className="h-7 w-7" />
          </span>
          <Dialog.Title className="mt-6 text-4xl font-semibold tracking-tight">Glory to God</Dialog.Title>
          <p className="mt-3 text-base text-muted-foreground">You have prayed the {prayerName}.</p>
          <p className="scripture-text mt-8 text-xl leading-relaxed">{CHURCH_LINE[time]}</p>
          {saint ? (
            <p className="mt-8 text-sm text-muted-foreground">
              Today: <span className="font-semibold text-foreground">{saint}</span>.
            </p>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">{NEXT_LINE[time]}</p>
        </div>
      </div>
      <footer className="shrink-0 border-t border-border/50 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-5">
          <Button asChild variant="outline" className="h-12 rounded-2xl border-border/60 px-5">
            <Link to="/read?read=daily" onClick={onDone}>
              <BookOpen className="mr-2 h-4 w-4" /> Today's readings
            </Link>
          </Button>
          <Button type="button" className="h-12 flex-1 rounded-2xl sm:flex-none sm:px-10" onClick={onDone}>
            Done
          </Button>
        </div>
      </footer>
    </div>
  );
}
