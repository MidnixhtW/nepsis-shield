// A short Western Compline, after the Roman and Benedictine night office prayed in Western Rite monasteries and
// parishes. Psalms in the King James text; hymn tr. J. M. Neale (1852); antiphons and collect in traditional English.
// All public domain.

export type ComplineStep = { title: string; lines: string[] };

export const WESTERN_COMPLINE: ComplineStep[] = [
  {
    title: "Opening",
    lines: [
      "Turn us, O God our Saviour.",
      "And let thine anger cease from us.",
      "O God, make speed to save us.",
      "O Lord, make haste to help us.",
      "Glory be to the Father, and to the Son, and to the Holy Ghost: as it was in the beginning, is now, and ever shall be, world without end. Amen.",
    ],
  },
  {
    title: "Psalm 4",
    lines: [
      "Hear me when I call, O God of my righteousness: thou hast enlarged me when I was in distress; have mercy upon me, and hear my prayer.",
      "Stand in awe, and sin not: commune with your own heart upon your bed, and be still.",
      "There be many that say, Who will shew us any good? Lord, lift thou up the light of thy countenance upon us.",
      "I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety.",
    ],
  },
  {
    title: "Psalm 134",
    lines: [
      "Behold, bless ye the Lord, all ye servants of the Lord, which by night stand in the house of the Lord.",
      "Lift up your hands in the sanctuary, and bless the Lord.",
      "The Lord that made heaven and earth bless thee out of Zion.",
    ],
  },
  {
    title: "Hymn: Before the ending of the day",
    lines: [
      "Before the ending of the day, Creator of the world, we pray that with thy wonted favour thou wouldst be our guard and keeper now.",
      "From all ill dreams defend our eyes, from nightly fears and fantasies; tread under foot our ghostly foe, that no pollution we may know.",
      "O Father, that we ask be done, through Jesus Christ, thine only Son, who, with the Holy Ghost and thee, doth live and reign eternally. Amen.",
    ],
  },
  {
    title: "Short reading and response",
    lines: [
      "Thou, O Lord, art in the midst of us, and we are called by thy name; leave us not, O Lord our God. (Jeremiah 14:9)",
      "Into thy hands, O Lord, I commend my spirit.",
      "For thou hast redeemed me, O Lord, thou God of truth.",
      "Keep me as the apple of an eye.",
      "Hide me under the shadow of thy wings.",
    ],
  },
  {
    title: "Song of Simeon",
    lines: [
      "Save us, O Lord, while waking, and guard us while sleeping; that awake we may watch with Christ, and asleep we may rest in peace.",
      "Lord, now lettest thou thy servant depart in peace, according to thy word:",
      "for mine eyes have seen thy salvation, which thou hast prepared before the face of all people;",
      "a light to lighten the Gentiles, and the glory of thy people Israel.",
      "Save us, O Lord, while waking, and guard us while sleeping; that awake we may watch with Christ, and asleep we may rest in peace.",
    ],
  },
  {
    title: "Collect and blessing",
    lines: [
      "Visit, we beseech thee, O Lord, this dwelling, and drive far from it all snares of the enemy: let thy holy Angels dwell herein to preserve us in peace, and let thy blessing be upon us always; through Jesus Christ our Lord. Amen.",
      "The almighty and merciful Lord, the Father, the Son, and the Holy Ghost, bless us and keep us. Amen.",
      "Then, if you keep it, the Marian antiphon of the season: Hail, holy Queen (found with the Rosary).",
    ],
  },
];
