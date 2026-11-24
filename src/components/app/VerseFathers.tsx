import { useId, useState } from "react";
import { ScrollText } from "lucide-react";
import { hasCommentary, useChapterCommentary } from "@/lib/commentary";

// Tap-to-open commentary of the Church Fathers under a Gospel verse, inline, so the place in the chapter is never
// lost (the Catena pattern). Shows nothing for verses or books without commentary.
export function VerseFathers({ book, chapter, verse }: { book?: string; chapter?: number; verse?: number }) {
  const query = useChapterCommentary(book, chapter);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!hasCommentary(book) || verse === undefined) return null;
  const quotes = query.data?.[String(verse)] ?? [];
  if (!quotes.length) return null;

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="ml-1 inline-flex min-h-11 items-center gap-1 rounded-full px-2 align-middle font-sans text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ScrollText aria-hidden className="h-3.5 w-3.5" />
        Fathers ({quotes.length})
        <span className="sr-only"> on {book} {chapter}:{verse}</span>
      </button>
      {open ? (
        <div id={panelId} className="my-2 grid gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
          {quotes.map((quote, index) => (
            <figure key={index}>
              <figcaption className="font-sans text-sm font-semibold">
                {quote.father}
                <span className="font-normal text-muted-foreground"> · {quote.source}{quote.range ? ` · on ${quote.range}` : ""}</span>
              </figcaption>
              <blockquote className="mt-1 text-base leading-relaxed text-foreground/90">{quote.text}</blockquote>
            </figure>
          ))}
          <p className="font-sans text-xs text-muted-foreground">
            Public domain translations, gathered by the Historical Christian Faith Commentaries Database. Read them with the Church: one Father is a witness, not the whole Tradition.
          </p>
        </div>
      ) : null}
    </>
  );
}
