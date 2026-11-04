// Orthodox fasting seasons and their day-by-day journey content.
// Dates are computed locally so journeys work offline. Pascha uses the Orthodox (Julian) reckoning,
// which both calendars share; fixed-date fasts shift by 13 days for Old Calendar users (1900-2099).
// Kept free of app imports so it can be tested directly.

export type ChurchCalendar = "gregorian" | "julian";

export type SeasonId = "great-lent" | "holy-week" | "paschal" | "apostles-fast" | "dormition-fast" | "nativity-fast";

export type JourneyDay = {
  title: string;
  theme: string;
  practice: string;
  prayer?: { text: string; source: string };
  link?: { label: string; href: string };
};

export type SeasonInstance = {
  id: SeasonId;
  /** Stable key for saving progress, e.g. "nativity-fast-2026-11-15". */
  key: string;
  name: string;
  summary: string;
  fastingNote: string;
  start: Date;
  end: Date;
  length: number;
};

const DAY_MS = 86_400_000;
const OLD_CALENDAR_OFFSET = 13;

export function dateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const next = dateOnly(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function daysBetween(from: Date, to: Date) {
  return Math.round((dateOnly(to).getTime() - dateOnly(from).getTime()) / DAY_MS);
}

export function isoDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Orthodox Pascha as a civil (Gregorian) date, via the Meeus Julian algorithm. */
export function orthodoxPascha(year: number) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  return addDays(new Date(year, month - 1, day), OLD_CALENDAR_OFFSET);
}

/** A fixed church date (e.g. Nov 15) as a civil date under the chosen calendar. */
export function fixedDate(year: number, month: number, day: number, calendar: ChurchCalendar) {
  const date = new Date(year, month - 1, day);
  return calendar === "julian" ? addDays(date, OLD_CALENDAR_OFFSET) : date;
}

/** The church (calendar) date for a civil day, so fixed feasts can be recognised. */
export function churchDate(civil: Date, calendar: ChurchCalendar) {
  return calendar === "julian" ? addDays(civil, -OLD_CALENDAR_OFFSET) : dateOnly(civil);
}

const seasonText: Record<SeasonId, { name: string; summary: string; fastingNote: string }> = {
  "great-lent": {
    name: "Great Lent",
    summary: "Forty days of prayer, fasting, and almsgiving on the road to Pascha.",
    fastingNote: "The strictest fast of the year. Keep it as your priest blesses, mindful of health and duty, and without judging others.",
  },
  "holy-week": {
    name: "Holy Week",
    summary: "From the raising of Lazarus to Christ resting in the tomb.",
    fastingNote: "The fast is at its strictest, especially on Great Friday. Follow your priest's guidance and your health needs.",
  },
  paschal: {
    name: "Pascha to Pentecost",
    summary: "Fifty days of resurrection joy, from Pascha to the descent of the Holy Spirit.",
    fastingNote: "Bright Week has no fasting at all. After Thomas Sunday, Wednesdays and Fridays are kept as usual.",
  },
  "apostles-fast": {
    name: "Apostles' Fast",
    summary: "A gentler fast that leads to the feast of the Holy Apostles Peter and Paul.",
    fastingNote: "A lighter fast; on many days fish is allowed. Ask your priest how your parish keeps it.",
  },
  "dormition-fast": {
    name: "Dormition Fast",
    summary: "Two weeks with the Mother of God before her falling-asleep.",
    fastingNote: "A strict fast, eased with fish on the Transfiguration. Follow your parish calendar and your priest.",
  },
  "nativity-fast": {
    name: "Nativity Fast",
    summary: "Forty days of preparation for the birth of Christ.",
    fastingNote: "A moderate fast; fish is allowed on many days until the final days before Nativity. Follow your parish calendar.",
  },
};

function instance(id: SeasonId, start: Date, end: Date): SeasonInstance {
  return {
    id,
    key: `${id}-${isoDate(start)}`,
    ...seasonText[id],
    start: dateOnly(start),
    end: dateOnly(end),
    length: daysBetween(start, end) + 1,
  };
}

