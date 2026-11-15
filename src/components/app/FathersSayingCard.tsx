import { Card } from "@/components/ui/card";
import { SAYINGS_SOURCE, sayingForDay } from "@/content/fathersSayings";
import { ShareCardButton } from "@/components/app/ShareCardButton";

// One saying of the Desert Fathers each day on Today.
export function FathersSayingCard({ today }: { today: Date }) {
  const saying = sayingForDay(today);
  return (
    <Card className="rounded-3xl border p-5 sm:p-6" role="region" aria-label="A word from the Fathers">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">A word from the Fathers</p>
      <figure className="mt-3">
        <blockquote className="scripture-text text-[1.05rem] leading-relaxed">{saying.text}</blockquote>
        <figcaption className="mt-2 text-sm font-semibold text-muted-foreground">{saying.who}</figcaption>
      </figure>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">{SAYINGS_SOURCE}</p>
        <ShareCardButton card={{ eyebrow: "A word from the Fathers", text: saying.text, attribution: saying.who }} fileName="word-from-the-fathers.png" />
      </div>
    </Card>
  );
}
