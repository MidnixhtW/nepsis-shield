import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FirstStepHint({
  title,
  description,
  actionLabel,
  icon,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  icon: ReactNode;
  onAction: () => void;
}) {
  return (
    <Card className="rounded-3xl border-primary/20 bg-primary/5 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button type="button" className="tap rounded-2xl sm:shrink-0" onClick={onAction}>
          {actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
