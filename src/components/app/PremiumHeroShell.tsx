import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ORTHODOX_ICONOGRAPHY } from "@/lib/orthodoxIconography";

export function PremiumHeroShell({ className, children, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("premium-hero-shell", className)} {...props}>
      <img
        src={ORTHODOX_ICONOGRAPHY.pantocrator.imageUrl}
        alt={ORTHODOX_ICONOGRAPHY.pantocrator.alt}
        title={ORTHODOX_ICONOGRAPHY.pantocrator.credit}
        className="premium-hero-image"
      />

      <div aria-hidden className="premium-hero-veil" />
      <div aria-hidden className="premium-hero-aura" />
      {children}
    </Card>
  );
}
