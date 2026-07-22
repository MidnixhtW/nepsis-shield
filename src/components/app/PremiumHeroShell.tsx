import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PremiumHeroShell({ className, children, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("premium-hero-shell", className)} {...props}>
      <div aria-hidden className="premium-hero-aura" />
      {children}
    </Card>
  );
}
