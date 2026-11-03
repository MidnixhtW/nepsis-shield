// The daily prayer offices: each time of day and rule length as a list of steps.

export type PrayerTime = "morning" | "evening" | "night";

export type PrayerMode = "short" | "standard" | "long" | "seraphim" | "personal";

export type PrayerStep = {
  title: string;
  body: string[];
};

export type ReaderPrefs = {
  focus: boolean;
  largeText: boolean;
  night: boolean;
};

export const commonOpening: PrayerStep[] = [
  {
    title: "Begin",
    body: [
      "Stand or sit quietly. Make the sign of the Cross.",
      "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      "Glory to Thee, our God, glory to Thee.",
    ],
  },
  {
    title: "O Heavenly King",
    body: [
      "O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.",
    ],
  },
  {
    title: "Trisagion prayers",
    body: [
      "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Thy Name's sake.",
      "Lord, have mercy. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
    ],
  },
];

export const closingPrayers: PrayerStep = {
  title: "Close",
  body: [
    "It is truly meet to bless you, O Theotokos, ever-blessed and most pure, and the Mother of our God. More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption you gave birth to God the Word. True Theotokos, we magnify you.",
    "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
    "Lord, have mercy. (3x)",
    "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us. Amen.",
  ],
};

export const creedStep: PrayerStep = {
  title: "The Creed",
  body: [
    "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
    "And in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages: Light of Light, true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made.",
    "Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried.",
    "And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again with glory to judge the living and the dead; Whose kingdom shall have no end.",
    "And in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshiped and glorified; Who spoke by the prophets.",
    "In one, holy, catholic, and apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead, and the life of the age to come. Amen.",
  ],
};

// St. Seraphim of Sarov's short rule for those who cannot keep the full prayers: on rising, at midday, and before sleep.
export const seraphimRule: PrayerStep[] = [
  commonOpening[0],
  {
    title: "St. Seraphim's rule",
    body: [
      "St. Seraphim of Sarov gave this short rule to those whose work or circumstances left no time for the full prayers. Kept faithfully, he said, it can lead to a high measure of Christian life.",
      "Pray it on rising, at midday, and before sleep. Through the day, keep the Jesus Prayer when you can.",
    ],
  },
  {
    title: "The Lord's Prayer (3 times)",
    body: [
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
      "Pray it three times, slowly.",
    ],
  },
  {
    title: "O Theotokos and Virgin (3 times)",
    body: [
      "O Theotokos and Virgin, rejoice, O Mary full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, for thou hast borne the Saviour of our souls.",
      "Pray it three times, slowly.",
    ],
  },
  creedStep,
  {
    title: "Close",
    body: [
      "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
      "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us. Amen.",
    ],
  },
];

export const shortFlows: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    commonOpening[0],
    {
      title: "Morning prayer",
      body: [
        "O Lord, grant me to greet the coming day in peace. Help me in all things to rely upon Thy holy will. In every hour of the day reveal Thy will to me.",
        "Bless my dealings with all who surround me. Teach me to treat all that comes to me throughout the day with peace of soul and with firm conviction that Thy will governs all.",
        "Guide my thoughts, words, and deeds. In unforeseen events, let me not forget that all are sent by Thee. Teach me to act firmly and wisely, without embittering or embarrassing others. Amen.",
      ],
    },
    {
      title: "Jesus Prayer: Lord Jesus Christ, Son of God, have mercy on me, a sinner",
      body: [
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner. (Repeat slowly 3, 12, or 33 times.)",
      ],
    },
    closingPrayers,
  ],
  evening: [
    commonOpening[0],
    {
      title: "Evening thanksgiving",
      body: [
        "Glory to Thee, O Lord, glory to Thee. I thank Thee for every mercy shown to me this day: for life, breath, protection, correction, forgiveness, and every good thing seen and unseen.",
        "Forgive me, O Lord, for every sin I have committed today in thought, word, deed, and neglect. Heal what I have wounded, strengthen what is weak, and grant me repentance without despair. Amen.",
      ],
    },
    {
      title: "For peace",
      body: [
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
        "Grant peace to my home, my family, my parish, and all who suffer. Teach me to forgive, to ask forgiveness, and to rest in Thy mercy. Amen.",
      ],
    },
    closingPrayers,
  ],
  night: [
    commonOpening[0],
    {
      title: "Before sleep",
      body: [
        "Into Thy hands, O Lord Jesus Christ my God, I commend my soul and body. Bless me, have mercy on me, and grant me eternal life. Amen.",
        "O Lord our God, as Thou art good and lovest mankind, forgive me all the sins I have committed this day in word, deed, and thought. Grant me peaceful and undisturbed sleep. Send Thy guardian angel to protect and keep me from every evil. Amen.",
      ],
    },
    {
      title: "Theotokos",
      body: [
        "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
      ],
    },
    closingPrayers,
  ],
};

