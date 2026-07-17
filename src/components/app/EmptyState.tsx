import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card className="candlelight-card rounded-[2rem] border p-8 text-center sm:p-10">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_18px_60px_hsl(35_91%_48%/0.16)]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </Card>
  );
}
