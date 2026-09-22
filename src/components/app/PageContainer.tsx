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
        "premium-page mx-auto min-h-dvh w-full pb-[calc(2.5rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:pb-12 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pt-[max(1.75rem,env(safe-area-inset-top))] lg:px-8 lg:pt-9",
        widths[width],
        className,
      )}
    >
      {children}
    </main>
  );
}
