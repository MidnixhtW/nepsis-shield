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
  {
    need: "Cancer and long treatments",
    saints: "Saint Nektarios of Aegina",
    search: "Nektarios Aegina",
    note: "For cancer, chronic illness, long treatments, and patient endurance.",
    keywords: ["cancer", "tumor", "chemo", "radiation", "treatment", "chronic", "illness", "endurance", "hospital", "diagnosis"],
    prayer:
      "Holy Hierarch Nektarios, pray to Christ for me. Ask the Lord to grant healing, patience, courage through treatment, and trust in His mercy and holy will. Amen.",
  },
  {
    need: "Doctors, surgery, and medical decisions",
    saints: "Saint Luke the Surgeon of Crimea",
    search: "Luke Crimea Surgeon",
    note: "For physicians, surgeons, nurses, diagnoses, operations, and difficult medical choices.",
    keywords: ["doctor", "surgeon", "surgery", "operation", "medical", "nurse", "diagnosis", "clinic", "decision", "medicine"],
    prayer:
      "Holy Hierarch Luke, physician and shepherd, pray to God for me. Ask Christ to guide the hands of those who treat the sick and to grant wisdom, healing, and peace. Amen.",
  },
  {
    need: "Joy, peace, and warmth of heart",
    saints: "Saint Seraphim of Sarov",
    search: "Seraphim Sarov",
    note: "For peace of soul, spiritual joy, gentleness, and acquiring the Holy Spirit.",
    keywords: ["joy", "peace", "warmth", "gentleness", "holy spirit", "sad", "cold", "heart", "hope", "calm"],
    prayer:
      "Venerable Father Seraphim, pray to God for me. Ask the Lord to warm my heart, grant peace, and teach me to greet each person with the joy of Christ. Amen.",
  },
  {
    need: "Humility and love for enemies",
    saints: "Saint Silouan the Athonite",
    search: "Silouan Athonite",
    note: "For humility, prayer for enemies, freedom from pride, and hope in despair.",
    keywords: ["humility", "humble", "enemies", "enemy", "pride", "despair", "hatred", "forgive", "forgiveness", "mercy"],
    prayer:
      "Venerable Silouan, pray to Christ for me. Ask Him to humble my heart, teach me to love my enemies, and keep my soul in hope and mercy. Amen.",
  },
  {
    need: "Courage and spiritual battle",
    saints: "Saint George the Greatmartyr",
    search: "George Greatmartyr",
    note: "For courage, perseverance, and faithfulness under pressure.",
    keywords: ["courage", "bravery", "fear", "pressure", "battle", "persevere", "trial", "strength", "martyr", "stand"],
    prayer:
      "Holy Greatmartyr George, pray to God for me. Ask Christ to strengthen my faith, give courage in trial, and help me overcome fear with trust in Him. Amen.",
  },
  {
    need: "Protection from sudden danger",
    saints: "Saint Barbara the Greatmartyr",
    search: "Barbara Greatmartyr",
    note: "For watchfulness, sudden danger, and readiness to meet Christ with repentance.",
    keywords: ["danger", "sudden", "storm", "protection", "emergency", "fear", "ready", "repentance", "accident", "death"],
    prayer:
      "Holy Greatmartyr Barbara, pray to God for me. Ask the Lord to protect me from sudden danger and to keep my heart ready through repentance and faith. Amen.",
  },
  {
    need: "Learning, philosophy, and difficult study",
    saints: "Saint Catherine of Alexandria",
    search: "Catherine Alexandria",
    note: "For students, teachers, philosophy, clear thinking, and defending the faith with humility.",
    keywords: ["learning", "student", "teacher", "philosophy", "study", "school", "college", "wisdom", "reason", "debate"],
    prayer:
      "Holy Greatmartyr Catherine, pray to Christ for me. Ask Him to enlighten my mind, purify my motives, and make all learning serve truth and humility. Amen.",
  },
  {
    need: "Speaking about Christ",
    saints: "Saint Photini the Samaritan Woman",
    search: "Photini Samaritan Woman",
    note: "For evangelism, honest conversation, repentance, and sharing Christ with courage.",
    keywords: ["evangelism", "speak", "conversation", "witness", "share", "christ", "truth", "repentance", "honest", "mission"],
    prayer:
      "Holy Martyr Photini, pray to God for me. Ask Christ to give me living water, honest repentance, and courage to speak of Him with love. Amen.",
  },
  {
    need: "Music, chanting, and words",
    saints: "Saint Romanos the Melodist",
    search: "Romanos Melodist",
    note: "For chanting, singing, writing, public speaking, and using words beautifully for God.",
    keywords: ["music", "chant", "sing", "singing", "voice", "writing", "words", "speech", "public", "creative"],
    prayer:
      "Venerable Romanos, sweet singer of the Church, pray to God for me. Ask the Lord to purify my words and make my voice serve prayer, truth, and love. Amen.",
  },
  {
    need: "Cooking, food, and hospitality",
    saints: "Saint Euphrosynos the Cook",
    search: "Euphrosynos Cook",
    note: "For cooks, kitchens, feeding others, humble service, and hospitality.",
    keywords: ["cook", "cooking", "kitchen", "food", "meal", "hospitality", "serve", "service", "restaurant", "feed"],
    prayer:
      "Venerable Euphrosynos, humble servant of God, pray for me. Ask Christ to bless the work of my hands and make every meal an act of gratitude and love. Amen.",
  },
  {
    need: "Animals and creation",
    saints: "Saint Mamas of Caesarea",
    search: "Mamas Caesarea",
    note: "For animals, pets, livestock, and gentle care for God's creation.",
    keywords: ["animal", "animals", "pet", "pets", "livestock", "creation", "nature", "gentle", "care", "farm"],
    prayer:
      "Holy Martyr Mamas, pray to God for me. Ask the Lord to teach me gentleness, gratitude, and faithful care for every creature entrusted to me. Amen.",
  },
  {
    need: "Gardens, crops, and practical work",
    saints: "Saint Tryphon the Martyr",
    search: "Tryphon Martyr",
    note: "For gardens, fields, pests, practical labor, and protection of crops.",
    keywords: ["garden", "gardening", "crop", "crops", "farm", "pests", "plants", "field", "labor", "harvest"],
    prayer:
      "Holy Martyr Tryphon, pray to God for me. Ask the Lord to bless the earth, the work of my hands, and all honest labor that feeds and serves others. Amen.",
  },
  {
    need: "Hospitality and caring for strangers",
    saints: "Saint Sampson the Hospitable",
    search: "Sampson Hospitable",
    note: "For hospitality, caregiving, mercy toward strangers, and service to the sick.",
    keywords: ["hospitality", "guest", "stranger", "care", "caregiving", "mercy", "service", "sick", "shelter", "welcome"],
    prayer:
      "Venerable Sampson the Hospitable, pray to God for me. Ask Christ to make my home and heart open with wisdom, mercy, and love for the suffering. Amen.",
  },
  {
    need: "Missions and life far from home",
    saints: "Saint Herman of Alaska",
    search: "Herman Alaska",
    note: "For missionaries, converts, remote places, homesickness, and simple faithful witness.",
    keywords: ["mission", "missionary", "convert", "alaska", "home", "homesick", "remote", "witness", "parish", "lonely"],
    prayer:
      "Venerable Herman of Alaska, pray to God for me. Ask the Lord to keep me faithful, gentle, and steadfast wherever He has placed me. Amen.",
  },
  {
    need: "Finding a parish and Orthodox community",
    saints: "Saint Tikhon of Moscow",
    search: "Tikhon Moscow",
    note: "For parish life, bishops, priests, converts, and finding stability in the Church.",
    keywords: ["parish", "church", "community", "orthodox", "convert", "bishop", "priest", "stability", "belong", "catechumen"],
    prayer:
      "Holy Patriarch Tikhon, pray to God for me. Ask Christ to guide me into faithful Church life, wise counsel, and peaceful communion with His people. Amen.",
  },
  {
    need: "Leadership and responsibility",
    saints: "Saint Alexander Nevsky",
    search: "Alexander Nevsky",
    note: "For leaders, responsibility, restraint, courage, and serving others without pride.",
    keywords: ["leader", "leadership", "responsibility", "command", "manage", "team", "courage", "restraint", "duty", "decision"],
    prayer:
      "Holy Right-Believing Alexander, pray to God for me. Ask the Lord to give me courage without pride, restraint under pressure, and a heart that serves. Amen.",
  },
  {
    need: "Marriage struggles and family healing",
    saints: "Saints Peter and Fevronia",
    search: "Peter Fevronia",
    note: "For marriage, faithfulness, reconciliation, and patient love in family life.",
    keywords: ["marriage", "husband", "wife", "spouse", "reconciliation", "family", "faithfulness", "love", "conflict", "healing"],
    prayer:
      "Holy Peter and Fevronia, pray to God for us. Ask Christ to heal wounds, strengthen faithfulness, and teach our home patience, forgiveness, and love. Amen.",
  },
  {
    need: "Children and young people",
    saints: "Saint Stylianos of Paphlagonia",
    search: "Stylianos Paphlagonia",
    note: "For children, infants, young people, parents, and those who care for them.",
    keywords: ["children", "child", "infant", "baby", "young", "youth", "parent", "parents", "care", "family"],
    prayer:
      "Venerable Stylianos, pray to God for our children. Ask the Lord to guard them, heal them, and make our homes places of patience, safety, and faith. Amen.",
  },
  {
    need: "Pregnancy and childbirth",
    saints: "Saint Eleutherios the Hieromartyr",
    search: "Eleutherios Hieromartyr",
    note: "For pregnancy, childbirth, mothers, infants, and safe delivery.",
    keywords: ["pregnancy", "pregnant", "birth", "childbirth", "delivery", "mother", "infant", "baby", "labor", "safe"],
    prayer:
      "Holy Hieromartyr Eleutherios, pray to God for mothers and children. Ask Christ to grant protection, safe delivery, healing, and peace according to His will. Amen.",
  },
  {
    need: "Addiction recovery and sobriety",
    saints: "Saint Boniface of Tarsus",
    search: "Boniface Tarsus",
    note: "For sobriety, addiction recovery, repentance, and freedom from destructive habits.",
    keywords: ["addiction", "sobriety", "alcohol", "drugs", "recovery", "habit", "compulsion", "repentance", "freedom", "relapse"],
    prayer:
      "Holy Martyr Boniface, pray to God for me. Ask Christ to free me from destructive habits, strengthen me in sobriety, and lead me to repentance and help. Amen.",
  },
  {
    need: "Unpaid bills and urgent needs",
    saints: "Saint Spyridon of Trimythous",
    search: "Spyridon Trimythous",
    note: "For urgent material needs, debt, provision, and trusting God with practical problems.",
    keywords: ["bills", "debt", "money", "urgent", "need", "rent", "provision", "financial", "poor", "help"],
    prayer:
      "Holy Hierarch Spyridon, quick helper, pray to God for me. Ask the Lord to provide what is needful and to teach me gratitude, generosity, and trust. Amen.",
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
