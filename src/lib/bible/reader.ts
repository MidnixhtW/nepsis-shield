// Bible reader helpers: storage keys, reference parsing and fallback-source lookups.
import { getBookByName } from "./books";
import type { BaseTranslation, TextTranslation } from "./osb";

export type BibleApiVerse = {
  book_name?: string;
  chapter?: number;
  verse?: number;
  text?: string;
};

export type BibleApiResponse = {
  reference?: string;
  translation_id?: string;
  translation_name?: string;
  translation_note?: string;
  verses?: BibleApiVerse[];
};

export type BookmarkItem = {
  ref: string; // e.g. "John 3" or "Tobit 1"
  createdAt: number;
  base: BaseTranslation;
};

export type FallbackSource = "bible-api" | "bolls";

export type ReadPrefs = {
  fontSize: number; // px
  lineWidth: "normal" | "wide";
};

export function bibleApiUrl(ref: string, translation: string) {
  const encoded = encodeURIComponent(ref.trim());
  return `https://bible-api.com/${encoded}?translation=${translation}`;
}

export function bookmarksKey() {
  return "bible:bookmarks";
}

export function lastReadKey() {
  return "bible:last_read";
}

export function saveEnabledKey() {
  return "privacy:bible_save";
}

export const LAST_READ_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
export const BOOKMARKS_TTL_MS = 1000 * 60 * 60 * 24 * 365; // 1 year

export function splitBookChapter(ref: string): { bookName: string; chapter: number } | null {
  const match = ref.match(/^(.*)\s+(\d+)\s*$/);
  if (!match) return null;
  return { bookName: match[1].trim(), chapter: Number(match[2]) };
}

export function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

export function prefsKey() {
  return "bible:prefs";
}

export function normalizeRefForBolls(ref: string): { candidates: string[]; chapter: number } | null {
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

export function bollsSlugForBase(base: TextTranslation) {
  if (base === "nkjv") return "NKJV";
  if (base === "lxx") return "LXXE"; // Brenton's English Septuagint (1851); "LXX" on Bolls is the Greek text
  return base === "web" ? "WEB" : "KJV";
}

export function bollsSlugForBook(bookName: string, base: TextTranslation) {
  // Bolls has the NKJV and Brenton's English LXX (LXXE).
  return bollsSlugForBase(base);
}

export type BookmarkSort = "recent" | "alpha";

export function sortBookmarks(items: BookmarkItem[], mode: BookmarkSort) {
  const next = [...items];
  if (mode === "recent") return next.sort((a, b) => b.createdAt - a.createdAt);
  return next.sort((a, b) => a.ref.localeCompare(b.ref));
}
