import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  EyeOff,
  Search,
  ShieldAlert,
  Star,
  Trash2,
  Type,
  WrapText,
  Link2,
  ArrowRight,
} from "lucide-react";
import { BIBLE_BOOKS, getBookByName } from "@/lib/bible/books";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import {
  getStoredItem,
  removeStoredItem,
  setStoredItem,
} from "@/lib/deviceStorage";
import { showError, showSuccess } from "@/utils/toast";
import { fetchJsonCached } from "@/lib/privacyFetch";
import { fetchBollsChapter, resolveBollsBookId } from "@/lib/bible/bolls";
import { cn } from "@/lib/utils";

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

type FallbackSource = "bible-api" | "bolls";

type ReadPrefs = {
  fontSize: number; // px
  lineWidth: "normal" | "wide";
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

function saveEnabledKey() {
  return "privacy:bible_save";
}

const LAST_READ_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const BOOKMARKS_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year

function splitBookChapter(ref: string): { bookName: string; chapter: number } | null {
  const match = ref.match(/^(.*)\s+(\d+)\s*$/);
  if (!match) return null;
  return { bookName: match[1].trim(), chapter: Number(match[2]) };
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

function prefsKey() {
  return "bible:prefs";
}

function normalizeRefForBolls(ref: string): { candidates: string[]; chapter: number } | null {
  // Accept: "John 3" or "John 3:16" or "1 Maccabees 2:1-5"; we only use the chapter.
  const m = ref.trim().match(/^(.*)\s+(\d+)(?::\d+.*)?$/);
  if (!m) return null;
  const rawBook = m[1].trim();
  const ch = Number(m[2]);
  if (!Number.isFinite(ch) || ch <= 0) return null;

  // Candidate names for Bolls book resolver: prefer API name, then display name, then a few normalizations.
  const book = getBookByName(rawBook);
  const candidates = book
    ? [book.apiName ?? book.name, book.name]
    : [rawBook];

  return { candidates: Array.from(new Set(candidates)), chapter: ch };
}

function bollsSlugForBase(base: BaseTranslation) {
  return base === "web" ? "WEB" : "KJV";
}

function bollsSlugForBook(bookName: string, base: BaseTranslation) {
  // Bolls does not consistently include Orthodox additions. Use KJV/WEB where possible.
  // For DRA-only books on bible-api, we still try Bolls KJV/WEB and surface errors if unavailable.
  const book = getBookByName(bookName);
  if (book?.forceTranslation === "dra") {
    // Keep it consistent with base; the dataset may or may not have this book.
    return bollsSlugForBase(base);
  }
  return bollsSlugForBase(base);
}

function sortBookmarks(items: BookmarkItem[], mode: "recent" | "alpha") {
  const next = [...items];
  if (mode === "recent") return next.sort((a, b) => b.createdAt - a.createdAt);
  return next.sort((a, b) => a.ref.localeCompare(b.ref));
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

  const [tab, setTab] = useState<"browse" | "reference" | "bookmarks">("browse");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const [memorizeMode, setMemorizeMode] = useState(false);

  // Reader preferences
  const [prefs, setPrefs] = useState<ReadPrefs>({ fontSize: 16, lineWidth: "normal" });

  // Bookmarks UX
  const [bookmarkQuery, setBookmarkQuery] = useState("");
  const [bookmarkSort, setBookmarkSort] = useState<"recent" | "alpha">("recent");

  // Track which upstream source was used for the currently displayed passage.
  const [browseSource, setBrowseSource] = useState<FallbackSource>("bible-api");
  const [refSource, setRefSource] = useState<FallbackSource>("bible-api");

  const book = useMemo(() => getBookByName(bookName), [bookName]);
  const apiBookName = apiNameForBook(book);
  const translation = translationForBook(book, base);

  useEffect(() => {
    const saved = getStoredItem<boolean>(saveEnabledKey());
    setSaveEnabled(saved ?? true);

    const savedPrefs = getStoredItem<ReadPrefs>(prefsKey());
    if (savedPrefs?.fontSize) {
      setPrefs({
        fontSize: Math.max(14, Math.min(22, savedPrefs.fontSize)),
        lineWidth: savedPrefs.lineWidth === "wide" ? "wide" : "normal",
      });
    }

    const last = getStoredItem<{
      base?: BaseTranslation;
      bookName?: string;
      chapter?: number;
      ref?: string;
    }>(lastReadKey());

    if (last?.base) setBase(last.base);
    if (last?.bookName) setBookName(last.bookName);
    if (typeof last?.chapter === "number") setChapter(Math.max(1, last.chapter));
    if (last?.ref) {
      setRefInput(last.ref);
      setRefSubmitted(last.ref);
    }

    const savedBookmarks = getStoredItem<BookmarkItem[]>(bookmarksKey());
    setBookmarks(savedBookmarks ?? []);
  }, []);

  useEffect(() => {
    setStoredItem(saveEnabledKey(), saveEnabled);
    if (!saveEnabled) {
      removeStoredItem(lastReadKey());
      removeStoredItem(bookmarksKey());
      removeStoredItem(prefsKey());
    }
  }, [saveEnabled]);

  useEffect(() => {
    setStoredItem(prefsKey(), prefs, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
  }, [prefs]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(
      lastReadKey(),
      { base, bookName, chapter, ref: refSubmitted },
      { ttlMs: LAST_READ_TTL_MS },
    );
  }, [base, bookName, chapter, refSubmitted, saveEnabled]);

  useEffect(() => {
    if (!saveEnabled) return;
    setStoredItem(bookmarksKey(), bookmarks, { ttlMs: BOOKMARKS_TTL_MS });
  }, [bookmarks, saveEnabled]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isInteractiveTarget(e.target)) return;
      if (tab !== "browse") return;

      if (e.key.toLowerCase() === "j") setChapter((c) => Math.max(1, c - 1));
      if (e.key.toLowerCase() === "k") setChapter((c) => c + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tab]);

  const browseRef = `${apiBookName} ${chapter}`;
  const browseUrl = useMemo(
    () => bibleApiUrl(browseRef, translation),
    [browseRef, translation],
  );

  const browseQuery = useQuery({
    queryKey: ["bible", "browse", apiBookName, chapter, translation, base],

    queryFn: async () => {
      try {
        const data = await fetchJsonCached<BibleApiResponse>(
          browseUrl,
          undefined,
          {
            key: `cache:bible-api:${browseUrl}`,
            ttlMs: 1000 * 60 * 60 * 8, // 8h
          },
        );
        setBrowseSource("bible-api");
        return data;
      } catch (e) {
        // Fallback to Bolls for chapters (best-effort).
        const slug = bollsSlugForBook(bookName, base);
        const id = await resolveBollsBookId(slug, [apiBookName, bookName]);
        if (!id) throw e;

        const verses = await fetchBollsChapter(slug, id, chapter);
        setBrowseSource("bolls");

        const fallback: BibleApiResponse = {
          reference: `${bookName} ${chapter}`,
          translation_id: slug,
          translation_name: slug,
          verses: verses.map((v) => ({
            book_name: bookName,
            chapter,
            verse: v.verse,
            text: v.text,
          })),
        };
        return fallback;
      }
    },
    enabled: Boolean(apiBookName),
  });

  const refUrl = useMemo(() => bibleApiUrl(refSubmitted, base), [refSubmitted, base]);
  const refQuery = useQuery({
    queryKey: ["bible", "ref", refSubmitted, base],
    queryFn: async () => {
      try {
        const data = await fetchJsonCached<BibleApiResponse>(
          refUrl,
          undefined,
          {
            key: `cache:bible-api:${refUrl}`,
            ttlMs: 1000 * 60 * 60 * 8,
          },
        );
        setRefSource("bible-api");
        return data;
      } catch (e) {
        // Fallback to Bolls for chapter-based reads.
        const parsed = normalizeRefForBolls(refSubmitted);
        if (!parsed) throw e;

        const slug = bollsSlugForBase(base);
        const id = await resolveBollsBookId(slug, parsed.candidates);
        if (!id) throw e;

        const verses = await fetchBollsChapter(slug, id, parsed.chapter);
        setRefSource("bolls");
        const fallback: BibleApiResponse = {
          reference: `${parsed.candidates[0]} ${parsed.chapter}`,
          translation_id: slug,
          translation_name: slug,
          verses: verses.map((v) => ({
            book_name: parsed.candidates[0],
            chapter: parsed.chapter,
            verse: v.verse,
            text: v.text,
          })),
        };
        return fallback;
      }
    },
    enabled: Boolean(refSubmitted.trim()),
  });

  const browseVerses = browseQuery.data?.verses ?? [];
  const browseTitle = browseQuery.data?.reference ?? `${bookName} ${chapter}`;

  const isBookmarked = useMemo(() => {
    const ref = `${bookName} ${chapter}`;
    return bookmarks.some((b) => b.ref === ref && b.base === base);
  }, [bookName, chapter, bookmarks, base]);

  const ot = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === "OT"), []);
  const nt = useMemo(() => BIBLE_BOOKS.filter((b) => b.testament === "NT"), []);

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

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("Copied to clipboard.");
    } catch {
      showError("Couldn't copy.");
    }
  }

  function truncateVerse(text?: string) {
    const MAX = 1200;
    const t = (text || "").trim();
    return t.length > MAX ? `${t.slice(0, MAX)} … [truncated]` : t;
  }

  const sortedFilteredBookmarks = useMemo(() => {
    const q = bookmarkQuery.trim().toLowerCase();
    const filtered = q
      ? bookmarks.filter((b) => b.ref.toLowerCase().includes(q))
      : bookmarks;
    return sortBookmarks(filtered, bookmarkSort);
  }, [bookmarks, bookmarkQuery, bookmarkSort]);

  const readerClass =
    (prefs.lineWidth === "wide" ? "max-w-none" : "max-w-3xl") +
    " mx-auto";

  const readerStyle = useMemo(
    () => ({ fontSize: `${prefs.fontSize}px`, lineHeight: 1.75 } as React.CSSProperties),
    [prefs.fontSize],
  );

  async function copyLinkToHere() {
    try {
      const url = new URL(window.location.href);
      url.pathname = "/read";
      url.searchParams.set("read", "bible");
      await navigator.clipboard.writeText(url.toString());
      showSuccess("Link copied.");
    } catch {
      showError("Couldn't copy link.");
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Bible</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              OSB-aligned book list. Text is from public sources (not the OSB translation).
            </p>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3">
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

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-2xl border-border/60"
                onClick={copyLinkToHere}
              >
                <Link2 className="mr-2 h-4 w-4" /> Copy link
              </Button>

              <Button
                asChild
                variant="outline"
                className="btn-wrap h-10 rounded-2xl border-border/60"
              >
                <a
                  href="https://www.oca.org/questions/scripture/canon-of-scripture"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OCA: Canon of Scripture <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                Reading appearance
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Type className="h-4 w-4" /> {prefs.fontSize}px
                <span className="mx-1">•</span>
                <WrapText className="h-4 w-4" /> {prefs.lineWidth === "wide" ? "Wide" : "Comfort"}
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:items-center">
              <div className="grid gap-2">
                <p className="text-xs font-semibold text-muted-foreground">Font size</p>
                <Slider
                  value={[prefs.fontSize]}
                  min={14}
                  max={22}
                  step={1}
                  onValueChange={(v) => setPrefs((p) => ({ ...p, fontSize: v[0] ?? p.fontSize }))}
                />
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold text-muted-foreground">Line width</p>
                <ToggleGroup
                  type="single"
                  value={prefs.lineWidth}
                  onValueChange={(v) => {
                    if (!v) return;
                    setPrefs((p) => ({ ...p, lineWidth: v as ReadPrefs["lineWidth"] }));
                  }}
                  className="justify-start gap-2"
                >
                  <ToggleGroupItem
                    value="normal"
                    className="h-9 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
                  >
                    Comfort
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="wide"
                    className="h-9 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
                  >
                    Wide
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Text API sources: bible-api.com and bolls.life (public). OSB text is copyrighted.
          </p>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Privacy</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              If enabled, bookmarks and "last read" are stored locally.
            </p>
          </div>
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        </div>
        <Separator className="my-4" />

        <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Remember on this device</p>
              <p className="text-xs text-muted-foreground">Last read auto-expires after 30 days.</p>
            </div>
            <Switch checked={saveEnabled} onCheckedChange={setSaveEnabled} />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
            <div>
              <p className="text-sm font-medium">Memorize mode</p>
              <p className="text-xs text-muted-foreground">Hide verse numbers to focus.</p>
            </div>
            <Switch checked={memorizeMode} onCheckedChange={setMemorizeMode} />
          </div>

          {saveEnabled ? (
            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border/60"
                onClick={() => {
                  removeStoredItem(lastReadKey());
                  removeStoredItem(bookmarksKey());
                  setBookmarks([]);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Clear saved data
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/30 p-1 sm:grid-cols-3">
          <TabsTrigger
            value="browse"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <BookOpen className="h-4 w-4 sm:mr-2" /> Browse
          </TabsTrigger>
          <TabsTrigger
            value="reference"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Search className="h-4 w-4 sm:mr-2" /> Reference
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Star className="h-4 w-4 sm:mr-2" /> Bookmarks
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
                    <p className="text-[11px] text-muted-foreground">Tip: J/K to change chapters.</p>
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
                    disabled={!saveEnabled}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    {saveEnabled ? (isBookmarked ? "Bookmarked" : "Bookmark") : "Bookmark (off)"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-2xl border-border/60"
                    onClick={() => {
                      const text = [
                        browseTitle,
                        "",
                        ...browseVerses.map((v) =>
                          memorizeMode
                            ? (v.text?.trim() ?? "")
                            : `${v.chapter}:${v.verse} ${v.text?.trim() ?? ""}`,
                        ),
                      ].join("\n");
                      void copyText(text);
                    }}
                    disabled={!browseVerses.length}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>

                  {browseSource === "bible-api" ? (
                    <Button asChild variant="outline" className="h-11 rounded-2xl border-border/60">
                      <a href={browseUrl} target="_blank" rel="noopener noreferrer">
                        Open JSON <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold tracking-tight">{browseTitle}</h3>
                    <Badge
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold " +
                        (browseSource === "bolls"
                          ? "bg-sky-500/15 text-sky-800 dark:text-sky-200"
                          : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200")
                      }
                    >
                      {browseSource === "bolls" ? "Source: bolls.life" : "Source: bible-api.com"}
                    </Badge>
                    {book?.deuterocanon ? (
                      <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Orthodox book
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Translation: "{browseQuery.data?.translation_id || translation}"
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {browseQuery.isError ? (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">
                    Couldn't load {bookName} {chapter} from the current public text sources.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    If this is an Orthodox-only book, it may not be available in the dataset.
                    You can verify the Orthodox canon here:
                  </p>
                  <Button asChild variant="outline" className="rounded-2xl border-border/60">
                    <a
                      href="https://www.oca.org/questions/scripture/canon-of-scripture"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OCA canon explanation <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ) : browseQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Fetching chapter…</p>
              ) : browseVerses.length ? (
                <div className={cn(readerClass, memorizeMode ? "space-y-4" : "space-y-3")} style={readerStyle}>
                  {browseVerses.map((v, idx) => (
                    <p key={idx} className="text-sm leading-relaxed">
                      {memorizeMode ? (
                        <span className="text-foreground/90">{truncateVerse(v.text)}</span>
                      ) : (
                        <>
                          <span className="mr-2 align-top text-xs font-semibold text-muted-foreground">
                            {v.chapter}:{v.verse}
                          </span>
                          <span className="text-foreground/90">{truncateVerse(v.text)}</span>
                        </>
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No text returned.</p>
              )}

              {memorizeMode ? (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeOff className="h-4 w-4" /> Verse numbers hidden
                </div>
              ) : null}
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
                <Button className="h-11 rounded-2xl" onClick={() => setRefSubmitted(refInput)}>
                  Read
                </Button>
              </div>
            </Card>

            <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold tracking-tight">
                      {refQuery.isLoading ? "Loading…" : refQuery.data?.reference || refSubmitted}
                    </h3>
                    <Badge
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold " +
                        (refSource === "bolls"
                          ? "bg-sky-500/15 text-sky-800 dark:text-sky-200"
                          : "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200")
                      }
                    >
                      {refSource === "bolls" ? "Source: bolls.life" : "Source: bible-api.com"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Text source translation: "{refQuery.data?.translation_id || base}"
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/60"
                    onClick={() => {
                      const title = refQuery.data?.reference || refSubmitted;
                      const verses = refQuery.data?.verses ?? [];
                      const text = [
                        title,
                        "",
                        ...verses.map((v) =>
                          memorizeMode
                            ? (v.text?.trim() ?? "")
                            : `${v.chapter}:${v.verse} ${v.text?.trim() ?? ""}`,
                        ),
                      ].join("\n");
                      void copyText(text);
                    }}
                    disabled={!(refQuery.data?.verses?.length ?? 0)}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  {refSource === "bible-api" ? (
                    <Button asChild variant="outline" className="rounded-2xl border-border/60">
                      <a href={refUrl} target="_blank" rel="noopener noreferrer">
                        Open JSON <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>

              <Separator className="my-4" />

              {refQuery.isError ? (
                <p className="text-sm text-destructive">
                  Couldn't load that reference. Try "John 3:16" or use Browse.
                </p>
              ) : refQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Fetching passage…</p>
              ) : (refQuery.data?.verses?.length ?? 0) ? (
                <div className={cn(readerClass, memorizeMode ? "space-y-4" : "space-y-3")} style={readerStyle}>
                  {(refQuery.data?.verses ?? []).map((v, idx) => (
                    <p key={idx} className="text-sm leading-relaxed">
                      {memorizeMode ? (
                        <span className="text-foreground/90">{truncateVerse(v.text)}</span>
                      ) : (
                        <>
                          <span className="mr-2 align-top text-xs font-semibold text-muted-foreground">
                            {v.chapter}:{v.verse}
                          </span>
                          <span className="text-foreground/90">{truncateVerse(v.text)}</span>
                        </>
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No text returned.</p>
              )}

              {memorizeMode ? (
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <EyeOff className="h-4 w-4" /> Verse numbers hidden
                </div>
              ) : null}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookmarks" className="mt-4">
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
                  value={bookmarkQuery}
                  onChange={(e) => setBookmarkQuery(e.target.value)}
                  placeholder="Filter bookmarks (e.g., John, Psalm, Tobit)"
                  className="h-11 rounded-2xl"
                />
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">Sort</p>
                <ToggleGroup
                  type="single"
                  value={bookmarkSort}
                  onValueChange={(v) => v && setBookmarkSort(v as typeof bookmarkSort)}
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

            {sortedFilteredBookmarks.length ? (
              <div className="grid gap-2">
                {sortedFilteredBookmarks.map((b) => (
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
                          setTab("browse");
                        }}
                      >
                        Open <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="rounded-2xl text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setBookmarks((prev) =>
                            prev.filter((x) => !(x.ref === b.ref && x.base === b.base)),
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
          This in-app reader matches the OSB book list and uses public text sources.
        </p>
        <div className="mt-4">
          <Button asChild className="btn-wrap rounded-2xl">
            <a
              href="https://www.oca.org/questions/scripture/canon-of-scripture"
              target="_blank"
              rel="noopener noreferrer"
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