export type PatronNeed = {
  need: string;
  saints: string;
  search: string;
  note: string;
  prayer: string;
  keywords: string[];
};

export const patronNeeds: PatronNeed[] = [
  {
    need: "Lost things",
    saints: "Saint Phanourios",
    search: "Phanourios",
    note: "For finding what is lost and returning with gratitude.",
    keywords: ["lost", "missing", "keys", "wallet", "phone", "find", "forgetful"],
    prayer:
      "Holy Greatmartyr Phanourios, pray to God for me. Ask the Lord to reveal what is hidden if it is profitable for my salvation, and teach me to seek first the Kingdom of God. Amen.",
  },
  {
    need: "Anxiety, depression, and dark thoughts",
    saints: "Saints Porphyrios and Paisios",
    search: "Porphyrios Paisios",
    note: "For despondency, fear, intrusive thoughts, and the need for peace.",
    keywords: ["anxiety", "anxious", "panic", "depression", "depressed", "sad", "despair", "despondency", "fear", "intrusive", "dark", "thoughts", "mental", "peace", "hopeless"],
    prayer:
      "Holy Elders Porphyrios and Paisios, pray to Christ our God for me. Ask Him to quiet my thoughts, guard me from despair, strengthen me to seek help, and fill my heart with repentance, hope, and the light of His mercy. Amen.",
  },
  {
    need: "Illness and healing",
    saints: "Saint Panteleimon",
    search: "Panteleimon",
    note: "For sickness, medical care, surgery, and those who treat the sick.",
    keywords: ["illness", "sick", "sickness", "healing", "health", "medical", "doctor", "hospital", "surgery", "pain", "cancer", "injury"],
    prayer:
      "Holy Greatmartyr and Healer Panteleimon, pray to God for the sick and suffering. Ask Christ the Physician of souls and bodies to grant healing, patience, courage, and salvation according to His holy will. Amen.",
  },
  {
    need: "Protection on duty",
    saints: "Holy Archangel Michael",
    search: "Archangel Michael",
    note: "For watchfulness, courage, restraint, and protection from danger.",
    keywords: ["protection", "protect", "danger", "duty", "police", "military", "fire", "first", "responder", "courage", "watchfulness", "unsafe", "threat"],
    prayer:
      "Holy Archangel Michael, commander of the bodiless hosts, defend us and pray to God for us. Guard us from fear, anger, pride, and every temptation that darkens the heart. Amen.",
  },
  {
    need: "Work, money, and housing",
    saints: "Saint Xenia of Petersburg",
    search: "Xenia Petersburg",
    note: "For housing, employment, provision, and trusting God in instability.",
    keywords: ["work", "job", "employment", "career", "money", "finances", "rent", "housing", "home", "homeless", "provision", "bills", "debt"],
    prayer:
      "Blessed Xenia, fool-for-Christ and quick helper, pray to God for me. Ask the Lord to provide what is needful, to open a righteous path, and to make me generous, patient, and faithful in uncertainty. Amen.",
  },
  {
    need: "Travel and safe return",
    saints: "Saint Nicholas the Wonderworker",
    search: "Nicholas Wonderworker",
    note: "For travelers, sailors, commuters, families apart, and those in danger.",
    keywords: ["travel", "trip", "drive", "driving", "flight", "fly", "commute", "sail", "journey", "safe", "return", "road"],
    prayer:
      "Holy Father Nicholas, wonderworker and shepherd, pray to God for all who travel by land, sea, and air. Ask the Lord to guide, protect, and return us in peace. Amen.",
  },
  {
    need: "Study, exams, and wisdom",
    saints: "The Three Holy Hierarchs",
    search: "Three Holy Hierarchs",
    note: "For learning, teaching, exams, discernment, and Orthodox formation.",
    keywords: ["study", "school", "exam", "test", "learning", "teacher", "student", "wisdom", "discernment", "memory", "focus", "college"],
    prayer:
      "Holy Basil the Great, Gregory the Theologian, and John Chrysostom, pray to God for me. Ask the Lord to grant humility, attention, memory, wisdom, and love for the truth. Amen.",
  },
  {
    need: "Anger and strong passions",
    saints: "Saint Moses the Black",
    search: "Moses the Black",
    note: "For anger, violence, resentment, lust, addiction, and repentance after falls.",
    keywords: ["anger", "angry", "rage", "resentment", "violence", "violent", "lust", "addiction", "passion", "temptation", "repentance", "fall"],
    prayer:
      "Venerable Moses, who rose from violence to holiness by repentance, pray to God for me. Ask Christ to break the power of anger and passion, give me tears of repentance, and teach me mercy. Amen.",
  },
  {
    need: "Family and children",
    saints: "Saints Joachim and Anna",
    search: "Joachim Anna",
    note: "For marriage, children, parents, infertility, and homes under strain.",
    keywords: ["family", "marriage", "spouse", "children", "child", "parents", "parenting", "infertility", "home", "household", "pregnancy", "strain"],
    prayer:
      "Holy and righteous Joachim and Anna, grandparents of Christ according to the flesh, pray to God for our homes. Ask Him to bless parents and children, heal wounds, and teach us patience and love. Amen.",
  },
  {
    need: "Grief and loneliness",
    saints: "Saint Xenia of Petersburg",
    search: "Xenia Petersburg",
    note: "For widowhood, grief, abandonment, and loneliness.",
    keywords: ["grief", "grieving", "loss", "death", "widow", "widowhood", "lonely", "loneliness", "alone", "abandoned", "abandonment", "sorrow"],
    prayer:
      "Blessed Xenia, you bore grief with holy foolishness and love for Christ. Pray for me, that sorrow may not become despair, and that Christ would comfort, strengthen, and save me. Amen.",
  },
  {
    need: "Confession and repentance",
    saints: "Saint Mary of Egypt",
    search: "Mary of Egypt",
    note: "For returning to confession, chastity, repentance, and starting again.",
    keywords: ["confession", "repentance", "repent", "shame", "chastity", "purity", "start", "again", "return", "sin", "forgiveness"],
    prayer:
      "Venerable Mother Mary of Egypt, pray to God for me. Ask the Lord to grant me true repentance, courage to confess, freedom from shame, and the strength to rise again. Amen.",
  },
  {
    need: "Before building or creating",
    saints: "Saint Joseph the Betrothed",
    search: "Joseph Betrothed",
    note: "For honest work, craft, discipline, and serving others through what you build.",
    keywords: ["build", "building", "create", "creating", "craft", "project", "discipline", "labor", "hands", "maker", "construction", "carpentry"],
    prayer:
      "Holy and righteous Joseph, guardian of the Theotokos and the Christ Child, pray to God for me. Ask the Lord to bless the work of my hands, keep me humble, and make my labor useful and pure. Amen.",
  },
];

