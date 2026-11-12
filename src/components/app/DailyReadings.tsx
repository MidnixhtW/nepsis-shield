import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { BookOpen, ExternalLink, Square, Volume2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { readingText } from "@/lib/orthocal";
import { hallowCardClass, hallowGlowClass } from "@/components/app/hallowCard";

import { useNavigate } from "react-router";
import { canReadAloud, startReadAloud, stopReadAloud, useReadAloud } from "@/lib/readAloud";
import { useEffect } from "react";
import { markHabitComplete } from "@/lib/dailyHabits";

function ReadingsSkeleton() {
  return (
    <div className="grid gap-3" aria-label="Loading readings">
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="grid flex-1 gap-2">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-5 w-40 rounded-full" />
            </div>
            <Skeleton className="h-7 w-14 rounded-full" />
          </div>
          <div className="mt-4 grid gap-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-11/12 rounded-full" />
            <Skeleton className="h-4 w-10/12 rounded-full" />
            <Skeleton className="h-4 w-8/12 rounded-full" />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/50 p-3">
        <Skeleton className="h-3 w-44 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-2xl" />
      </div>
    </div>
  );
}

function ReadingCard({
  label,
  display,
  text,
  onReadInApp,
}: {

  label: string;
  display?: string;
  text: string;
  onReadInApp?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-semibold leading-snug">{display || ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            OCA
          </Badge>
        </div>
      </div>

      {text ? (
        <p className="scripture-text mt-3 whitespace-pre-wrap text-[1.05rem] text-foreground/90">
          {text}
        </p>
      ) : (
        <div className="mt-3 grid gap-2">
          <p className="text-sm text-muted-foreground">
            Text was not included in the calendar feed for this reading.
          </p>
          {onReadInApp ? (
            <Button
              type="button"
              variant="outline"
              className="w-fit rounded-2xl border-border/60"
              onClick={onReadInApp}
            >
              Read in app
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function DailyReadings() {
  const navigate = useNavigate();
  const { today, query: q, retry } = useDailyCalendar();
  // Opening today's readings fills the Readings step of the day on Today.
  const loaded = !!q.data;
  useEffect(() => {
    if (loaded) markHabitComplete("reading");
  }, [loaded]);
  const reading = useReadAloud();
  const listenTitle = "Today's Epistle and Gospel";
  const listening = reading.title === listenTitle;

  function listen() {
    if (listening) {
      stopReadAloud();
      return;
    }
    if (!q.data) return;
    const texts = [q.data.readings.epistle, q.data.readings.gospel].flatMap((item) => {
      const text = readingText(item, Number.POSITIVE_INFINITY);
      const name = item?.display ?? item?.short_display;
      return text ? [name ? `${name}.` : "", text] : [];
    });
    startReadAloud(listenTitle, texts);
  }

  function openRef(ref?: string) {
    if (!ref) return;
    navigate(`/read?read=bible&ref=${encodeURIComponent(ref)}`);
  }

  return (
    <div className="grid gap-4">
      <Card className={hallowCardClass}>
        <div className={hallowGlowClass} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Epistle & Gospel</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Read with attention. Keep a single line with you through the day.
            </p>
          </div>
          {canReadAloud() && q.data ? (
            <Button type="button" variant="outline" size="sm" className="shrink-0 rounded-full" aria-pressed={listening} onClick={listen}>
              {listening ? <Square className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              {listening ? "Stop" : "Listen"}
            </Button>
          ) : (
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <Separator className="my-4" />
        <DailyContentStatus date={today} data={q.data} failed={q.isError} refreshing={q.isFetching} onRetry={retry} />

        {q.isLoading ? (
          <ReadingsSkeleton />
        ) : q.data ? (

          <div className="grid gap-3">
            {(() => {
              const full = readingText(q.data.readings.epistle, Number.POSITIVE_INFINITY);
              return (
                <ReadingCard
                  label="Epistle"
                  display={q.data.readings.epistle?.display ?? q.data.readings.epistle?.short_display}
                  text={full}
                  onReadInApp={() =>
                    openRef(
                      q.data.readings.epistle?.display ?? q.data.readings.epistle?.short_display,
                    )
                  }
                />
              );
            })()}

            {(() => {
              const full = readingText(q.data.readings.gospel, Number.POSITIVE_INFINITY);
              return (
                <ReadingCard
                  label="Gospel"
                  display={q.data.readings.gospel?.display ?? q.data.readings.gospel?.short_display}
                  text={full}
                  onReadInApp={() =>
                    openRef(
                      q.data.readings.gospel?.display ?? q.data.readings.gospel?.short_display,
                    )
                  }
                />
              );
            })()}

            {q.data.readings.others.length ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="others" className="border-none">
                  <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                    Other readings ({q.data.readings.others.length})
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="grid gap-3">
                      {q.data.readings.others.map((r, idx) => {
                        const disp = r.display ?? r.short_display ?? r.description;
                        const t = readingText(r, Number.POSITIVE_INFINITY);
                        return (
                          <div
                            key={idx}
                            className="rounded-2xl border border-border/60 bg-background p-4"
                          >
                            <p className="text-sm font-semibold leading-snug">
                              {disp ?? "Reading"}
                            </p>
                            {t ? (
                              <div className="mt-2">
                                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                                  {t}
                                </p>
                              </div>
                            ) : disp ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-2 w-fit rounded-2xl border-border/60"
                                onClick={() => openRef(disp)}
                              >
                                Read in app
                              </Button>
                            ) : (
                              <p className="mt-2 text-sm text-muted-foreground">
                                Open the OCA page for the full reading.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Backed up by the OCA daily readings page.
              </div>
              <Button asChild variant="outline" className="rounded-2xl border-border/60">
                <a href={q.data.sources.ocaDailyUrl} target="_blank" rel="noopener noreferrer"><span className="sr-only"> (opens in a new tab) </span>
                  Open on OCA <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}