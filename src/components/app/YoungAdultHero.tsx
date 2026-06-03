import { useMemo } from "react";
import { BookOpen, Compass, Hand, Radio, Shield, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  const chips = useMemo(
    () => [
      { icon: <Hand className="h-3.5 w-3.5" />, label: "Pray daily" },
      { icon: <BookOpen className="h-3.5 w-3.5" />, label: "Read Scripture" },
      { icon: <Compass className="h-3.5 w-3.5" />, label: "Stay oriented" },
      { icon: <Shield className="h-3.5 w-3.5" />, label: "Guard the heart" },
    ],
    [],
  );

  return (
    <Card className="ornate-card card-interactive">
      <div className="relative overflow-hidden sacred-surface field-grid">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/30 to-accent/15" />
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full border border-accent/25" />
        <div className="absolute -bottom-36 -right-32 h-96 w-96 rounded-full border border-primary/15" />
        <OrthodoxCrossIcon className="absolute -right-7 bottom-3 h-44 w-44 text-primary/10" />

        <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-sm">
                <OrthodoxCrossIcon className="h-3.5 w-3.5" /> Orthodox-rooted
              </Badge>
              <Badge className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
                For all Christians
              </Badge>
            </div>

            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
              A calmer way to keep faith close throughout the day.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Begin with Orthodox prayer, daily Scripture, fasting guidance, and brief reflection, presented in a focused field-guide layout that stays quiet and practical.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur"
                >
                  {c.icon}
                  {c.label}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              <Button
                type="button"
                className="tap h-12 justify-start rounded-2xl shadow-lg shadow-primary/15"
                onClick={() => onAction?.({ section: "read", read: "daily" })}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Daily readings
              </Button>
              <Button
                type="button"
                variant="outline"
                className="tap h-12 justify-start rounded-2xl border-border/60 bg-background/65 shadow-sm backdrop-blur"
                onClick={() => onAction?.({ section: "pray", tab: "counter" })}
              >
                <Radio className="mr-2 h-4 w-4" /> Jesus Prayer
              </Button>
              <Button
                type="button"
                variant="outline"
                className="tap h-12 justify-start rounded-2xl border-border/60 bg-background/65 shadow-sm backdrop-blur"
                onClick={() => onAction?.({ section: "pray", tab: "journal" })}
              >
                <Timer className="mr-2 h-4 w-4" /> 1-minute reflection
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/58 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="icon-medallion h-12 w-12">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Today’s posture</p>
                <p className="text-base font-semibold tracking-tight">Steady, prayerful, attentive</p>
              </div>
            </div>
            <div className="my-4 h-px gold-hairline" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              “One clear prayer, one faithful next step.” Use the app as a quiet anchor, not a distraction.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
