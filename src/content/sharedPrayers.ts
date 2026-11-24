// Prayers from the undivided Church that Catholics and Orthodox both pray, and Western prayers kept by Western Rite
// Orthodox parishes and by Catholics. Texts are public domain (ancient texts, King James and Prayer Book English).

export type SharedPrayer = { id: string; title: string; origin: string; lines: string[] };

export const SHARED_PRAYERS: SharedPrayer[] = [
  {
    id: "sub-tuum",
    title: "Beneath your compassion",
    origin: "The oldest known prayer to the Theotokos, from about the 3rd century.",
    lines: [
      "Beneath your compassion we take refuge, O Theotokos. Do not despise our petitions in time of trouble, but deliver us from dangers, only pure, only blessed one.",
    ],
  },
  {
    id: "st-ephrem",
    title: "Prayer of St. Ephrem the Syrian",
    origin: "4th century. Prayed in Great Lent by Orthodox and Eastern Catholics.",
    lines: [
      "O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk.",
      "But give rather the spirit of chastity, humility, patience, and love to Thy servant.",
      "Yea, O Lord and King, grant me to see my own transgressions, and not to judge my brother, for blessed art Thou unto ages of ages. Amen.",
    ],
  },
  {
    id: "gladsome-light",
    title: "O Gladsome Light",
    origin: "An evening hymn from about the 3rd century, sung at Vespers East and West.",
    lines: [
      "O gladsome Light of the holy glory of the immortal Father, heavenly, holy, blessed Jesus Christ!",
      "Now that we have come to the setting of the sun and behold the light of evening, we praise God: Father, Son, and Holy Spirit.",
      "For meet it is at all times to worship Thee with voices of praise, O Son of God and Giver of life; therefore all the world glorifies Thee.",
    ],
  },
  {
    id: "nunc-dimittis",
    title: "Song of Simeon",
    origin: "Luke 2:29-32. Sung at Vespers in the East and at Compline in the West.",
    lines: [
      "Lord, now lettest Thou Thy servant depart in peace, according to Thy word:",
      "for mine eyes have seen Thy salvation, which Thou hast prepared before the face of all people;",
      "a light to lighten the Gentiles, and the glory of Thy people Israel.",
    ],
  },
];

export const WESTERN_PRAYERS: SharedPrayer[] = [
  {
    id: "collect-for-purity",
    title: "Collect for Purity",
    origin: "From the Western Mass before the Schism; said at the start of the Liturgy of St. Tikhon in Western Rite parishes.",
    lines: [
      "Almighty God, unto whom all hearts be open, all desires known, and from whom no secrets are hid: cleanse the thoughts of our hearts by the inspiration of thy Holy Spirit, that we may perfectly love thee, and worthily magnify thy holy Name; through Christ our Lord. Amen.",
    ],
  },
  {
    id: "christ-with-me",
    title: "Christ be with me",
    origin: "From the Breastplate of St. Patrick (5th century), tr. Cecil Frances Alexander, 1889.",
    lines: [
      "Christ be with me, Christ within me, Christ behind me, Christ before me,",
      "Christ beside me, Christ to win me, Christ to comfort and restore me.",
      "Christ beneath me, Christ above me, Christ in quiet, Christ in danger,",
      "Christ in hearts of all that love me, Christ in mouth of friend and stranger.",
    ],
  },
];
