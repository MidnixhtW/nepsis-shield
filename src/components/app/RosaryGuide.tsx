import { useMemo, useState } from "react";
import { ChevronLeft, Info, RotateCcw, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { angelus, mysterySetForDay, mysterySets, reginaCaeli, rosaryPrayers, rosarySteps, type MysterySetId } from "@/content/rosary";
import { addDays, dateOnly, orthodoxPascha } from "@/lib/fastingSeasons";
import { canReadAloud, startReadAloud, stopReadAloud, useReadAloud } from "@/lib/readAloud";
import { cn } from "@/lib/utils";

function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(12);
}

/** From Pascha through Pentecost the Regina Caeli is said in place of the Angelus. */
function isPaschaltide(date: Date) {
  const today = dateOnly(date);
  const pascha = orthodoxPascha(today.getFullYear());
  return today >= pascha && today <= addDays(pascha, 49);
}

function WesternRiteNote() {
  return (
    <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Added with Western Rite Orthodoxy in mind.</span> Western Rite
            Orthodox parishes pray the Rosary and the Angelus. This is the traditional form, with fifteen mysteries.
          </p>
          <p className="mt-2">
            Catholics, Eastern or Roman, can pray it too. If your parish adds the Luminous Mysteries or the Fatima prayer, add
            them where it does. Byzantine Christians have their own way of praying with beads, the Jesus Prayer on a prayer rope.
          </p>
        </div>
      </div>
    </Card>
  );
}

function RosaryCounter() {
  const [setId, setSetId] = useState<MysterySetId>(() => mysterySetForDay(new Date()));
  const steps = useMemo(() => rosarySteps(setId), [setId]);
  const [stepIndex, setStepIndex] = useState(0);
  const [bead, setBead] = useState(0);
  const reading = useReadAloud();

  const finished = stepIndex >= steps.length;
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const totalBeads = steps.reduce((sum, item) => sum + item.repeat, 0);
  const done = steps.slice(0, stepIndex).reduce((sum, item) => sum + item.repeat, 0) + bead;
  const title = `Rosary: ${mysterySets[setId].label}`;

  function restart(next: MysterySetId = setId) {
    setSetId(next);
    setStepIndex(0);
    setBead(0);
  }

  function advance() {
    haptic();
    if (bead + 1 < step.repeat) {
      setBead(bead + 1);
      return;
    }
    setStepIndex(stepIndex + 1);
    setBead(0);
  }

  function back() {
    if (bead > 0) {
      setBead(bead - 1);
      return;
    }
    if (stepIndex === 0) return;
    const previous = steps[stepIndex - 1];
    setStepIndex(stepIndex - 1);
    setBead(previous.repeat - 1);
  }

  function readAll() {
    startReadAloud(title, steps.flatMap((item) => Array.from({ length: item.repeat }, () => item.text)));
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">The Rosary</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mysterySets[setId].label}, traditionally prayed on {mysterySets[setId].days}.
          </p>
        </div>
        {canReadAloud() ? (
          reading.title === title ? (
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={stopReadAloud}>
              <Square className="mr-1.5 h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={readAll}>
              <Volume2 className="mr-1.5 h-4 w-4" /> Read it to me
            </Button>
          )
        ) : null}
      </div>

      <ToggleGroup
        type="single"
        value={setId}
        onValueChange={(value) => value && restart(value as MysterySetId)}
        aria-label="Mysteries"
        className="mt-4 flex flex-wrap justify-start gap-2"
      >
        {(Object.keys(mysterySets) as MysterySetId[]).map((id) => (
          <ToggleGroupItem
            key={id}
            value={id}
            className="rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
          >
            {mysterySets[id].label.replace(" Mysteries", "")}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Separator className="my-4" />

      <Progress value={(done / totalBeads) * 100} aria-label="Progress through the Rosary" className="h-1.5" />

      {finished ? (
        <div className="mt-5 grid gap-3 text-center">
          <p className="text-lg font-semibold">Amen.</p>
          <p className="text-sm text-muted-foreground">You have prayed the {mysterySets[setId].label}.</p>
          <Button type="button" variant="outline" className="mx-auto rounded-full" onClick={() => restart()}>
            <RotateCcw className="mr-2 h-4 w-4" /> Pray again
          </Button>
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          <div aria-live="polite">
            <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
            {step.note ? <p className="mt-1 text-sm italic text-muted-foreground">{step.note}</p> : null}
          </div>

          {step.repeat > 1 ? (
            <div className="flex flex-wrap gap-2" role="img" aria-label={`Bead ${bead + 1} of ${step.repeat}`}>
              {Array.from({ length: step.repeat }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-4 w-4 rounded-full border",
                    index < bead ? "border-primary bg-primary" : index === bead ? "border-accent bg-accent/60" : "border-border bg-muted/30",
                  )}
                />
              ))}
            </div>
          ) : null}

          <p className="whitespace-pre-line rounded-2xl border border-border/60 bg-background/50 p-4 text-[15px] leading-relaxed">{step.text}</p>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="rounded-2xl" onClick={back} disabled={stepIndex === 0 && bead === 0} aria-label="Previous bead">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button type="button" className="tap h-12 flex-1 rounded-2xl text-base" onClick={advance}>
              {step.repeat > 1 ? `Next bead (${bead + 1} of ${step.repeat})` : "Next"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function AngelusCard() {
  const easter = isPaschaltide(new Date());
  const prayer = easter ? reginaCaeli : angelus;
  const name = easter ? "Regina Caeli" : "The Angelus";
  const reading = useReadAloud();
  const spoken = prayer.lines.map((line) => line.replace(/^[VR]\. /, "").replace("Hail Mary…", rosaryPrayers.hailMary));

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {easter
              ? "From Pascha to Pentecost this is said in place of the Angelus."
              : "Traditionally prayed morning, noon and evening, remembering the Incarnation."}
          </p>
        </div>
        {canReadAloud() ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => (reading.title === name ? stopReadAloud() : startReadAloud(name, spoken))}
          >
            {reading.title === name ? <Square className="mr-1.5 h-4 w-4" /> : <Volume2 className="mr-1.5 h-4 w-4" />}
            {reading.title === name ? "Stop" : "Read it to me"}
          </Button>
        ) : null}
      </div>
      <Separator className="my-4" />
      <div className="grid gap-2 text-[15px] leading-relaxed">
        {prayer.lines.map((line, index) => (
          <p key={index} className={cn(line.startsWith("R.") && "font-semibold", line.startsWith("Let us pray") && "mt-2")}>
            {line}
          </p>
        ))}
      </div>
    </Card>
  );
}

// Pray > Rosary: Western Rite devotions to the Mother of God.
export function RosaryGuide() {
  return (
    <div className="grid gap-4 sm:gap-5">
      <WesternRiteNote />
      <RosaryCounter />
      <AngelusCard />
    </div>
  );
}
