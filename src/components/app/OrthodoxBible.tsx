import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Star,
} from "lucide-react";
import { BIBLE_BOOKS, getBookByName } from "@/lib/bible/books";
import type { BibleBook } from "@/lib/bible/books";
import {
  apiNameForBook,
  translationForBook,
  type BaseTranslation,
} from "@/lib/bible/osb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type BibleApiVerse = {
  book_name?: string;
  chapter?: number;
  verse?: number;
  text?: string;
};

type BibleApiResponse = {
  reference?: string;
  translation_id?: string;
  translation_name?: string;
  translation_note?: string;
  verses?: BibleApiVerse[];
};

type BookmarkItem = {
  ref: string; // e.g. "John 3" or "Tobit 1"
  createdAt: number;
  base: BaseTranslation;
};

function bibleApiUrl(ref: string, translation: string) {
  const encoded = encodeURIComponent(ref.trim());
  return `https://bible-api.com/${encoded}?translation=${translation}`;
}

function bookmarksKey() {
  return "bible:bookmarks";
}

function lastReadKey() {
  return "bible:last_read";
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function splitBookChapter(ref: string): { bookName: string; chapter: number } | null {
  const match = ref.match(/^(.*)\s+(\d+)\s*$/);
  if (!match) return null;
  return { bookName: match[1].trim(), chapter: Number(match[2]) };
}

export function OrthodoxBible() {
  // OSB-aligned mode (book list), public text sources
  const [base, setBase] = useState<BaseTranslation>("kjv");

  // Browse mode
  const [bookName, setBookName] = useState("John");
  const [chapter, setChapter] = useState(1);

  // Reference mode
  const [refInput, setRefInput] = useState("John 3:16");
  const [refSubmitted, setRefSubmitted] = useState("John 3:16");

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const book = useMemo(() => getBookByName(bookName), [bookName]);
  const apiBookName = apiNameForBook(book);
  const translation = translationForBook(book, base);

  useEffect(() => {
    const saved = safeJsonParse<{
      base?: BaseTranslation;
      bookName?: string;
      chapter?: number;
      ref?: string;
    }>(localStorage.getItem(lastReadKey()));

    if (saved?.base) setBase(saved.base);
    if (saved?.bookName) setBookName(saved.bookName);
    if (typeof saved?.chapter === "number") setChapter(Math.max(1, saved.chapter));
    if (saved?.ref) {
      setRefInput(saved.ref);
      setRefSubmitted(saved.ref);
    }

    const savedBookmarks = safeJsonParse<BookmarkItem[]>(
      localStorage.getItem(bookmarksKey()),
    );
    setBookmarks(savedBookmarks ?? []);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      lastReadKey(),
      JSON.stringify({ base, bookName, chapter, ref: refSubmitted }),
    );
  }, [base, bookName, chapter, refSubmitted]);

  useEffect(() => {
    localStorage.setItem(bookmarksKey(), JSON.stringify(bookmarks));
  }, [bookmarks]);

  const browseRef = `${apiBookName} ${chapter}`;
  const browseUrl = useMemo(
    () => bibleApiUrl(browseRef, translation),
    [browseRef, translation],
  );

  const browseQuery = useQuery({
    queryKey: ["bible", "browse", apiBookName, chapter, translation],
    queryFn: async () => {
      const res = await fetch(browseUrl);
      if (!res.ok) throw new Error(`Bible request failed (${res.status})`);
      return (await res.json()) as BibleApiResponse;
    },
    enabled: Boolean(apiBookName),
  });

  const refUrl = useMemo(() => bibleApiUrl(refSubmitted, base), [refSubmitted, base]);
  const refQuery = useQuery({
    queryKey: ["bible", "ref", refSubmitted, base],
    queryFn: async () => {
      const res = await fetch(refUrl);
      if (!res.ok) throw new Error(`Bible request failed (${res.status})`);
      return (await res.json()) as BibleApiResponse;
    },
    enabled: Boolean(refSubmitted.trim()),
  });

  const browseVerses = browseQuery.data?.verses ?? [];
  const browseTitle = browseQuery.data?.reference ?? `${bookName} ${chapter}`;

  const isBookmarked = useMemo(() => {
    const ref = `${bookName} ${chapter}`;
    return bookmarks.some((b) => b.ref === ref && b.base === base);
  }, [bookName, chapter, bookmarks, base]);

  const ot = useMemo(
    () => BIBLE_BOOKS.filter((b) => b.testament === "OT"),
    [],
  );
  const nt = useMemo(
    () => BIBLE_BOOKS.filter((b) => b.testament === "NT"),
    [],
  );

  function addBookmark(ref: string) {
    setBookmarks((prev) => {
      const next: BookmarkItem[] = [
        { ref, base, createdAt: Date.now() },
        ...prev.filter((b) => !(b.ref === ref && b.base === base)),
      ];
      return next.slice(0, 120);
    });
  }

  function removeBookmark(ref: string) {
    setBookmarks((prev) => prev.filter((b) => !(b.ref === ref && b.base === base)));
  }

  const textAvailabilityNote = useMemo(() => {
    if (!book) return "";
    if (!book.deuterocanon) return "";
    return "Some OSB books are not available in all public-domain datasets; if a book/chapter fails to load, use the OCA canon link and an Orthodox Bible in print/app.";
  }, [book]);

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Bible (OSB book list)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This aligns to the Orthodox Study Bible’s book list. Text is from public sources (not the OSB translation).
            </p>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Base text</span>
            <ToggleGroup
              type="single"
              value={base}
              onValueChange={(v) => {
                if (v) setBase(v as BaseTranslation);
              }}
              className="gap-2"
            >
              <ToggleGroupItem
                value="kjv"
                className="h-9 rounded-2xl border border-border/60 px-3 data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
              >
                KJV
              </ToggleGroupItem>
              <ToggleGroupItem
                value="web"
                className="h-9 rounded-2xl border border-border/60 px-3 data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
              >
                WEB
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Button asChild variant="outline" className="h-9 rounded-2xl border-border/60">
            <a
              href="https://www.oca.org/questions/scripture/canon-of-scripture"
              target="_blank"
              rel="noreferrer"
            >
              OCA: Canon of Scripture <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Orthodox canon guidance source: "https://www.oca.org/questions/scripture/canon-of-scripture"
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Text API source: "https://bible-api.com" (public). OSB text (Septuagint-based OT + NKJV NT) is copyrighted.
        </p>
      </Card>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-muted/30 p-1">
          <TabsTrigger value="browse" className="rounded-xl">
            <BookOpen className="mr-2 h-4 w-4" /> Browse
          </TabsTrigger>
          <TabsTrigger value="reference" className="rounded-xl">
            <Search className="mr-2 h-4 w-4" /> Reference
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="rounded-xl">
            <Star className="mr-2 h-4 w-4" /> Bookmarks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-4">
          <div className="grid gap-4">
            <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      Book
                    </p>
                    <Select value={bookName} onValueChange={setBookName}>
                      <SelectTrigger className="h-11 rounded-2xl">
                        <SelectValue placeholder="Choose a book" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[60vh]">
                        <div className="px-2 pb-2 pt-2 text-xs font-semibold text-muted-foreground">
                          Old Testament
                        </div>
                        {ot.map((b) => (
                          <SelectItem key={b.id} value={b.name}>
                            {b.name}{b.deuterocanon ? " (Orthodox)" : ""}
                          </SelectItem>
                        ))}
                        <div className="px-2 pb-2 pt-3 text-xs font-semibold text-muted-foreground">
                          New Testament
                        </div>
                        {nt.map((b) => (
                          <SelectItem key={b.id} value={b.name}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      Chapter
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-11 rounded-2xl border-border/60 p-0"
                        onClick={() => setChapter((c) => Math.max(1, c - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Input
                        value={String(chapter)}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          if (!Number.isFinite(n)) return;
                          setChapter(Math.max(1, Math.floor(n)));
                        }}
                        inputMode="numeric"
                        className="h-11 rounded-2xl text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-11 rounded-2xl border-border/60 p-0"
                        onClick={() => setChapter((c) => c + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{textAvailabilityNote}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={isBookmarked ? "secondary" : "outline"}
                    className="h-11 rounded-2xl border-border/60"
                    onClick={() => {
                      const ref = `${bookName} ${chapter}`;
                      if (isBookmarked) removeBookmark(ref);
                      else addBookmark(ref);
                    }}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-2xl border-border/60"
                  >
                    <a href={browseUrl} target="_blank" rel="noreferrer">
                      Open JSON <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">{browseTitle}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Text source: bible-api.com translation "{translation}"
                  </p>
                </div>
                {book?.deuterocanon ? (
                  <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Orthodox book
                  </Badge>
                ) : null}
              </div>

              <Separator className="my-4" />

              {browseQuery.isError ? (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">
                    Couldn’t load {bookName} {chapter} from the current public text source.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If this is an Orthodox-only book, it may not be available in this dataset.
                    You can still verify the Orthodox canon here:
                  </p>
                  <Button asChild variant="outline" className="rounded-2xl border-border/60">
                    <a
                      href="https://www.oca.org/questions/scripture/canon-of-scripture"
                      target="_blank"
                      rel="noreferrer"
                    >
                      OCA canon explanation <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Source: "https://www.oca.org/questions/scripture/canon-of-scripture"
                  </p>
                </div>
              ) : browseQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Fetching chapter…</p>
              ) : browseVerses.length ? (
                <div className="space-y-3">
                  {browseVerses.map((v, idx) => (
                    <p key={idx} className="text-sm leading-relaxed">
                      <span className="mr-2 align-top text-xs font-semibold text-muted-foreground">
                        {v.chapter}:{v.verse}
                      </span>
                      <span className="text-foreground/90">{v.text?.trim()}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No text returned.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reference" className="mt-4">
          <div className="grid gap-4">
            <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="grid gap-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Reference
                  </p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={refInput}
                      onChange={(e) => setRefInput(e.target.value)}
                      placeholder="Try: John 1:1-5, Psalm 50, Tobit 1"
                      className="h-11 rounded-2xl pl-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setRefSubmitted(refInput);
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reference lookup uses the base translation (KJV/WEB). Some Orthodox books may not be supported by the public dataset.
                  </p>
                </div>
                <Button
                  className="h-11 rounded-2xl"
                  onClick={() => setRefSubmitted(refInput)}
                >
                  Read
                </Button>
              </div>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {refQuery.isLoading
                      ? "Loading…"
                      : refQuery.data?.reference || refSubmitted}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Text source: bible-api.com translation "{base}"
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-border/60"
                >
                  <a href={refUrl} target="_blank" rel="noreferrer">
                    Open JSON <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>

              <Separator className="my-4" />

              {refQuery.isError ? (
                <p className="text-sm text-destructive">
                  Couldn’t load that reference. Try “John 3:16” or use Browse.
                </p>
              ) : refQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Fetching passage…</p>
              ) : (refQuery.data?.verses?.length ?? 0) ? (
                <div className="space-y-3">
                  {(refQuery.data?.verses ?? []).map((v, idx) => (
                    <p key={idx} className="text-sm leading-relaxed">
                      <span className="mr-2 align-top text-xs font-semibold text-muted-foreground">
                        {v.chapter}:{v.verse}
                      </span>
                      <span className="text-foreground/90">{v.text?.trim()}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No text returned.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-4">
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold tracking-tight">Bookmarks</h3>
                <p className="mt-1 text-sm text-muted-foreground">Saved on this device.</p>
              </div>
              <Star className="h-5 w-5 text-muted-foreground" />
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
                        Base: {b.base.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-2xl border-border/60"
                        onClick={() => {
                          const parsed = splitBookChapter(b.ref);
                          if (parsed) {
                            setBookName(parsed.bookName);
                            setChapter(parsed.chapter);
                          }
                          setRefInput(b.ref);
                          setRefSubmitted(b.ref);
                          setBase(b.base);
                        }}
                      >
                        Open
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-2xl text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setBookmarks((prev) =>
                            prev.filter(
                              (x) => !(x.ref === b.ref && x.base === b.base),
                            ),
                          )
                        }
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
        </TabsContent>
      </Tabs>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h3 className="text-base font-semibold tracking-tight">Orthodox note</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The OSB uses a Septuagint-based Old Testament and the NKJV for the New Testament.
          This in-app reader matches the OSB *book list* and uses public text sources.
        </p>
        <div className="mt-4">
          <Button asChild className="rounded-2xl">
            <a
              href="https://www.oca.org/questions/scripture/canon-of-scripture"
              target="_blank"
              rel="noreferrer"
            >
              Open OCA canon explanation <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Source: "https://www.oca.org/questions/scripture/canon-of-scripture"
        </p>
      </Card>
    </div>
  );
}
