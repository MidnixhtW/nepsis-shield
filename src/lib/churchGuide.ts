// The public guide to the Church year: a page for each great feast, each fast, and each saint the app has a prayer
// to, plus two index pages. The app routes them, the build pre-renders them (scripts/prerender.mjs), and the
// sitemap lists them, so people searching for "Nativity Fast 2026" or "prayer to St Nicholas" find the app.
import { GREAT_FEASTS, type GreatFeast } from "@/content/greatFeasts";
import { nameDaySaints } from "@/content/nameDaySaints";
import { addDays, dateOnly, fixedDate, orthodoxPascha, seasonsForYear, type ChurchCalendar, type SeasonId } from "@/lib/fastingSeasons";
import { patronNeeds } from "@/lib/patronSaints";

export type GuideKind = "feast" | "fast" | "saint" | "hub";
export type GuidePage = { kind: GuideKind; slug: string; path: string; name: string; title: string; description: string };

const SITE = "Nepsis Shield";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/^(saints?|st\.?|holy)\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---- Feasts -------------------------------------------------------------------------------------------------------

/** The civil date of a feast in a given year (its Church year for fixed feasts). */
export function feastDate(feast: GreatFeast, year: number, calendar: ChurchCalendar) {
  if (feast.fixed) return fixedDate(year, feast.fixed.month, feast.fixed.day, calendar);
  return addDays(orthodoxPascha(year), feast.fromPascha ?? 0);
}

/** The next time a feast is kept on or after `from`, on the given calendar. */
export function nextFeastDate(feast: GreatFeast, from: Date, calendar: ChurchCalendar) {
  const today = dateOnly(from);
  for (const year of [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2]) {
    const date = feastDate(feast, year, calendar);
    if (date >= today) return date;
  }
  return feastDate(feast, today.getFullYear() + 1, calendar);
}

// ---- Fasts --------------------------------------------------------------------------------------------------------

export const GUIDE_FASTS: SeasonId[] = ["great-lent", "holy-week", "apostles-fast", "dormition-fast", "nativity-fast"];

/** The fast that is under way on `from`, or the next one to begin, on the given calendar. */
export function upcomingFast(id: SeasonId, from: Date, calendar: ChurchCalendar) {
  const today = dateOnly(from);
  for (const year of [today.getFullYear() - 1, today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2]) {
    const season = seasonsForYear(year, calendar).find((item) => item.id === id);
    if (season && season.end >= today) return season;
  }
  return null;
}

// ---- Saints -------------------------------------------------------------------------------------------------------

export type GuideSaint = { slug: string; name: string; needs: Array<{ need: string; note: string }>; prayer: string; search: string };

/** One page per saint named in the patron list; a saint listed for several needs gathers them on one page. */
export const GUIDE_SAINTS: GuideSaint[] = (() => {
  const bySlug = new Map<string, GuideSaint>();
  for (const item of patronNeeds) {
    const slug = slugify(item.saints);
    const existing = bySlug.get(slug);
    if (existing) existing.needs.push({ need: item.need, note: item.note });
    else bySlug.set(slug, { slug, name: item.saints, needs: [{ need: item.need, note: item.note }], prayer: item.prayer, search: item.search });
  }
  return [...bySlug.values()];
})();

// Words that say what kind of saint, not which one.
const GENERIC = new Set(["saint", "saints", "st", "the", "of", "and", "holy", "great", "greatmartyr", "martyr", "hieromartyr", "new", "venerable", "righteous", "apostle", "archangel", "elder", "blessed", "father", "mother", ""]);

function nameWords(name: string) {
  return new Set(name.toLowerCase().split(/[^a-z]+/).filter((word) => !GENERIC.has(word)));
}

/**
 * The saint's feast (Church-calendar month and day) from the name-day list: the entry sharing the most distinctive
 * words with the saint's name, only when there is one clear best and it includes the saint's own search word.
 * Pages for saints without a clear match simply leave the feast out rather than guess.
 */
export function saintFeast(saint: GuideSaint): { month: number; day: number } | null {
  const own = nameWords(saint.name);
  const key = saint.search.toLowerCase().split(/\s+/)[0];
  const scored = nameDaySaints
    .map((entry) => {
      const words = nameWords([entry.name, ...(entry.also ?? [])].join(" "));
      return { entry, score: [...own].filter((word) => words.has(word)).length, hasKey: words.has(key) };
    })
    .filter((item) => item.score > 0 && item.hasKey)
    .sort((a, b) => b.score - a.score);
  if (!scored.length || (scored[1] && scored[1].score === scored[0].score)) return null;
  // A saint named for two (Porphyrios and Paisios) has no single feast.
  if (/\band\b/i.test(saint.name)) return null;
  return { month: scored[0].entry.month, day: scored[0].entry.day };
}

// ---- Pages --------------------------------------------------------------------------------------------------------

function fastName(id: SeasonId) {
  return seasonsForYear(2026, "gregorian").find((season) => season.id === id)?.name ?? id;
}

export const GUIDE_PAGES: GuidePage[] = [
  {
    kind: "hub",
    slug: "feasts",
    path: "/feasts",
    name: "Feasts and fasts",
    title: `Orthodox feasts and fasts: dates and meaning | ${SITE}`,
    description: "Pascha, the Twelve Great Feasts and the four fasts of the Orthodox Church year, with this year's dates on the New and Old Calendars.",
  },
  {
    kind: "hub",
    slug: "saint-prayers",
    path: "/saint-prayers",
    name: "Prayers to the saints",
    title: `Prayers to the saints: Orthodox patron saints | ${SITE}`,
    description: "Short Orthodox prayers to the patron saints, for illness, work, travel, family, grief and every need, with their feast days.",
  },
  ...GREAT_FEASTS.map<GuidePage>((feast) => ({
    kind: "feast",
    slug: feast.slug,
    path: `/feasts/${feast.slug}`,
    name: feast.name,
    title: `${feast.name}: date and meaning | ${SITE}`,
    description: `${feast.about[0]} This year's date on the New and Old Calendars.`.slice(0, 300),
  })),
  ...GUIDE_FASTS.map<GuidePage>((id) => ({
    kind: "fast",
    slug: id,
    path: `/fasts/${id}`,
    name: fastName(id),
    title: `The ${fastName(id)}: dates, rules and a prayer for each day | ${SITE}`,
    description: `When the ${fastName(id)} begins and ends this year on the New and Old Calendars, how it is kept, and a short prayer and practice for each day.`,
  })),
  ...GUIDE_SAINTS.map<GuidePage>((saint) => ({
    kind: "saint",
    slug: saint.slug,
    path: `/saints/${saint.slug}`,
    name: saint.name,
    title: `Prayer to ${saint.name.replace(/^Holy /, "the Holy ")} | ${SITE}`,
    description: `A short Orthodox prayer to ${saint.name}, ${saint.needs.map((item) => item.note.replace(/\.$/, "").replace(/^For /, "for ")).join("; ")}.`.slice(0, 300),
  })),
];

export function guidePage(pathname: string) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return GUIDE_PAGES.find((page) => page.path === path) ?? null;
}
