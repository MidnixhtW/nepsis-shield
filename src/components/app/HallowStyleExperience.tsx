import { useMemo, useState } from "react";
import { ArrowRight, BellRing, BookOpen, Headphones, MoonStar, Sparkles, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAudio } from "@/components/app/AudioProvider";

const questions = [
  {
    title: "What draws you here?",
    options: ["A deeper prayer habit", "Stillness and focus", "Prayer through the day"],
  },
  {
    title: "What is hardest right now?",
    options: ["Anxiety and restlessness", "Wandering thoughts", "Consistency"],
  },
  {
    title: "When do you need this most?",
    options: ["Morning", "Midday", "Before sleep"],
  },
];

export function HallowStyleExperience() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);
  const { currentTrack, isPlaying, playTrack, pauseTrack } = useAudio();

  const track = currentTrack ?? {
    id: "intro",
    title: "Evening Prayer",
    url: "",
    category: "prayer" as const,
  };

  const rule = useMemo(
    () => [
      "Morning: 5-minute offering and psalm",
      "Midday: short Jesus Prayer reset",
      "Night: compline and silence",
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[2rem] border-white/10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_40%),linear-gradient(180deg,rgba(12,10,9,0.98),rgba(12,10,9,0.92))] p-5 text-stone-100 shadow-2xl">
        <div className="mb-6 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-amber-200/70">
          <span>Orthodox sanctuary</span>
          <span>Prayer • Read • Learn</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-white/5 px-3 py-1 text-xs text-amber-100/80 backdrop-blur">
              <BellRing className="h-3.5 w-3.5" /> Enter the sanctuary
            </div>
            <div>
              <p className="text-sm text-stone-300">Quiet your heart. Leave the noise of the world behind.</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">A deeply immersive Orthodox prayer app.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
                Guided prayer, readings, counter, reflections, saints, and learning — wrapped in a premium, candlelit experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="h-12 rounded-full bg-amber-500 px-6 text-stone-950 hover:bg-amber-400" onClick={() => setStep(0)}>
                Enter the sanctuary <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10">
                Unlock daily rule
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-300">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">Your daily rule</p>
                <p className="text-sm text-stone-200">Built from your answers</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm text-stone-300">
              {rule.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[2rem] border-border/60 bg-card/90 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pilgrim's path</p>
              <h2 className="text-lg font-semibold tracking-tight">Aesthetic diagnostic quiz</h2>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {questions.map((q, index) => (
              <div key={q.title} className="space-y-3 rounded-3xl border border-border/60 bg-background/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm font-semibold text-foreground">{q.title}</Label>
                  <span className="text-xs text-muted-foreground">0{index + 1}</span>
                </div>
                <RadioGroup value={answers[index]} onValueChange={(value) => {
                  const next = [...answers];
                  next[index] = value;
                  setAnswers(next);
                }} className="grid gap-2">
                  {q.options.map((option) => (
                    <label key={option} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
                      <RadioGroupItem value={option} />
                      <span>{option}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[2rem] border-border/60 bg-card/90 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Headphones className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Monastic sanctuary player</p>
              <h2 className="text-lg font-semibold tracking-tight">Now playing</h2>
            </div>
          </div>
          <div className="mt-5 rounded-[2rem] bg-gradient-to-b from-stone-950 to-stone-900 p-5 text-stone-100 shadow-inner">
            <div className="mx-auto grid h-44 w-44 place-items-center rounded-full border border-amber-400/20 bg-[radial-gradient(circle,rgba(251,191,36,0.22),rgba(12,10,9,0.75))]">
              <div className="grid h-28 w-28 place-items-center rounded-full border border-amber-300/20 bg-black/30 text-amber-200">
                <MoonStar className="h-12 w-12" />
              </div>
            </div>
            <div className="mt-5 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">{track.category}</p>
              <h3 className="mt-1 text-2xl font-semibold">{track.title}</h3>
              <p className="mt-2 text-sm text-stone-300">Read along, pray along, and settle into a quieter rhythm.</p>
            </div>
            <div className="mt-5 h-1.5 rounded-full bg-white/10">
              <div className="h-full w-[38%] rounded-full bg-amber-500" />
            </div>
            <div className="mt-5 flex items-center justify-center gap-4">
              <Button variant="ghost" className="rounded-full text-stone-300 hover:bg-white/5 hover:text-white">⏮</Button>
              <Button className="h-14 w-14 rounded-full bg-amber-500 text-stone-950 hover:bg-amber-400" onClick={() => (isPlaying ? pauseTrack() : playTrack({ id: "intro", title: track.title, url: "", category: "prayer" }))}>
                {isPlaying ? "⏸" : "▶"}
              </Button>
              <Button variant="ghost" className="rounded-full text-stone-300 hover:bg-white/5 hover:text-white">⏭</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Ambient</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Text</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Timer</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-border/60 bg-card/90 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Custom spiritual rule</p>
            <h2 className="text-lg font-semibold tracking-tight">Seal this daily rule</h2>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Morning offering", "Jesus Prayer counter", "Compline and examen"].map((item) => (
            <div key={item} className="rounded-3xl border border-border/60 bg-background/80 p-4 text-sm text-foreground">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Anonymous pilgrim" className="mt-1 rounded-2xl" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="mt-1 rounded-2xl" />
            </div>
          </div>
          <Button className="h-12 rounded-full bg-primary px-6">
            Seal this daily rule <UserRound className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
