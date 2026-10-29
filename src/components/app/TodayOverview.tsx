import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowRight, BookOpen, ExternalLink, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { AppSection } from "@/components/app/AppShell";
import { RuleOfVigilanceCard } from "@/components/app/RuleOfVigilanceCard";
import { GroundMeNow } from "@/components/app/GroundMeNow";
import { NeedHelpNow } from "@/components/app/NeedHelpNow";
import { fetchDailyData, buildOcaDailyUrl } from "@/lib/orthocal";
import { useSettings } from "@/hooks/useSettings";

export function TodayOverview({ onNavigate, onOpenRoute }: {
  onNavigate?: (to: { section: AppSection; tab?: string; read?: string }) => void;
  onOpenRoute?: (path: string) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const { settings } = useSettings();
  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });
  const sourceUrl = settings.jurisdiction === "goarch"
    ? `https://www.goarch.org/chapel?date=${encodeURIComponent(format(today, "M/d/yyyy"))}`
    : q.data?.sources.ocaDailyUrl ?? buildOcaDailyUrl(today);

  return (
    <div className="grid gap-5 sm:gap-6">
      <RuleOfVigilanceCard onNavigate={onNavigate} />
      <div className="grid items-start gap-5 md:grid-cols-2">
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
                {q.data.saints.slice(0, 3).map((saint) => <li key={saint}>{saint}</li>)}
              </ul>
              <p className="text-xs leading-relaxed text-muted-foreground">Adapt fasting with your priest for health and duty needs.</p>
            </div>
          ) : <p className="mt-4 text-sm text-muted-foreground">Check today’s calendar at the trusted source below.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => onOpenRoute?.("/saints")}>All saints</Button>
            <Button asChild variant="ghost" size="sm" className="rounded-xl">
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Daily source <ExternalLink className="ml-2 h-3.5 w-3.5" /></a>
            </Button>
          </div>
        </Card>
      </div>
      <section aria-label="Help now" className="grid gap-3">
        <NeedHelpNow onNavigate={onNavigate} />
        <Accordion type="single" collapsible className="rounded-3xl border bg-card px-5">
          <AccordionItem value="ground" className="border-0">
            <AccordionTrigger className="text-left">Ground me now · guided reset</AccordionTrigger>
            <AccordionContent><GroundMeNow /></AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
