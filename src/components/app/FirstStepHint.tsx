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
    <Card className="overflow-hidden rounded-[1.6rem] border-primary/15 bg-primary/[0.045] p-4 shadow-sm backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button type="button" className="tap rounded-2xl sm:shrink-0" onClick={onAction}>
          {actionLabel} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>

  );
}
