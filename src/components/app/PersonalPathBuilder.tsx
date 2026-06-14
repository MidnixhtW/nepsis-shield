import { useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Clock, Hand, Heart, MoonStar, ShieldAlert, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { showSuccess } from "@/utils/toast";

type Need = "peace" | "discipline" | "scripture" | "temptation" | "sleep" | "learn";
type Time = "2" | "5" | "10" | "20";

type Profile = {
  need: Need;
  time: Time;
};

const STORE_KEY = "personal_path:v1";

const needs: Array<{ id: Need; label: string; helper: string; icon: typeof Heart }> = [
  { id: "peace", label: "Peace", helper: "Calm anxiety and return to prayer.", icon: Heart },
  { id: "discipline", label: "Discipline", helper: "Build a steady daily rule.", icon: Target },
  { id: "scripture", label: "Scripture", helper: "Read and remember the Word.", icon: BookOpen },
  { id: "temptation", label: "Temptation", helper: "Interrupt spirals quickly.", icon: ShieldAlert },
  { id: "sleep", label: "Sleep", helper: "End the day without doom-scrolling.", icon: MoonStar },
  { id: "learn", label: "Learn", helper: "Understand Orthodoxy step by step.", icon: Sparkles },
];

const times: Array<{ id: Time; label: string }> = [
  { id: "2", label: "2 min" },
  { id: "5", label: "5 min" },
  { id: "10", label: "10 min" },
  { id: "20", label: "20 min" },
];

const planMap: Record<Need, Record<Time, Array<{ label: string; detail: string; to: string; icon: typeof Hand }>>> = {
  peace: {
    "2": [{ label: "Jesus Prayer", detail: "Two quiet minutes with the prayer counter.", to: "/pray?tab=counter", icon: Hand }],
    "5": [{ label: "Short daily prayer", detail: "Use the short rule, then pause before moving on.", to: "/pray?tab=daily", icon: Hand }],
    "10": [{ label: "Prayer + reflection", detail: "Pray, then write one sentence about what you need to surrender.", to: "/pray?tab=journal", icon: Heart }],
    "20": [{ label: "Full reset", detail: "Daily prayer, reading, and stillness practice.", to: "/pray?tab=daily", icon: Target }],
  },
  discipline: {
    "2": [{ label: "Minimum rule", detail: "Open Daily and complete one short prayer.", to: "/pray?tab=daily", icon: Hand }],
    "5": [{ label: "Daily mission", detail: "Complete Pray and Read from Today.", to: "/today", icon: Target }],
    "10": [{ label: "Prayer rule", detail: "Build a stable rule you can actually keep.", to: "/pray?tab=rule", icon: Target }],
    "20": [{ label: "Challenge path", detail: "Start 14 Days of Watchfulness.", to: "/learn?tab=challenges", icon: ShieldAlert }],
  },
  scripture: {
    "2": [{ label: "One reading", detail: "Open today’s reading and carry one phrase.", to: "/read?read=daily", icon: BookOpen }],
    "5": [{ label: "Daily readings", detail: "Read slowly and stop at one phrase.", to: "/read?read=daily", icon: BookOpen }],
    "10": [{ label: "Reading plan", detail: "Pick a plan and keep it small.", to: "/read?read=plans", icon: BookOpen }],
    "20": [{ label: "Bible + journal", detail: "Read, then write one line of response.", to: "/pray?tab=journal", icon: Heart }],
  },
  temptation: {
    "2": [{ label: "Interrupt now", detail: "Open Jesus Prayer before the spiral grows.", to: "/pray?tab=counter", icon: ShieldAlert }],
    "5": [{ label: "Prep check", detail: "Use confession prep to name the pattern honestly.", to: "/pray?tab=prep", icon: ShieldAlert }],
    "10": [{ label: "Watchfulness challenge", detail: "Begin a structured path of attention and return.", to: "/learn?tab=challenges", icon: Target }],
    "20": [{ label: "Prayer + prep", detail: "Pray, examine, then write one concrete next step.", to: "/pray?tab=prep", icon: Hand }],
  },
  sleep: {
    "2": [{ label: "Entrustment", detail: "Use the final Sleep Mode prayer and stop scrolling.", to: "/pray?tab=sleep", icon: MoonStar }],
    "5": [{ label: "Sleep Mode", detail: "Complete the short evening review.", to: "/pray?tab=sleep", icon: MoonStar }],
    "10": [{ label: "Sleep + review", detail: "Use every step and answer each review prompt.", to: "/pray?tab=sleep", icon: MoonStar }],
    "20": [{ label: "Night reset", detail: "Sleep Mode plus a quiet Psalm.", to: "/pray?tab=sleep", icon: BookOpen }],
  },
  learn: {
    "2": [{ label: "One answer", detail: "Search one question and stop there.", to: "/learn?tab=qa", icon: Sparkles }],
    "5": [{ label: "Starter guide", detail: "Read one small guide section.", to: "/learn?tab=guide", icon: Sparkles }],
    "10": [{ label: "Liturgy help", detail: "Learn one part of the service.", to: "/learn?tab=liturgy", icon: Sparkles }],
    "20": [{ label: "Welcome path", detail: "Use the full beginner overview.", to: "/learn?tab=welcome", icon: Sparkles }],
  },
};

export function PersonalPathBuilder() {
  const [profile, setProfile] = useState<Profile>(() => getStoredItem<Profile>(STORE_KEY) ?? { need: "peace", time: "5" });
  const selectedNeed = needs.find((need) => need.id === profile.need) ?? needs[0];
  const plan = useMemo(() => planMap[profile.need][profile.time], [profile]);

  function save(next: Profile) {
    setProfile(next);
    setStoredItem(STORE_KEY, next);
  }

  function saveAndConfirm() {
    setStoredItem(STORE_KEY, profile);
    showSuccess("Personal path saved.");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Personal path</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">What do you need most?</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Choose one focus and the amount of time you can actually keep. The app will recommend a simple next step.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {needs.map((need) => {
            const Icon = need.icon;
            const active = profile.need === need.id;
            return (
              <button
                key={need.id}
                type="button"
                className={active ? "rounded-2xl border border-primary/35 bg-primary/10 p-3 text-left" : "rounded-2xl border border-border/60 bg-background/60 p-3 text-left hover:bg-muted/60"}
                onClick={() => save({ ...profile, need: need.id })}
              >
                <div className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="block text-sm font-semibold">{need.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{need.helper}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <p className="text-sm font-semibold">How much time?</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {times.map((time) => (
              <Button
                key={time.id}
                type="button"
                variant={profile.time === time.id ? "default" : "outline"}
                className="rounded-2xl"
                onClick={() => save({ ...profile, time: time.id })}
              >
                {time.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Recommended for you</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{selectedNeed.label} · {profile.time} min</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Keep it small enough to repeat tomorrow.</p>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <Clock className="mr-1.5 h-3.5 w-3.5" /> Daily
          </Badge>
        </div>

        <div className="mt-5 grid gap-3">
          {plan.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-3xl border border-primary/15 bg-primary/5 p-4">
                <div className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
                <Button asChild className="mt-4 h-11 w-full rounded-2xl">
                  <Link to={item.to}>Start this path</Link>
                </Button>
              </div>
            );
          })}
        </div>

        <Button type="button" variant="outline" className="mt-4 rounded-2xl" onClick={saveAndConfirm}>
          <CheckCircle2 className="mr-2 h-4 w-4" /> Save my path
        </Button>
      </Card>
    </div>
  );
}
