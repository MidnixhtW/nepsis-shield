import { Link } from "react-router";
import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dueReviews, useLearnState } from "@/lib/learnByHeart";

// Today: shown only when sections learned by heart are due for review.
export function LearnReviewCard() {
  const due = dueReviews(useLearnState());
  if (!due.length) return null;
  const prayers = [...new Set(due.map((item) => item.prayer.title))];
  const minutes = Math.max(1, Math.round(due.length / 2));

  return (
    <section aria-label="Review today" className="flex flex-wrap items-center gap-3 rounded-3xl border bg-card p-5">
      <ScrollText aria-hidden className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Review today · {due.length} section{due.length === 1 ? "" : "s"}, about {minutes} min</p>
        <p className="truncate text-xs text-muted-foreground">{prayers.join(", ")}</p>
      </div>
      <Button asChild size="sm" className="rounded-full">
        <Link to="/learn?tab=byheart&review=1">Review</Link>
      </Button>
    </section>
  );
}
