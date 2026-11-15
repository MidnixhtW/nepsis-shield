// The icon shown across the top of Today: the feast when there is one, otherwise the season's icon.
// Every image is a public-domain icon from Wikimedia Commons, copied into public/icons/days so loading one
// sends nothing to another site (Commons sets tracking cookies on image requests). The source link stays for credit.
import { churchDate, daysBetween, orthodoxPascha, type ChurchCalendar } from "./fastingSeasons";
import { liturgicalSeason, SEASON_LABELS } from "./liturgicalSeason";

export type DayIcon = {
  /** What the day is, e.g. "The Dormition of the Theotokos". */
  title: string;
  imageUrl: string;
  sourceUrl: string;
  alt: string;
  credit: string;
};

/** The local copy's name: the Commons file name in lowercase words, e.g. "Chora Anastasis1.jpg" -> "chora-anastasis1". */
function localName(file: string) {
  return file
    .replace(/\.[a-z]+$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
}

function commons(file: string, alt: string, credit: string) {
  const name = encodeURIComponent(file.replace(/ /g, "_"));
  return {
    imageUrl: `/icons/days/${localName(file)}.jpg`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${name}`,
    alt,
    credit,
  };
}

const ICONS = {
  pantocrator: commons("Spas vsederzhitel sinay.jpg", "Sixth-century icon of Christ Pantocrator from Saint Catherine's Monastery, Sinai", "Christ Pantocrator, 6th c., Sinai"),
  ladder: commons("The Ladder of Divine Ascent Monastery of St Catherine Sinai 12th century.jpg", "Twelfth-century icon of the Ladder of Divine Ascent, monks climbing toward Christ", "The Ladder of Divine Ascent, 12th c., Sinai"),
  lamentation: commons("Lamentation icon Nerezi MK.jpg", "Byzantine fresco of the Lamentation over the body of Christ at Nerezi", "The Lamentation, 1164, Nerezi"),
  anastasis: commons("Chora Anastasis1.jpg", "Fresco of the Resurrection: Christ raising Adam and Eve from Hades, Chora Church", "The Anastasis, 14th c., Chora Church"),
  pentecost: commons("The Descent of the Holy Spirit Novgorod.jpeg", "Novgorod icon of the descent of the Holy Spirit on the Apostles", "Pentecost, Novgorod school"),
  vladimir: commons("Vladimirskaya.jpg", "The Vladimir icon of the Mother of God holding the Christ Child cheek to cheek", "Theotokos of Vladimir, 12th c."),
  annunciation: commons("Annunciation Ustyuzhskoe.jpg", "The Ustyug Annunciation icon: the Archangel Gabriel and the Theotokos", "The Ustyug Annunciation, 12th c."),
  dormition: commons("Theofanus uspenie.jpg", "Icon of the Dormition of the Theotokos attributed to Theophanes the Greek", "The Dormition, Theophanes the Greek"),
  transfiguration: commons("1400-10 Theophanes the Greek Transfiguration anagoria.JPG", "Icon of the Transfiguration of Christ on Mount Tabor attributed to Theophanes the Greek", "The Transfiguration, Theophanes the Greek"),
  nativity: commons("Nativity (15th c., Annunciation Cathedral in Moscow).jpg", "Fifteenth-century icon of the Nativity of Christ from the Annunciation Cathedral, Moscow", "The Nativity, 15th c., Moscow Kremlin"),
  theophany: commons("Baptism (15th c., Annunciation Cathedral in Moscow).jpg", "Fifteenth-century icon of the Baptism of Christ in the Jordan", "Theophany, 15th c., Moscow Kremlin"),
  george: commons("Saint George icon. Novgorod icon-painting school, 15th cent.., Veliky Novgorod, Russia. Tretyakov Gallery.jpg", "Novgorod icon of Saint George on a white horse slaying the dragon", "Saint George, 15th c., Novgorod"),
  michael: commons("Mikharkhangel.jpg", "Thirteenth-century Byzantine icon of the Archangel Michael from Saint Catherine's Monastery, Sinai", "Archangel Michael, 13th c., Sinai"),
  nicholas: commons("Novgorod School - Saint Nicholas - NG.M.02422 - National Museum of Art, Architecture and Design.jpg", "Novgorod icon of Saint Nicholas the Wonderworker", "Saint Nicholas, Novgorod school"),
} as const;

// Fixed feasts by church date (month-day).
const FIXED: Record<string, { title: string; icon: keyof typeof ICONS }> = {
  "1-6": { title: "Theophany", icon: "theophany" },
  "3-25": { title: "The Annunciation", icon: "annunciation" },
  "4-23": { title: "Great Martyr George", icon: "george" },
  "8-6": { title: "The Transfiguration", icon: "transfiguration" },
  "8-15": { title: "The Dormition of the Theotokos", icon: "dormition" },
  "9-8": { title: "The Nativity of the Theotokos", icon: "vladimir" },
  "11-8": { title: "Synaxis of the Archangels", icon: "michael" },
  "11-21": { title: "The Entry of the Theotokos", icon: "vladimir" },
  "12-6": { title: "Saint Nicholas", icon: "nicholas" },
  "12-25": { title: "The Nativity of Christ", icon: "nativity" },
};

export function dayIcon(day: Date, calendar: ChurchCalendar): DayIcon {
  const fromPascha = daysBetween(orthodoxPascha(day.getFullYear()), day);
  if (fromPascha === 0) return { title: "Pascha: Christ is risen!", ...ICONS.anastasis };
  if (fromPascha === -2 || fromPascha === -1) return { title: fromPascha === -2 ? "Holy Friday" : "Holy Saturday", ...ICONS.lamentation };
  if (fromPascha === 49) return { title: "Pentecost", ...ICONS.pentecost };

  const church = churchDate(day, calendar);
  const fixed = FIXED[`${church.getMonth() + 1}-${church.getDate()}`];
  if (fixed) return { title: fixed.title, ...ICONS[fixed.icon] };

  const season = liturgicalSeason(day, calendar);
  const title = SEASON_LABELS[season];
  switch (season) {
    case "lent":
      return { title, ...ICONS.ladder };
    case "pascha":
      return { title: "The Paschal season", ...ICONS.anastasis };
    case "pentecost":
      return { title: "The week of Pentecost", ...ICONS.pentecost };
    case "theotokos":
    case "nativity-fast":
      return { title, ...ICONS.vladimir };
    case "nativity":
      return { title, ...(church.getMonth() === 0 && church.getDate() >= 6 ? ICONS.theophany : ICONS.nativity) };
    default:
      return { title: "Today", ...ICONS.pantocrator };
  }
}
