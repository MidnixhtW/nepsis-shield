import { useState } from "react";
import { Link } from "react-router";
import { Baby, BookHeart, Flame, Lightbulb, Square, Users, Volume2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CHILD_PRAYERS, EVENING_PRAYER, PARENT_NOTES, SAINT_STORIES, ST_TIKHON } from "@/content/familyPrayer";
import { cn } from "@/lib/utils";
import { canReadAloud, startReadAloud, stopReadAloud, useReadAloud } from "@/lib/readAloud";

type Part = "tonight" | "learn" | "stories" | "parents";

const PARTS: { id: Part; label: string; icon: typeof Flame }[] = [
  { id: "tonight", label: "Pray tonight", icon: Flame },
  { id: "learn", label: "Prayers to learn", icon: Baby },
  { id: "stories", label: "Saint stories", icon: BookHeart },
  { id: "parents", label: "For parents", icon: Lightbulb },
];

// Prayer for the whole family: a short evening prayer, prayers children can learn, saint stories, notes for parents.
export function FamilyPrayer() {
  const [part, setPart] = useState<Part>("tonight");

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Family</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Pray as a household.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The home is a little church. A few minutes before the icons each evening, with simple prayers your children can say with you, is how faith is passed on.
        </p>
        <div role="group" aria-label="Family sections" className="mt-4 flex flex-wrap gap-2">
          {PARTS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={part === id}
              onClick={() => setPart(id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                part === id ? "border-accent/50 bg-accent/15 text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon aria-hidden className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </Card>

      {part === "tonight" ? <TonightPrayer /> : null}
      {part === "learn" ? <PrayersToLearn /> : null}
      {part === "stories" ? <SaintStories /> : null}
      {part === "parents" ? <ParentNotes /> : null}
    </div>
  );
}

function TonightPrayer() {
  return (
    <Card className="rounded-3xl border p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight">Evening prayer together · about 5 minutes</h3>
      <ol className="mt-4 grid gap-4">
        {EVENING_PRAYER.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/40 text-sm font-semibold text-accent">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold">{step.title}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{step.who}</p>
              {step.note ? <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.note}</p> : null}
              {step.say ? <p className="scripture-text mt-2 whitespace-pre-line text-[1.08rem] leading-relaxed">{step.say}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        The prayer for the family is from {ST_TIKHON}; the blessing is Numbers 6:24–26.
      </p>
    </Card>
  );
}

function PrayersToLearn() {
  return (
    <Card className="rounded-3xl border p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight">Short prayers children can learn</h3>
      <p className="mt-1 text-sm text-muted-foreground">Learn one at a time. Say it together until your child can say it alone.</p>
      <ul className="mt-4 grid gap-3">
        {CHILD_PRAYERS.map((prayer) => (
          <li key={prayer.text} className="rounded-2xl border border-border/60 bg-background/45 p-4">
            <p className="scripture-text text-[1.08rem] leading-relaxed">{prayer.text}</p>
            <p className="mt-1 text-sm text-muted-foreground">{prayer.when}</p>
            {prayer.source ? <p className="mt-1 text-[11px] text-muted-foreground">From {prayer.source}</p> : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SaintStories() {
  const reading = useReadAloud();
  return (
    <Card className="rounded-3xl border p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight">Saint stories for children</h3>
      <p className="mt-1 text-sm text-muted-foreground">Short enough for bedtime. Read one, then ask what your child noticed.</p>
      <Accordion type="single" collapsible className="mt-3">
        {SAINT_STORIES.map((story) => (
          <AccordionItem key={story.saint} value={story.saint}>
            <AccordionTrigger className="text-left">
              <span>
                <span className="block font-semibold">{story.title}</span>
                <span className="block text-xs font-normal text-muted-foreground">{story.saint} · {story.day}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3">
                {canReadAloud() ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-fit rounded-full"
                    aria-pressed={reading.title === story.title}
                    onClick={() => (reading.title === story.title ? stopReadAloud() : startReadAloud(story.title, [story.title + ".", ...story.story, story.lesson]))}
                  >
                    {reading.title === story.title ? <Square className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                    {reading.title === story.title ? "Stop" : "Read it to me"}
                  </Button>
                ) : null}
                {story.story.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="scripture-text text-[1.05rem] leading-relaxed">{paragraph}</p>
                ))}
                <p className="rounded-2xl border border-accent/30 bg-accent/10 p-3 text-sm font-semibold">{story.lesson}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

function ParentNotes() {
  return (
    <Card className="rounded-3xl border p-5 sm:p-6">
      <h3 className="text-lg font-semibold tracking-tight">For parents</h3>
      <ul className="mt-3 grid gap-2">
        {PARENT_NOTES.map((note) => (
          <li key={note} className="flex gap-2 text-sm leading-relaxed">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-2xl border border-border/60 bg-background/45 p-4">
        <p className="text-sm font-semibold">Pray for each other during the day</p>
        <p className="mt-1 text-sm text-muted-foreground">A family prayer group lets everyone share requests and see who has prayed, even when you are apart.</p>
        <Button asChild variant="outline" size="sm" className="mt-3 rounded-full">
          <Link to="/pray?tab=groups"><Users className="mr-2 h-4 w-4" /> Start a family group</Link>
        </Button>
      </div>
    </Card>
  );
}
