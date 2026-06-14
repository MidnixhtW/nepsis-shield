import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Compass, Hand, Heart, MoonStar, ShieldAlert, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { showSuccess } from "@/utils/toast";

const STORE_KEY = "personalized-path:v1";

type Need = "peace" | "discipline" | "scripture" | "temptation" | "sleep" | "learn";
type TimeChoice = "2" | "5" | "10" | "20";

type PathPrefs = {
  need: Need;
  time: TimeChoice;
  savedAt: number;
};

const needs: Array<{ id: Need; label: string; icon: typeof Heart; line: string }> = [
  { id: "peace", label: "Peace", icon: Heart, line: "Calm, prayer, and steadiness." },
  { id: "discipline", label: "Discipline", icon: Compass, line: "A small daily rule." },
  { id: "scripture", label: "Scripture", icon: BookOpen, line: "Read and reflect." },
  { id: "temptation", label: "Temptation", icon: ShieldAlert, line: "Interrupt the spiral." },
  { id: "sleep", label: "Sleep", icon: MoonStar, line: "End the day gently." },
  { id: "learn", label: "Learn", icon: Sparkles, line: "Understand the faith." },
];

const timeChoices: Array<{ id: TimeChoice; label: string }> = [
  { id: "2", label: "2 min" },
  { id: "5", label: "5 min" },
  { id: "10", label: "10 min" },
  { id: "20", label: "20 min" },
];

const routes: Record<Need, Array<{ label: string; line: string; to: string; icon: typeof Hand }>> = {
  peace: [
    { label: "Jesus Prayer", line: "Begin with repetition and breath.", to: "/pray?tab=counter", icon: Hand },
    { label: "Sleep Mode", line: "Use at night when your mind will not settle.", to: "/pray?tab=sleep", icon: MoonStar },
    { label: "Journal", line: "Write one sentence and let it rest.", to: "/pray?tab=journal", icon: Compass },
  ],
  discipline: [
    { label: "Daily Prayer", line: "The simplest repeatable rule.", to: "/pray?tab=daily", icon: Hand },
    { label: "Challenges", line: "Choose a 7 or 14 day path.", to: "/learn?tab=challenges", icon: CheckCircle2 },
    { label: "Reading Plans", line: "Add Scripture without overload.", to: "/read?read=plans", icon: BookOpen },
  ],
  scripture: [
    { label: "Daily Readings", line: "Start with what the Church gives today.", to: "/read?read=daily", icon: BookOpen },
    { label: "Bible", line: "Browse a passage directly.", to: "/read?read=bible", icon: BookOpen },
    { label: "Journal", line: "Save one phrase to carry.", to: "/pray?tab=journal", icon: Compass },
  ],
  temptation: [
    { label: "Jesus Prayer", line: "A fast interruption for the moment.", to: "/pray?tab=counter", icon: Hand },
    { label: "Prep", line: "Examine patterns without despair.", to: "/pray?tab=prep", icon: ShieldAlert },
    { label: "Watchfulness Challenge", line: "Train attention over time.", to: "/learn?tab=challenges", icon: CheckCircle2 },
  ],
  sleep: [
    { label: "Sleep Mode", line: "Night prayer, dim screen, timer.", to: "/pray?tab=sleep", icon: MoonStar },
    { label: "Evening Prayer", line: "Use the daily prayer flow at night.", to: "/pray?tab=daily", icon: Hand },
    { label: "Stillness", line: "A quiet timer if sleep is delayed.", to: "/pray?tab=counter", icon: Clock },
  ],
  learn: [
    { label: "Start Guide", line: "The simplest overview.", to: "/learn?tab=welcome", icon: Sparkles },
    { label: "Q&A", line: "Search practical questions.", to: "/learn?tab=qa", icon: Compass },
    { label: "Liturgy Help", line: "Understand worship step by step.", to: "/learn?tab=liturgy", icon: BookOpen },
  ],
};

function readPrefs(): PathPrefs {
  return getStoredItem<PathPrefs>(STORE_KEY) ?? { need: "peace", time: "5", savedAt: Date.now() };
}

export function PersonalizedPath() {
  const [prefs, setPrefs] = useState(readPrefs);

  const selectedNeed = needs.find((need) => need.id === prefs.need) ?? needs[0];
  const recommendations = useMemo(() => routes[prefs.need], [prefs.need]);
  const minutes = Number(prefs.time);
  const main = recommendations[0];

  function update(next: Partial<PathPrefs>) {
    const updated = { ...prefs, ...next, savedAt: Date.now() };
    setPrefs(updated);
    setStoredItem(STORE_KEY, updated);
  }

  function save() {
    setStoredItem(STORE_KEY, prefs);
    showSuccess("Your path was saved.");
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Personal path</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Tell the app what you need.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Pick your main need and available time. The app will give you a simple starting path.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs font-semibold">
            {selectedNeed.label} · {prefs.time} min
          </Badge>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-sm font-semibold">What do you need most right now?</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {needs.map((need) => {
              const Icon = need.icon;
              const active = prefs.need === need.id;
              return (
                <button
                  key={need.id}
                  type="button"
                  className={active ? "rounded-3xl border border-primary/40 bg-primary/10 p-4 text-left shadow-sm" : "rounded-3xl border border-border/60 bg-background/50 p-4 text-left hover:border-primary/30"}
                  onClick={() => update({ need: need.id })}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4 text-primary" /> {need.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{need.line}</span>
                </button>
              );
            })}
          </div>

          <Separator className="my-5" />

          <p className="text-sm font-semibold">How much time do you realistically have?</p>
          <ToggleGroup type="single" value={prefs.time} onValueChange={(v) => v && update({ time: v as TimeChoice })} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {timeChoices.map((choice) => (
              <ToggleGroupItem key={choice.id} value={choice.id} className="rounded-2xl border border-border/60 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                {choice.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Recommended</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight">Your {minutes}-minute path</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Start with {main.label.toLowerCase()}. Keep it small enough to actually do.
          </p>

          <div className="mt-4 grid gap-2">
            {recommendations.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button key={item.to} asChild variant={index === 0 ? "default" : "outline"} className="h-auto justify-start rounded-2xl px-4 py-3 text-left">
                  <Link to={item.to}>
                    <Icon className="mr-3 h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{item.label}</span>
                      <span className="mt-0.5 block whitespace-normal text-xs font-normal opacity-80">{item.line}</span>
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
                  </Link>
                </Button>
              );
            })}
          </div>

          <Button type="button" variant="secondary" className="mt-4 w-full rounded-2xl" onClick={save}>
            Save this path
          </Button>
        </Card>
      </div>
    </div>
  );
}
