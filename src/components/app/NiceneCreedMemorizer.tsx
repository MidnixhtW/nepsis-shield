import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const CREED_LINES = [
  "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
  "And in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages: Light of Light, true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made.",
  "Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried.",
  "And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again with glory to judge the living and the dead; Whose kingdom shall have no end.",
  "And in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshiped and glorified; Who spoke by the prophets.",
  "In one, holy, catholic, and apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead, and the life of the age to come. Amen.",
] as const;

const STORAGE_KEY = "orthodox-app:nicene-creed-progress:v1";
type Mode = "hide" | "quiz" | "recite";
type SavedProgress = { completedLines: number[]; bestQuiz: number };

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function wordScore(word: string, wordIndex: number, lineIndex: number) {
  let value = lineIndex * 47 + wordIndex * 31;
  for (const letter of word) value = (value * 33 + letter.charCodeAt(0)) % 997;
  return value % 100;
}

function hiddenWord(word: string) {
  return word.replace(/[A-Za-z]+/g, (letters) => "•".repeat(Math.max(2, letters.length)));
}

function quizIndexes(line: string, lineIndex: number) {
  const words = line.split(" ");
  const candidates = words
    .map((word, index) => ({ index, length: normalize(word).length }))
    .filter(({ length }) => length >= 4)
    .sort((a, b) => wordScore(words[b.index], b.index, lineIndex) - wordScore(words[a.index], a.index, lineIndex));
  return candidates.slice(0, Math.min(4, Math.max(2, Math.round(words.length / 10)))).map(({ index }) => index).sort((a, b) => a - b);
}

function loadProgress(): SavedProgress {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<SavedProgress> | null;
    return {
      completedLines: Array.isArray(parsed?.completedLines)
        ? parsed.completedLines.filter((line) => Number.isInteger(line) && line >= 0 && line < CREED_LINES.length)
        : [],
      bestQuiz: typeof parsed?.bestQuiz === "number" ? Math.max(0, Math.min(100, parsed.bestQuiz)) : 0,
    };
  } catch {
    return { completedLines: [], bestQuiz: 0 };
  }
}

