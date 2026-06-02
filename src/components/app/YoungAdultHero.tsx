import { useMemo } from "react";
import { BookOpen, Compass, Hand, Radio, Shield, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  const chips = useMemo(
    () => [
      { icon: <Hand className="h-3.5 w-3.5" />, label: "Pray on watch" },
      { icon: <BookOpen className="h-3.5 w-3.5" />, label: "Read daily" },
      { icon: <Compass className="h-3.5 w-3.5" />, label: "Stay oriented" },
      { icon: <Shield className="h-3.5 w-3.5" />, label: "Guard the heart" },
    ],
    [],
  );

  return (
    <Card className="card-interactive overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
      <div className="relative field-grid">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-background/70 to-accent/12" />

        <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full border border-primary/20" />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Built for deployment
            </Badge>
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              Quiet, durable, Orthodox
            </Badge>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            One faithful checkpoint for today.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            For deployed Orthodox service members and military families. Keep a steady rule with daily readings, brief prayer, fasting guidance, and private notes.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground"
              >
                {c.icon}
                {c.label}
              </span>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              type="button"
              className="tap h-11 justify-start rounded-2xl"
              onClick={() => onAction?.({ section: "read", read: "daily" })}
            >
              <BookOpen className="mr-2 h-4 w-4" /> Daily brief
            </Button>
            <Button
              type="button"
              variant="outline"
              className="tap h-11 justify-start rounded-2xl border-border/60 bg-background/60"
              onClick={() => onAction?.({ section: "pray", tab: "counter" })}
            >
              <Radio className="mr-2 h-4 w-4" /> Jesus Prayer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="tap h-11 justify-start rounded-2xl border-border/60 bg-background/60"
              onClick={() => onAction?.({ section: "pray", tab: "journal" })}
            >
              <Timer className="mr-2 h-4 w-4" /> 1-minute debrief
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
