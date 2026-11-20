import { SAYINGS_SOURCE, sayingForDay } from "@/content/fathersSayings";
import { ShareCardButton } from "@/components/app/ShareCardButton";

// One saying of the Desert Fathers each day on Today.
export function FathersSayingCard({ today }: { today: Date }) {
  const saying = sayingForDay(today);
  return (
    <section className="border-t border-border/60 px-1 py-7" role="region" aria-label="A word from the Fathers">
      <h2 className="text-2xl text-cinnabar">A word from the Fathers</h2>
      <figure className="mt-3">
        <blockquote className="scripture-text text-xl leading-relaxed">{saying.text}</blockquote>
        <figcaption className="mt-2 text-sm font-semibold text-foreground/80">{saying.who}</figcaption>
      </figure>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-foreground/70">{SAYINGS_SOURCE}</p>
        <ShareCardButton card={{ eyebrow: "A word from the Fathers", text: saying.text, attribution: saying.who }} fileName="word-from-the-fathers.png" />
      </div>
    </section>
  );
}
