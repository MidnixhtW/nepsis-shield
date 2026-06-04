import { BookOpen, Hand, Radio } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
      <div className="relative p-5 sm:p-7">
        <OrthodoxCrossIcon className="absolute -right-5 -top-5 h-32 w-32 text-primary/[0.06]" />

        <div className="relative max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Today’s rhythm
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Pray simply. Read slowly. Keep watch.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A quiet Orthodox-rooted companion for daily prayer, Scripture, fasting guidance, and reflection.
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <Button
              type="button"
              className="tap h-11 justify-start rounded-2xl"
              onClick={() => onAction?.({ section: "pray", tab: "daily" })}
            >
              <Hand className="mr-2 h-4 w-4" /> Begin prayer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="tap h-11 justify-start rounded-2xl border-border/60 bg-background/50"
              onClick={() => onAction?.({ section: "read", read: "daily" })}
            >
              <BookOpen className="mr-2 h-4 w-4" /> Daily readings
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="tap h-11 justify-start rounded-2xl"
              onClick={() => onAction?.({ section: "pray", tab: "counter" })}
            >
              <Radio className="mr-2 h-4 w-4" /> Jesus Prayer
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
