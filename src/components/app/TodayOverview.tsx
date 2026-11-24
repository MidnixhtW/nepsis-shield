import { useEffect, useState } from "react";
import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { format } from "date-fns";
import { BookOpen, ChevronDown, ExternalLink, HeartPulse, Leaf, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AppSection } from "@/components/app/AppShell";
import { RuleOfVigilanceCard } from "@/components/app/RuleOfVigilanceCard";
import { SeasonJourneyCard } from "@/components/app/SeasonJourneyCard";
import { SetupRuleCard, isRuleSetUp } from "@/components/app/SetupRuleCard";
import { TodayLamps } from "@/components/app/TodayLamps";
import { ReminderOffer } from "@/components/app/ReminderOffer";
import { ChurchYearLookBack } from "@/components/app/ChurchYearLookBack";
import { BackupReminderCard } from "@/components/app/BackupReminderCard";
import { MemorialsCard } from "@/components/app/MemorialsCard";
import { NameDayCard } from "@/components/app/NameDay";
import { FeastGreetingCard } from "@/components/app/FeastGreetingCard";
import { GroundResetButton } from "@/components/app/GroundMeNow";
import { TodayMoments } from "@/components/app/TodayMoments";
import { FathersSayingCard } from "@/components/app/FathersSayingCard";
import { PrayNowCard } from "@/components/app/PrayNowCard";
import { DayIconBanner, fastBadge } from "@/components/app/DayIconBanner";
import { WeekDots } from "@/components/app/WeekDots";
import { LearnReviewCard } from "@/components/app/LearnReviewCard";
import { TodayFold } from "@/components/app/TodayFold";
import { WesternAdventCard } from "@/components/app/WesternAdventCard";
import { ShieldTriggers } from "@/components/app/ShieldTriggers";
import { TraditionPrompt } from "@/components/app/TraditionPicker";
import { fastingAdvice, getTradition, traditionChosen, westernSeasonLine } from "@/lib/tradition";
import { buildOcaDailyUrl, readingText } from "@/lib/orthocal";
import { isWarriorSaint } from "@/lib/warriorSaints";
import { saveWidgetSnapshot } from "@/lib/widgetSnapshot";

