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
    <main
      className={cn(
        "premium-page mx-auto min-h-dvh w-full px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8 lg:pt-10",
        widths[width],
        className,
      )}
    >
      {children}
    </main>
  );
}
