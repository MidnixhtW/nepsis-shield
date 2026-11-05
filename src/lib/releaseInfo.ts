export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

/** The Android build number (V + the GitHub run number), or "web" on the website. */
export const CURRENT_BUILD = import.meta.env.VITE_APK_VERSION || "web";

/** The release from package.json without a trailing ".0" ("1.0.0" shows as "1.0"). Bump it there and add a note below when shipping. */
export const CURRENT_VERSION = __APP_VERSION__.replace(/\.0$/, "");

// Newest first. Written for the people using the app, not for developers.
export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: "1.2",
    date: "November 5, 2026",
    title: "One tap to pray",
    changes: [
      "Today opens with the prayers for this hour: morning, evening or night, with how long they take and a Begin button that opens them full screen.",
      "Pray and Learn now open on large tiles, each one tap from its practice or topic, with a way back at the top.",
      "A new Me tab in place of More: a quiet week of dots for the days you prayed (no streak to keep up), your favorites, recently opened places, your rule, names, journal and groups, and Settings.",
      "Star any practice, service or topic to keep it on Me and on Today.",
      "Read aloud now has a small player above the tabs, with pause, skip and stop, and keeps reading while you move around the app. Daily readings and the saint stories for children can be read aloud too.",
      "Recorded readers: the morning, evening and night prayers, St. Seraphim's rule and the saint stories are now read by recorded voices (Abba, Anna, Timba, Maria and Empa), made with ElevenLabs. Choose your reader in Settings or in the full-screen prayer. They play in the Android app too.",
      "Quieter screens: the length and reading options for daily prayer fold away, and the saved-copy notice shows only when today's content could not be refreshed.",
    ],
  },
  {
    version: "1.1",
    date: "November 4, 2026",
    title: "Pray with the whole Church",
    changes: [
      "Services: Small Compline, the Hours, the Akathist to the Theotokos, the Three Canons before Communion, the Panikhida for the departed, and the Canon for those fallen in battle, with a section menu, text size and read-aloud.",
      "A word from the Desert Fathers on Today, a new saying each day.",
      "Prayer groups: make a private group for your family, parish or friends, share prayer requests, and see who has prayed today. No accounts.",
      "Family prayer: a five-minute evening prayer for parents and children, prayers children can learn, and saint stories for bedtime.",
      "Android: a Today widget for the home screen with the feast or fast and the day's saying.",
    ],
  },
  {
    version: "1.0",
    date: "November 4, 2026",
    title: "Church life through the year",
    changes: [
      "Preparing for Holy Communion: a short checklist, the prayers before Communion, and the thanksgiving prayers after.",
      "Memorial days: add the date someone reposed to see their 3rd, 9th and 40th days and yearly anniversaries, plus the Saturdays of Souls, with reminders.",
      "Name days: choose your patron saint in Settings and Today greets you on the eve and the day, on the New or Old Calendar.",
      "Feast greetings on Today for Pascha, the Ascension, the Nativity and Theophany, with a button to send the greeting.",
      "Learn is now four groups (Start, Faith, Worship, Resources), laid out the same way as Pray.",
      "On busy days Today shows two occasions and folds the rest behind \"Also today\".",
      "Faster first load: pages you open less often now load only when you open them.",
      "Security update for the Android app, and unused parts removed.",
    ],
  },
  {
    version: "0.9",
    date: "November 3, 2026",
    title: "For everyone, with a new look",
    changes: [
      "Everyday life comes first; support for those who serve (military, police, fire and EMS) remains as a second focus.",
      "Olive & Brass is the default look, with Parchment, Black & Red and Blue & Cream to choose from during setup.",
      "Fasting-season journeys on Today, a reminder the evening before each fast, and an invite button to keep the fast with others.",
      "A commemoration list of the living and the departed, ready to print for your parish.",
      "St. Seraphim's rule as a prayer length, a full-screen prayer view that can read aloud, and the hour of prayer in the header.",
      "Setup accepts several needs, offers versions of each rule, and asks which calendar your parish keeps.",
      "Today shows the day's main feasts and marks the warrior saints.",
      "Help is at the top of every screen, with a guided reset and Psalm 90.",
      "Scripture and prayers are set in Literata for easier reading.",
      "Back up all your app data, with a monthly reminder.",
    ],
  },
  {
    version: "0.5",
    date: "September 2026",
    title: "The Creed and steadier layouts",
    changes: [
      "An interactive Nicene Creed memorizer that remembers your progress.",
      "Three selectable color themes.",
      "Layouts that hold up on phones, tablets and desktops.",
    ],
  },
  {
    version: "0.1",
    date: "July 2026",
    title: "Life & Service foundation",
    changes: [
      "The Orthodox Life & Service Guide for daily life, duty, stress, travel, grief, courage, the sick and wounded, the departed, and thanksgiving after danger.",
      "Daily prayer, Scripture readings, the saints of the day and the fasting calendar.",
      "An Android app download page with install instructions.",
      "Works offline for the main screens.",
    ],
  },
];