/** All seasons that start in a given civil year (the Old Calendar Nativity Fast may end in the next year). */
export function seasonsForYear(year: number, calendar: ChurchCalendar): SeasonInstance[] {
  const pascha = orthodoxPascha(year);
  const seasons = [
    instance("great-lent", addDays(pascha, -48), addDays(pascha, -9)),
    instance("holy-week", addDays(pascha, -8), addDays(pascha, -1)),
    instance("paschal", pascha, addDays(pascha, 49)),
    instance("apostles-fast", addDays(pascha, 57), fixedDate(year, 6, 28, calendar)),
    instance("dormition-fast", fixedDate(year, 8, 1, calendar), fixedDate(year, 8, 14, calendar)),
    instance("nativity-fast", fixedDate(year, 11, 15, calendar), fixedDate(year, 12, 24, calendar)),
  ];
  // In late-Pascha years the Apostles' Fast can vanish entirely.
  return seasons.filter((season) => season.length > 0);
}

function nearbySeasons(day: Date, calendar: ChurchCalendar) {
  const year = day.getFullYear();
  return [...seasonsForYear(year - 1, calendar), ...seasonsForYear(year, calendar), ...seasonsForYear(year + 1, calendar)];
}

/** The season that includes this day, if any, with the 0-based day index. */
export function currentSeason(day: Date, calendar: ChurchCalendar) {
  const today = dateOnly(day);
  for (const season of nearbySeasons(today, calendar)) {
    const index = daysBetween(season.start, today);
    if (index >= 0 && index < season.length) return { season, index };
  }
  return null;
}

/** The next season to begin after this day, with the number of days until it starts. */
export function nextSeason(day: Date, calendar: ChurchCalendar) {
  const today = dateOnly(day);
  const upcoming = nearbySeasons(today, calendar)
    .filter((season) => season.start > today)
    .sort((a, b) => a.start.getTime() - b.start.getTime())[0];
  return upcoming ? { season: upcoming, daysUntil: daysBetween(today, upcoming.start) } : null;
}

const FASTS: SeasonId[] = ["great-lent", "apostles-fast", "dormition-fast", "nativity-fast"];

