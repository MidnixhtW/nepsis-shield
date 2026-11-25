import { useId, useState } from "react";
import { ChevronDown, ScrollText } from "lucide-react";
import { hasCommentary, useChapterCommentary, type FatherQuote } from "@/lib/commentary";
import type { OrthocalReading } from "@/lib/orthocal";
import { cn } from "@/lib/utils";

const FIRST_SHOWN = 4;

/** "Luke 18.15-17, 26-30" -> "Luke". Daily readings name the book in full in their display line. */
function gospelBook(reading?: OrthocalReading) {
  const display = reading?.display ?? reading?.short_display ?? "";
  const name = display.match(/^([A-Za-z]+)/)?.[1];
  return hasCommentary(name) ? name : undefined;
}

// The Fathers on today's Gospel, under the reading itself: one tap opens what Chrysostom, Cyril, Augustine and the
// others said about these verses. Nothing shows when the day's Gospel has no commentary or it cannot load offline.
export function GospelFathers({ reading }: { reading?: OrthocalReading }) {
  const book = gospelBook(reading);
  const passage = reading?.passage ?? [];
  const chapters = [...new Set(passage.map((p) => p.chapter).filter((c): c is number => typeof c === "number"))];
  // A daily Gospel spans one chapter, sometimes two.
  const first = useChapterCommentary(book, chapters[0]);
  const second = useChapterCommentary(book, chapters[1]);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const panelId = useId();
  if (!book) return null;

  const byChapter = new Map<number, Record<string, FatherQuote[]>>();
  if (chapters[0] !== undefined && first.data) byChapter.set(chapters[0], first.data);
  if (chapters[1] !== undefined && second.data) byChapter.set(chapters[1], second.data);

  const seen = new Set<string>();
  const quotes: Array<FatherQuote & { where: string }> = [];
  for (const p of passage) {
    if (p.chapter === undefined || p.verse === undefined) continue;
    const key = `${p.chapter}:${p.verse}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const quote of byChapter.get(p.chapter)?.[String(p.verse)] ?? []) {
      quotes.push({ ...quote, where: `${book} ${p.chapter}:${p.verse}` });
    }
  }
  if (!quotes.length) return null;
  const shown = showAll ? quotes : quotes.slice(0, FIRST_SHOWN);

  return (
    <section className="rounded-2xl border border-border/60 bg-card/60">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ScrollText aria-hidden className="h-5 w-5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg">The Fathers on this Gospel</span>
          <span className="block text-sm text-muted-foreground">
            {quotes.length} {quotes.length === 1 ? "passage" : "passages"} from Chrysostom, Cyril and others
          </span>
        </span>
        <ChevronDown aria-hidden className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div id={panelId} className="grid gap-4 border-t border-border/60 px-4 py-4">
          {shown.map((quote, index) => (
            <figure key={index}>
              <figcaption className="text-sm font-semibold">
                {quote.father}
                <span className="font-normal text-muted-foreground">, on {quote.range ? `${book} ${quote.range}` : quote.where}</span>
              </figcaption>
              <blockquote className="scripture-text mt-1 text-lg leading-relaxed text-foreground/90">{quote.text}</blockquote>
              <p className="mt-1 text-xs text-muted-foreground">{quote.source}</p>
            </figure>
          ))}
          {quotes.length > FIRST_SHOWN ? (
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="min-h-11 justify-self-start rounded-full px-1 text-sm font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {showAll ? "Show fewer" : `Show all ${quotes.length}`}
            </button>
          ) : null}
          <p className="text-sm text-muted-foreground">
            Public domain translations, gathered by the Historical Christian Faith Commentaries Database. Read them with the Church: one Father is a witness, not the whole Tradition.
          </p>
        </div>
      ) : null}
    </section>
  );
}
