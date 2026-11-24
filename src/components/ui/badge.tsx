import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent text-accent",
        secondary:
          "border-transparent text-muted-foreground",
        destructive:
          "border-transparent text-destructive",
        outline: "text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Badges read as small tracked metadata (a feast rank, a fasting rule, a count), never as colored pills: typography
// carries the hierarchy. A color given by the caller is kept.
const METADATA = "rounded-none border-0 bg-transparent px-0 py-0 shadow-none text-xs font-semibold uppercase tracking-[0.14em] hover:bg-transparent";

// Text colors meant for sitting on a filled pill would vanish on the open page, so they are dropped.
function withoutPillText(className?: string) {
  return className?.split(/\s+/).filter((name) => !/^text-[a-z-]+-foreground$/.test(name)).join(" ");
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), withoutPillText(className), METADATA)} {...props} />
  );
}

export { Badge, badgeVariants };
