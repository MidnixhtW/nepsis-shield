// The Rosary and the Angelus in the traditional Western form, as prayed in Western Rite Orthodox parishes:
// fifteen mysteries, traditional English, no later additions. Texts are public domain.

export const rosaryPrayers = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Ghost. Amen.",
  creed:
    "I believe in God the Father Almighty, Maker of heaven and earth: and in Jesus Christ his only Son our Lord, who was conceived by the Holy Ghost, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, dead, and buried. He descended into hell; the third day he rose again from the dead; he ascended into heaven, and sitteth on the right hand of God the Father Almighty; from thence he shall come to judge the quick and the dead. I believe in the Holy Ghost; the holy Catholic Church; the communion of saints; the forgiveness of sins; the resurrection of the body; and the life everlasting. Amen.",
  ourFather:
    "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.",
  hailMary:
    "Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  gloryBe:
    "Glory be to the Father, and to the Son, and to the Holy Ghost: as it was in the beginning, is now, and ever shall be, world without end. Amen.",
  hailHolyQueen:
    "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. To thee do we cry, poor banished children of Eve; to thee do we send up our sighs, mourning and weeping in this vale of tears. Turn then, most gracious advocate, thine eyes of mercy toward us; and after this our exile show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary.\nV. Pray for us, O holy Mother of God.\nR. That we may be made worthy of the promises of Christ.",
  collect:
    "Let us pray. O God, whose only-begotten Son, by his life, death, and resurrection, hath purchased for us the rewards of eternal life: grant, we beseech thee, that meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise; through the same Christ our Lord. Amen.",
};

export type MysterySetId = "joyful" | "luminous" | "sorrowful" | "glorious";

export type Mystery = { title: string; scripture: string; reference: string };

// The Luminous Mysteries were added in 2002. Some parishes, Western Rite and Catholic, pray them; the app offers them as a choice.
export const mysterySets: Record<MysterySetId, { label: string; mysteries: Mystery[] }> = {
  joyful: {
    label: "Joyful Mysteries",
    mysteries: [
      { title: "The Annunciation", scripture: "Behold the handmaid of the Lord; be it unto me according to thy word.", reference: "Luke 1:26-38" },
      { title: "The Visitation", scripture: "Blessed art thou among women, and blessed is the fruit of thy womb.", reference: "Luke 1:39-56" },
      { title: "The Nativity of our Lord", scripture: "She brought forth her firstborn son, and laid him in a manger.", reference: "Luke 2:1-20" },
      { title: "The Presentation in the Temple", scripture: "Lord, now lettest thou thy servant depart in peace, according to thy word.", reference: "Luke 2:22-38" },
      { title: "The Finding in the Temple", scripture: "Wist ye not that I must be about my Father's business?", reference: "Luke 2:41-52" },
    ],
  },
  luminous: {
    label: "Luminous Mysteries",
    mysteries: [
      { title: "The Baptism of our Lord", scripture: "This is my beloved Son, in whom I am well pleased.", reference: "Matthew 3:13-17" },
      { title: "The Wedding at Cana", scripture: "Whatsoever he saith unto you, do it.", reference: "John 2:1-11" },
      { title: "The Proclamation of the Kingdom", scripture: "The kingdom of God is at hand: repent ye, and believe the gospel.", reference: "Mark 1:14-15" },
      { title: "The Transfiguration", scripture: "This is my beloved Son: hear him.", reference: "Luke 9:28-36" },
      { title: "The Institution of the Holy Eucharist", scripture: "This is my body which is given for you: this do in remembrance of me.", reference: "Luke 22:14-20" },
    ],
  },
  sorrowful: {
    label: "Sorrowful Mysteries",
    mysteries: [
      { title: "The Agony in the Garden", scripture: "Nevertheless not as I will, but as thou wilt.", reference: "Matthew 26:36-46" },
      { title: "The Scourging at the Pillar", scripture: "Then Pilate therefore took Jesus, and scourged him.", reference: "John 19:1" },
      { title: "The Crowning with Thorns", scripture: "And when they had platted a crown of thorns, they put it upon his head.", reference: "Matthew 27:27-31" },
      { title: "The Carrying of the Cross", scripture: "And he bearing his cross went forth.", reference: "John 19:17" },
      { title: "The Crucifixion", scripture: "Father, into thy hands I commend my spirit.", reference: "Luke 23:33-46" },
    ],
  },
  glorious: {
    label: "Glorious Mysteries",
    mysteries: [
      { title: "The Resurrection", scripture: "He is not here, but is risen.", reference: "Luke 24:1-12" },
      { title: "The Ascension", scripture: "While they beheld, he was taken up; and a cloud received him out of their sight.", reference: "Acts 1:6-11" },
      { title: "The Descent of the Holy Ghost", scripture: "And they were all filled with the Holy Ghost.", reference: "Acts 2:1-4" },
      { title: "The Assumption (Dormition) of the Mother of God", scripture: "Arise, O Lord, into thy rest; thou, and the ark of thy strength.", reference: "Psalm 132:8" },
      { title: "The Coronation of the Mother of God", scripture: "A woman clothed with the sun, and upon her head a crown of twelve stars.", reference: "Revelation 12:1" },
    ],
  },
};

