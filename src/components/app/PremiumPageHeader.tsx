import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/app/ThemeToggle";
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
  // Set like the title page of a section in a printed book: the title in the reading serif, one line under it, and
  // the page's few actions as quiet buttons. No box, no icon badge, no label over the title (`eyebrow` and `icon` are
  // kept in the signature so older pages still compile).
  void eyebrow;
  void icon;
  return (
    <header className={cn("flex flex-col gap-5 pb-2 pt-4 sm:pt-8 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        <h1 className="text-balance text-4xl leading-[1.1] sm:text-5xl">{title}</h1>
        {description ? <p className="scripture-text mt-3 text-lg text-muted-foreground">{description}</p> : null}
      </div>

      <div className="flex w-full max-w-full flex-wrap gap-2 lg:w-auto lg:shrink-0 lg:justify-end">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
