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
      className="tap h-12 justify-start rounded-[1.25rem] border-0 bg-background/55 px-4 shadow-sm backdrop-blur-xl hover:bg-background/75"
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
    <Card className="relative isolate flex min-h-[42dvh] overflow-hidden rounded-[2rem] border-0 bg-card/70 shadow-[0_28px_80px_hsl(var(--foreground)/0.12)] backdrop-blur-2xl sm:min-h-[46dvh]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/18 via-card/80 to-accent/12" />
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-24 left-4 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
      <OrthodoxCrossIcon className="absolute -right-8 top-8 h-48 w-48 text-primary/[0.08]" />

      <div className="relative z-10 flex w-full flex-col justify-between p-7 sm:p-9 lg:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Field-ready Orthodox companion
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Prayer and watchfulness for life on duty and off duty.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Start with one simple step: pray now, read today, or use a short reset when pressure is high.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="tap h-14 rounded-[1.4rem] px-6 text-base shadow-lg shadow-primary/15"
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

          <div className="rounded-[1.5rem] bg-background/55 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[1.15rem] bg-primary/10 text-primary">
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
