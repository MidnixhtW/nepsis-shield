// Prayers to learn by heart. Each prayer is split into short sections, learned one at a time.
// The texts match the ones the app prays elsewhere, so what is learned here is what is said in the prayer rule.
import { CHILD_PRAYERS } from "@/content/familyPrayer";

export type PrayerToLearn = {
  id: string;
  title: string;
  hint: string;
  group: "core" | "psalms" | "children";
  sections: string[];
};

export const CREED_SECTIONS = [
  "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
  "And in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages: Light of Light, true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made.",
  "Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried.",
  "And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again with glory to judge the living and the dead; Whose kingdom shall have no end.",
  "And in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshiped and glorified; Who spoke by the prophets.",
  "In one, holy, catholic, and apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead, and the life of the age to come. Amen.",
];

// Psalm 90 in the Septuagint numbering (Psalm 91 in most English Bibles), public-domain King James text.
export const PSALM_90_VERSES = [
  "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
  "I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.",
  "Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence.",
  "He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.",
  "Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day;",
  "Nor for the pestilence that walketh in darkness; nor for the destruction that wasteth at noonday.",
  "A thousand shall fall at thy side, and ten thousand at thy right hand; but it shall not come nigh thee.",
  "Only with thine eyes shalt thou behold and see the reward of the wicked.",
  "Because thou hast made the LORD, which is my refuge, even the most High, thy habitation;",
  "There shall no evil befall thee, neither shall any plague come nigh thy dwelling.",
  "For he shall give his angels charge over thee, to keep thee in all thy ways.",
  "They shall bear thee up in their hands, lest thou dash thy foot against a stone.",
  "Thou shalt tread upon the lion and adder: the young lion and the dragon shalt thou trample under feet.",
  "Because he hath set his love upon me, therefore will I deliver him: I will set him on high, because he hath known my name.",
  "He shall call upon me, and I will answer him: I will be with him in trouble; I will deliver him, and honour him.",
  "With long life will I satisfy him, and shew him my salvation.",
];

// Psalm 50 in the Septuagint numbering (Psalm 51 in most English Bibles), from Brenton's public-domain
// translation of the Septuagint (1851), with the pronouns for God capitalized as elsewhere in the app.
export const PSALM_50_VERSES = [
  "Have mercy upon me, O God, according to Thy great mercy; and according to the multitude of Thy compassions blot out my transgression.",
  "Wash me thoroughly from mine iniquity, and cleanse me from my sin.",
  "For I am conscious of mine iniquity; and my sin is continually before me.",
  "Against Thee only have I sinned, and done evil before Thee: that Thou mightest be justified in Thy sayings, and mightest overcome when Thou art judged.",
  "For, behold, I was conceived in iniquities, and in sins did my mother conceive me.",
  "For, behold, Thou lovest truth: Thou hast manifested to me the secret and hidden things of Thy wisdom.",
  "Thou shalt sprinkle me with hyssop, and I shall be purified: Thou shalt wash me, and I shall be made whiter than snow.",
  "Thou shalt cause me to hear gladness and joy: the afflicted bones shall rejoice.",
  "Turn away Thy face from my sins, and blot out all mine iniquities.",
  "Create in me a clean heart, O God; and renew a right spirit in my inward parts.",
  "Cast me not away from Thy presence; and remove not Thy Holy Spirit from me.",
  "Restore to me the joy of Thy salvation: establish me with Thy directing Spirit.",
  "Then will I teach transgressors Thy ways; and ungodly men shall turn to Thee.",
  "Deliver me from blood-guiltiness, O God, the God of my salvation: and my tongue shall joyfully declare Thy righteousness.",
  "O Lord, Thou shalt open my lips; and my mouth shall declare Thy praise.",
  "For if Thou desiredst sacrifice, I would have given it: Thou wilt not take pleasure in whole-burnt-offerings.",
  "Sacrifice to God is a broken spirit: a broken and humbled heart God will not despise.",
  "Do good, O Lord, to Sion in Thy good pleasure; and let the walls of Jerusalem be built.",
  "Then shalt Thou be pleased with a sacrifice of righteousness, offering, and whole-burnt-sacrifices: then shall they offer calves upon Thine altar.",
];

