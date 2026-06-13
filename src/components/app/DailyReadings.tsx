import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { BookOpen, ExternalLink } from "lucide-react";
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
import { fetchDailyData, readingText } from "@/lib/orthocal";

import { useNavigate } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";

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
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
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
  const today = useMemo(() => new Date(), []);
  const { settings } = useSettings();

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  function openRef(ref?: string) {
    if (!ref) return;
    navigate(`/read?read=bible&ref=${encodeURIComponent(ref)}`);
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Epistle & Gospel</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Read with attention. Keep a single line with you through the day.
            </p>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        {q.isLoading ? (
          <ReadingsSkeleton />
        ) : q.isError ? (
          <div className="text-sm text-destructive">Couldn't load readings right now.</div>
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
                <a href={q.data.sources.ocaDailyUrl} target="_blank" rel="noopener noreferrer">
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