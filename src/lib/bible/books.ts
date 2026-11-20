export type BibleBook = {
  id: string;
  /** Display name (OSB-style where applicable) */
  name: string;
  testament: "OT" | "NT";
  /** Name to use with external text sources (e.g. bible-api.com). Defaults to `name`. */
  apiName?: string;
  /** If set, forces which translation id to use on bible-api.com */
  forceTranslation?: "dra";
  /** If true, indicates the book is part of the Orthodox Study Bible canon beyond the standard Protestant 66 */
  deuterocanon?: boolean;
};

// NOTE:
// - The Orthodox Study Bible (OSB) uses a Septuagint-based OT and the NKJV for the NT (copyrighted).
// - This app aligns to the OSB *book list* and uses public sources for text.
// - For the additional Orthodox books, we attempt to use the Douay-Rheims (DRA) where available.

export const BIBLE_BOOKS: BibleBook[] = [
  // Pentateuch
  { id: "gen", name: "Genesis", testament: "OT" },
  { id: "exo", name: "Exodus", testament: "OT" },
  { id: "lev", name: "Leviticus", testament: "OT" },
  { id: "num", name: "Numbers", testament: "OT" },
  { id: "deu", name: "Deuteronomy", testament: "OT" },

  // History
  { id: "jos", name: "Joshua", testament: "OT" },
  { id: "jdg", name: "Judges", testament: "OT" },
  { id: "rut", name: "Ruth", testament: "OT" },

  // OSB naming for the Kings/Kingdoms (maps to common English names for API)
  { id: "1kg", name: "1 Kingdoms", apiName: "1 Samuel", testament: "OT" },
  { id: "2kg", name: "2 Kingdoms", apiName: "2 Samuel", testament: "OT" },
  { id: "3kg", name: "3 Kingdoms", apiName: "1 Kings", testament: "OT" },
  { id: "4kg", name: "4 Kingdoms", apiName: "2 Kings", testament: "OT" },

  { id: "1ch", name: "1 Chronicles", testament: "OT" },
  { id: "2ch", name: "2 Chronicles", testament: "OT" },

  // Ezra/Nehemiah and Orthodox additions
  { id: "1es", name: "1 Esdras", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "2es", name: "2 Esdras", apiName: "Ezra", testament: "OT" },
  { id: "neh", name: "Nehemiah", testament: "OT" },

  { id: "tob", name: "Tobit", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "jdth", name: "Judith", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "est", name: "Esther", testament: "OT" },

  // Maccabees (OSB includes 1–3 Maccabees)
  { id: "1ma", name: "1 Maccabees", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "2ma", name: "2 Maccabees", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "3ma", name: "3 Maccabees", testament: "OT", deuterocanon: true, forceTranslation: "dra" },

  // Wisdom
  { id: "job", name: "Job", testament: "OT" },
  { id: "psa", name: "Psalms", testament: "OT" },
  { id: "pro", name: "Proverbs", testament: "OT" },
  { id: "ecc", name: "Ecclesiastes", testament: "OT" },
  { id: "sng", name: "Song of Songs", apiName: "Song of Solomon", testament: "OT" },
  { id: "wis", name: "Wisdom", apiName: "Wisdom of Solomon", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "sir", name: "Sirach", apiName: "Ecclesiasticus", testament: "OT", deuterocanon: true, forceTranslation: "dra" },

  // Prophets
  { id: "isa", name: "Isaiah", testament: "OT" },
  { id: "jer", name: "Jeremiah", testament: "OT" },
  { id: "bar", name: "Baruch", testament: "OT", deuterocanon: true, forceTranslation: "dra" },
  { id: "lam", name: "Lamentations", testament: "OT" },
  { id: "ezk", name: "Ezekiel", testament: "OT" },
  { id: "dan", name: "Daniel", testament: "OT" },

  // Minor prophets
  { id: "hos", name: "Hosea", testament: "OT" },
  { id: "jol", name: "Joel", testament: "OT" },
  { id: "amo", name: "Amos", testament: "OT" },
  { id: "oba", name: "Obadiah", testament: "OT" },
  { id: "jon", name: "Jonah", testament: "OT" },
  { id: "mic", name: "Micah", testament: "OT" },
  { id: "nam", name: "Nahum", testament: "OT" },
  { id: "hab", name: "Habakkuk", testament: "OT" },
  { id: "zep", name: "Zephaniah", testament: "OT" },
  { id: "hag", name: "Haggai", testament: "OT" },
  { id: "zec", name: "Zechariah", testament: "OT" },
  { id: "mal", name: "Malachi", testament: "OT" },

  // New Testament
  { id: "mat", name: "Matthew", testament: "NT" },
  { id: "mrk", name: "Mark", testament: "NT" },
  { id: "luk", name: "Luke", testament: "NT" },
  { id: "jhn", name: "John", testament: "NT" },
  { id: "act", name: "Acts", testament: "NT" },
  { id: "rom", name: "Romans", testament: "NT" },
  { id: "1co", name: "1 Corinthians", testament: "NT" },
  { id: "2co", name: "2 Corinthians", testament: "NT" },
  { id: "gal", name: "Galatians", testament: "NT" },
  { id: "eph", name: "Ephesians", testament: "NT" },
  { id: "php", name: "Philippians", testament: "NT" },
  { id: "col", name: "Colossians", testament: "NT" },
  { id: "1th", name: "1 Thessalonians", testament: "NT" },
  { id: "2th", name: "2 Thessalonians", testament: "NT" },
  { id: "1ti", name: "1 Timothy", testament: "NT" },
  { id: "2ti", name: "2 Timothy", testament: "NT" },
  { id: "tit", name: "Titus", testament: "NT" },
  { id: "phm", name: "Philemon", testament: "NT" },
  { id: "heb", name: "Hebrews", testament: "NT" },
  { id: "jas", name: "James", testament: "NT" },
  { id: "1pe", name: "1 Peter", testament: "NT" },
  { id: "2pe", name: "2 Peter", testament: "NT" },
  { id: "1jn", name: "1 John", testament: "NT" },
  { id: "2jn", name: "2 John", testament: "NT" },
  { id: "3jn", name: "3 John", testament: "NT" },
  { id: "jud", name: "Jude", testament: "NT" },
  { id: "rev", name: "Revelation", testament: "NT" },
];

export function getBookByName(name: string) {
  return BIBLE_BOOKS.find((b) => b.name === name);
}
