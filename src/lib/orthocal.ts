import { fetchJsonCached } from "@/lib/privacyFetch";

export type OrthocalPassage = {
  book?: string;
  chapter?: number;
  verse?: number;
  content?: string;
  paragraph_start?: boolean;
};

export type OrthocalReading = {
  display?: string;
  short_display?: string;
  description?: string;
  passage?: OrthocalPassage[];
};

export type OrthocalDay = {
  fast_level?: number;
  fast_level_desc?: string;
  fast_exception?: string;
  fast_exception_desc?: string;
  saints?: string[];
  readings?: OrthocalReading[];
  abbreviated_reading_indices?: number[];
};

export type DailyData = {
  date: Date;
  fasting: {
    level: number;
    description: string;
    exception?: string;
  };
  saints: string[];
  readings: {
    epistle?: OrthocalReading;
    gospel?: OrthocalReading;
    others: OrthocalReading[];
  };
  sources: {
    ocaDailyUrl: string;
    orthocalApiUrl: string;
  };
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function buildOcaDailyUrl(date: Date) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  return `https://www.oca.org/readings/daily/${yyyy}/${mm}/${dd}`;
}

export function buildOrthocalApiUrl(date: Date) {
  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `https://orthocal.info/api/gregorian/${yyyy}/${m}/${d}/`;
}

function isEpistle(r?: OrthocalReading) {
  const hay = `${r?.description ?? ""} ${r?.display ?? ""}`.toLowerCase();
  return hay.includes("epistle") ||
    hay.includes("corinth") ||
    hay.includes("romans") ||
    hay.includes("galatians") ||
    hay.includes("ephesians") ||
    hay.includes("philippians") ||
    hay.includes("colossians") ||
    hay.includes("thessalonians") ||
    hay.includes("timothy") ||
    hay.includes("titus") ||
    hay.includes("philemon") ||
    hay.includes("hebrews") ||
    hay.includes("acts") ||
    hay.includes("peter") ||
    hay.includes("james") ||
    hay.includes("john") ||
    hay.includes("jude");
}

function isGospel(r?: OrthocalReading) {
  const hay = `${r?.description ?? ""} ${r?.display ?? ""}`.toLowerCase();
  return hay.includes("gospel") ||
    hay.includes("matthew") ||
    hay.includes("mark") ||
    hay.includes("luke") ||
    hay.includes("john");
}

function extractPrimaryReadings(day: OrthocalDay): {
  epistle?: OrthocalReading;
  gospel?: OrthocalReading;
  others: OrthocalReading[];
} {
  const readings = day.readings ?? [];
  const primary = (day.abbreviated_reading_indices ?? [])
    .map((i) => readings[i])
    .filter(Boolean) as OrthocalReading[];

  const pool = primary.length ? primary : readings;

  const epistle = pool.find(isEpistle) ?? readings.find(isEpistle);
  const gospel = pool.find(isGospel) ?? readings.find(isGospel);

  const others = readings.filter((r) => r !== epistle && r !== gospel);

  return { epistle, gospel, others };
}

export async function fetchDailyData(date: Date): Promise<DailyData> {
  const orthocalApiUrl = buildOrthocalApiUrl(date);
  const day = await fetchJsonCached<OrthocalDay>(
    orthocalApiUrl,
    undefined,
    {
      key: `cache:orthocal:${orthocalApiUrl}`,
      ttlMs: 1000 * 60 * 60 * 12, // 12h
    },
  );

  const fastingLevel = day.fast_level ?? 0;
  const fastingDesc = day.fast_level_desc?.trim() || "No fast";
  const fastingException = day.fast_exception_desc?.trim() || undefined;

  return {
    date,
    fasting: {
      level: fastingLevel,
      description: fastingDesc,
      exception: fastingException,
    },
    saints: day.saints ?? [],
    readings: extractPrimaryReadings(day),
    sources: {
      ocaDailyUrl: buildOcaDailyUrl(date),
      orthocalApiUrl,
    },
  };
}

export function readingText(reading?: OrthocalReading, maxChars = 900) {
  const raw = (reading?.passage ?? [])
    .map((p) => p.content)
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return "";
  if (raw.length <= maxChars) return raw;
  return raw.slice(0, maxChars - 1).trimEnd() + "…";
}