import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { format } from "date-fns";
import { ArrowRight, BookOpen, ExternalLink, Leaf, LifeBuoy, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AppSection } from "@/components/app/AppShell";
import { RuleOfVigilanceCard } from "@/components/app/RuleOfVigilanceCard";
import { SeasonJourneyCard } from "@/components/app/SeasonJourneyCard";
import { BackupReminderCard } from "@/components/app/BackupReminderCard";
import { MemorialsCard } from "@/components/app/MemorialsCard";
import { NameDayCard } from "@/components/app/NameDay";
import { FeastGreetingCard } from "@/components/app/FeastGreetingCard";
import { GroundMeNow } from "@/components/app/GroundMeNow";
import { openHelpPanel } from "@/lib/appEvents";
import { buildOcaDailyUrl } from "@/lib/orthocal";
import { currentSeason } from "@/lib/fastingSeasons";
import { isWarriorSaint } from "@/lib/warriorSaints";

export function TodayOverview({ onNavigate, onOpenRoute }: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
  onOpenRoute?: (path: string) => void;
}) {
  const { today, settings, query: q, retry } = useDailyCalendar();
  const sourceUrl = settings.jurisdiction === "goarch"
    ? `https://www.goarch.org/chapel?date=${encodeURIComponent(format(today, "M/d/yyyy"))}`
    : q.data?.sources.ocaDailyUrl ?? buildOcaDailyUrl(today);

  const inSeason = currentSeason(today, settings.calendarMode) !== null;

  // The "Ground Me Now" app shortcut links to /today#ground, so open the reset when that is the target.
  const groundDefault = typeof window !== "undefined" && window.location.hash === "#ground" ? "ground" : undefined;

  // Two columns on desktop: the day's journey and rule on the left, help and the calendar on the right.
  // On phones the columns stack in the same order as before.
  return (
    <div className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <div className="grid min-w-0 gap-5 sm:gap-6">
        <FeastGreetingCard today={today} calendar={settings.calendarMode} />
        <NameDayCard today={today} />
        <SeasonJourneyCard today={today} calendar={settings.calendarMode} />
        <RuleOfVigilanceCard onNavigate={onNavigate} compact={inSeason} />
        <MemorialsCard today={today} />
      </div>
      <div className="grid min-w-0 gap-5 sm:gap-6">
      {/* Help lives in the top bar on every screen, so Today keeps only a short pointer and the reset. */}
      <section aria-label="Help now" className="rounded-3xl border bg-card px-5">
        <div className="flex flex-wrap items-center gap-3 py-4">
          <LifeBuoy aria-hidden className="h-5 w-5 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Struggling right now?</p>
            <p className="text-xs text-muted-foreground">Help is always at the top of every screen.</p>
          </div>
          <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={openHelpPanel}>
            Open Help
          </Button>
        </div>
        <Accordion type="single" collapsible defaultValue={groundDefault} className="border-t">
          <AccordionItem value="ground" className="border-0">
            <AccordionTrigger className="text-left">Ground me now · guided reset</AccordionTrigger>
            <AccordionContent><GroundMeNow /></AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <BackupReminderCard />
      <DailyContentStatus date={today} data={q.data} failed={q.isError} refreshing={q.isFetching} onRetry={retry} />
      <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-1">
        <Card className="rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Readings · {format(today, "MMMM d")}</p>
          <h2 className="mt-2 text-2xl font-semibold">Receive today’s Scripture.</h2>
          {q.isLoading ? <Skeleton className="mt-4 h-16 w-full rounded-xl" /> : q.data ? (
            <div className="mt-4 grid gap-2 text-sm">
              {[q.data.readings.epistle, q.data.readings.gospel].filter(Boolean).map((reading, index) => (
                <p key={index}>{reading?.display ?? reading?.short_display ?? reading?.description}</p>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-muted-foreground">Daily details are unavailable. Open the readings or the trusted calendar source below.</p>}
          <Button className="mt-5 rounded-xl" onClick={() => onNavigate?.({ section: "read", read: "daily" })}>
            <BookOpen className="mr-2 h-4 w-4" /> Open readings <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
        <Card id="saints-fast" className="scroll-mt-24 rounded-3xl p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Saints and fast</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">{settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}</Badge>
            {q.data?.tone?.value ? <Badge variant="secondary">Tone {q.data.tone.value}</Badge> : null}
          </div>
          {q.isLoading ? <Skeleton className="mt-4 h-24 w-full rounded-xl" /> : q.data ? (
            <div className="mt-4 grid gap-3 text-sm">
              <p className="flex items-start gap-2 text-muted-foreground"><Leaf className="mt-0.5 h-4 w-4 shrink-0" /><span>{q.data.fasting.description}{q.data.fasting.exception ? ` · ${q.data.fasting.exception}` : ""}</span></p>
              <ul className="grid gap-2">
                {q.data.saints.slice(0, 3).map((saint) => (
                  <li key={saint}>
                    {saint}
                    {isWarriorSaint(saint) ? (
                      <span className="mt-1 flex w-fit items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
                        <Shield aria-hidden className="h-3 w-3" /> Patron of those who serve
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="text-xs leading-relaxed text-muted-foreground">Adapt fasting with your priest for health and duty needs.</p>
            </div>
          ) : <p className="mt-4 text-sm text-muted-foreground">Check today’s calendar at the trusted source below.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onOpenRoute?.("/saints")}>All saints</Button>
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer"><span className="sr-only"> (opens in a new tab) </span>Daily source <ExternalLink className="ml-2 h-3.5 w-3.5" /></a>
            </Button>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
}