/** Fasts that begin within the next `withinDays` days, soonest first (for reminders). */
export function upcomingFasts(day: Date, calendar: ChurchCalendar, withinDays = 365) {
  const today = dateOnly(day);
  return nearbySeasons(today, calendar)
    .filter((season) => FASTS.includes(season.id))
    .filter((season) => season.start > today && daysBetween(today, season.start) <= withinDays)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Short traditional texts, in widely used public-domain English forms.
const EPHRAIM = {
  text: "O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk. But give rather the spirit of chastity, humility, patience, and love to Thy servant. Yea, O Lord and King, grant me to see my own transgressions and not to judge my brother, for blessed art Thou unto ages of ages. Amen.",
  source: "Prayer of St. Ephraim the Syrian",
};
const PASCHAL_TROPARION = {
  text: "Christ is risen from the dead, trampling down death by death, and upon those in the tombs bestowing life.",
  source: "Paschal troparion",
};
const BRIDEGROOM = {
  text: "Behold, the Bridegroom comes at midnight, and blessed is the servant whom He shall find watching; but unworthy is he whom He shall find heedless. Beware, then, O my soul, and be not overcome by sleep.",
  source: "Troparion of the Bridegroom",
};
const THEOTOKOS = { text: "Most Holy Theotokos, save us.", source: "Traditional prayer to the Mother of God" };
const ISAIAH = {
  text: "For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.",
  source: "Isaiah 9:6",
};
const APOSTLES = { text: "Holy Apostles, pray to God for us.", source: "Traditional prayer to the Apostles" };
const JESUS_PRAYER = { text: "Lord Jesus Christ, Son of God, have mercy on me, a sinner.", source: "The Jesus Prayer" };
const DEPARTED = {
  text: "With the saints give rest, O Christ, to the souls of Thy servants, where there is neither sickness nor sorrow nor sighing, but life everlasting.",
  source: "Kontakion for the departed",
};

function soulSaturday(): JourneyDay {
  return {
    title: "Saturday of Souls",
    theme: "On the second, third, and fourth Saturdays of Lent, the Church prays especially for the departed.",
    practice: "Pray by name for your departed loved ones, and bring their names to church if your parish serves a memorial.",
    prayer: DEPARTED,
    link: PANIKHIDA,
  };
}

const OCA_LIVES = { label: "Today's saints (OCA)", href: "https://www.oca.org/saints/lives" };
const AKATHIST = { label: "Pray the Akathist", href: "/pray?tab=services&service=akathist" };
const PANIKHIDA = { label: "Pray the Panikhida", href: "/pray?tab=services&service=panikhida" };

function annunciation(): JourneyDay {
  return {
    title: "The Annunciation",
    theme: "The archangel Gabriel brings good news to the Virgin Mary, and the Word becomes flesh. A feast of joy shines in the middle of the fast.",
    practice: "Pray slowly the angel's greeting and Mary's answer: “Be it unto me according to thy word.” Fish is traditionally allowed today.",
    prayer: THEOTOKOS,
  };
}

function greatLentDay(index: number, civil: Date, calendar: ChurchCalendar): JourneyDay {
  const church = churchDate(civil, calendar);
  if (church.getMonth() === 2 && church.getDate() === 25) return annunciation();

  const weekday = civil.getDay();
  const week = Math.floor(index / 7) + 1;
  const special: Record<number, JourneyDay> = {
    0: {
      title: "Clean Monday",
      theme: "The fast begins. Yesterday we asked forgiveness of one another; today we start again with a clean heart. Tonight the Great Canon of St. Andrew begins.",
      practice: "Keep the fast simply today and pray the Prayer of St. Ephraim with prostrations, if you are able.",
    },
    5: {
      title: "Saturday of St. Theodore",
      theme: "The Church remembers St. Theodore the Recruit, who protected Christians from food defiled by idol sacrifices at the start of the fast. Kolyva is blessed.",
      practice: "Give thanks for the first week of the fast, however it went, and pray for those who are struggling.",
      prayer: JESUS_PRAYER,
    },
    12: soulSaturday(),
    19: soulSaturday(),
    26: soulSaturday(),
    6: {
      title: "Sunday of Orthodoxy",
      theme: "The Church celebrates the restoration of the holy icons: God truly became man and can be depicted.",
      practice: "Spend a quiet minute before an icon of Christ. Thank Him for becoming one of us.",
    },
    13: {
      title: "Sunday of St. Gregory Palamas",
      theme: "St. Gregory taught that we can truly know God, not only about Him, through prayer and grace.",
      practice: "Pray the Jesus Prayer slowly for five minutes, with attention rather than effort.",
      prayer: JESUS_PRAYER,
    },
    20: {
      title: "Sunday of the Holy Cross",
      theme: "Halfway through the fast, the Cross is brought out for veneration to strengthen tired travellers.",
      practice: "Make the sign of the Cross slowly and with attention each time you pray today.",
    },
    27: {
      title: "Sunday of St. John Climacus",
      theme: "St. John's “Ladder of Divine Ascent” describes the spiritual life as a climb, one rung at a time.",
      practice: "Choose one small step for this week, one rung, and keep it faithfully.",
    },
    31: {
      title: "Thursday of the Great Canon",
      theme: "The whole Great Canon of St. Andrew of Crete is read: a long, honest lament that ends in hope.",
      practice: "If you can, attend the service tonight. If not, read a portion of the Canon slowly at home.",
    },
    33: {
      title: "Saturday of the Akathist",
      theme: "The Church sings the Akathist to the Mother of God, giving thanks for her protection.",
      practice: "Pray a few stanzas of the Akathist, or simply ask the Theotokos for her prayers.",
      prayer: THEOTOKOS,
      link: AKATHIST,
    },
    34: {
      title: "Sunday of St. Mary of Egypt",
      theme: "St. Mary turned from a life of sin to decades of repentance in the desert. No one is beyond God's mercy.",
      practice: "Name to God one thing you want to turn away from, and trust His mercy more than your own strength.",
    },
    39: {
      title: "The forty days are completed",
      theme: "The forty days end today. Tomorrow, Lazarus Saturday, begins the journey into Holy Week.",
      practice: "Give thanks for whatever you kept, and ask forgiveness for what you did not. Prepare to follow Christ to Jerusalem.",
    },
  };
  // The Prayer of St. Ephraim is said on Lenten weekdays, not on Saturdays and Sundays.
  const weekdayPrayer = weekday >= 1 && weekday <= 5 ? EPHRAIM : JESUS_PRAYER;
  if (special[index]) return { ...special[index], prayer: special[index].prayer ?? weekdayPrayer };

  if (week === 1 && index <= 3) {
    return {
      title: `Clean Week: ${["Monday", "Tuesday", "Wednesday", "Thursday"][index]}`,
      theme: "In the first four evenings of Lent, the Great Canon of St. Andrew of Crete is read in four parts at Great Compline.",
      practice: "Attend Great Compline tonight if you can, or read tonight's portion of the Canon at home.",
      prayer: EPHRAIM,
    };
  }
  if (weekday === 3 || weekday === 5) {
    return {
      title: `Week ${week}: Presanctified Liturgy`,
      theme: "On Lenten Wednesdays and Fridays, many parishes serve the Liturgy of the Presanctified Gifts in the evening.",
      practice: "If your parish serves it, attend. Otherwise, keep a quiet half hour of prayer this evening.",
      prayer: EPHRAIM,
    };
  }
  const weekThemes = [
    "Begin with what you can keep. The fast is for healing, not for proving yourself.",
    "Watch your thoughts as well as your food. Notice what pulls you away from prayer.",
    "Give something away this week: time, money, or attention to someone who needs it.",
    "When you grow tired, shorten the prayer rather than abandoning it.",
    "Prepare your confession. Look honestly at your life, and trust God's mercy.",
    "The end is in sight. Keep watch, and get ready to walk with Christ into Holy Week.",
  ];
  return {
    title: `Great Lent, week ${week}`,
    theme: weekThemes[Math.min(week - 1, weekThemes.length - 1)],
    practice: "Pray the Prayer of St. Ephraim morning and evening, and keep today's fast as you are able.",
    prayer: EPHRAIM,
  };
}

function holyWeekDay(index: number, civil: Date, calendar: ChurchCalendar): JourneyDay {
  const church = churchDate(civil, calendar);
  if (church.getMonth() === 2 && church.getDate() === 25) return annunciation();
  const days: JourneyDay[] = [
    {
      title: "Lazarus Saturday",
      theme: "Christ raises His friend Lazarus from the dead, a sign of the resurrection to come.",
      practice: "Pray for someone you have lost, and for anyone who feels beyond hope.",
      prayer: PASCHAL_TROPARION,
    },
    {
      title: "Palm Sunday",
      theme: "Christ enters Jerusalem in humility, greeted with palms and “Hosanna,” knowing what awaits Him.",
      practice: "Take home your blessed palm or willow and place it by your icons. Fish is traditionally allowed today.",
    },
    {
      title: "Great and Holy Monday",
      theme: "We remember Joseph the all-comely and the barren fig tree. Bridegroom Matins calls us to stay awake.",
      practice: "Pray the Troparion of the Bridegroom tonight, and attend the evening service if you can.",
      prayer: BRIDEGROOM,
    },
    {
      title: "Great and Holy Tuesday",
      theme: "The parable of the ten virgins: keep your lamp burning, ready for the Bridegroom.",
      practice: "Ask yourself what keeps your lamp from burning, and bring it to God tonight.",
      prayer: BRIDEGROOM,
    },
    {
      title: "Great and Holy Wednesday",
      theme: "A sinful woman anoints Christ with costly myrrh, while Judas agrees to betray Him. Many parishes serve Holy Unction.",
      practice: "Come to Holy Unction if your parish offers it, and pray for those who are sick.",
      prayer: BRIDEGROOM,
    },
    {
      title: "Great and Holy Thursday",
      theme: "The Mystical Supper: Christ washes His disciples' feet and gives His Body and Blood. In the evening, the Twelve Passion Gospels are read.",
      practice: "Receive Communion if you are prepared and blessed to, and stay for as much of the evening service as you can.",
    },
    {
      title: "Great and Holy Friday",
      theme: "Christ is crucified and laid in the tomb. The Church keeps the strictest fast and gathers for the Lamentations.",
      practice: "Keep silence where you can today, and attend the Royal Hours, Vespers, or Lamentations.",
      prayer: { text: "Remember me, O Lord, when Thou comest into Thy kingdom.", source: "The prayer of the thief on the cross (Luke 23:42)" },
    },
    {
      title: "Great and Holy Saturday",
      theme: "Christ rests in the tomb in the flesh and descends to Hades to free those held there. The Church waits in quiet expectation.",
      practice: "Prepare your home and your heart for Pascha. Come to the midnight service tonight if you can.",
    },
  ];
  return days[Math.min(index, days.length - 1)];
}

function paschalDay(index: number): JourneyDay {
  const special: Record<number, JourneyDay> = {
    0: {
      title: "Pascha: the Resurrection of Christ",
      theme: "Christ is risen! The feast of feasts. Death has lost its power.",
      practice: "Greet everyone today with “Christ is risen!” and answer “Indeed He is risen!”",
    },
    7: {
      title: "Thomas Sunday",
      theme: "Christ shows His wounds to Thomas, who answers, “My Lord and my God.” Doubt meets the risen Lord.",
      practice: "Bring your own doubts honestly to Christ in prayer today.",
    },
    14: {
      title: "Sunday of the Myrrh-bearing Women",
      theme: "The women came to the tomb early with spices and became the first witnesses of the resurrection.",
      practice: "Do one quiet act of faithful service for someone today, as they did.",
    },
    21: {
      title: "Sunday of the Paralytic",
      theme: "Christ heals a man who had waited thirty-eight years. He asks, “Wilt thou be made whole?”",
      practice: "Pray for someone who has been waiting a long time for healing.",
    },
    24: {
      title: "Mid-Pentecost",
      theme: "Halfway to Pentecost, Christ invites the thirsty to come to Him and drink living water.",
      practice: "Pray for a renewed thirst for God.",
    },
    28: {
      title: "Sunday of the Samaritan Woman",
      theme: "At the well, Christ offers living water to a woman others overlooked, and she runs to tell her town.",
      practice: "Share something of your faith gently with one person this week.",
    },
    35: {
      title: "Sunday of the Blind Man",
      theme: "Christ gives sight to a man born blind: “One thing I know, that, whereas I was blind, now I see.”",
      practice: "Ask Christ to open your eyes to one thing you have been blind to.",
    },
    38: {
      title: "Leave-taking of Pascha",
      theme: "The last day the Paschal services are sung in full. Tomorrow the Church celebrates the Ascension.",
      practice: "Sing or say the Paschal troparion one last time with joy.",
    },
    39: {
      title: "The Ascension",
      theme: "Christ ascends into heaven, taking our human nature with Him, and promises the Holy Spirit.",
      practice: "Pray that your heart may be lifted up to where Christ is.",
      prayer: {
        text: "Ye men of Galilee, why stand ye gazing up into heaven? this same Jesus, which is taken up from you into heaven, shall so come in like manner as ye have seen him go into heaven.",
        source: "Acts 1:11",
      },
    },
    42: {
      title: "Sunday of the Fathers of the First Council",
      theme: "The Church remembers the fathers of Nicaea, who confessed Christ as true God, of one essence with the Father.",
      practice: "Pray the Nicene Creed slowly, with attention to each line.",
      prayer: JESUS_PRAYER,
    },
    48: {
      title: "Saturday of Souls",
      theme: "Before Pentecost, the Church prays for all the departed.",
      practice: "Pray by name for your departed loved ones: “Memory eternal.”",
      prayer: DEPARTED,
      link: PANIKHIDA,
    },
    49: {
      title: "Pentecost",
      theme: "The Holy Spirit descends on the apostles. The Church is born, and the kneeling prayers return at Vespers.",
      practice: "Pray “O Heavenly King” again today, for the first time since Pascha.",
      prayer: {
        text: "O Heavenly King, the Comforter, the Spirit of Truth, who art everywhere present and fillest all things, Treasury of blessings and Giver of life: come and abide in us, cleanse us from every impurity, and save our souls, O Good One.",
        source: "Prayer to the Holy Spirit",
      },
    },
  };
  if (special[index]) return { ...special[index], prayer: special[index].prayer ?? PASCHAL_TROPARION };
  if (index <= 6) {
    return {
      title: `Bright Week, day ${index + 1}`,
      theme: "The whole week is one bright day of Pascha. The royal doors stay open, and there is no fasting.",
      practice: "In place of your usual morning and evening prayers, pray the Paschal Hours, or the Paschal troparion three times.",
      prayer: PASCHAL_TROPARION,
    };
  }
  // The Paschal troparion is sung through the Leave-taking of Pascha (day 38); "O Heavenly King" returns at Pentecost.
  if (index < 38) {
    return {
      title: "Paschal season",
      theme: "Until the Leave-taking of Pascha, the Paschal troparion takes the place of “O Heavenly King” at the start of prayer.",
      practice: "Begin your prayers with the Paschal troparion, three times.",
      prayer: PASCHAL_TROPARION,
    };
  }
  return {
    title: "Between Ascension and Pentecost",
    theme: "The apostles waited and prayed together for the promised Spirit. “O Heavenly King” is not yet said; begin prayer with the Trisagion.",
    practice: "Pray each day for the gift of the Holy Spirit.",
    prayer: JESUS_PRAYER,
  };
}

function apostlesDay(index: number, length: number): JourneyDay {
  if (index === length - 1) {
    return {
      title: "Eve of Sts. Peter and Paul",
      theme: "Tomorrow the Church celebrates the chief apostles: Peter, who denied and was restored, and Paul, the persecutor who became a preacher.",
      practice: "Read the account of Peter's restoration in John 21:15-17.",
      prayer: APOSTLES,
    };
  }
  return {
    title: `Apostles' Fast, day ${index + 1}`,
    theme: "The apostles fasted and prayed before going out to preach. This fast follows their example after Pentecost.",
    practice: "Read one chapter of the Acts of the Apostles today.",
    prayer: APOSTLES,
  };
}

function dormitionDay(index: number): JourneyDay {
  const special: Record<number, JourneyDay> = {
    0: {
      title: "Procession of the Precious Cross",
      theme: "The fast begins with the Cross and with prayer for healing, as in the old procession in Constantinople.",
      practice: "Begin the fast with the sign of the Cross and a prayer for those who are sick.",
    },
    5: {
      title: "The Transfiguration",
      theme: "On Mount Tabor, Christ shows His glory to Peter, James, and John. Fruit is blessed, and fish is allowed today.",
      practice: "Bring fruit to church to be blessed, and pray to see Christ's light in your own life.",
    },
    13: {
      title: "Eve of the Dormition",
      theme: "Tomorrow the Church celebrates the falling-asleep of the Mother of God, who did not abandon the world.",
      practice: "Ask the Theotokos for her prayers for your family, and prepare for the feast.",
    },
  };
  if (special[index]) return { ...special[index], prayer: special[index].prayer ?? THEOTOKOS };
  return {
    title: `Dormition Fast, day ${index + 1}`,
    theme: "Through these two weeks, many parishes pray the Paraklesis, the Small or Great Supplicatory Canon to the Theotokos, on most evenings.",
    practice: "Pray the Paraklesis tonight, or a few of its verses, or simply ask the Mother of God to pray for you.",
    prayer: THEOTOKOS,
  };
}

function nativityDay(index: number, civil: Date, calendar: ChurchCalendar): JourneyDay {
  const church = churchDate(civil, calendar);
  const month = church.getMonth() + 1;
  const day = church.getDate();
  const isSunday = civil.getDay() === 0;

  if (month === 11 && day === 15) {
    return {
      title: "The Nativity Fast begins",
      theme: "Forty days to prepare for the birth of Christ. Also called St. Philip's Fast, it begins after his feast.",
      practice: "Choose one simple, steady practice for these forty days: a prayer, a reading, or a gift.",
      prayer: ISAIAH,
    };
  }
  if (month === 11 && day === 21) {
    return {
      title: "Entrance of the Theotokos into the Temple",
      theme: "As a child, Mary is brought into the Temple to be raised for God. From today, the Church begins to sing “Christ is born, glorify Him!”",
      practice: "Make a small room in your day, and in your home, for God to dwell.",
      prayer: THEOTOKOS,
    };
  }
  if (month === 11 && day === 30) {
    return {
      title: "St. Andrew the First-called",
      theme: "Andrew heard John the Baptist, followed Christ, and brought his brother Peter: “We have found the Messias.”",
      practice: "Invite someone to come and see: share an act of kindness or a word of faith.",
      prayer: ISAIAH,
    };
  }
  if (month === 12 && day === 6) {
    return {
      title: "St. Nicholas of Myra",
      theme: "St. Nicholas, the wonderworker, is remembered for generous, hidden gifts to those in need.",
      practice: "Give a gift in secret today, as St. Nicholas did.",
      prayer: ISAIAH,
    };
  }
  if (month === 12 && day === 9) {
    return {
      title: "Conception of the Theotokos by St. Anna",
      theme: "After long years of barrenness, Joachim and Anna conceive the child who will become the Mother of God.",
      practice: "Pray for couples who long for children, and for all who wait in hope.",
      prayer: THEOTOKOS,
    };
  }
  if (isSunday && month === 12 && day >= 11 && day <= 17) {
    return {
      title: "Sunday of the Forefathers",
      theme: "The Church remembers the righteous of the Old Testament who longed for the coming of Christ.",
      practice: "Read one of the promises to Abraham (Genesis 12:1-3 or 22:15-18).",
      prayer: ISAIAH,
    };
  }
  if (isSunday && month === 12 && day >= 18 && day <= 24) {
    return {
      title: "Sunday before Nativity",
      theme: "The Gospel reads the genealogy of Christ: God enters a real family, with all its saints and sinners.",
      practice: "Pray for your own family, living and departed, by name.",
      prayer: ISAIAH,
    };
  }
  if (month === 12 && day === 24) {
    return {
      title: "Nativity Eve",
      theme: "The Royal Hours are read, and the Vesperal Liturgy prepares us for the feast. Traditionally, the fast is kept strictly until the evening.",
      practice: "Keep the day quietly. Attend the services if you can, and prepare to greet the feast with joy.",
      prayer: ISAIAH,
    };
  }
  if (month === 12 && day >= 20) {
    return {
      title: "Forefeast of the Nativity",
      theme: "The hymns now look straight toward Bethlehem: “Prepare, O Bethlehem, for Eden has been opened to all.”",
      practice: "Read Luke 2:1-7 slowly, and imagine the journey to Bethlehem.",
      prayer: ISAIAH,
    };
  }
  const weekThemes = [
    "Set a steady rhythm. A small rule kept every day is the best preparation.",
    "Watch: guard your mind from the noise of the season so there is room for Christ.",
    "Give: the fast frees up time and money for those in need.",
    "Make peace with someone before the feast, if you can.",
    "Prepare your confession, so you can receive Christ at the feast.",
    "Keep the light of the coming feast before you.",
  ];
  const week = Math.floor(index / 7);
  return {
    title: `Nativity Fast, day ${index + 1}`,
    theme: weekThemes[Math.min(week, weekThemes.length - 1)],
    practice: "Pray the Jesus Prayer for a few minutes, and read today's Gospel or a few verses of the prophets.",
    prayer: index % 2 === 0 ? ISAIAH : JESUS_PRAYER,
    link: OCA_LIVES,
  };
}

/** The journey entry for one day of a season. */
export function journeyDay(season: SeasonInstance, index: number, calendar: ChurchCalendar): JourneyDay {
  const civil = addDays(season.start, index);
  switch (season.id) {
    case "great-lent":
      return greatLentDay(index, civil, calendar);
    case "holy-week":
      return holyWeekDay(index, civil, calendar);
    case "paschal":
      return paschalDay(index);
    case "apostles-fast":
      return apostlesDay(index, season.length);
    case "dormition-fast":
      return dormitionDay(index);
    case "nativity-fast":
      return nativityDay(index, civil, calendar);
  }
}
