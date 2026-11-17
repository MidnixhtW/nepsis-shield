import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { AArrowDown, AArrowUp, BookOpen, ExternalLink, Square, Volume2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { prefsKey, type ReadPrefs } from "@/lib/bible/reader";
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

// One text size for Scripture: the same saved preference as the Bible reader, so a change here carries over there.
const MIN_SIZE = 14;
const MAX_SIZE = 22;

function useScriptureSize() {
  const [size, setSize] = useState(() => {
    const saved = getStoredItem<ReadPrefs>(prefsKey())?.fontSize;
    return saved ? Math.max(MIN_SIZE, Math.min(MAX_SIZE, saved)) : 17;
  });
  function change(step: number) {
    setSize((current) => {
      const next = Math.max(MIN_SIZE, Math.min(MAX_SIZE, current + step));
      const saved = getStoredItem<ReadPrefs>(prefsKey());
      setStoredItem(prefsKey(), { lineWidth: saved?.lineWidth ?? "normal", fontSize: next }, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
      return next;
    });
  }
  return { size, change };
}

function ReadingCard({
  label,
  display,
  text,
  onReadInApp,
  size,
}: {
  label: string;
  display?: string;
  text: string;
  onReadInApp?: () => void;
  size: number;
}) {
  // On phones the reading sits straight on the outer card (a rule above it, no inner box) so lines get the full width.
  return (
    <div className="border-t border-border/60 pt-4 sm:rounded-2xl sm:border sm:border-border/60 sm:bg-muted/20 sm:p-4">
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
        <p className="scripture-text mt-3 whitespace-pre-wrap text-foreground/90" style={{ fontSize: `${size}px` }}>
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
  const { size, change } = useScriptureSize();
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
      <Card className={hallowCardClass + " max-sm:px-4"}>
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
        {q.data ? (
          <div role="group" aria-label="Text size" className="mt-3 flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="Smaller text" disabled={size <= MIN_SIZE} onClick={() => change(-1)}>
              <AArrowDown aria-hidden className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-full" aria-label="Larger text" disabled={size >= MAX_SIZE} onClick={() => change(1)}>
              <AArrowUp aria-hidden className="h-5 w-5" />
            </Button>
          </div>
        ) : null}

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
                  size={size}
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
                  size={size}
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