// Short Western morning and evening prayer for Western Rite Orthodox users, after the office kept in Western Rite
// parishes. Psalms and canticles in the King James text; versicles and collects from the 1662 Book of Common Prayer.
// All public domain.

import type { ComplineStep } from "@/content/westernCompline";

const GLORIA = "Glory be to the Father, and to the Son, and to the Holy Ghost: as it was in the beginning, is now, and ever shall be, world without end. Amen.";

const OUR_FATHER =
  "Our Father, which art in heaven, hallowed be thy Name. Thy kingdom come. Thy will be done, in earth as it is in heaven. Give us this day our daily bread. And forgive us our trespasses, as we forgive them that trespass against us. And lead us not into temptation; but deliver us from evil. Amen.";

export const WESTERN_MORNING: ComplineStep[] = [
  {
    title: "Opening",
    lines: [
      "O Lord, open thou our lips.",
      "And our mouth shall shew forth thy praise.",
      "O God, make speed to save us.",
      "O Lord, make haste to help us.",
      GLORIA,
      "Alleluia. (In Lent: Praise be to thee, O Lord, King of eternal glory.)",
    ],
  },
  {
    title: "Psalm 95",
    lines: [
      "O come, let us sing unto the Lord: let us make a joyful noise to the rock of our salvation.",
      "Let us come before his presence with thanksgiving, and make a joyful noise unto him with psalms.",
      "For the Lord is a great God, and a great King above all gods.",
      "O come, let us worship and bow down: let us kneel before the Lord our maker.",
      "For he is our God; and we are the people of his pasture, and the sheep of his hand.",
      GLORIA,
    ],
  },
  {
    title: "Psalm 63",
    lines: [
      "O God, thou art my God; early will I seek thee: my soul thirsteth for thee.",
      "Because thy lovingkindness is better than life, my lips shall praise thee.",
      "Thus will I bless thee while I live: I will lift up my hands in thy name.",
      "Because thou hast been my help, therefore in the shadow of thy wings will I rejoice.",
    ],
  },
  {
    title: "Song of Zechariah",
    lines: [
      "Blessed be the Lord God of Israel; for he hath visited and redeemed his people,",
      "and hath raised up an horn of salvation for us in the house of his servant David.",
      "And thou, child, shalt be called the prophet of the Highest: for thou shalt go before the face of the Lord to prepare his ways;",
      "to give light to them that sit in darkness and in the shadow of death, to guide our feet into the way of peace.",
      GLORIA,
    ],
  },
  {
    title: "The Lord's Prayer",
    lines: ["Lord, have mercy. Christ, have mercy. Lord, have mercy.", OUR_FATHER],
  },
  {
    title: "Collect for grace",
    lines: [
      "O Lord, our heavenly Father, Almighty and everlasting God, who hast safely brought us to the beginning of this day; Defend us in the same with thy mighty power; and grant that this day we fall into no sin, neither run into any kind of danger; but that all our doings may be ordered by thy governance, to do always that is righteous in thy sight; through Jesus Christ our Lord. Amen.",
    ],
  },
  {
    title: "Ending",
    lines: [
      "Let us bless the Lord.",
      "Thanks be to God.",
      "May the souls of the faithful, through the mercy of God, rest in peace. Amen.",
    ],
  },
];

export const WESTERN_EVENING: ComplineStep[] = [
  {
    title: "Opening",
    lines: [
      "O God, make speed to save us.",
      "O Lord, make haste to help us.",
      GLORIA,
      "Alleluia. (In Lent: Praise be to thee, O Lord, King of eternal glory.)",
    ],
  },
  {
    title: "Psalm 141",
    lines: [
      "Lord, I cry unto thee: make haste unto me; give ear unto my voice, when I cry unto thee.",
      "Let my prayer be set forth before thee as incense; and the lifting up of my hands as the evening sacrifice.",
      "Set a watch, O Lord, before my mouth; keep the door of my lips.",
      "Incline not my heart to any evil thing.",
      GLORIA,
    ],
  },
  {
    title: "Song of Mary",
    lines: [
      "My soul doth magnify the Lord, and my spirit hath rejoiced in God my Saviour.",
      "For he hath regarded the low estate of his handmaiden: for, behold, from henceforth all generations shall call me blessed.",
      "For he that is mighty hath done to me great things; and holy is his name.",
      "And his mercy is on them that fear him from generation to generation.",
      "He hath shewed strength with his arm; he hath scattered the proud in the imagination of their hearts.",
      "He hath put down the mighty from their seats, and exalted them of low degree.",
      "He hath filled the hungry with good things; and the rich he hath sent empty away.",
      "He hath holpen his servant Israel, in remembrance of his mercy; as he spake to our fathers, to Abraham, and to his seed for ever.",
      GLORIA,
    ],
  },
  {
    title: "The Lord's Prayer",
    lines: ["Lord, have mercy. Christ, have mercy. Lord, have mercy.", OUR_FATHER],
  },
  {
    title: "Collect for peace",
    lines: [
      "O God, from whom all holy desires, all good counsels, and all just works do proceed; Give unto thy servants that peace which the world cannot give; that both our hearts may be set to obey thy commandments, and also that by thee we being defended from the fear of our enemies may pass our time in rest and quietness; through the merits of Jesus Christ our Saviour. Amen.",
    ],
  },
  {
    title: "Collect for aid against all perils",
    lines: [
      "Lighten our darkness, we beseech thee, O Lord; and by thy great mercy defend us from all perils and dangers of this night; for the love of thy only Son, our Saviour, Jesus Christ. Amen.",
    ],
  },
  {
    title: "Ending",
    lines: [
      "Let us bless the Lord.",
      "Thanks be to God.",
      "May the souls of the faithful, through the mercy of God, rest in peace. Amen.",
    ],
  },
];

/** What the reader says for each part: the title, then the lines, without the notes for Lent in parentheses. */
export function westernOfficeNarration(steps: ComplineStep[]): string[][] {
  return steps.map((step) => [
    `${step.title}.`,
    ...step.lines.map((line) => line.replace(/\s*\(In Lent:[^)]*\)/, "").trim()).filter(Boolean),
  ]);
}