export const standardExtras: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    commonOpening[1],
    commonOpening[2],
    {
      title: "Prayer to the Holy Trinity",
      body: [
        "Having arisen from sleep, we fall down before Thee, O Blessed One, and sing to Thee, O Mighty One, the angelic hymn: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
        "Glory to the Father, and to the Son, and to the Holy Spirit.",
        "Do Thou, O Lord, Who hast raised me from my bed and from sleep, enlighten my mind and heart, and open my lips that I may praise Thee, O Holy Trinity: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
        "Now and ever and unto ages of ages. Amen.",
        "The Judge will come suddenly and the acts of every man will be revealed; but with fear we cry in the middle of the night: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
      ],
    },
    {
      title: "Guardian angel",
      body: [
        "O Holy Angel, keeping guard over my wretched soul and my passionate life, do not forsake me, a sinner, nor depart from me because of my incontinence. Do not give the evil enemy room to overcome me by force of this mortal body. Strengthen my weak and feeble hand, and set me on the way of salvation. Yea, O Holy Angel of God, guardian and protector of my wretched soul and body, forgive me everything by which I have offended you all the days of my life, and even what I have done this past night; protect me during this day, and guard me from every temptation of the enemy, that I may not anger God by any sin. Pray to the Lord for me, that He may confirm me in His fear and prove me a worthy servant of His goodness. Amen.",
      ],
    },
    {
      title: "App patron: St Michael the Archangel",
      body: [
        "Holy Archangel Michael, defend us in battle, guard this work, and pray to God for us.",
      ],
    },
  ],
  evening: [
    commonOpening[1],
    commonOpening[2],
    {
      title: "Have mercy on us",
      body: [
        "Have mercy on us, O Lord, have mercy on us; for laying aside all excuse, we sinners offer to Thee, as to our Master, this supplication: Have mercy on us.",
        "Glory to the Father, and to the Son, and to the Holy Spirit.",
        "O Lord, have mercy on us, for in Thee have we put our trust. Do not be angry with us, nor remember our iniquities, but look down on us even now, since Thou art compassionate, and deliver us from our enemies. For Thou art our God, and we are Thy people; we are all the work of Thy hands, and we call on Thy name.",
        "Now and ever and unto ages of ages. Amen.",
        "O blessed Theotokos, open the doors of compassion to us whose hope is in you, that we may not perish but be delivered from adversity through you, who are the salvation of the Christian people.",
      ],
    },
    {
      title: "To the Father",
      body: [
        "O Eternal God, King of every creature, Who hast enabled me to attain to this hour, forgive me the sins which I have committed this day by thought, word and deed. Cleanse my humble soul, O Lord, from every defilement of flesh and spirit. Grant me, O Lord, to pass through the sleep of this night in peace, that I may rise from my humble bed and please Thy most Holy Name all the days of my life, vanquishing the enemies both fleshly and bodiless that contend against me. Deliver me from vain thoughts that defile me, O Lord, and from evil desires. For Thine is the Kingdom, and the power, and the glory: of the Father, and of the Son, and of the Holy Spirit, now and ever and unto ages of ages. Amen.",
      ],
    },
  ],
  night: [
    commonOpening[1],
    commonOpening[2],
    {
      title: "Prayer to Christ before sleep",
      body: [
        "O Almighty Word of the Father, Jesus Christ, Who art Thyself perfect: Because of Thy great mercy, do not ever depart from me, Thy servant, but always abide in me. O Jesus, Good Shepherd of Thy sheep, let me not fall into the disobedience of the serpent, nor leave me to the will of Satan, for the seeds of corruption are in me. O Lord God adorable, O Holy King Jesus, guard me while I sleep with the unfading light, Thy Holy Spirit, through Whom Thou didst sanctify Thy disciples. Grant even to me, Thy unworthy servant, O Lord, Thy salvation upon my bed. Enlighten my mind with the light of the understanding of Thy Gospel; my soul with love of Thy Cross; my heart with the purity of Thy word; my body with Thy passionless passion; preserve my thought in Thy humility, and raise me at the time proper for Thy glorification. For Thou art most glorified with Thy Father, Who is without beginning, and Thy Most Holy Spirit, unto the ages. Amen.",
      ],
    },
    {
      title: "Into Thy hands",
      body: [
        "Into Thy hands, O Lord Jesus Christ my God, I commend my spirit. Bless me, have mercy on me, and grant me eternal life. Amen.",
      ],
    },
  ],
};

