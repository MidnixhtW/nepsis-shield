import { useMemo } from "react";
import { Flame, BookOpen, Hand, Sparkles, Timer, HeartHandshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function YoungAdultHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  const chips = useMemo(
    () => [
      { icon: <Hand className="h-3.5 w-3.5" />, label: "Pray" },
      { icon: <BookOpen className="h-3.5 w-3.5" />, label: "Read" },
      { icon: <Flame className="h-3.5 w-3.5" />, label: "Fast" },
      { icon: <HeartHandshake className="h-3.5 w-3.5" />, label: "Mercy" },
    ],
    [],
  );

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />

        <div className="relative p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Built for busy lives
            </Badge>
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              Orthodox, calm, practical
            </Badge>
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            One small step toward Christ today.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Made with young adults in mind, but for all Orthodox Christians. Daily readings, fasting guidance,
            simple prayer, and private notes, with direct sources.
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
              className="h-11 justify-start rounded-2xl"
              onClick={() => onAction?.({ section: "read", read: "daily" })}
            >
              <BookOpen className="mr-2 h-4 w-4" /> Read today
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start rounded-2xl border-border/60 bg-background/60"
              onClick={() => onAction?.({ section: "pray", tab: "counter" })}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Jesus Prayer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 justify-start rounded-2xl border-border/60 bg-background/60"
              onClick={() => onAction?.({ section: "pray", tab: "journal" })}
            >
              <Timer className="mr-2 h-4 w-4" /> 1-minute reflection
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}