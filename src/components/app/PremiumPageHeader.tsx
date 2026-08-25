import type { ReactNode } from "react";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { cn } from "@/lib/utils";

export function PremiumPageHeader({
  eyebrow,
  title,
  description,
  icon,
  actions,
  className,
}: {

  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("premium-page-header", className)}>
      <OrthodoxCrossIcon className="pointer-events-none absolute -right-5 -top-7 h-28 w-28 rotate-6 text-primary/[0.08]" />
      <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">

        <span className="premium-icon-mark">
          {icon ?? <OrthodoxCrossIcon className="h-6 w-6" />}
        </span>

        <div className="min-w-0">
          <p className="premium-eyebrow">{eyebrow}</p>
          <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.035em] sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">{description}</p> : null}
        </div>
      </div>
      {actions ? (
        <div className="flex max-w-full flex-wrap gap-2 sm:justify-end">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
