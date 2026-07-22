import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const widths = {
  compact: "max-w-4xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
} as const;

export function PageContainer({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: keyof typeof widths;
}) {
  return (
    <main className={cn("premium-page mx-auto min-h-dvh w-full px-3 pb-28 pt-4 sm:px-5 sm:pt-7", widths[width], className)}>
      {children}
    </main>
  );
}
