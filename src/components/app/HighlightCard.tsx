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
        "ornate-card card-interactive",
        className,
      )}
    >
      {/* ambient gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 sacred-surface"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-accent/12 blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute left-5 right-5 top-0 h-px gold-hairline opacity-70" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow ? (
              <Badge className="rounded-full border border-primary/20 bg-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm">
                {eyebrow}
              </Badge>
            ) : null}
            <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{title}</h3>
            {description ? (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {icon ? (
            <div className="icon-medallion h-12 w-12">
              {icon}
            </div>
          ) : null}
        </div>

        {actions ? <div className="mt-5 flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </Card>
  );
}
