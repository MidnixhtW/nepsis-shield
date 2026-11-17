// The app's interface text in English: the source every other language is translated from.
// Interface text only. Prayers, Scripture and liturgical texts stay in src/content and need approved translations,
// never machine translation.
export const en = {
  "nav.primary": "Primary navigation",
  "nav.primaryMobile": "Mobile primary navigation",
  "nav.today": "Today",
  "nav.today.aria": "Go to Today",
  "nav.pray": "Pray",
  "nav.pray.aria": "Go to Prayer",
  "nav.read": "Read",
  "nav.read.aria": "Go to Readings",
  "nav.learn": "Learn",
  "nav.learn.aria": "Go to learning and tools",
  "nav.me": "Me",
  "nav.me.aria": "Go to Me: your rule, favorites and recent",

  "header.help": "Help",
  "header.help.aria": "Need help now",
  "header.reset.aria": "60-second reset",
  "header.menu": "Open menu",
  "header.hourTitle": "The hour of prayer: {hour}",

  "pray.eyebrow": "Pray",
  "pray.title": "Make room for stillness.",
  "pray.lead": "For this hour",
  "learn.eyebrow": "Learn",
  "learn.title": "Grow with steadiness.",
  "learn.lead": "Continue",
  "me.eyebrow": "Me",
  "me.title": "Your prayer life",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