export const developerPrayerRule: PrayerStep[] = [
  {
    title: "Beginning",
    body: [
      "Stand or sit attentively. Make the sign of the Cross.",
      "In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      "Glory to Thee, our God, glory to Thee.",
      "O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.",
    ],
  },
  {
    title: "The Trisagion Prayers",
    body: [
      "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Thy Name's sake.",
      "Lord, have mercy. (3x)",
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
    ],
  },
  {
    title: "Psalm 50",
    body: [
      "Have mercy on me, O God, according to Thy great mercy; and according to the multitude of Thy compassions blot out my transgression.",
      "Create in me a clean heart, O God, and renew a right spirit within me. Cast me not away from Thy presence, and take not Thy Holy Spirit from me.",
      "Restore unto me the joy of Thy salvation, and with Thy governing Spirit establish me. O Lord, open Thou my lips, and my mouth shall declare Thy praise.",
    ],
  },
  creedStep,
  {
    title: "Prayer before work",
    body: [
      "O Lord Jesus Christ, Son of God, bless the work of my hands today. Make my attention sober, my decisions truthful, my speech gentle, and my craft useful to those who depend on it.",
      "Deliver me from pride, impatience, distraction, vanity, and the love of praise. Let no work of mine harm another soul. Teach me to build with humility, diligence, and mercy. Amen.",
    ],
  },
  {
    title: "Jesus Prayer",
    body: [
      "Pray slowly 33 times, or as much as your rule permits:",
      "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
    ],
  },
  {
    title: "Prayer of St. Ephraim",
    body: [
      "O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk.",
      "But give rather the spirit of chastity, humility, patience, and love to Thy servant.",
      "Yea, O Lord and King, grant me to see my own transgressions, and not to judge my brother, for blessed art Thou, unto ages of ages. Amen.",
      "Make a prostration or deep bow if appropriate.",
    ],
  },
  {
    title: "Holy Archangel Michael",
    body: [
      "Holy Archangel Michael, commander of the bodiless hosts, defend us and pray to God for us.",
      "Guard this work from vanity, anger, confusion, and every temptation that darkens the heart. Ask the Lord to grant courage with humility, strength with mercy, and watchfulness in every duty. Amen.",
    ],
  },
  {
    title: "Intercessions",
    body: [
      "Remember, O Lord, my family, my parish, my clergy, my friends, my enemies, the sick, the suffering, travelers, captives, those in danger, those who have no one to pray for them, and all who have asked for my prayers.",
      "Pray to God for me, O holy patron saint and all saints, for I fervently flee unto you who are swift helpers and intercessors for my soul.",
    ],
  },
  {
    title: "The Theotokos",
    body: [
      "It is truly meet to bless thee, O Theotokos, ever-blessed and most pure, and the Mother of our God.",
      "More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption thou gavest birth to God the Word. True Theotokos, we magnify thee.",
    ],
  },
  {
    title: "Dismissal",
    body: [
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "Lord, have mercy. (3x)",
      "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us and save us. Amen.",
    ],
  },
];

