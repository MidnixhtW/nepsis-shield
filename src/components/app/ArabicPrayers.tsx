// Short prayers in Arabic as Melkite and Antiochian parishes pray them, with the English beside each. Shown in Learn by
// heart for Melkite users and anyone who chose Arabic.
const PRAYERS = [
  {
    title: "Trisagion",
    arabic: "قُدُّوسٌ الله، قُدُّوسٌ القَوِيّ، قُدُّوسٌ الذي لا يَموت، ارحَمنا.",
    english: "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (Three times)",
  },
  {
    title: "Our Father",
    arabic:
      "أبانا الذي في السماوات، ليتقدَّسِ اسمُك، ليأتِ ملكوتُك، لتكُنْ مشيئتُك، كما في السماء كذلك على الأرض. خبزَنا الجوهريَّ أعطِنا اليوم، واغفِرْ لنا ذنوبَنا كما نغفرُ نحن لمن أساءَ إلينا، ولا تُدخِلْنا في تجربة، لكن نجِّنا من الشرّير.",
    english: "Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come, Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from the evil one.",
  },
  {
    title: "Paschal greeting",
    arabic: "المسيحُ قام! حقًّا قام!",
    english: "Christ is risen! Truly He is risen!",
  },
];

export function ArabicPrayers() {
  return (
    <section aria-labelledby="arabic-prayers" className="grid gap-5 border-b border-border/60 px-1 pb-8">
      <div>
        <h2 id="arabic-prayers" className="text-2xl">In Arabic</h2>
        <p className="mt-1 text-sm text-muted-foreground">As Melkite and Antiochian parishes pray them.</p>
      </div>
      {PRAYERS.map((prayer) => (
        <div key={prayer.title}>
          <h3 className="text-lg font-semibold">{prayer.title}</h3>
          <p lang="ar" dir="rtl" className="mt-2 text-right text-2xl leading-loose">{prayer.arabic}</p>
          <p className="scripture-text mt-2 text-base leading-relaxed text-foreground/80">{prayer.english}</p>
        </div>
      ))}
    </section>
  );
}
