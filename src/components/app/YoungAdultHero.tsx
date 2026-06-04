import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Hand, Radio, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

function HeroAction({
  icon,
  title,
  detail,
  variant = "outline",
  onClick,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  variant?: "default" | "outline" | "ghost";
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className="tap h-auto min-h-16 justify-start whitespace-normal rounded-2xl border border-border/70 px-4 py-3 text-left shadow-sm hover:border-primary/40 hover:bg-muted/70"
      onClick={onClick}
    >
      <span className="mr-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-background/70 text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-tight">{title}</span>
        <span className="mt-0.5 block whitespace-normal text-xs font-normal leading-relaxed opacity-80">
          {detail}
        </span>
      </span>
      <ArrowRight className="ml-2 h-4 w-4 shrink-0 opacity-75" />
    </Button>
  );
}

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
      <div className="relative p-5 sm:p-7">
        <OrthodoxCrossIcon className="absolute -right-5 -top-5 h-32 w-32 text-primary/[0.06]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div>
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
              <HeroAction
                title="Go to Prayer"
                detail="Start morning, evening, or night prayer."
                icon={<Hand className="h-4 w-4" />}
                variant="default"
                onClick={() => onAction?.({ section: "pray", tab: "daily" })}
              />
              <HeroAction
                title="Go to Readings"
                detail="Open today’s Epistle, Gospel, and links."
                icon={<BookOpen className="h-4 w-4" />}
                onClick={() => onAction?.({ section: "read", read: "daily" })}
              />
              <HeroAction
                title="Go to Jesus Prayer"
                detail="Open the counter and stillness timer."
                icon={<Radio className="h-4 w-4" />}
                onClick={() => onAction?.({ section: "pray", tab: "counter" })}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Patron of this app
                </p>
                <p className="text-sm font-semibold">St Michael the Archangel</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Holy Archangel Michael, defend us and pray to God for us.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