export const longExtras: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    {
      title: "Psalm 50 excerpts",
      body: [
        "Have mercy on me, O God, according to Thy great mercy; and according to the multitude of Thy compassions blot out my transgression.",
        "Wash me thoroughly from mine iniquity, and cleanse me from my sin. For I know mine iniquity, and my sin is ever before me.",
        "Against Thee only have I sinned and done this evil before Thee, that Thou mightest be justified in Thy words and prevail when Thou art judged.",

        "Create in me a clean heart, O God, and renew a right spirit within me. Cast me not away from Thy presence, and take not Thy Holy Spirit from me.",
        "Restore unto me the joy of Thy salvation, and with Thy governing Spirit establish me. O Lord, open Thou my lips, and my mouth shall declare Thy praise.",
      ],
    },
    {
      title: "The Creed",
      body: [
        "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
        "And in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages: Light of Light, true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made.",
        "Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried.",
        "And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again with glory to judge the living and the dead; Whose kingdom shall have no end.",
        "And in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshiped and glorified; Who spoke by the prophets.",
        "In one, holy, catholic, and apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead, and the life of the age to come. Amen.",
      ],
    },
  ],
  evening: [
    {
      title: "Examination of conscience",
      body: [
        "O Lord, reveal to me where I sinned today by thought, word, deed, or neglect. Show me where I was proud, angry, impure, lazy, fearful, unmerciful, or inattentive to prayer.",
        "Do not let shame drive me away from Thee. Give me true repentance, courage to confess what must be confessed, and a humble heart that seeks mercy rather than excuses. Amen.",
      ],
    },
    {
      title: "Intercessions",
      body: [
        "Remember, O Lord, my family, my parish, my clergy, my friends, my enemies, the sick, the suffering, travelers, captives, those in danger, those who have no one to pray for them, and all who have asked for my prayers.",
        "Grant rest, O Lord, to Thy departed servants, and make their memory to be eternal. Amen.",
      ],
    },
  ],
  night: [
    {
      title: "Jesus Prayer: Lord Jesus Christ, Son of God, have mercy on me, a sinner",
      body: [
        "Pray slowly for one to three minutes:",
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
      ],
    },
    {
      title: "Protection by the Cross",
      body: [
        "Let God arise, let His enemies be scattered; let those who hate Him flee from before His face.",
        "Surround me, O Lord, with the power of Thy precious and life-giving Cross. Preserve me from every evil imagination, fear, disturbance, and assault of the enemy. Amen.",
      ],
    },
    {
      title: "Prayer to the Theotokos",
      body: [
        "O most holy Theotokos, save and protect me. Cover me with your holy protection through this night, and deliver me from all evil by your prayers to Christ our God. Amen.",
      ],
    },
  ],
};

export function buildFlow(time: PrayerTime, mode: PrayerMode) {
  if (mode === "personal") return developerPrayerRule;
  if (mode === "seraphim") return seraphimRule;
  if (mode === "short") return shortFlows[time];
  if (mode === "standard") return [shortFlows[time][0], ...standardExtras[time], ...shortFlows[time].slice(1)];
  return [shortFlows[time][0], ...standardExtras[time], ...longExtras[time], ...shortFlows[time].slice(1)];
}

export function recommendedTime(): PrayerTime {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 20) return "evening";
  return "night";
}