export function NiceneCreedMemorizer() {
  const [mode, setMode] = useState<Mode>("hide");
  const [hidePercent, setHidePercent] = useState(30);
  const [lineIndex, setLineIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState<SavedProgress>(loadProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Practice remains fully usable without persistence.
    }
  }, [progress]);

  const currentLine = CREED_LINES[lineIndex];
  const currentWords = useMemo(() => currentLine.split(" "), [currentLine]);
  const blanks = useMemo(() => quizIndexes(currentLine, lineIndex), [currentLine, lineIndex]);
  const correctCount = checked
    ? blanks.filter((index) => normalize(answers[index] ?? "") === normalize(currentWords[index])).length
    : 0;
  const completion = Math.round((progress.completedLines.length / CREED_LINES.length) * 100);

  const selectLine = (next: number) => {
    setLineIndex(Math.max(0, Math.min(CREED_LINES.length - 1, next)));
    setRevealed(false);
    setAnswers({});
    setChecked(false);
  };

  const markLineComplete = () => {
    setProgress((current) => ({
      ...current,
      completedLines: current.completedLines.includes(lineIndex)
        ? current.completedLines
        : [...current.completedLines, lineIndex].sort((a, b) => a - b),
    }));
  };

  const checkQuiz = () => {
    const score = Math.round(
      (blanks.filter((index) => normalize(answers[index] ?? "") === normalize(currentWords[index])).length / blanks.length) * 100,
    );
    setChecked(true);
    setProgress((current) => ({ ...current, bestQuiz: Math.max(current.bestQuiz, score) }));
    if (score === 100) markLineComplete();
  };

  const resetProgress = () => {
    setProgress({ completedLines: [], bestQuiz: 0 });
    selectLine(0);
  };

  return (
    <div className="grid min-w-0 gap-4">
      <Card className="premium-surface overflow-hidden rounded-[1.5rem] p-4 sm:rounded-[1.75rem] sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:justify-between">
          <div className="min-w-0 max-w-2xl">
            <p className="premium-eyebrow">The Symbol of Faith</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Nicene Creed Memorizer</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Learn the Orthodox liturgical text gradually. Practice one section at a time, without rushing.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mastered</p>
            <p className="mt-1 text-2xl font-semibold text-primary">{progress.completedLines.length} / {CREED_LINES.length}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <Progress value={completion} className="h-2" aria-label={`${completion}% mastered`} />
          <span className="w-10 text-right text-xs font-medium text-muted-foreground">{completion}%</span>
        </div>
      </Card>

      <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <TabsList className="premium-tabs">
          <TabsTrigger value="hide" className="min-h-10 rounded-xl px-3 text-xs sm:text-sm">Hide words</TabsTrigger>
          <TabsTrigger value="quiz" className="min-h-10 rounded-xl px-3 text-xs sm:text-sm">Fill blanks</TabsTrigger>
          <TabsTrigger value="recite" className="min-h-10 rounded-xl px-3 text-xs sm:text-sm">Recite</TabsTrigger>
        </TabsList>

        <Card className="mt-4 min-w-0 rounded-[1.5rem] border-border/60 bg-card p-4 shadow-sm sm:rounded-[1.75rem] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Section {lineIndex + 1} of {CREED_LINES.length}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {progress.completedLines.includes(lineIndex) ? "Marked as mastered" : "Still practicing"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => selectLine(lineIndex - 1)} disabled={lineIndex === 0} aria-label="Previous section">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => selectLine(lineIndex + 1)} disabled={lineIndex === CREED_LINES.length - 1} aria-label="Next section">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="hide" className="mt-0 min-w-0 grid gap-5">
            <div className="min-w-0 rounded-2xl border border-border/60 bg-background/45 p-4 sm:p-5">
              <p className="font-serif text-base leading-8 text-foreground sm:text-xl sm:leading-9">
                {currentWords.map((word, index) => (
                  <span key={`${word}-${index}`} className={cn(wordScore(word, index, lineIndex) < hidePercent && "text-muted-foreground")}>
                    {wordScore(word, index, lineIndex) < hidePercent ? hiddenWord(word) : word}{" "}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <div className="mb-3 flex justify-between text-sm">
                <span className="font-medium">Words hidden</span>
                <span className="text-muted-foreground">{hidePercent}%</span>
              </div>
              <Slider value={[hidePercent]} onValueChange={([value]) => setHidePercent(value)} min={0} max={100} step={10} aria-label="Percentage of words hidden" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setHidePercent(0)}><Eye className="mr-2 h-4 w-4" />Show all</Button>
                <Button variant="outline" onClick={() => setHidePercent(100)}><EyeOff className="mr-2 h-4 w-4" />Hide all</Button>
                <Button onClick={markLineComplete}><Check className="mr-2 h-4 w-4" />I know this section</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0 min-w-0 grid gap-5">
            <p className="text-sm text-muted-foreground">Type each missing word, then check your answers.</p>
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-3 rounded-2xl border border-border/60 bg-background/45 p-4 font-serif text-base leading-8 sm:p-5 sm:text-xl sm:leading-9">
              {currentWords.map((word, index) => {
                if (!blanks.includes(index)) return <span key={`${word}-${index}`}>{word}</span>;
                const correct = normalize(answers[index] ?? "") === normalize(word);
                return (
                  <Input
                    key={`${word}-${index}`}
                    value={answers[index] ?? ""}
                    onChange={(event) => { setAnswers((current) => ({ ...current, [index]: event.target.value })); setChecked(false); }}
                    className={cn("inline-flex h-9 w-24 rounded-lg px-2 font-sans text-sm sm:w-28", checked && (correct ? "border-emerald-600 bg-emerald-500/10" : "border-destructive bg-destructive/10"))}
                    aria-label={`Missing word ${blanks.indexOf(index) + 1}`}
                    autoCapitalize="none"
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={checkQuiz} disabled={blanks.some((index) => !answers[index]?.trim())}>Check answers</Button>
              {checked && <p className={cn("text-sm font-medium", correctCount === blanks.length ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground")}>
                {correctCount === blanks.length ? "Perfect — this section is marked as mastered." : `${correctCount} of ${blanks.length} correct. Keep going.`}
              </p>}
            </div>
          </TabsContent>

          <TabsContent value="recite" className="mt-0 grid gap-5">
            <div className="min-h-48 rounded-2xl border border-border/60 bg-background/45 p-5">
              {revealed ? (
                <p className="font-serif text-lg leading-9 sm:text-xl">{currentLine}</p>
              ) : (
                <div className="grid min-h-36 place-items-center text-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Begin with this cue</p>
                    <p className="mt-3 font-serif text-2xl text-primary">{currentWords.slice(0, 3).join(" ")}…</p>
                    <p className="mt-4 text-sm text-muted-foreground">Recite the rest aloud or silently, then reveal the text.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setRevealed((value) => !value)}>
                {revealed ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {revealed ? "Hide text" : "Reveal text"}
              </Button>
              {revealed && <Button onClick={() => { markLineComplete(); selectLine(lineIndex + 1); }}>
                <Check className="mr-2 h-4 w-4" />I recited it correctly
              </Button>}
            </div>
          </TabsContent>
        </Card>
      </Tabs>

      <Card className="rounded-2xl border-border/60 bg-card p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Trophy className="h-4 w-4" /></span>
            <div><p className="text-sm font-semibold">Best fill-in score: {progress.bestQuiz}%</p><p className="text-xs text-muted-foreground">Progress is saved automatically on this device.</p></div>
          </div>
          <Button variant="ghost" size="sm" onClick={resetProgress}><RotateCcw className="mr-2 h-4 w-4" />Reset progress</Button>
        </div>
      </Card>
    </div>
  );
}
