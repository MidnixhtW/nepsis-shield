import { useMemo, useState } from "react";
import { BellRing, ChevronLeft, ChevronRight, Clock3, Sparkles, TimerReset, Waves, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QUIZ_QUESTIONS = [
  {
    id: "draw",
    question: "What draws you to the desert?",
    options: [
      "Guarding against distracting thoughts (Nepsis)",
      "Learning the prayers of the Church",
      "Building a silent, daily prayer habit",
    ],
  },
  {
    id: "struggle",
    question: "What is your primary spiritual struggle right now?",
    options: ["Anxiety / Restlessness (Akedia)", "Anger / Frustration", "Pride / Self-Reliance", "Wandering thoughts (Logismoi)"],
  },
  {
    id: "timing",
    question: "When do you find it hardest to stay watchful?",
    options: ["In the noise of the morning", "During my work / night shift", "Right before sleep"],
  },
];

const RULES = [
  {
    title: "Morning",
    body: "5-Minute Morning Offering & Epistle reading.",
  },
  {
    title: "Midday",
    body: "The Tactical Chotki — 33 Jesus Prayers.",
  },
  {
    title: "Night",
    body: "10-Minute Compline & Silent Examen.",
  },
];

type QuestionAnswers = Record<string, string>;

export function MonasticSanctuary() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [showMixer, setShowMixer] = useState(false);

  const track = {
    title: "The Evening Prayer of St. Macarius",
    category: "Compline",
    duration: "10:00",
  };

  const summary = useMemo(() => {
    const struggle = answers.struggle ?? "watchfulness";
    const timing = answers.timing ?? "your hardest hour";

    return {
      title: "Spiritual Rule of Vigilance",
      body: `A gentle rule for ${struggle.toLowerCase()} and ${timing.toLowerCase()}.`,
    };
  }, [answers]);

  function choose(option: string) {
    const key = QUIZ_QUESTIONS[step].id;
    setAnswers((current) => ({ ...current, [key]: option }));
    setStep((current) => Math.min(current + 1, QUIZ_QUESTIONS.length));
  }

  if (!started) {
    return (
      <div className="relative min-h-[100svh] overflow-hidden bg-[#0a0908] text-stone-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent)]" />
        <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
          <div className="mb-8 grid h-24 w-24 place-items-center rounded-full border border-amber-500/20 bg-stone-900/60 shadow-[0_0_60px_rgba(217,119,6,0.18)]">
            <BellRing className="h-11 w-11 text-amber-400" />
          </div>
          <p className="max-w-md text-3xl font-serif italic leading-tight text-stone-100 sm:text-4xl">
            Quiet your heart. Leave the noise of the world behind.
          </p>
          <Button
            className="mt-10 rounded-full border border-amber-400/40 bg-amber-500/10 px-7 py-6 text-sm text-amber-100 backdrop-blur-md hover:bg-amber-500/20"
            onClick={() => setStarted(true)}
          >
            Enter the Sanctuary
          </Button>
        </div>
      </div>
    );
  }

  if (step < QUIZ_QUESTIONS.length) {
    const current = QUIZ_QUESTIONS[step];
    return (
      <div className="min-h-[100svh] bg-[#0c0a09] px-4 py-6 text-stone-100 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100svh-3rem)] max-w-3xl flex-col justify-center">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-400/80">The Pilgrim’s Path</p>
          <h2 className="text-3xl font-serif tracking-tight text-stone-50 sm:text-4xl">{current.question}</h2>
          <div className="mt-6 grid gap-3">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => choose(option)}
                className="rounded-3xl border border-stone-800 bg-stone-900/70 px-4 py-4 text-left text-sm leading-relaxed text-stone-200 transition hover:border-amber-500/40 hover:bg-stone-900"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-[#0c0a09] text-stone-100">
      <div className="mx-auto flex min-h-[100svh] max-w-5xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6">
        <Card className="rounded-[2rem] border-amber-500/15 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.14),transparent_42%),linear-gradient(to_bottom,rgba(28,25,23,0.95),rgba(12,10,9,0.98))] p-5 shadow-[0_0_50px_rgba(217,119,6,0.08)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-400/70">Monastic Sanctuary</p>
              <h1 className="mt-2 text-2xl font-serif text-stone-50 sm:text-4xl">{track.title}</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full text-stone-400 hover:text-stone-100">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 grid place-items-center gap-6 text-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative grid h-64 w-64 place-items-center overflow-hidden rounded-full border border-amber-500/20 bg-stone-900 shadow-[0_0_50px_rgba(217,119,6,0.16)]">
                <img
                  src="/assets/st-michael-icon-intro.png"
                  alt="Saint icon"
                  className="h-full w-full object-cover opacity-90"
                />
              </div>
            </div>

            <div className="max-w-xl space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-400/70">{track.category}</p>
              <h2 className="text-3xl font-serif text-stone-50 sm:text-4xl">The Prayer of Symeon</h2>
              <p className="font-serif text-lg italic leading-relaxed text-stone-300">
                “Lord, now lettest Thou Thy servant depart in peace...”
              </p>
            </div>

            <div className="w-full max-w-md space-y-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                <div className="h-full w-[35%] rounded-full bg-amber-500" />
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-[0.24em] text-stone-500">
                <span>02:14</span>
                <span>{track.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <Button variant="ghost" size="icon" className="rounded-full text-stone-300 hover:text-amber-400">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button className="h-16 w-16 rounded-full bg-amber-500 text-stone-950 hover:bg-amber-400">
                <Sparkles className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-stone-300 hover:text-amber-400">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[2rem] border-stone-800/80 bg-stone-950/70 p-5 backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400/70">Your Rule</p>
                <h3 className="mt-2 text-2xl font-serif text-stone-50">{summary.title}</h3>
              </div>
              <Button variant="outline" className="rounded-full border-amber-500/20 bg-amber-500/10 text-amber-100 hover:bg-amber-500/20">
                Seal this Daily Rule
              </Button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-300">{summary.body}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {RULES.map((rule) => (
                <div key={rule.title} className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-400/70">{rule.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-stone-200">{rule.body}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[2rem] border-stone-800/80 bg-stone-950/70 p-5 backdrop-blur-md sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-400/70">Tools</p>
              <Clock3 className="h-4 w-4 text-stone-500" />
            </div>
            <div className="mt-4 grid gap-3">
              <button className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3 text-left text-sm text-stone-200">
                <span className="flex items-center gap-2"><Waves className="h-4 w-4 text-amber-400" /> Ambient Mixer</span>
                <span className="text-xs text-stone-500">Censer</span>
              </button>
              <button className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3 text-left text-sm text-stone-200">
                <span className="flex items-center gap-2"><TimerReset className="h-4 w-4 text-amber-400" /> Sleep Timer</span>
                <span className="text-xs text-stone-500">10 min</span>
              </button>
              <button
                onClick={() => setShowMixer((current) => !current)}
                className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3 text-left text-sm text-stone-200"
              >
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-400" /> Text Transcript</span>
                <span className="text-xs text-stone-500">Scroll</span>
              </button>
            </div>

            {showMixer ? (
              <div className="mt-4 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-sm leading-relaxed text-stone-300">
                <p className="font-serif italic text-stone-100">“O Lord, keep me from the assault of the enemy...”</p>
                <p className="mt-2">A full prayer transcript can sit here with beautiful drop-cap styling and read-along text.</p>
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
