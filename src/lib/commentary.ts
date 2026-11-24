import { useQuery } from "@tanstack/react-query";

// The Fathers on the Gospels, one small file per chapter in /commentary (built from public-domain English: Newman's
// Catena Aurea and 19th-century editions of Chrysostom, Augustine and Cyril). Fetched when a Gospel chapter is opened;
// the service worker keeps what was read for use offline.
export type FatherQuote = { father: string; source: string; text: string; range?: string };
type ChapterCommentary = { book: string; chapter: number; verses: Record<string, FatherQuote[]> };

const GOSPELS = new Set(["Matthew", "Mark", "Luke", "John"]);

export function hasCommentary(book: string | undefined) {
  return Boolean(book && GOSPELS.has(book));
}

export function useChapterCommentary(book: string | undefined, chapter: number | undefined) {
  const enabled = hasCommentary(book) && typeof chapter === "number" && chapter > 0;
  return useQuery({
    queryKey: ["commentary", book, chapter],
    enabled,
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    queryFn: async (): Promise<ChapterCommentary["verses"]> => {
      const response = await fetch(`/commentary/${encodeURIComponent(book!)}/${chapter}.json`);
      if (response.status === 404) return {};
      if (!response.ok) throw new Error("commentary unavailable");
      return ((await response.json()) as ChapterCommentary).verses ?? {};
    },
  });
}
