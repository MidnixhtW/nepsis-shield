import { useState } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Preparation for Holy Communion: a gentle checklist, the prayers said just before Communion,
// and thanksgiving afterward. Practice differs between parishes, so the priest's guidance leads.

const checklist = [
  "Go to confession as your priest directs.",
  "Be at peace with others; ask forgiveness where you need to.",
  "Keep the fast your priest has blessed, and the eucharistic fast from midnight or as directed.",
  "The evening before, pray the prayers or canon of preparation your parish uses.",
  "Arrive before the Divine Liturgy begins.",
];

const before: Array<{ title: string; lines: string[] }> = [
  {
    title: "I believe, O Lord, and I confess",
    lines: [
      "I believe, O Lord, and I confess that Thou art truly the Christ, the Son of the living God, Who didst come into the world to save sinners, of whom I am first.",
      "And I believe that this is truly Thine own most pure Body, and that this is truly Thine own precious Blood. Therefore I pray Thee: have mercy upon me and forgive my transgressions, voluntary and involuntary, in word and in deed, in knowledge and in ignorance; and make me worthy to partake without condemnation of Thy most pure Mysteries, for the remission of sins and unto life everlasting. Amen.",
    ],
  },
  {
    title: "Of Thy Mystical Supper",
    lines: [
      "Of Thy Mystical Supper, O Son of God, accept me today as a communicant; for I will not speak of Thy Mystery to Thine enemies, neither like Judas will I give Thee a kiss; but like the thief will I confess Thee: Remember me, O Lord, in Thy Kingdom.",
    ],
  },
  {
    title: "Not unto judgment",
    lines: [
      "Not unto judgment nor unto condemnation be my partaking of Thy holy Mysteries, O Lord, but unto the healing of soul and body. Amen.",
    ],
  },
];

const after: Array<{ title: string; lines: string[] }> = [
  {
    title: "Glory to Thee, O God",
    lines: ["Glory to Thee, O God. Glory to Thee, O God. Glory to Thee, O God."],
  },
  {
    title: "Prayer of thanksgiving",
    lines: [
      "I thank Thee, O Lord my God, that Thou hast not rejected me, a sinner, but hast made me worthy to be a partaker of Thy holy Mysteries. I thank Thee that Thou hast permitted me, unworthy as I am, to commune of Thy most pure and heavenly Gifts.",
      "O Master, Lover of mankind, Who for our sake didst die and didst rise again, and gavest us these awesome and life-creating Mysteries for the good and sanctification of our souls and bodies: let them be for the healing of soul and body, the illumining of the eyes of my heart, a faith unashamed, a love unfeigned, and the attaining of Thy Kingdom. Amen.",
    ],
  },
  {
    title: "The Song of Simeon",
    lines: [
      "Lord, now lettest thou thy servant depart in peace, according to thy word: for mine eyes have seen thy salvation, which thou hast prepared before the face of all people; a light to lighten the Gentiles, and the glory of thy people Israel. (Luke 2:29-32)",
    ],
  },
];

function PrayerSection({ id, title, hint, prayers }: { id: string; title: string; hint: string; prayers: typeof before }) {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      <Accordion type="multiple" defaultValue={[`${id}-0`]} className="mt-3">
        {prayers.map((prayer, index) => (
          <AccordionItem key={prayer.title} value={`${id}-${index}`}>
            <AccordionTrigger className="text-left">{prayer.title}</AccordionTrigger>
            <AccordionContent>
              <div className="scripture-text grid gap-3 text-[1.05rem]">
                {prayer.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

export function CommunionPrep() {
  const [done, setDone] = useState<number[]>([]);

  return (
    <div className="grid gap-4 sm:gap-5">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight">Preparing for Holy Communion</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          We do not come because we are worthy, but because Christ calls us to be healed. Practice differs between parishes and jurisdictions, so follow your priest's guidance above anything here.
        </p>
        <ul className="mt-4 grid gap-2">
          {checklist.map((item, index) => {
            const checked = done.includes(index);
            return (
              <li key={item}>
                <button
                  type="button"
                  aria-pressed={checked}
                  onClick={() => setDone((current) => (checked ? current.filter((value) => value !== index) : [...current, index]))}
                  className="flex w-full items-start gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                      checked ? "border-accent bg-accent text-accent-foreground" : "border-border",
                    )}
                  >
                    {checked ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className={cn(checked && "text-muted-foreground line-through")}>{item}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <PrayerSection
        id="before"
        title="Before Communion"
        hint="Said quietly as you approach the chalice, or at home beforehand."
        prayers={before}
      />
      <PrayerSection
        id="after"
        title="Thanksgiving after Communion"
        hint="Stay for the thanksgiving prayers in church, or read them when you return home."
        prayers={after}
      />
    </div>
  );
}
