import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PremiumHeroShell({ className, children, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card className={cn("premium-hero-shell", className)} {...props}>
      <img
        src="/assets/byzantine-hero-mosaic.png"
        alt="Byzantine-inspired mosaic of Christ and the Theotokos in an Orthodox church apse"
        className="premium-hero-image"
      />
      <div aria-hidden className="premium-hero-veil" />
      <div aria-hidden className="premium-hero-aura" />
      {children}
    </Card>
  );
}
