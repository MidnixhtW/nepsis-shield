import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Shield, Siren } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";

function SecondaryAction({
  icon,
  title,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      className="tap h-11 justify-start rounded-2xl border-border/70 bg-background/70 shadow-sm hover:border-primary/40"
      onClick={onClick}
    >
      <span className="mr-2 text-primary">{icon}</span>
      {title}
    </Button>
  );
}

export function OrthodoxHero({
  onAction,
}: {
  onAction?: (to: { section: "today" | "pray" | "read" | "learn"; tab?: string; read?: string }) => void;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-primary/25 bg-gradient-to-br from-primary/15 via-card to-accent/10 shadow-sm">
      <div className="relative p-5 sm:p-7">
        <OrthodoxCrossIcon className="absolute -right-5 -top-5 h-32 w-32 text-primary/[0.08]" />

        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Field-ready Orthodox companion
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Prayer and watchfulness for life on duty and off duty.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Start with one simple step: pray now, read today, or use a short reset when pressure is high.
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                className="tap h-12 rounded-2xl px-5"
                onClick={() => onAction?.({ section: "pray", tab: "daily" })}
              >
                Pray now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <SecondaryAction
                title="Read today"
                icon={<BookOpen className="h-4 w-4" />}
                onClick={() => onAction?.({ section: "read", read: "daily" })}
              />
              <SecondaryAction
                title="Need help now"
                icon={<Siren className="h-4 w-4" />}
                onClick={() => onAction?.({ section: "pray", tab: "counter" })}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Daily order
                </p>
                <p className="text-sm font-semibold">Pray → Read → Reset → Serve</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Today is your command center for prayer, Scripture, saints, field tools, and one clear next step.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
