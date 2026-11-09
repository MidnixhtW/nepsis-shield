import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BACKGROUNDS, GLOSSARY, JOURNEY_STAGES } from "@/content/becomingOrthodox";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { cn } from "@/lib/utils";
import { showError, showSuccess } from "@/utils/toast";

const KEY = "journey:becoming-orthodox:v1";

type JourneyStore = { stage: string; done: string[] };

function load(): JourneyStore {
  const saved = getStoredItem<Partial<JourneyStore>>(KEY);
  const stage = JOURNEY_STAGES.some((item) => item.id === saved?.stage) ? saved!.stage! : JOURNEY_STAGES[0].id;
  return { stage, done: Array.isArray(saved?.done) ? saved!.done! : [] };
}

// Learn > Your next step > Becoming Orthodox: where you are on the road into the Church, what to expect, and what
// to do next. Private to this device. Every step points back to the parish priest.
export function BecomingOrthodox() {
  const [store, setStore] = useState<JourneyStore>(load);
  const index = JOURNEY_STAGES.findIndex((item) => item.id === store.stage);
  const stage = JOURNEY_STAGES[index];

  function save(next: JourneyStore) {
    setStore(next);
    setStoredItem(KEY, next);
  }

  function toggleStep(step: string) {
    const id = `${stage.id}:${step}`;
    save({ ...store, done: store.done.includes(id) ? store.done.filter((item) => item !== id) : [...store.done, id] });
  }

  async function shareWithSponsor() {
    const doneHere = stage.steps.filter((step) => store.done.includes(`${stage.id}:${step}`));
    const text = [
      `I'm on my way into the Orthodox Church. Where I am now: ${stage.title} (${stage.short}).`,
      doneHere.length ? `Done so far: ${doneHere.join("; ")}.` : "",
      "Please keep me in your prayers.",
    ].filter(Boolean).join("\n");
    try {
      if (navigator.share) await navigator.share({ title: "My journey into Orthodoxy", text });
      else {
        await navigator.clipboard.writeText(text);
        showSuccess("Copied. Paste it in a message to your sponsor or priest.");
      }
    } catch (error) {
      if ((error as Error)?.name !== "AbortError") showError("Couldn't share. Please try again.");
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Becoming Orthodox</p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">Where are you on the way?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pick the step you are on. Parishes do things a little differently, so where your priest says something different, follow your priest. What you mark here stays on this device.
        </p>
        <ol className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Steps into the Church">
          {JOURNEY_STAGES.map((item, itemIndex) => {
            const active = item.id === stage.id;
            const past = itemIndex < index;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-current={active ? "step" : undefined}
                  onClick={() => save({ ...store, stage: item.id })}
                  className={cn(
                    "flex h-full w-full flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active ? "border-accent bg-accent/15" : past ? "border-accent/30 bg-accent/5" : "border-border/60 hover:bg-muted/40",
                  )}
                >
                  <span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs font-bold", active || past ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")}>
                    {past ? <Check aria-hidden className="h-3.5 w-3.5" /> : itemIndex + 1}
                  </span>
                  <span className="text-sm font-semibold leading-tight">{item.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card className="rounded-3xl border p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Step {index + 1} of {JOURNEY_STAGES.length} · {stage.short}</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight">{stage.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{stage.about}</p>

        <h4 className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">What to expect</h4>
        <ul className="mt-2 grid gap-2">
          {stage.expect.map((line) => (
            <li key={line} className="flex gap-2.5 text-sm leading-relaxed">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h4 className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Next steps</h4>
        <ul className="mt-2 grid gap-2">
          {stage.steps.map((step) => {
            const checked = store.done.includes(`${stage.id}:${step}`);
            return (
              <li key={step}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleStep(step)}
                  className="flex w-full items-start gap-3 rounded-2xl border border-border/60 px-3.5 py-3 text-left text-sm hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border", checked ? "border-accent bg-accent text-accent-foreground" : "border-border")}>
                    {checked ? <Check aria-hidden className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span className={cn(checked && "text-muted-foreground line-through")}>{step}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-2">
          {index < JOURNEY_STAGES.length - 1 ? (
            <Button type="button" className="rounded-full" onClick={() => save({ ...store, stage: JOURNEY_STAGES[index + 1].id })}>
              I'm ready for: {JOURNEY_STAGES[index + 1].title}
            </Button>
          ) : null}
          <Button type="button" variant="outline" className="rounded-full" onClick={() => void shareWithSponsor()}>
            <Send className="mr-2 h-4 w-4" /> Share with my sponsor
          </Button>
        </div>
      </Card>

      <Card className="rounded-3xl border px-5">
        <Accordion type="multiple">
          <AccordionItem value="from">
            <AccordionTrigger className="text-base font-semibold">Where you're coming from</AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="rounded-2xl border px-4">
                {BACKGROUNDS.map((background) => (
                  <AccordionItem key={background.id} value={background.id} className="last:border-b-0">
                    <AccordionTrigger className="text-sm font-semibold">{background.label}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="grid gap-2">
                        {background.notes.map((note) => (
                          <li key={note} className="flex gap-2.5 text-sm leading-relaxed">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="words" className="border-b-0">
            <AccordionTrigger className="text-base font-semibold">Words you'll hear</AccordionTrigger>
            <AccordionContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                {GLOSSARY.map(([term, meaning]) => (
                  <div key={term}>
                    <dt className="text-sm font-semibold">{term}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">{meaning}</dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}
