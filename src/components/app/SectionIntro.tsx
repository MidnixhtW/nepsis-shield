import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionIntro({
  eyebrow,
  title,
  description,
  icon,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("section-intro", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon ? <span className="premium-icon-mark h-10 w-10 rounded-2xl">{icon}</span> : null}
        <div className="min-w-0">
          {eyebrow ? <p className="premium-eyebrow">{eyebrow}</p> : null}
          <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex max-w-full flex-wrap gap-2">{actions}</div> : null}
    </section>
  );
}
