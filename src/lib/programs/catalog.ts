export type Program = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  minutesPerDay: number;
  level: "starter" | "growth";
  sessions: Session[];
};

export type SessionSegment =
  | { kind: "speak"; text: string }
  | { kind: "silence"; seconds: number; label?: string };

export type Session = {
  id: string;
  title: string;
  durationMinutes: number;
  segments: SessionSegment[];
  sources?: Array<{ label: string; url: string }>;
};

const JESUS_PRAYER = "Lord Jesus Christ, Son of God, have mercy on me, a sinner.";

export const PROGRAMS: Program[] = [
  {
    id: "7days-starter",
    title: "7 Days: Start a prayer life",
    tagline: "Small, steady, Orthodox.",
    description:
      "A simple week for busy young adults: Scripture, one prayer, one act of mercy. Nothing dramatic — just consistent.",
    minutesPerDay: 6,
    level: "starter",
    sessions: [
      {
        id: "day-1",
        title: "Day 1 — Begin small",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "Welcome. Today is about starting small — and actually doing it." },
          { kind: "speak", text: "Sit down. Put the phone aside. Let your shoulders drop." },
          { kind: "silence", seconds: 10, label: "Settle" },
          { kind: "speak", text: `We will pray the Jesus Prayer slowly. You can whisper it or say it in your heart: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 40, label: "Jesus Prayer" },
          { kind: "speak", text: "Now one small intention: Lord, teach me to pray today — not perfectly, but honestly." },
          { kind: "silence", seconds: 20 },
          { kind: "speak", text: "Before you go: read today’s Gospel. Then choose one concrete act of mercy — a message, a call, a small gift, or patience." },
          { kind: "speak", text: "Glory to You, O God. Glory to You." },
        ],
        sources: [
          {
            label: "OCA — The Jesus Prayer",
            url: "https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/prayer-fasting-and-almsgiving/the-jesus-prayer",
          },
        ],
      },
      {
        id: "day-2",
        title: "Day 2 — Attention",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "Today’s focus is attention. Not feelings. Attention." },
          { kind: "speak", text: "Breathe in calmly. Breathe out calmly." },
          { kind: "silence", seconds: 12 },
          { kind: "speak", text: "When your mind wanders, don’t panic. Return gently." },
          { kind: "speak", text: `Say the Jesus Prayer once, with attention: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 45, label: "Quiet prayer" },
          { kind: "speak", text: "Now, choose one sentence to carry today: ‘Lord, have mercy.’ Say it before you respond to stress." },
          { kind: "silence", seconds: 15 },
          { kind: "speak", text: "Glory to You, O God. Glory to You." },
        ],
        sources: [
          {
            label: "OCA — Prayer",
            url: "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-daily-cycles-of-prayer/prayer",
          },
        ],
      },
      {
        id: "day-3",
        title: "Day 3 — Mercy",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "Today is about mercy. Orthodox life is not just ideas — it becomes love." },
          { kind: "silence", seconds: 10 },
          { kind: "speak", text: "Think of one person you can serve today: time, attention, forgiveness, or money." },
          { kind: "silence", seconds: 20, label: "Choose one act" },
          { kind: "speak", text: `Pray: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 40 },
          { kind: "speak", text: "Do the mercy first, even if it’s small. Then thank God for the chance to love." },
        ],
        sources: [
          {
            label: "OCA — Almsgiving",
            url: "https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/prayer-fasting-and-almsgiving/almsgiving",
          },
        ],
      },
      {
        id: "day-4",
        title: "Day 4 — Repent simply",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "Repentance is not self-hatred. It’s turning back to Christ." },
          { kind: "speak", text: "Name one thing you need to change — without excuses." },
          { kind: "silence", seconds: 20 },
          { kind: "speak", text: "Pray: ‘Lord, help me begin again.’" },
          { kind: "silence", seconds: 15 },
          { kind: "speak", text: `Now the Jesus Prayer: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 40 },
          { kind: "speak", text: "If you need to, use the Confession prep in the app this week. Keep notes short and concrete." },
        ],
        sources: [
          {
            label: "OCA — Confessing in the Presence of a Priest",
            url: "https://www.oca.org/questions/sacramentconfession/confessing-in-the-presence-of-a-priest",
          },
        ],
      },
      {
        id: "day-5",
        title: "Day 5 — Fasting with humility",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "Fasting is a tool for repentance and love — not a performance." },
          { kind: "speak", text: "Check today’s fasting guidance. Keep it as you are able, with peace." },
          { kind: "silence", seconds: 12 },
          { kind: "speak", text: "Offer one small restraint today: food, spending, entertainment, or words." },
          { kind: "silence", seconds: 20 },
          { kind: "speak", text: `Pray: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 35 },
          { kind: "speak", text: "Add mercy. Fasting without love becomes empty." },
        ],
        sources: [
          {
            label: "OCA — Orthodox fasting (Q&A)",
            url: "https://www.oca.org/questions/dailylife/orthodox-fasting",
          },
        ],
      },
      {
        id: "day-6",
        title: "Day 6 — Scripture in the Church",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "Today: Scripture. Not as content — as communion." },
          { kind: "speak", text: "Read today’s Gospel slowly. If you can, read it out loud." },
          { kind: "silence", seconds: 12 },
          { kind: "speak", text: "Ask one question: What is Christ asking of me today?" },
          { kind: "silence", seconds: 20 },
          { kind: "speak", text: "End with a simple doxology: Glory to the Father, and to the Son, and to the Holy Spirit." },
        ],
        sources: [
          {
            label: "OCA — Bible (Q&A)",
            url: "https://www.oca.org/questions/scripture/bible",
          },
        ],
      },
      {
        id: "day-7",
        title: "Day 7 — Keep going",
        durationMinutes: 6,
        segments: [
          { kind: "speak", text: "You made it a week. The goal is not intensity — it’s faithfulness." },
          { kind: "speak", text: "Choose your next step: keep this same rhythm for another week." },
          { kind: "silence", seconds: 10 },
          { kind: "speak", text: "If you have a parish, show up. Orthodox life is personal, but never private." },
          { kind: "silence", seconds: 12 },
          { kind: "speak", text: `Pray once more: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 30 },
          { kind: "speak", text: "Glory to You, O God. Glory to You." },
        ],
        sources: [
          {
            label: "OCA — The Divine Liturgy (Q&A)",
            url: "https://www.oca.org/questions/divineliturgy/the-divine-liturgy",
          },
        ],
      },
    ],
  },
  {
    id: "stillness-5min",
    title: "Stillness: 5 minutes",
    tagline: "Quiet your mind; keep your heart soft.",
    description:
      "Short guided stillness sessions to pair with the timer. Designed for lunch breaks, commutes (not while driving), or before sleep.",
    minutesPerDay: 5,
    level: "starter",
    sessions: [
      {
        id: "s1",
        title: "Settle (5 min)",
        durationMinutes: 5,
        segments: [
          { kind: "speak", text: "Find a comfortable position. Let your jaw unclench." },
          { kind: "silence", seconds: 10 },
          { kind: "speak", text: "Notice the breath. You don’t control it — you receive it." },
          { kind: "silence", seconds: 15 },
          { kind: "speak", text: "Now, when thoughts come, let them pass. Return to the Name." },
          { kind: "speak", text: `Gently: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 60, label: "Quiet" },
          { kind: "speak", text: "Glory to You, O God." },
        ],
      },
      {
        id: "s2",
        title: "Before a hard conversation (5 min)",
        durationMinutes: 5,
        segments: [
          { kind: "speak", text: "Before you speak, ask for mercy." },
          { kind: "silence", seconds: 10 },
          { kind: "speak", text: "Pray for the other person by name. Keep it simple." },
          { kind: "silence", seconds: 20 },
          { kind: "speak", text: "Now pray for your own heart: ‘Lord, make me gentle.’" },
          { kind: "silence", seconds: 15 },
          { kind: "speak", text: `Once: ${JESUS_PRAYER}` },
          { kind: "silence", seconds: 25 },
        ],
      },
    ],
  },
];

export function getProgramById(id: string) {
  return PROGRAMS.find((p) => p.id === id) ?? null;
}

export function getSession(programId: string, sessionId: string) {
  const p = getProgramById(programId);
  if (!p) return null;
  const s = p.sessions.find((x) => x.id === sessionId) ?? null;
  return { program: p, session: s };
}