export function TodayOverview({ onNavigate, onOpenRoute }: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
  onOpenRoute?: (path: string) => void;
}) {
  const { today, settings, query: q, retry } = useDailyCalendar();
  const tradition = getTradition(settings);
  const western = tradition === "western-rite";
  // One invitation at a time: "How do you pray?" first, then setting up a rule.
  const [askTradition, setAskTradition] = useState(() => !traditionChosen(settings));
  const sourceUrl = settings.jurisdiction === "goarch"
    ? `https://www.goarch.org/chapel?date=${encodeURIComponent(format(today, "M/d/yyyy"))}`
    : q.data?.sources.ocaDailyUrl ?? buildOcaDailyUrl(today);


  // Keep the Android home-screen widget current: two weeks of days, with today's fast once it has loaded.
  const fastToday = q.data ? [q.data.fasting.description, q.data.fasting.exception].filter(Boolean).join(" · ") : undefined;
  useEffect(() => {
    void saveWidgetSnapshot(today, settings.calendarMode, fastToday);
  }, [today, settings.calendarMode, fastToday]);

  // The "Ground Me Now" app shortcut links to /today#ground, so open the reset straight away when that is the target.
  const groundOnLoad = typeof window !== "undefined" && window.location.hash === "#ground";

  // Today is one page of the day. Left (first on phones): the icon, the day in a sentence, and one Begin. Right: the
  // day set like a book, a red heading for each section and a rule between them. Last: your own things, together.
  const gospel = q.data ? readingText(q.data.readings.gospel, 220) : "";
  // The rule in plain words ("Fish, wine and oil allowed"), the same as under the day's feast at the top.
  const fastRule = q.data ? (q.data.fasting.exception ? fastBadge(q.data.fasting).label : q.data.fasting.description) : "";
  return (
    <div className="grid gap-10">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div className="grid min-w-0 gap-8 shortphone:gap-3 lg:sticky lg:top-28">
          <DayIconBanner
            today={today}
            calendar={settings.calendarMode}
            saints={q.data?.saints}
            tone={western ? undefined : q.data?.tone?.value}
            fasting={q.data?.fasting}
            westernSeason={western ? westernSeasonLine(today, settings.calendarMode) : undefined}
          />
          <PrayNowCard />
          {askTradition ? <TraditionPrompt onAnswered={() => setAskTradition(false)} /> : <SetupRuleCard />}
          {/* Only once setup is done, so a newcomer sees one invitation at a time. */}
          {isRuleSetUp() ? <ReminderOffer /> : null}
        </div>

        <div className="min-w-0">
          <ChurchYearLookBack today={today} calendar={settings.calendarMode} />
          <TodayMoments
            moments={[
              { id: "feast", label: "Feast greeting", node: <FeastGreetingCard today={today} calendar={settings.calendarMode} /> },
              { id: "nameday", label: "Name day", node: <NameDayCard today={today} /> },
              { id: "season", label: "Fasting season", node: <SeasonJourneyCard today={today} calendar={settings.calendarMode} /> },
              { id: "memorials", label: "Memorial days", node: <MemorialsCard today={today} /> },
            ]}
          />

          {settings.westernRite ? (
            <div className="px-1 pb-6">
              <WesternAdventCard today={today} />
            </div>
          ) : null}

          <section aria-labelledby="today-readings" className="border-t border-border/60 px-1 py-7">
            <h2 id="today-readings" className="text-2xl">Today&rsquo;s readings</h2>
            {western ? <p className="mt-1 text-sm text-muted-foreground">The Byzantine readings for today. Your parish reads the Western propers at Mass.</p> : null}
            <DailyContentStatus date={today} data={q.data} failed={q.isError} refreshing={q.isFetching} onRetry={retry} />
            {q.isLoading ? (
              <Skeleton className="mt-4 h-20 w-full rounded-xl" />
            ) : q.data ? (
              <>
                <p className="mt-2 text-base font-semibold">
                  {[q.data.readings.epistle, q.data.readings.gospel]
                    .filter(Boolean)
                    .map((reading) => reading?.display ?? reading?.short_display ?? reading?.description)
                    .join(" and ")}
                </p>
                {gospel ? <p className="scripture-text mt-3 text-lg leading-relaxed text-foreground/90">{gospel}</p> : null}
              </>
            ) : (
              <p className="mt-2 text-sm text-foreground/75">Daily details are unavailable. Open the readings or the trusted calendar source.</p>
            )}
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => onNavigate?.({ section: "read", read: "daily" })}>
              <BookOpen className="mr-2 h-4 w-4" /> Open readings
            </Button>
            <Button variant="ghost" className="mt-4 rounded-full" onClick={() => onOpenRoute?.("/pray?tab=lectio")}>
              Pray with this Gospel
            </Button>
          </section>

          <section id="saints-fast" aria-labelledby="saints-fast-title" className="scroll-mt-24 border-t border-border/60 px-1 py-7">
            <h2 id="saints-fast-title" className="text-2xl">Saints and fast</h2>
            {q.isLoading ? (
              <Skeleton className="mt-4 h-24 w-full rounded-xl" />
            ) : q.data ? (
              <div className="mt-3 grid gap-3">
                <ul className="grid gap-2 text-base">
                  {q.data.saints.slice(0, 3).map((saint) => (
                    <li key={saint}>
                      {saint}
                      {isWarriorSaint(saint) ? (
                        <span className="mt-1 flex w-fit items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                          <Shield aria-hidden className="h-3 w-3" /> Patron of those who serve
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {(q.data.lives ?? []).length ? (
                  <div className="grid gap-2">
                    <p className="text-sm font-semibold text-muted-foreground">Lives of today&rsquo;s saints</p>
                    {q.data.lives.map((life) => (
                      <details key={life.title} className="group rounded-2xl border border-border/60 bg-muted/20">
                        <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-2 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          {life.title}
                          <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-accent transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="scripture-text space-y-3 px-4 pb-4 text-base leading-relaxed">
                          {life.paragraphs.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </details>
                    ))}
                    <p className="text-sm text-muted-foreground">From orthocal.info. Saved on this device for the next two weeks, so the lives read with no signal.</p>
                  </div>
                ) : null}
                {fastRule ? (
                  <p className="flex items-start gap-2 text-base">
                    <Leaf aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" />
                    <span>{fastRule}. {fastingAdvice(tradition)}</span>
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-foreground/75">Check today&rsquo;s calendar at the trusted source.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => onOpenRoute?.("/saints")}>All saints</Button>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer"><span className="sr-only"> (opens in a new tab) </span>Daily source <ExternalLink className="ml-2 h-3.5 w-3.5" /></a>
              </Button>
            </div>
          </section>

          <section aria-labelledby="when-hard" className="border-t border-border/60 px-1 py-7">
            <h2 id="when-hard" className="text-2xl">When it&rsquo;s hard</h2>
            <p className="mt-1 text-sm text-muted-foreground">One tap to the prayer for the moment.</p>
            <div className="mt-3">
              <ShieldTriggers />
            </div>
          </section>

          <TodayFold title="A word from the Fathers" hint="A short saying for today. Tap to read.">
            <FathersSayingCard today={today} />
          </TodayFold>
        </div>
      </div>

      <section aria-labelledby="your-rule" className="border-t border-border/60 pt-8">
        <h2 id="your-rule" className="px-1 text-2xl">Your rule</h2>
        <div className="mt-5 grid items-start gap-5 md:grid-cols-2">
          <div className="grid min-w-0 gap-5">
            <WeekDots />
            <TodayLamps />
            {/* Until setup is done the SetupRuleCard above stands in, so Today never names a plan the user hasn't chosen. */}
            {isRuleSetUp() ? <RuleOfVigilanceCard onNavigate={onNavigate} compact /> : null}
            <LearnReviewCard />
          </div>
          <div className="grid min-w-0 gap-5">
            {/* Help is in the top bar on every screen, so Today keeps only a short pointer and the reset. */}
            <section aria-label="Help now" className="rounded-3xl border bg-card px-5">
              <div id="ground" className="flex flex-wrap items-center gap-3 py-4">
                <HeartPulse aria-hidden className="h-5 w-5 shrink-0 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Under pressure?</p>
                  <p className="text-sm text-foreground/75">Breathe, orient, pray, act. Four steps, about a minute.</p>
                </div>
                <GroundResetButton variant="outline" size="sm" className="rounded-full" defaultOpen={groundOnLoad}>
                  Start reset
                </GroundResetButton>
              </div>
            </section>
            <BackupReminderCard />
          </div>
        </div>
      </section>
    </div>
  );
}
