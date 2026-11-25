import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { format } from "date-fns";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { BookOpen, ExternalLink, Square, Volume2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { readingText } from "@/lib/orthocal";
import { hallowCardClass, hallowGlowClass } from "@/components/app/hallowCard";

import { useNavigate } from "react-router";
import { canReadAloud, startReadAloud, stopReadAloud, useReadAloud } from "@/lib/readAloud";
import { useEffect, useRef, useState } from "react";
import { ShareSelectionButton } from "@/components/app/ShareSelectionButton";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { prefsKey, type ReadPrefs } from "@/lib/bible/reader";
import { markHabitComplete } from "@/lib/dailyHabits";
import { GospelFathers } from "@/components/app/GospelFathers";

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
  const textRef = useRef<HTMLParagraphElement>(null);
  // On phones the reading sits straight on the outer card (a rule above it, no inner box) so lines get the full width.
  return (
    <div className="border-t border-border/60 pt-4 sm:rounded-2xl sm:border sm:border-border/60 sm:bg-muted/20 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-semibold leading-snug">{display || ""}</p>
        </div>
        <div className="flex items-center gap-1">
          {text ? <ShareSelectionButton container={textRef} attribution={display || label} eyebrow={label} /> : null}
        </div>
      </div>

      {text ? (
        <p ref={textRef} className="scripture-text mt-3 whitespace-pre-wrap text-foreground/90" style={{ fontSize: `${size}px` }}>
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
  // Up to a week back, for a day that was missed; markHabitComplete only counts today's readings.
  const [offset, setOffset] = useState(0);
  const { today, query: q, retry } = useDailyCalendar(offset);
  // Opening today's readings fills the Readings step of the day on Today.
  const loaded = !!q.data;
  useEffect(() => {
    if (loaded && offset === 0) markHabitComplete("reading");
  }, [loaded, offset]);
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

  // The Gospel's first sentence, for the line at the top of the page.
  const gospelLine = q.data ? (readingText(q.data.readings.gospel, 400).match(/^.*?[.;:!?](\s|$)/)?.[0] ?? readingText(q.data.readings.gospel, 140)).trim() : "";

  return (
    <div className="grid gap-4">
      <Card className={hallowCardClass + " max-sm:px-4"}>
        <div className={hallowGlowClass} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Epistle & Gospel</h2>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <span>{offset === 0 ? "Today" : format(today, "EEEE, MMMM d")}</span>
              <Button type="button" variant="ghost" size="sm" className="h-9 rounded-full px-2" disabled={offset <= -7} onClick={() => setOffset((value) => value - 1)}>
                Previous day
              </Button>
              {offset < 0 ? (
                <Button type="button" variant="ghost" size="sm" className="h-9 rounded-full px-2" onClick={() => setOffset(0)}>
                  Back to today
                </Button>
              ) : null}
            </div>
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
          <>
            {/* The day's Gospel opens the page: its first line, large, to carry through the day. */}
            {gospelLine ? (
              <figure className="mt-6">
                <blockquote className="scripture-text text-2xl leading-snug">&ldquo;{gospelLine}&rdquo;</blockquote>
                <figcaption className="meta-label mt-2 text-muted-foreground">{q.data.readings.gospel?.short_display ?? q.data.readings.gospel?.display}</figcaption>
              </figure>
            ) : null}
            <div role="group" aria-label="Text size" className="mt-4 flex items-center gap-1 text-muted-foreground">
              <span className="mr-1 text-sm">Text size</span>
              <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full font-display text-sm" aria-label="Smaller text" disabled={size <= MIN_SIZE} onClick={() => change(-1)}>
                A
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full font-display text-xl" aria-label="Larger text" disabled={size >= MAX_SIZE} onClick={() => change(1)}>
                A
              </Button>
            </div>
          </>
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

            <GospelFathers reading={q.data.readings.gospel} />

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

            <a
              href={q.data.sources.ocaDailyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 self-start text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              The full readings on oca.org <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        ) : null}
      </Card>
    </div>
  );
}