function pairs(lines: string[]) {
  const out: string[] = [];
  for (let index = 0; index < lines.length; index += 2) out.push(lines.slice(index, index + 2).join(" "));
  return out;
}

function childPrayer(learnId: string) {
  const prayer = CHILD_PRAYERS.find((item) => item.learnId === learnId);
  if (!prayer) throw new Error(`Missing child prayer ${learnId}`);
  return prayer.text;
}

export const PRAYERS_TO_LEARN: PrayerToLearn[] = [
  {
    id: "jesus-prayer",
    title: "The Jesus Prayer",
    hint: "Said any time, on the prayer rope",
    group: "core",
    sections: ["Lord Jesus Christ, Son of God, have mercy on me, a sinner."],
  },
  {
    id: "heavenly-king",
    title: "O Heavenly King",
    hint: "To the Holy Spirit, at the start of prayer",
    group: "core",
    sections: [
      "O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings and Giver of life:",
      "come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.",
    ],
  },
  {
    id: "trisagion",
    title: "The Trisagion prayers",
    hint: "Holy God, Glory, and O Most Holy Trinity",
    group: "core",
    sections: [
      "Holy God, Holy Mighty, Holy Immortal, have mercy on us.",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Thy Name's sake.",
    ],
  },
  {
    id: "our-father",
    title: "The Lord's Prayer",
    hint: "Our Father, the prayer Christ gave us",
    group: "core",
    sections: [
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven.",
      "Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
    ],
  },
  {
    id: "creed",
    title: "The Creed",
    hint: "The Symbol of Faith, sung at every Liturgy",
    group: "core",
    sections: CREED_SECTIONS,
  },
  {
    id: "truly-meet",
    title: "It is truly meet",
    hint: "The hymn to the Theotokos at the end of prayer",
    group: "core",
    sections: [
      "It is truly meet to bless you, O Theotokos, ever-blessed and most pure, and the Mother of our God.",
      "More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption you gave birth to God the Word. True Theotokos, we magnify you.",
    ],
  },
  {
    id: "beneath-compassion",
    title: "Beneath your compassion",
    hint: "The oldest known prayer to the Theotokos",
    group: "core",
    sections: [
      "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
    ],
  },
  {
    id: "psalm-90",
    title: "Psalm 90",
    hint: "The psalm of protection, carried by soldiers",
    group: "psalms",
    sections: pairs(PSALM_90_VERSES),
  },
  {
    id: "psalm-50",
    title: "Psalm 50",
    hint: "The psalm of repentance, from morning prayer",
    group: "psalms",
    sections: pairs(PSALM_50_VERSES),
  },
  {
    id: "meal-blessing",
    title: "Blessing before meals",
    hint: "A short prayer children can learn first",
    group: "children",
    sections: [childPrayer("meal-blessing")],
  },
  {
    id: "guardian-angel",
    title: "To the Guardian Angel",
    hint: "The longer bedtime prayer, for older children",
    group: "children",
    sections: (() => {
      const [first, ...rest] = childPrayer("guardian-angel").split(": ");
      const text = rest.join(": ");
      const cut = text.indexOf("Pray for me");
      return [`${first}: ${text.slice(0, cut).trim()}`, text.slice(cut)];
    })(),
  },
];

export const PRAYER_GROUPS: { id: PrayerToLearn["group"]; title: string }[] = [
  { id: "core", title: "Prayers every Orthodox Christian knows" },
  { id: "psalms", title: "Psalms" },
  { id: "children", title: "With children" },
];

/** Daily prayer step titles that have a prayer to learn, so the step can link to it. */
export const LEARN_ID_BY_STEP_TITLE: Record<string, string> = {
  "O Heavenly King": "heavenly-king",
  "Trisagion prayers": "trisagion",
  "The Creed": "creed",
  "Psalm 50 excerpts": "psalm-50",
};

export function findPrayerToLearn(id: string | null | undefined) {
  return PRAYERS_TO_LEARN.find((prayer) => prayer.id === id);
}