/** "announce" is said before the prayer, for a mystery: its name and a line of Scripture. */
export type RosaryStep = { title: string; note?: string; announce?: string; text: string; repeat: number };

const ORDINALS = ["First", "Second", "Third", "Fourth", "Fifth"];

/** The Rosary as a list of steps, from the Cross to the closing prayer. */
export function rosarySteps(setId: MysterySetId): RosaryStep[] {
  const set = mysterySets[setId];
  const steps: RosaryStep[] = [
    { title: "On the Cross", note: "Make the sign of the Cross and say the Creed.", text: `${rosaryPrayers.signOfCross}\n\n${rosaryPrayers.creed}`, repeat: 1 },
    { title: "Our Father", note: "On the first large bead.", text: rosaryPrayers.ourFather, repeat: 1 },
    { title: "Hail Mary", note: "Three times, for faith, hope and love.", text: rosaryPrayers.hailMary, repeat: 3 },
    { title: "Glory be", text: rosaryPrayers.gloryBe, repeat: 1 },
  ];
  set.mysteries.forEach((mystery, index) => {
    const name = `${ORDINALS[index]} ${set.label.replace(/ies$/, "y")}: ${mystery.title}`;
    steps.push(
      {
        title: name,
        note: `"${mystery.scripture}" (${mystery.reference}). Then the Our Father.`,
        announce: `The ${name}. ${mystery.scripture}`,
        text: rosaryPrayers.ourFather,
        repeat: 1,
      },
      { title: "Hail Mary", note: mystery.title, text: rosaryPrayers.hailMary, repeat: 10 },
      { title: "Glory be", note: mystery.title, text: rosaryPrayers.gloryBe, repeat: 1 },
    );
  });
  steps.push({ title: "Hail, holy Queen", note: "To close.", text: `${rosaryPrayers.hailHolyQueen}\n\n${rosaryPrayers.collect}`, repeat: 1 });
  return steps;
}

export const angelus = {
  lines: [
    "V. The Angel of the Lord declared unto Mary.",
    "R. And she conceived of the Holy Ghost.",
    "Hail Mary…",
    "V. Behold the handmaid of the Lord.",
    "R. Be it unto me according to thy word.",
    "Hail Mary…",
    "V. And the Word was made flesh.",
    "R. And dwelt among us.",
    "Hail Mary…",
    "V. Pray for us, O holy Mother of God.",
    "R. That we may be made worthy of the promises of Christ.",
    "Let us pray. Pour forth, we beseech thee, O Lord, thy grace into our hearts; that, as we have known the incarnation of thy Son Jesus Christ by the message of an angel, so by his cross and passion we may be brought unto the glory of his resurrection; through the same Christ our Lord. Amen.",
  ],
};

// Said in place of the Angelus from Pascha to Pentecost.
export const reginaCaeli = {
  lines: [
    "Queen of heaven, rejoice, alleluia:",
    "For he whom thou didst merit to bear, alleluia,",
    "Hath risen, as he said, alleluia.",
    "Pray for us to God, alleluia.",
    "V. Rejoice and be glad, O Virgin Mary, alleluia.",
    "R. Because the Lord is truly risen, alleluia.",
    "Let us pray. O God, who by the resurrection of thy Son our Lord Jesus Christ didst vouchsafe to give joy to the whole world: grant, we beseech thee, that through his Mother, the Virgin Mary, we may obtain the joys of everlasting life; through the same Christ our Lord. Amen.",
  ],
};

/** Text as read aloud: the V. and R. marks are for the eye. */
export function speakable(text: string) {
  return text.replace(/^[VR]\. /gm, "");
}

/** The Rosary as recordings, in order. Each entry is one clip; the Hail Mary is the same clip every time. */
export function rosaryNarration(setId: MysterySetId): string[][] {
  return rosarySteps(setId).flatMap((step) => {
    const prayer = Array.from({ length: step.repeat }, () => [speakable(step.text)]);
    return step.announce ? [[step.announce], ...prayer] : prayer;
  });
}

/** The Angelus or Regina Caeli as one recording, with each "Hail Mary…" said in full. */
export function marianAntiphonNarration(prayer: { lines: string[] }): string[] {
  return prayer.lines.map((line) => speakable(line).replace("Hail Mary…", rosaryPrayers.hailMary));
}
