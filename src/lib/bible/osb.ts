import type { BibleBook } from "@/lib/bible/books";

export type BaseTranslation = "nkjv" | "lxx" | "web";
export type BibleApiTranslation = BaseTranslation | "dra" | "en-engbrent";

export function translationForBook(
  book: BibleBook | undefined,
  base: BaseTranslation,
): BibleApiTranslation {
  if (!book) return base === "nkjv" ? "web" : base; // bible-api doesn't have nkjv, fallback to web

  // For Orthodox books not in standard KJV/WEB, we use DRA on bible-api
  if (book.forceTranslation) return book.forceTranslation;

  if (base === "nkjv") return "web"; // bible-api fallback
  if (base === "lxx") return "en-engbrent"; // bible-api ID for Brenton LXX

  return base;
}

export function apiNameForBook(book: BibleBook | undefined) {
  if (!book) return "";
  return book.apiName ?? book.name;
}