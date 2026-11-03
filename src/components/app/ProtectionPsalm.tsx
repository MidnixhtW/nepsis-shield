// Psalm 90 in the Septuagint numbering used by the Orthodox Church (Psalm 91 in most English Bibles),
// the traditional psalm of protection, in the public-domain King James text. Bundled so it works offline.
const verses = [
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

export function ProtectionPsalm() {
  return (
    <div className="grid gap-3 pb-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Prayed by Orthodox Christians in danger and fear, and carried by many soldiers. Read it slowly, aloud if you can.
      </p>
      <ol className="scripture-text grid gap-2 text-[1.05rem]">
        {verses.map((verse, index) => (
          <li key={index} className="flex gap-2">
            <span className="w-5 shrink-0 text-right text-xs leading-7 text-accent tabular-nums">{index + 1}</span>
            <span>{verse}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">Psalm 90 (Psalm 91 in most English Bibles) · King James Version</p>
    </div>
  );
}
