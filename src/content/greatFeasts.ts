// Pascha and the Twelve Great Feasts, for the public feast pages (/feasts/...). Each is dated either by the Church
// calendar (month and day, shifted for the Old Calendar by fixedDate) or by its distance from Pascha.
// The descriptions are short and plain; the full services and hymns are linked from each page.

export type GreatFeast = {
  slug: string;
  name: string;
  /** Church-calendar date, for fixed feasts. */
  fixed?: { month: number; day: number };
  /** Days after Pascha, for moveable feasts (negative before it). */
  fromPascha?: number;
  greeting?: { greeting: string; response: string };
  about: string[];
};

export const GREAT_FEASTS: GreatFeast[] = [
  {
    slug: "pascha",
    name: "Pascha, the Resurrection of Christ",
    fromPascha: 0,
    greeting: { greeting: "Christ is risen!", response: "Indeed He is risen!" },
    about: [
      "Pascha is the Feast of feasts: Christ, crucified and buried, rises from the dead on the third day, trampling down death by death.",
      "The Church keeps it with the midnight Paschal service and forty days of rejoicing, greeting one another \"Christ is risen!\" until the Leave-taking, the day before the Ascension.",
    ],
  },
  {
    slug: "palm-sunday",
    name: "The Entry of the Lord into Jerusalem",
    fromPascha: -7,
    about: [
      "On the Sunday before Pascha, Christ rides into Jerusalem on a colt, and the crowds lay palm branches before Him, crying \"Hosanna to the Son of David.\"",
      "It follows Lazarus Saturday and opens Holy Week. Palms or willow branches are blessed and held at the services, and fish is allowed at table that day.",
    ],
  },
  {
    slug: "ascension",
    name: "The Ascension of the Lord",
    fromPascha: 39,
    greeting: { greeting: "Christ is ascended!", response: "From earth to heaven!" },
    about: [
      "Forty days after His Resurrection, Christ blesses His disciples and is taken up into heaven from the Mount of Olives, promising to send the Holy Spirit.",
      "It falls on a Thursday, forty days from Pascha counting Pascha itself.",
    ],
  },
  {
    slug: "pentecost",
    name: "Pentecost, the Descent of the Holy Spirit",
    fromPascha: 49,
    about: [
      "On the fiftieth day after Pascha the Holy Spirit descends on the apostles as tongues of fire, and the Church goes out to every nation.",
      "Also called Trinity Sunday. At Vespers that evening the faithful kneel for the first time since Pascha.",
    ],
  },
  {
    slug: "nativity-of-the-theotokos",
    name: "The Nativity of the Theotokos",
    fixed: { month: 9, day: 8 },
    about: [
      "The birth of the Virgin Mary to the righteous Joachim and Anna, long childless, as the answer to their prayer.",
      "It is the first great feast of the Church year, which begins on September 1.",
    ],
  },
  {
    slug: "exaltation-of-the-cross",
    name: "The Exaltation of the Holy Cross",
    fixed: { month: 9, day: 14 },
    about: [
      "The Church remembers the finding of the Cross in Jerusalem by St Helen and its raising before the people, and venerates the Cross of Christ as the sign of victory over death.",
      "It is kept as a strict fast day, whatever day of the week it falls on.",
    ],
  },
  {
    slug: "entry-of-the-theotokos",
    name: "The Entry of the Theotokos into the Temple",
    fixed: { month: 11, day: 21 },
    about: [
      "The young Virgin Mary is brought by her parents to the Temple in Jerusalem, to be raised there for God.",
      "From this day the Church begins to sing the hymns of the Nativity: \"Christ is born, glorify Him!\" Fish is allowed at table during the Nativity Fast.",
    ],
  },
  {
    slug: "nativity-of-christ",
    name: "The Nativity of Christ",
    fixed: { month: 12, day: 25 },
    greeting: { greeting: "Christ is born!", response: "Glorify Him!" },
    about: [
      "The birth of our Lord Jesus Christ in Bethlehem, God become man for our salvation.",
      "It ends the forty-day Nativity Fast and opens the twelve days to Theophany, when there is no fasting.",
    ],
  },
  {
    slug: "theophany",
    name: "Theophany, the Baptism of the Lord",
    fixed: { month: 1, day: 6 },
    greeting: { greeting: "Christ is baptized!", response: "In the river Jordan!" },
    about: [
      "Christ is baptized by John in the Jordan; the Father's voice is heard and the Spirit descends as a dove, so the Holy Trinity is revealed.",
      "Water is blessed at the Great Blessing of Waters, and in the weeks after, priests bless the homes of the faithful.",
    ],
  },
  {
    slug: "meeting-of-the-lord",
    name: "The Meeting of the Lord in the Temple",
    fixed: { month: 2, day: 2 },
    about: [
      "Forty days after His birth, Christ is brought to the Temple, and the elder Simeon takes Him in his arms and says, \"Lord, now lettest Thou Thy servant depart in peace.\"",
      "Candles are often blessed on this day.",
    ],
  },
  {
    slug: "annunciation",
    name: "The Annunciation",
    fixed: { month: 3, day: 25 },
    about: [
      "The Archangel Gabriel brings the Virgin Mary the news that she will bear the Son of God, and she answers, \"Be it unto me according to thy word.\"",
      "It usually falls in Great Lent; fish is allowed at table that day.",
    ],
  },
  {
    slug: "transfiguration",
    name: "The Transfiguration",
    fixed: { month: 8, day: 6 },
    about: [
      "On Mount Tabor, Christ shines with divine light before Peter, James and John, with Moses and Elijah speaking with Him.",
      "It falls in the Dormition Fast. Grapes and other fruit are blessed after the Liturgy, and fish is allowed at table.",
    ],
  },
  {
    slug: "dormition",
    name: "The Dormition of the Theotokos",
    fixed: { month: 8, day: 15 },
    about: [
      "The falling asleep of the Virgin Mary, surrounded by the apostles, and her being taken up to her Son.",
      "It ends the two-week Dormition Fast.",
    ],
  },
];
