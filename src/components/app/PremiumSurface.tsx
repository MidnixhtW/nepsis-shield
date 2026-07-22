import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PremiumSurface({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn("premium-surface", className)} {...props} />;
}
