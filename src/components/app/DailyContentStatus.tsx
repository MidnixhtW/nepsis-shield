import { format } from "date-fns";
import { ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildOcaDailyUrl, type DailyData } from "@/lib/orthocal";

export function DailyContentStatus({ date, data, failed, refreshing, onRetry }: {
  date: Date;
  data?: DailyData;
  failed: boolean;
  refreshing: boolean;
  onRetry: () => Promise<unknown>;
}) {
  if (!failed && !data?.cache) return null;
  const unavailable = failed || data?.cache?.stale;
  return (
    <div className="my-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <p role="status" className="text-sm leading-relaxed text-muted-foreground">
        {data?.cache
          ? `${unavailable ? "The daily source could not be refreshed. " : ""}Showing cached content for ${format(data.date, "MMMM d, yyyy")} (${data.calendarMode === "julian" ? "Old" : "New"} Calendar), saved ${format(new Date(data.cache.savedAt), "MMM d, h:mm a")}.`
          : `Daily content for ${format(date, "MMMM d, yyyy")} could not be loaded. Check your connection or consult your parish calendar.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" className="rounded-xl" disabled={refreshing} onClick={() => void onRetry()}>
          <RefreshCw aria-hidden="true" className="mr-2 h-4 w-4" /> {refreshing ? "Retrying…" : "Retry daily content"}
        </Button>
        {unavailable ? <Button asChild size="sm" variant="ghost" className="rounded-xl">
          <a href={buildOcaDailyUrl(date)} target="_blank" rel="noopener noreferrer">
            OCA daily source <ExternalLink aria-hidden="true" className="ml-2 h-4 w-4" /><span className="sr-only"> (opens in a new tab; verify your parish calendar)</span>
          </a>
        </Button> : null}
      </div>
    </div>
  );
}
