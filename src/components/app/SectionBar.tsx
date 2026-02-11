import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionBar({
  title,
  hint,
  action,
  className,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-3",
        "rounded-2xl border border-border/50 bg-card/40 px-4 py-3",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
          {title}
        </div>
        {hint ? (
          <div className="mt-0.5 text-sm font-semibold tracking-tight text-foreground/90">
            {hint}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
