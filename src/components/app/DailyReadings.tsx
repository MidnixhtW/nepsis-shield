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
import { fetchDailyData, readingText } from "@/lib/orthocal";

function ReadingCard({
  label,
  display,
  text,
}: {
  label: string;
  display?: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-semibold">{display || "—"}</p>
        </div>
        <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Verify on OCA
        </Badge>
      </div>
      {text ? (
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{text}</p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Open the OCA page for the full reading.
        </p>
      )}
    </div>
  );
}

export function DailyReadings() {
  const today = useMemo(() => new Date(), []);

  const q = useQuery({
    queryKey: ["daily", format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today),
  });

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Epistle & Gospel</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Read with attention — then keep a single line with you all day.
            </p>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        {q.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading readings…</div>
        ) : q.isError ? (
          <div className="text-sm text-destructive">
            Couldn't load readings right now.
          </div>
        ) : q.data ? (
          <div className="grid gap-3">
            <ReadingCard
              label="Epistle"
              display={
                q.data.readings.epistle?.display ??
                q.data.readings.epistle?.short_display
              }
              text={readingText(q.data.readings.epistle)}
            />
            <ReadingCard
              label="Gospel"
              display={
                q.data.readings.gospel?.display ??
                q.data.readings.gospel?.short_display
              }
              text={readingText(q.data.readings.gospel)}
            />

            {q.data.readings.others.length ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="others" className="border-none">
                  <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                    Other readings ({q.data.readings.others.length})
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="grid gap-3">
                      {q.data.readings.others.map((r, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-border/60 bg-background p-4"
                        >
                          <p className="text-sm font-semibold">
                            {r.display ??
                              r.short_display ??
                              r.description ??
                              "Reading"}
                          </p>
                          {readingText(r, 500) ? (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {readingText(r, 500)}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                Backed up by the OCA daily readings page.
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-border/60"
              >
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