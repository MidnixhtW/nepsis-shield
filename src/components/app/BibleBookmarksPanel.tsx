import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { BookmarkItem, BookmarkSort } from "@/lib/bible/reader";

// The Bible reader's Bookmarks tab: search, sort, open and remove saved chapters.
export function BibleBookmarksPanel({
  bookmarks,
  saveEnabled,
  query,
  onQueryChange,
  sort,
  onSortChange,
  onOpen,
  onRemove,
}: {
  bookmarks: BookmarkItem[];
  saveEnabled: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  sort: BookmarkSort;
  onSortChange: (sort: BookmarkSort) => void;
  onOpen: (bookmark: BookmarkItem) => void;
  onRemove: (bookmark: BookmarkItem) => void;
}) {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Bookmarks</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {saveEnabled ? "Saved on this device." : "Saving is off (in-session only)."}
          </p>
        </div>
        <Star className="h-5 w-5 text-muted-foreground" />
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3 sm:grid-cols-2 sm:items-end">
        <div className="grid gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Search</p>
          <Input
            aria-label="Search Bible bookmarks"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Filter bookmarks (e.g., John, Psalm, Tobit)"
            className="h-11 rounded-2xl"
          />
        </div>

        <div className="grid gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Sort</p>
          <ToggleGroup
            type="single"
            aria-label="Bible bookmark sort order"
            value={sort}
            onValueChange={(v) => v && onSortChange(v as BookmarkSort)}
            className="justify-start gap-2"
          >
            <ToggleGroupItem
              value="recent"
              className="h-11 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
            >
              Recent
            </ToggleGroupItem>
            <ToggleGroupItem
              value="alpha"
              className="h-11 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
            >
              A–Z
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <Separator className="my-4" />

      {bookmarks.length ? (
        <div className="grid gap-2">
          {bookmarks.map((b) => (
            <div
              key={`${b.base}:${b.ref}:${b.createdAt}`}
              className="flex flex-col justify-between gap-2 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold">{b.ref}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Base: {b.base.toUpperCase()} • {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  aria-label={`Open bookmark ${b.ref}`}
                  className="rounded-2xl border-border/60"
                  onClick={() => onOpen(b)}
                >
                  Open <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  aria-label={`Remove bookmark ${b.ref}`}
                  className="rounded-2xl text-muted-foreground hover:text-foreground"
                  onClick={() => onRemove(b)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No bookmarks yet. Bookmark a chapter from Browse.
        </p>
      )}
    </Card>
  );
}
