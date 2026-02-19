import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function HighlightCard({
  eyebrow,
  title,
  description,
  icon,
  actions,
  className,
}: Props) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-3xl border-border/60 bg-card/70 shadow-sm backdrop-blur",
        "card-interactive",
        className,
      )}
    >
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-background to-accent/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow ? (
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {eyebrow}
              </Badge>
            ) : null}
            <h3 className="mt-3 text-xl font-semibold tracking-tight">{title}</h3>
            {description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {icon ? (
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border/60 bg-background/60">
              {icon}
            </div>
          ) : null}
        </div>

        {actions ? <div className="mt-4 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </Card>
  );
}
