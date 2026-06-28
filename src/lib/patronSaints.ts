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
  {
    need: "Soldiers and courage under threat",
    saints: "Saint Demetrios of Thessalonica",
    search: "Demetrios Thessalonica",
    note: "For soldiers, defenders, courage, and faithful endurance in danger.",
    keywords: ["soldier", "military", "courage", "threat", "danger", "defense", "battle", "endurance", "service", "protector"],
    prayer:
      "Holy Greatmartyr Demetrios, pray to God for me. Ask Christ to give courage without hatred, discipline without pride, and faithfulness in every danger. Amen.",
  },
  {
    need: "Temptation and purity of heart",
    saints: "Saint Theodore the Recruit",
    search: "Theodore Recruit Tyro",
    note: "For temptations, purity, courage, and refusing compromise.",
    keywords: ["temptation", "purity", "compromise", "courage", "pressure", "trial", "clean", "heart", "faithful", "refuse"],
    prayer:
      "Holy Martyr Theodore, pray to God for me. Ask the Lord to strengthen my will, purify my heart, and help me refuse what harms my soul. Amen.",
  },
  {
    need: "Safe travel and carrying heavy burdens",
    saints: "Saint Christopher the Martyr",
    search: "Christopher Martyr",
    note: "For travelers, drivers, heavy responsibilities, and protection on the road.",
    keywords: ["travel", "driver", "road", "burden", "responsibility", "safe", "journey", "commute", "carry", "protection"],
    prayer:
      "Holy Martyr Christopher, pray to God for me. Ask Christ to guard my path, lighten my burdens, and bring me safely where I must go. Amen.",
  },
  {
    need: "Fear, nightmares, and spiritual oppression",
    saints: "Saint Marina the Greatmartyr",
    search: "Marina Greatmartyr",
    note: "For fear, nightmares, spiritual struggle, and courage against darkness.",
    keywords: ["fear", "nightmare", "darkness", "oppression", "spiritual", "demons", "courage", "sleep", "terror", "struggle"],
    prayer:
      "Holy Greatmartyr Marina, pray to Christ for me. Ask Him to drive away fear, guard my sleep, and strengthen me against every darkness. Amen.",
  },
  {
    need: "Eye trouble and clarity",
    saints: "Saint Paraskeva",
    search: "Paraskeva",
    note: "For eye ailments, clarity, women in need, and steadfast faith.",
    keywords: ["eyes", "vision", "sight", "clarity", "women", "healing", "ailment", "focus", "faith", "steadfast"],
    prayer:
      "Holy Martyr Paraskeva, pray to God for me. Ask Christ to grant healing, clear sight of His will, and steadfast love for Him. Amen.",
  },
  {
    need: "Epidemics and public sickness",
    saints: "Saint Haralambos the Hieromartyr",
    search: "Haralambos Hieromartyr",
    note: "For plagues, epidemics, community illness, and protection of the vulnerable.",
    keywords: ["epidemic", "plague", "sickness", "public", "illness", "vulnerable", "community", "infection", "protection", "health"],
    prayer:
      "Holy Hieromartyr Haralambos, pray to God for us. Ask Christ to protect the sick and vulnerable and to grant mercy, healing, and peace. Amen.",
  },
  {
    need: "Throat, voice, and breathing trouble",
    saints: "Saint Blaise of Sebaste",
    search: "Blaise Sebaste",
    note: "For throat pain, voice, breathing concerns, and calm during illness.",
    keywords: ["throat", "voice", "breathing", "cough", "air", "speech", "illness", "pain", "calm", "healing"],
    prayer:
      "Holy Hieromartyr Blaise, pray to Christ for me. Ask Him to ease my suffering, guard my breath and voice, and grant healing according to His will. Amen.",
  },
  {
    need: "Breast illness and women suffering",
    saints: "Saint Agatha the Martyr",
    search: "Agatha Martyr",
    note: "For breast illness, women in pain, and courage under humiliation.",
    keywords: ["breast", "women", "pain", "illness", "cancer", "humiliation", "courage", "body", "healing", "suffering"],
    prayer:
      "Holy Martyr Agatha, pray to God for me. Ask Christ to heal suffering, restore dignity, and give courage to all who endure pain. Amen.",
  },
  {
    need: "Young children in danger",
    saints: "Saints Kyrikos and Julitta",
    search: "Kyrikos Julitta",
    note: "For children, mothers, danger, and steadfast faith in family trials.",
    keywords: ["children", "child", "mother", "danger", "family", "trial", "young", "protection", "faith", "martyr"],
    prayer:
      "Holy Kyrikos and Julitta, pray to God for our children. Ask Christ to protect them, strengthen families, and keep us faithful in trial. Amen.",
  },
  {
    need: "Physicians and free healing",
    saints: "Saints Cosmas and Damian",
    search: "Cosmas Damian Unmercenary",
    note: "For doctors, nurses, medicine, and healing offered with compassion.",
    keywords: ["doctor", "nurse", "medicine", "healing", "free", "compassion", "clinic", "physician", "care", "unmercenary"],
    prayer:
      "Holy Unmercenary Physicians Cosmas and Damian, pray to God for me. Ask Christ to heal, guide caregivers, and make medicine an instrument of mercy. Amen.",
  },
  {
    need: "Hard diagnoses and hospital care",
    saints: "Saints Cyrus and John the Unmercenaries",
    search: "Cyrus John Unmercenary",
    note: "For serious illness, hospital care, physicians, and difficult diagnoses.",
    keywords: ["diagnosis", "hospital", "serious", "illness", "doctor", "care", "healing", "medicine", "pain", "patient"],
    prayer:
      "Holy Cyrus and John, pray to Christ for me. Ask Him to guide every diagnosis, comfort the sick, and grant healing of soul and body. Amen.",
  },
  {
    need: "Women in medicine and caregiving",
    saints: "Saint Hermione the Physician",
    search: "Hermione Physician",
    note: "For women physicians, nurses, caregivers, and healing ministries.",
    keywords: ["woman", "women", "physician", "nurse", "caregiver", "medicine", "healing", "ministry", "hospital", "service"],
    prayer:
      "Holy Hermione, physician of mercy, pray to God for me. Ask Christ to bless caregivers with wisdom, patience, and healing love. Amen.",
  },
  {
    need: "Disability and hidden suffering",
    saints: "Saint Matrona of Moscow",
    search: "Matrona Moscow",
    note: "For disability, chronic weakness, hidden suffering, and hope.",
    keywords: ["disability", "disabled", "weakness", "chronic", "hidden", "suffering", "hope", "blind", "pain", "endurance"],
    prayer:
      "Blessed Matrona, pray to God for me. Ask Christ to strengthen me in hidden suffering and fill my weakness with hope and trust. Amen.",
  },
  {
    need: "Refugees, orphans, and displaced families",
    saints: "Saint John Maximovitch",
    search: "John Maximovitch Shanghai San Francisco",
    note: "For refugees, orphans, displaced families, children, and tireless pastoral care.",
    keywords: ["refugee", "orphan", "displaced", "family", "children", "homeless", "pastoral", "travel", "care", "migration"],
    prayer:
      "Holy Hierarch John, pray to God for us. Ask Christ to shelter refugees, comfort orphans, and make us quick to serve those without a home. Amen.",
  },
  {
    need: "Forgiveness after betrayal",
    saints: "Saint Elizabeth the New Martyr",
    search: "Elizabeth New Martyr",
    note: "For forgiveness, mercy, service to the poor, and healing after violence.",
    keywords: ["forgiveness", "betrayal", "violence", "mercy", "poor", "service", "healing", "widow", "wound", "compassion"],
    prayer:
      "Holy New Martyr Elizabeth, pray to Christ for me. Ask Him to heal wounds, teach forgiveness, and make my grief fruitful in mercy. Amen.",
  },
  {
    need: "Serving the poor and homeless",
    saints: "Saint Maria of Paris",
    search: "Maria Paris Skobtsova",
    note: "For serving the poor, refugees, prisoners, and Christ hidden in the neighbor.",
    keywords: ["poor", "homeless", "refugee", "prisoner", "service", "charity", "neighbor", "mercy", "shelter", "hunger"],
    prayer:
      "Saint Maria of Paris, pray to God for me. Ask Christ to open my eyes to Him in the poor and to give me courageous mercy. Amen.",
  },
  {
    need: "Returning to the Orthodox Church",
    saints: "Saint Alexis Toth",
    search: "Alexis Toth",
    note: "For converts, returning to Orthodoxy, parish struggles, and patient endurance.",
    keywords: ["convert", "return", "orthodox", "church", "parish", "struggle", "endurance", "faith", "identity", "home"],
    prayer:
      "Holy Alexis, pray to God for me. Ask Christ to guide me home to His Church with humility, patience, and love. Amen.",
  },
  {
    need: "Languages and missionary learning",
    saints: "Saint Innocent of Alaska",
    search: "Innocent Alaska",
    note: "For missionaries, language learning, teaching, and patient work across cultures.",
    keywords: ["language", "mission", "missionary", "culture", "teaching", "learn", "translate", "alaska", "patience", "travel"],
    prayer:
      "Holy Innocent of Alaska, pray to God for me. Ask Christ to bless my learning, make my words clear, and teach me to serve every people with love. Amen.",
  },
  {
    need: "New beginnings in a foreign place",
    saints: "Saint Nicholas of Japan",
    search: "Nicholas Japan",
    note: "For mission, language study, new cultures, patience, and building trust.",
    keywords: ["foreign", "new", "culture", "language", "mission", "study", "patience", "trust", "japan", "beginning"],
    prayer:
      "Holy Nicholas of Japan, pray to God for me. Ask Christ to give patience, humility, and love as I learn and begin again. Amen.",
  },
  {
    need: "Parish unity and immigrant families",
    saints: "Saint Raphael of Brooklyn",
    search: "Raphael Brooklyn",
    note: "For parish unity, immigrants, clergy, families far from home, and Orthodox stability.",
    keywords: ["parish", "unity", "immigrant", "family", "clergy", "stability", "community", "home", "america", "church"],
    prayer:
      "Holy Raphael of Brooklyn, pray to God for us. Ask Christ to unite our parish, strengthen families, and make His Church a home of peace. Amen.",
  },
  {
    need: "Standing firm in Orthodox truth",
    saints: "Saint Athanasius the Great",
    search: "Athanasius Great",
    note: "For doctrine, courage, perseverance, and standing firm when isolated.",
    keywords: ["truth", "doctrine", "orthodox", "courage", "alone", "pressure", "persevere", "faith", "defend", "teaching"],
    prayer:
      "Holy Father Athanasius, pray to Christ for me. Ask Him to make me steadfast in truth, humble in speech, and faithful under pressure. Amen.",
  },
  {
    need: "Truth under pressure",
    saints: "Saint Maximus the Confessor",
    search: "Maximus Confessor",
    note: "For confessing truth, theological discernment, endurance, and suffering for conscience.",
    keywords: ["truth", "pressure", "discernment", "conscience", "endurance", "theology", "confession", "suffer", "speak", "faith"],
    prayer:
      "Holy Maximus, pray to God for me. Ask Christ to give me discernment, courage, and humility when truth is costly. Amen.",
  },
  {
    need: "Discernment and guarding the faith",
    saints: "Saint Mark of Ephesus",
    search: "Mark Ephesus",
    note: "For discernment, faithfulness, Church unity in truth, and resistance to compromise.",
    keywords: ["discernment", "faith", "unity", "truth", "compromise", "church", "orthodox", "decision", "courage", "teaching"],
    prayer:
      "Holy Mark of Ephesus, pray to God for me. Ask Christ to grant discernment, love for truth, and peace without false compromise. Amen.",
  },
  {
    need: "Quick help in trouble",
    saints: "Saint Basil of Ostrog",
    search: "Basil Ostrog",
    note: "For urgent help, healing, family needs, and hope during trouble.",
    keywords: ["urgent", "help", "trouble", "healing", "family", "need", "quick", "hope", "illness", "protection"],
    prayer:
      "Holy Basil of Ostrog, pray to God for me. Ask the Lord to help quickly, heal what is wounded, and keep my heart in hope. Amen.",
  },
  {
    need: "Schools, nations, and Church foundations",
    saints: "Saint Sava of Serbia",
    search: "Sava Serbia",
    note: "For schools, Church life, national healing, leadership, and spiritual foundations.",
    keywords: ["school", "church", "nation", "leadership", "foundation", "education", "serbia", "unity", "bishop", "peace"],
    prayer:
      "Holy Sava, pray to God for us. Ask Christ to bless our schools, churches, and homes with wisdom, peace, and holy foundations. Amen.",
  },
  {
    need: "Fathers and family responsibility",
    saints: "Saint Simeon the Myrrh-streaming",
    search: "Simeon Myrrh-streaming Serbia",
    note: "For fathers, family responsibility, repentance, and peaceful leadership at home.",
    keywords: ["father", "dad", "family", "responsibility", "leadership", "repentance", "home", "peace", "parent", "husband"],
    prayer:
      "Holy Simeon, pray to God for me. Ask Christ to make me repentant, peaceful, and faithful in every responsibility given to me. Amen.",
  },
  {
    need: "Abuse survivors and wounded families",
    saints: "Saint Olga of Alaska",
    search: "Olga Alaska",
    note: "For abuse survivors, women in pain, families carrying trauma, and gentle healing.",
    keywords: ["abuse", "survivor", "trauma", "women", "family", "wound", "healing", "gentle", "pain", "safety"],
    prayer:
      "Blessed Olga, pray to God for the wounded. Ask Christ to protect the vulnerable, heal trauma, and surround every sufferer with mercy and safety. Amen.",
  },
  {
    need: "Repentance for leaders",
    saints: "Saint Olga Equal-to-the-Apostles",
    search: "Olga Equal-to-the-Apostles",
    note: "For rulers, leaders, conversion, repentance, and wise influence.",
    keywords: ["leader", "ruler", "repentance", "conversion", "influence", "wisdom", "nation", "family", "decision", "authority"],
    prayer:
      "Holy Olga, pray to God for me. Ask Christ to turn my heart toward repentance and make every influence I have serve His mercy. Amen.",
  },
  {
    need: "Family conversion and shared faith",
    saints: "Saint Vladimir Equal-to-the-Apostles",
    search: "Vladimir Equal-to-the-Apostles",
    note: "For conversion, family faith, leaders, and bringing light to households.",
    keywords: ["conversion", "family", "faith", "leader", "household", "light", "baptism", "nation", "change", "repentance"],
    prayer:
      "Holy Vladimir, pray to God for us. Ask Christ to illumine our homes, turn hearts toward Him, and make our families faithful. Amen.",
  },
  {
    need: "Writing, creativity, and repentance",
    saints: "Saint Kassiani the Hymnographer",
    search: "Kassiani Hymnographer",
    note: "For writers, hymnographers, women creatives, repentance, and truthful beauty.",
    keywords: ["writing", "writer", "creative", "hymn", "music", "repentance", "beauty", "women", "poetry", "art"],
    prayer:
      "Holy Kassiani, pray to God for me. Ask Christ to purify my creativity, deepen repentance, and make beauty serve truth. Amen.",
  },
  {
    need: "Grief and hope in the Resurrection",
    saints: "Saint Mary Magdalene",
    search: "Mary Magdalene",
    note: "For grief, faithful love, resurrection hope, and courage to proclaim good news.",
    keywords: ["grief", "resurrection", "hope", "mourning", "love", "witness", "news", "sadness", "tomb", "joy"],
    prayer:
      "Holy Mary Magdalene, pray to Christ for me. Ask Him to meet me in grief and fill my heart with the hope of His Resurrection. Amen.",
  },
  {
    need: "Bleeding, chronic pain, and courage to ask",
    saints: "Saint Veronica",
    search: "Veronica Hemorrhissa",
    note: "For chronic bleeding, hidden illness, shame, and courage to reach toward Christ.",
    keywords: ["bleeding", "chronic", "pain", "hidden", "illness", "shame", "courage", "healing", "touch", "faith"],
    prayer:
      "Holy Veronica, pray to God for me. Ask Christ to heal what is hidden, remove shame, and give me courage to reach for His mercy. Amen.",
  },
  {
    need: "Seeing Christ clearly",
    saints: "Saint Longinus the Centurion",
    search: "Longinus Centurion",
    note: "For soldiers, repentance, clear sight, and recognizing Christ in suffering.",
    keywords: ["soldier", "repentance", "sight", "see", "christ", "cross", "suffering", "truth", "courage", "witness"],
    prayer:
      "Holy Longinus, pray to God for me. Ask Christ to open my eyes, turn my heart to repentance, and help me confess Him with courage. Amen.",
  },
  {
    need: "Last-minute repentance",
    saints: "Saint Dismas the Wise Thief",
    search: "Dismas Wise Thief",
    note: "For repentance near death, mercy after wasted years, and hope for sinners.",
    keywords: ["repentance", "death", "dying", "mercy", "sinner", "last", "hope", "thief", "forgiveness", "paradise"],
    prayer:
      "Holy Dismas, pray to Christ for me. Ask Him to remember me in His Kingdom and grant repentance, mercy, and hope. Amen.",
  },
  {
    need: "Grief, burial, and quiet courage",
    saints: "Saint Joseph of Arimathea",
    search: "Joseph Arimathea",
    note: "For grief, funerals, burial, quiet courage, and serving Christ when afraid.",
    keywords: ["grief", "funeral", "burial", "death", "courage", "quiet", "fear", "service", "loss", "mourning"],
    prayer:
      "Holy Joseph of Arimathea, pray to God for me. Ask Christ to give quiet courage, reverence in grief, and hope in His victory over death. Amen.",
  },
  {
    need: "Questions, doubt, and secret seeking",
    saints: "Saint Nicodemus",
    search: "Nicodemus",
    note: "For seekers, questions, fear, nighttime prayer, and growing courage in faith.",
    keywords: ["questions", "doubt", "seeker", "fear", "night", "faith", "courage", "learn", "hidden", "belief"],
    prayer:
      "Holy Nicodemus, pray to God for me. Ask Christ to meet me in my questions and lead me from fear into faithful courage. Amen.",
  },
  {
    need: "Death, friendship, and hope",
    saints: "Saint Lazarus the Four-Days-Dead",
    search: "Lazarus Four-Days-Dead",
    note: "For grief, friendship, death, and hope in Christ who raises the dead.",
    keywords: ["death", "grief", "friend", "friendship", "resurrection", "hope", "mourning", "sick", "family", "loss"],
    prayer:
      "Holy Lazarus, friend of Christ, pray for me. Ask the Lord to comfort grief and awaken hope in the One who raises the dead. Amen.",
  },
  {
    need: "Hospitality and anxious busyness",
    saints: "Saints Martha and Mary of Bethany",
    search: "Martha Mary Bethany",
    note: "For hospitality, anxiety, listening to Christ, and balancing service with prayer.",
    keywords: ["hospitality", "busy", "anxiety", "service", "prayer", "listen", "home", "balance", "work", "guest"],
    prayer:
      "Holy Martha and Mary, pray to God for me. Ask Christ to bless my service and teach my heart to listen, rest, and love. Amen.",
  },
  {
    need: "New vocations and first steps",
    saints: "Saint Andrew the First-Called",
    search: "Andrew First-Called",
    note: "For beginnings, vocations, invitations to faith, and bringing others to Christ.",
    keywords: ["beginning", "vocation", "calling", "first", "start", "faith", "invite", "disciple", "decision", "path"],
    prayer:
      "Holy Apostle Andrew, pray to God for me. Ask Christ to guide my first steps and make me quick to follow and invite others to Him. Amen.",
  },
  {
    need: "Failure and returning after denial",
    saints: "Saint Peter the Apostle",
    search: "Peter Apostle",
    note: "For repentance after failure, leadership, courage, and returning to Christ.",
    keywords: ["failure", "denial", "repentance", "return", "leader", "courage", "wept", "forgiveness", "start", "again"],
    prayer:
      "Holy Apostle Peter, pray to Christ for me. Ask Him to lift me after failure, restore my love, and make me faithful again. Amen.",
  },
  {
    need: "Endurance in mission and hardship",
    saints: "Saint Paul the Apostle",
    search: "Paul Apostle",
    note: "For mission, endurance, preaching, hardship, and zeal transformed by grace.",
    keywords: ["mission", "endurance", "hardship", "preach", "zeal", "grace", "travel", "work", "suffering", "apostle"],
    prayer:
      "Holy Apostle Paul, pray to God for me. Ask Christ to transform my zeal, strengthen me in hardship, and make my life serve the Gospel. Amen.",
  },
  {
    need: "Doubt and honest faith",
    saints: "Saint Thomas the Apostle",
    search: "Thomas Apostle",
    note: "For doubt, honest questions, faith, and meeting the risen Christ.",
    keywords: ["doubt", "question", "faith", "honest", "belief", "resurrection", "proof", "uncertain", "trust", "apostle"],
    prayer:
      "Holy Apostle Thomas, pray to Christ for me. Ask Him to meet me in doubt and lead me to confess Him with love and trust. Amen.",
  },
  {
    need: "Money, taxes, and changing direction",
    saints: "Saint Matthew the Apostle",
    search: "Matthew Apostle Evangelist",
    note: "For money, work with numbers, repentance, and leaving an old life behind.",
    keywords: ["money", "tax", "taxes", "numbers", "accounting", "repentance", "career", "change", "work", "old"],
    prayer:
      "Holy Apostle Matthew, pray to God for me. Ask Christ to free me from greed, bless honest work, and help me follow Him without delay. Amen.",
  },
  {
    need: "Artists, writers, and physicians",
    saints: "Saint Luke the Evangelist",
    search: "Luke Evangelist",
    note: "For artists, iconographers, writers, doctors, and telling Christ’s mercy clearly.",
    keywords: ["artist", "icon", "writer", "doctor", "physician", "gospel", "mercy", "story", "paint", "creative"],
    prayer:
      "Holy Apostle and Evangelist Luke, pray to God for me. Ask Christ to bless my hands, words, and work with healing truth. Amen.",
  },
  {
    need: "Writing clearly and finishing work",
    saints: "Saint Mark the Evangelist",
    search: "Mark Evangelist",
    note: "For writers, deadlines, clarity, and proclaiming the Gospel simply.",
    keywords: ["writing", "deadline", "clarity", "finish", "gospel", "simple", "writer", "work", "focus", "message"],
    prayer:
      "Holy Evangelist Mark, pray to God for me. Ask Christ to give clarity, focus, and words that serve truth. Amen.",
  },
  {
    need: "Love, purity, and spiritual friendship",
    saints: "Saint John the Theologian",
    search: "John Theologian Apostle",
    note: "For love, purity, friendship, theology, and abiding near Christ.",
    keywords: ["love", "purity", "friendship", "theology", "heart", "beloved", "prayer", "truth", "family", "church"],
    prayer:
      "Holy Apostle John, pray to Christ for me. Ask Him to purify my heart and teach me to abide in His love. Amen.",
  },
  {
    need: "Family conflict and Church leadership",
    saints: "Saint James the Brother of the Lord",
    search: "James Brother of the Lord",
    note: "For family strain, leadership, justice, prayer, and wisdom in the Church.",
    keywords: ["family", "conflict", "leadership", "justice", "wisdom", "church", "prayer", "brother", "community", "decision"],
    prayer:
      "Holy Apostle James, pray to God for me. Ask Christ to grant wisdom, justice, and peace in family and Church life. Amen.",
  },
  {
    need: "Service under criticism",
    saints: "Saint Stephen the Protomartyr",
    search: "Stephen Protomartyr",
    note: "For deacons, service, forgiveness, courage, and bearing false accusation.",
    keywords: ["service", "deacon", "criticism", "accusation", "forgiveness", "courage", "martyr", "serve", "enemy", "witness"],
    prayer:
      "Holy Protomartyr Stephen, pray to Christ for me. Ask Him to make me faithful in service and forgiving toward those who wound me. Amen.",
  },
  {
    need: "Generosity with possessions",
    saints: "Saint Laurence the Archdeacon",
    search: "Laurence Archdeacon",
    note: "For charity, generosity, stewardship, and serving Christ in the poor.",
    keywords: ["charity", "generosity", "money", "poor", "stewardship", "possessions", "service", "giving", "deacon", "wealth"],
    prayer:
      "Holy Laurence, pray to God for me. Ask Christ to make me generous, wise with possessions, and quick to serve Him in the poor. Amen.",
  },
  {
    need: "Facing suffering with courage",
    saints: "Saint Ignatius of Antioch",
    search: "Ignatius Antioch",
    note: "For courage before suffering, love for the Eucharist, and unity with the Church.",
    keywords: ["suffering", "courage", "eucharist", "church", "unity", "martyr", "fear", "trial", "bishop", "endurance"],
    prayer:
      "Holy Ignatius, pray to God for me. Ask Christ to unite me to His Church and make me brave in suffering. Amen.",
  },
  {
    need: "Old age and steadfast endurance",
    saints: "Saint Polycarp of Smyrna",
    search: "Polycarp Smyrna",
    note: "For elders, old age, memory, courage, and lifelong faithfulness.",
    keywords: ["old", "elder", "age", "memory", "courage", "lifelong", "faithful", "endurance", "martyr", "steadfast"],
    prayer:
      "Holy Polycarp, pray to Christ for me. Ask Him to keep me faithful through every season and courageous to the end. Amen.",
  },
  {
    need: "Peace and Church unity",
    saints: "Saint Irenaeus of Lyons",
    search: "Irenaeus Lyons",
    note: "For peace, unity, right teaching, and healing divisions.",
    keywords: ["peace", "unity", "church", "division", "teaching", "healing", "conflict", "truth", "bishop", "community"],
    prayer:
      "Holy Irenaeus, pray to God for us. Ask Christ to heal divisions, guard true teaching, and grant peace to His Church. Amen.",
  },
  {
    need: "Exile, prisoners, and perseverance",
    saints: "Saint Clement of Rome",
    search: "Clement Rome",
    note: "For prisoners, exile, forced labor, perseverance, and hope far from home.",
    keywords: ["prison", "prisoner", "exile", "labor", "perseverance", "hope", "far", "home", "captivity", "work"],
    prayer:
      "Holy Clement, pray to God for prisoners and exiles. Ask Christ to give perseverance, hope, and living water in dry places. Amen.",
  },
  {
    need: "Music and faithful joy",
    saints: "Saint Cecilia of Rome",
    search: "Cecilia Rome",
    note: "For musicians, singers, purity, and keeping song in the heart.",
    keywords: ["music", "song", "singer", "musician", "heart", "purity", "joy", "voice", "chant", "art"],
    prayer:
      "Holy Cecilia, pray to God for me. Ask Christ to make my heart sing with purity, courage, and faithful joy. Amen.",
  },
  {
    need: "Family life and hidden charity",
    saints: "Saint Juliana of Lazarevo",
    search: "Juliana Lazarevo",
    note: "For mothers, household burdens, generosity, and sanctity in ordinary family life.",
    keywords: ["mother", "family", "household", "charity", "ordinary", "home", "generosity", "burden", "children", "work"],
    prayer:
      "Holy Juliana, pray to God for me. Ask Christ to make ordinary work holy and fill my home with patient charity. Amen.",
  },
  {
    need: "Protecting a city and community",
    saints: "Saint Genevieve of Paris",
    search: "Genevieve Paris",
    note: "For cities, civic danger, community protection, and steadfast prayer.",
    keywords: ["city", "community", "danger", "protection", "civic", "prayer", "steadfast", "home", "neighbors", "peace"],
    prayer:
      "Holy Genevieve, pray to God for our community. Ask Christ to protect our city, calm fear, and make us steadfast in prayer. Amen.",
  },
  {
    need: "Hospitality, generosity, and daily work",
    saints: "Saint Brigid of Kildare",
    search: "Brigid Kildare",
    note: "For hospitality, generosity, farm work, creativity, and care for the poor.",
    keywords: ["hospitality", "generosity", "farm", "work", "poor", "creativity", "ireland", "home", "food", "service"],
    prayer:
      "Holy Brigid, pray to God for me. Ask Christ to make my work generous, my table hospitable, and my heart open to the poor. Amen.",
  },
  {
    need: "Solitude, nature, and quiet prayer",
    saints: "Saint Cuthbert of Lindisfarne",
    search: "Cuthbert Lindisfarne",
    note: "For solitude, nature, pastoral care, and quiet prayer away from noise.",
    keywords: ["solitude", "nature", "quiet", "prayer", "noise", "pastoral", "island", "rest", "creation", "peace"],
    prayer:
      "Holy Cuthbert, pray to God for me. Ask Christ to quiet my heart, deepen prayer, and teach me reverence for His creation. Amen.",
  },
  {
    need: "Mission and overcoming fear",
    saints: "Saint Patrick of Ireland",
    search: "Patrick Ireland",
    note: "For mission, forgiveness of enemies, courage after captivity, and teaching the faith.",
    keywords: ["mission", "fear", "captivity", "forgiveness", "enemy", "ireland", "teaching", "courage", "faith", "evangelism"],
    prayer:
      "Holy Patrick, pray to God for me. Ask Christ to free me from fear, teach me forgiveness, and make my life a witness to His light. Amen.",
  },
  {
    need: "Gentle teaching and pastoral patience",
    saints: "Saint Aidan of Lindisfarne",
    search: "Aidan Lindisfarne",
    note: "For teachers, pastors, gentle evangelism, and patient formation.",
    keywords: ["teacher", "pastor", "gentle", "evangelism", "patience", "formation", "mission", "student", "guide", "peace"],
    prayer:
      "Holy Aidan, pray to God for me. Ask Christ to make my words gentle, patient, and full of His peace. Amen.",
  },
  {
    need: "Women leaders and wise learning",
    saints: "Saint Hilda of Whitby",
    search: "Hilda Whitby",
    note: "For women leaders, learning, community discernment, and wise counsel.",
    keywords: ["woman", "women", "leader", "learning", "wisdom", "counsel", "community", "discernment", "abbess", "school"],
    prayer:
      "Holy Hilda, pray to God for me. Ask Christ to grant wisdom, clear counsel, and leadership shaped by humility. Amen.",
  },
  {
    need: "Study, history, and careful research",
    saints: "Saint Bede the Venerable",
    search: "Bede Venerable",
    note: "For students, historians, careful research, teaching, and faithful attention.",
    keywords: ["study", "history", "research", "teacher", "student", "attention", "careful", "writing", "books", "learning"],
    prayer:
      "Venerable Bede, pray to God for me. Ask Christ to bless my study with attention, humility, and love for truth. Amen.",
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
