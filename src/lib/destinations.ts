// Every place in the app, for the menu's "Go to" search. Keywords are other words people might type.
export type Destination = { label: string; to: string; area: string; keywords?: string };

export const DESTINATIONS: Destination[] = [
  { label: "Today", to: "/today", area: "Today", keywords: "home start feast fast saints readings saying" },
  { label: "Me", to: "/me", area: "Me", keywords: "my favorites recent rule names journal week profile" },
  { label: "Pray", to: "/pray", area: "Pray", keywords: "all prayer practices" },
  { label: "Daily prayer", to: "/pray?tab=daily", area: "Pray", keywords: "morning evening night prayers office" },
  { label: "Morning prayers", to: "/pray?tab=daily&begin=morning", area: "Pray", keywords: "wake start day" },
  { label: "Evening prayers", to: "/pray?tab=daily&begin=evening", area: "Pray", keywords: "vespers sunset" },
  { label: "Night prayers", to: "/pray?tab=daily&begin=night", area: "Pray", keywords: "bedtime sleep compline" },
  { label: "My rule of prayer", to: "/pray?tab=rule", area: "Pray", keywords: "rule seraphim discipline" },
  { label: "Family prayer", to: "/pray?tab=family", area: "Pray", keywords: "children kids parents household bedtime stories" },
  { label: "Prayer texts", to: "/pray?tab=prayers", area: "Pray", keywords: "prayer book saints michael meals" },
  { label: "Services", to: "/pray?tab=services", area: "Pray", keywords: "church hours horologion" },
  { label: "Small Compline", to: "/pray?tab=services&service=compline", area: "Services", keywords: "evening night bedtime apodeipnon" },
  { label: "The Hours", to: "/pray?tab=services&service=hours", area: "Services", keywords: "first third sixth ninth hour" },
  { label: "Akathist to the Theotokos", to: "/pray?tab=services&service=akathist", area: "Services", keywords: "mary mother of god salutations hail" },
  { label: "The Three Canons", to: "/pray?tab=services&service=three-canons", area: "Services", keywords: "communion preparation guardian angel repentance paraklesis" },
  { label: "Panikhida", to: "/pray?tab=services&service=panikhida", area: "Services", keywords: "memorial departed dead funeral requiem" },
  { label: "Canon for the Fallen in Battle", to: "/pray?tab=services&service=fallen-warriors", area: "Services", keywords: "military veterans soldiers memorial day warriors" },
  { label: "Names of the living and departed", to: "/pray?tab=names", area: "Pray", keywords: "commemoration diptychs memorial repose" },
  { label: "Prayer groups", to: "/pray?tab=groups", area: "Pray", keywords: "share requests intentions community family parish" },
  { label: "Jesus Prayer", to: "/pray?tab=counter", area: "Pray", keywords: "chotki prayer rope counter stillness timer" },
  { label: "Sleep", to: "/pray?tab=sleep", area: "Pray", keywords: "night insomnia rest" },
  { label: "Confession", to: "/pray?tab=prep", area: "Pray", keywords: "repentance examination sins" },
  { label: "Holy Communion", to: "/pray?tab=communion", area: "Pray", keywords: "eucharist preparation thanksgiving" },
  { label: "Journal", to: "/pray?tab=journal", area: "Pray", keywords: "reflection notes examen" },
  { label: "Learn", to: "/learn", area: "Learn", keywords: "all topics faith worship" },
  { label: "Daily readings", to: "/read?read=daily", area: "Read", keywords: "scripture epistle gospel lectionary" },
  { label: "Bible", to: "/read?read=bible", area: "Read", keywords: "scripture book chapter verse bookmarks" },
  { label: "Reading plans", to: "/read?read=plans", area: "Read", keywords: "psalter kathisma gospels plan" },
  { label: "Welcome to Orthodoxy", to: "/learn?tab=welcome", area: "Learn", keywords: "new inquirer start" },
  { label: "My path", to: "/learn?tab=path", area: "Learn", keywords: "personal recommendations" },
  { label: "Challenges", to: "/learn?tab=challenges", area: "Learn", keywords: "habits streak" },
  { label: "Memorize the Creed", to: "/learn?tab=creed", area: "Learn", keywords: "nicene symbol of faith" },
  { label: "Questions and answers", to: "/learn?tab=qa", area: "Learn", keywords: "catechism faq icons fasting" },
  { label: "Daily guide", to: "/learn?tab=guide", area: "Learn", keywords: "duty work service" },
  { label: "Divine Liturgy", to: "/learn?tab=liturgy", area: "Learn", keywords: "church service mass" },
  { label: "Hymns of the day", to: "/learn?tab=hymns", area: "Learn", keywords: "troparion kontakion propers" },
  { label: "Audio", to: "/learn?tab=audio", area: "Learn", keywords: "chant podcast radio listen" },
  { label: "Find a parish", to: "/learn?tab=parish", area: "Learn", keywords: "church near me directory" },
  { label: "OCA library", to: "/learn?tab=library", area: "Learn", keywords: "articles faith" },
  { label: "Rosary and Angelus", to: "/pray?tab=rosary", area: "Pray", keywords: "western rite hail mary mysteries beads regina caeli catholic" },
  { label: "For those who serve", to: "/learn?tab=serve", area: "Learn", keywords: "military police fire ems dispatch chaplain first responders duty" },
  { label: "Saints", to: "/saints", area: "Library", keywords: "lives patron warrior name day" },
  { label: "Life & Service Guide", to: "/field-manual", area: "Library", keywords: "military police fire ems stress grief travel" },
  { label: "Settings", to: "/settings", area: "App", keywords: "reminders notifications calendar patron saint name day accessibility text size" },
  { label: "Reader voice", to: "/settings#reader", area: "App", keywords: "read aloud listen audio narration abba anna timba maria empa voice" },
  { label: "Privacy and backup", to: "/privacy", area: "App", keywords: "data export import encrypt delete" },
  { label: "Install / share", to: "/download", area: "App", keywords: "android apk app qr" },
  { label: "About", to: "/about", area: "App", keywords: "sources credits empathik" },
  { label: "What's new", to: "/release-notes", area: "App", keywords: "release notes version updates" },
];

/** Destinations whose label, area or keywords contain every word typed. */
export function searchDestinations(query: string): Destination[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return DESTINATIONS.filter((destination) => {
    const haystack = `${destination.label} ${destination.area} ${destination.keywords ?? ""}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });
}
