import { format } from "date-fns";
import { CloudOff, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildOcaDailyUrl, type DailyData } from "@/lib/orthocal";

export function DailyContentStatus({ date, data, failed, refreshing, onRetry }: {
  date: Date;
  data?: DailyData;
  failed: boolean;
  refreshing: boolean;
  onRetry: () => Promise<unknown>;
}) {
  // Saved copies are normal and quiet. When the source can't be reached but a saved copy is showing, say so with a
  // small badge, not a warning: the readings are all there. Only a day with nothing saved gets the full notice.
  const offline = typeof navigator !== "undefined" && navigator.onLine === false;
  if (data?.cache && (data.cache.stale || offline)) {
    return (
      <div className="my-2 flex flex-wrap items-center gap-2">
        <span role="status" className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-semibold text-foreground/85">
          <CloudOff aria-hidden className="h-3.5 w-3.5 text-accent" /> Offline ready · saved {format(new Date(data.cache.savedAt), "MMM d")}
        </span>
        <button
          type="button"
          disabled={refreshing}
          onClick={() => void onRetry()}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        >
          <RefreshCw aria-hidden className="h-3.5 w-3.5" /> {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
    );
  }
  const unavailable = failed;
  if (!unavailable) return null;
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
