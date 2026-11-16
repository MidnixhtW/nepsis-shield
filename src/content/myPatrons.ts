// The patrons on the hidden page's shelf. Lives are written fresh for the app; the lines are from Scripture (KJV) and
// St Augustine's Confessions in E. B. Pusey's 1838 translation, both public domain. Feasts are New Calendar dates.

export type MyPatron = {
  id: string;
  name: string;
  title: string;
  month: number;
  day: number;
  feastName: string;
  life: string;
  line: string;
  lineSource: string;
  practice: string;
  prayer: string;
};

export const MY_PATRONS: MyPatron[] = [
  {
    id: "michael",
    name: "St Michael the Archangel",
    title: "Commander of the heavenly hosts",
    month: 11,
    day: 8,
    feastName: "Synaxis of the Archangel Michael and all the Bodiless Powers",
    life:
      "His name asks a question: \"Who is like God?\" Scripture shows him standing guard over God's people in Daniel, contending for the body of Moses in Jude, and casting down the dragon in Revelation. The Church calls him the chief of the angels who keep watch, and soldiers have prayed to him for as long as there have been Christian soldiers.",
    line: "And there was war in heaven: Michael and his angels fought against the dragon.",
    lineSource: "Revelation 12:7",
    practice: "Before a shift or a hard task, ask his protection by name and make the sign of the Cross.",
    prayer:
      "Holy Archangel Michael, commander of the bodiless hosts, defend us and pray to God for us. Guard us from fear, anger, pride, and every temptation that darkens the heart. Amen.",
  },
  {
    id: "augustine",
    name: "St Augustine of Hippo",
    title: "Bishop and teacher of grace",
    month: 6,
    day: 15,
    feastName: "Blessed Augustine, Bishop of Hippo",
    life:
      "A brilliant young teacher from North Africa who chased pleasure, ambition and every clever philosophy of his day, while his mother Monica prayed for him with tears. In a garden in Milan he heard a child singing \"take up and read\", opened St Paul, and gave his life to Christ. St Ambrose baptised him. He became a bishop in Hippo and wrote the Confessions, a whole book spoken to God about how grace found him.",
    line: "Thou madest us for Thyself, and our heart is restless, until it repose in Thee.",
    lineSource: "Confessions, Book I",
    practice: "When the heart is restless tonight, name what it is reaching for, then say his line back to God.",
    prayer:
      "Holy Father Augustine, pray to God for me. Ask Christ to turn my restless heart toward Him, to heal what my past has bent, and to make my mind and my loves serve His truth. Amen.",
  },
  {
    id: "romanos",
    name: "St Romanos the Melodist",
    title: "Sweet singer of the Church",
    month: 10,
    day: 1,
    feastName: "Venerable Romanos the Melodist",
    life:
      "A deacon from Syria who served in Constantinople and had no gift for singing. On the eve of the Nativity the Mother of God appeared to him in a dream and gave him a scroll to eat. The next morning he stood up in church and sang a new hymn for the feast, which the Church still sings. He went on to write hundreds of kontakia, long sung sermons that set Scripture to music.",
    line: "I will sing unto the LORD as long as I live: I will sing praise to my God while I have my being.",
    lineSource: "Psalm 104:33",
    practice: "Before a session, offer the first sound you make to God. Keep one line from today's hymns in your notes.",
    prayer:
      "Venerable Romanos, sweet singer of the Church, pray to God for me. Ask the Lord to purify my words and make my voice serve prayer, truth, and love. Amen.",
  },
  {
    id: "george",
    name: "St George the Greatmartyr",
    title: "Trophy bearer, soldier of Christ",
    month: 4,
    day: 23,
    feastName: "Holy Greatmartyr, Victory Bearer and Wonderworker George",
    life:
      "A Roman officer from Cappadocia who served under Diocletian. When the emperor ordered Christians hunted down, George gave away his goods, stood before the court and said he was a Christian. He was tortured for days and would not deny Christ, and he was beheaded around the year 303. Soldiers of every Christian nation have taken him as their own.",
    line: "Greater love hath no man than this, that a man lay down his life for his friends.",
    lineSource: "John 15:13",
    practice: "Do one hard duty today without complaint, and offer it for the people beside you.",
    prayer:
      "Holy Greatmartyr George, pray to God for me. Ask Christ to strengthen my faith, give courage in trial, and help me overcome fear with trust in Him. Amen.",
  },
];

/** The patron for a day: whoever keeps his feast that day, otherwise each in turn. */
export function patronForDay(date: Date): { patron: MyPatron; isFeast: boolean } {
  const feast = MY_PATRONS.find((patron) => patron.month === date.getMonth() + 1 && patron.day === date.getDate());
  if (feast) return { patron: feast, isFeast: true };
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return { patron: MY_PATRONS[dayNumber % MY_PATRONS.length], isFeast: false };
}

/** The next time this patron's feast comes round, today included. */
export function nextFeast(patron: MyPatron, from: Date) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const thisYear = new Date(from.getFullYear(), patron.month - 1, patron.day);
  return thisYear >= today ? thisYear : new Date(from.getFullYear() + 1, patron.month - 1, patron.day);
}

export function ocaLivesUrl(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `https://www.oca.org/saints/lives/${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}