const stopWords = new Set([
  "a",
  "about",
  "and",
  "are",
  "can",
  "do",
  "for",
  "help",
  "i",
  "im",
  "in",
  "is",
  "me",
  "my",
  "of",
  "on",
  "or",
  "pray",
  "prayer",
  "saint",
  "saints",
  "should",
  "the",
  "to",
  "who",
  "with",
]);

const crisisWords = ["suicide", "suicidal", "self-harm", "selfharm", "kill myself", "harm myself", "end my life"];

export function ocaSaintSearchUrl(query: string) {
  return `https://www.oca.org/saints/lives?search=${encodeURIComponent(query)}`;
}

export function tokenizeSaintQuery(query: string) {
  return query
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9-]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1 && !stopWords.has(word));
}

export function matchesPatronNeed(item: PatronNeed, query: string) {
  return scorePatronNeed(item, query) > 0;
}

export function scorePatronNeed(item: PatronNeed, query: string) {
  const tokens = tokenizeSaintQuery(query);
  if (!tokens.length) return 0;

  const haystack = [item.need, item.saints, item.search, item.note, item.prayer, ...item.keywords]
    .join(" ")
    .toLowerCase();

  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

export function findPatronNeeds(query: string, limit = 3) {
  return patronNeeds
    .map((item) => ({ item, score: scorePatronNeed(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.need.localeCompare(b.item.need))
    .slice(0, limit)
    .map(({ item }) => item);
}

export function isCrisisQuery(query: string) {
  const normalized = query.toLowerCase();
  return crisisWords.some((word) => normalized.includes(word));
}

export function buildSaintAssistantReply(query: string) {
  const matches = findPatronNeeds(query, 3);
  const crisis = isCrisisQuery(query);

  if (!query.trim()) {
    return {
      crisis: false,
      matches,
      message: "Tell me what you are facing—depression, anxiety, grief, illness, work, travel, family, or another need—and I’ll suggest a saint from the app’s patron guide.",
    };
  }

  if (!matches.length) {
    return {
      crisis,
      matches,
      message: "I could not find a close patron-saint match in the local guide. Try a simpler phrase like anxiety, depression, grief, illness, family, work, travel, confession, or anger.",
    };
  }

  const top = matches[0];
  return {
    crisis,
    matches,
    message: `For “${query.trim()},” start with ${top.saints}. ${top.note} You can pray simply: “Holy saint of God, pray to God for me.”`,
  };
}
