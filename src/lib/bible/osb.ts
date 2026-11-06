import type { BibleBook } from "@/lib/bible/books";

// "orthodox" follows the Orthodox Study Bible's pattern with public texts: the Septuagint (Brenton) for the Old
// Testament and the NKJV for the New. It is the default.
export type BaseTranslation = "orthodox" | "nkjv" | "lxx" | "web" | "kjv";
export type TextTranslation = Exclude<BaseTranslation, "orthodox">;

/** The translation actually read for a book: under "orthodox", LXX for the Old Testament and NKJV for the New. */
export function effectiveBase(book: BibleBook | undefined, base: BaseTranslation): TextTranslation {
  if (base !== "orthodox") return base;
  return book?.testament === "OT" ? "lxx" : "nkjv";
}
export type BibleApiTranslation = TextTranslation | "dra" | "en-engbrent";

export function translationForBook(
  book: BibleBook | undefined,
  chosen: BaseTranslation,
): BibleApiTranslation {
  const base = effectiveBase(book, chosen);
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