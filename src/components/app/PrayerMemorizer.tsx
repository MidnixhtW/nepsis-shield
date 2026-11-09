import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, ChevronLeft, ChevronRight, Eye, EyeOff, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PRAYER_GROUPS, PRAYERS_TO_LEARN, findPrayerToLearn, type PrayerToLearn } from "@/content/prayersToLearn";
import {
  STEPS,
  dueReviews,
  finishReview,
  finishStep,
  formatDue,
  getLearnState,
  learnedCount,
  practiceAgain,
  resetPrayer,
  useLearnState,
  type DueReview,
} from "@/lib/learnByHeart";
import { cn } from "@/lib/utils";

const LIST_URL = "/learn?tab=byheart";

// ---- How a section is shown at each step ----

function wordScore(word: string, index: number) {
  let value = index * 31 + 7;
  for (const letter of word) value = (value * 33 + letter.charCodeAt(0)) % 997;
  return value % 100;
}

/** Fade: about half the words become blanks the same length as the word. */
function faded(text: string) {
  return text
    .split(" ")
    .map((word, index) => (wordScore(word, index) < 50 ? word.replace(/[A-Za-z']+/g, (letters) => "_".repeat(letters.length)) : word))
    .join(" ");
}

/** First letters: "Our Father, Who art" becomes "O F, W a". */
function firstLetters(text: string) {
  return text
    .split(" ")
    .map((word) => word.replace(/[A-Za-z']+/, (letters) => letters[0]))
    .join(" ");
}

/** Pieces to tap in order: single words for a short section, short phrases for a long one. */
function tapPieces(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 12) return words;
  const phrases: string[][] = [[]];
  for (const word of words) {
    phrases[phrases.length - 1].push(word);
    if (/[,;:.!?]$/.test(word)) phrases.push([]);
  }
  return phrases
    .filter((phrase) => phrase.length)
    .flatMap((phrase) => {
      if (phrase.length <= 7) return [phrase.join(" ")];
      const parts = Math.ceil(phrase.length / 6);
      const size = Math.ceil(phrase.length / parts);
      const out: string[] = [];
      for (let start = 0; start < phrase.length; start += size) out.push(phrase.slice(start, start + size).join(" "));
      return out;
    });
}

function shuffled<T>(items: T[]) {
  const out = [...items];
  for (let attempt = 0; attempt < 5; attempt += 1) {
    for (let index = out.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [out[index], out[swap]] = [out[swap], out[index]];
    }
    if (out.length < 2 || out.some((item, index) => item !== items[index])) break;
  }
  return out;
}

/** Tap the pieces of a section in order. One slip is allowed; finishing reports how many slips there were. */
function TapInOrder({ text, onDone }: { text: string; onDone: (slips: number) => void }) {
  const pieces = useMemo(() => tapPieces(text), [text]);
  const pool = useMemo(() => shuffled(pieces.map((piece, index) => ({ piece, id: index }))), [pieces]);
  const [used, setUsed] = useState<number[]>([]);
  const [slips, setSlips] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const placed = used.length;

  function tap(id: number, piece: string) {
    if (placed >= pieces.length) return;
    // Matching by text, so either of two identical words is right.
    if (piece === pieces[placed]) {
      const next = [...used, id];
      setUsed(next);
      setWrong(null);
      if (next.length === pieces.length) onDone(slips);
    } else {
      setSlips((count) => count + 1);
      setWrong(id);
    }
  }

  return (
    <div className="grid gap-4">
      <p className="min-h-24 rounded-2xl border border-border/60 bg-background/45 p-4 font-serif text-lg leading-8 sm:text-xl sm:leading-9" aria-label="Your answer so far">
        {placed ? pieces.slice(0, placed).join(" ") : <span className="text-muted-foreground">Tap the first words…</span>}
      </p>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {wrong !== null ? "Not that one. What comes next?" : slips ? `${slips} slip${slips === 1 ? "" : "s"} so far` : ""}
      </p>
      <div role="group" aria-label="Words to tap" className="flex flex-wrap gap-2">
        {pool.map(({ piece, id }) =>
          used.includes(id) ? null : (
            <button
              key={id}
              type="button"
              onClick={() => tap(id, piece)}
              className={cn(
                "min-h-11 rounded-xl border bg-card px-3 py-2 text-left font-serif text-base transition-colors hover:border-primary/60 hover:bg-primary/10",
                wrong === id && "border-destructive bg-destructive/10",
              )}
            >
              {piece}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

// ---- One prayer, section by section ----

function StepTrack({ level }: { level: number }) {
  return (
    <ol aria-label="Steps" className="grid grid-cols-4 gap-1.5">
      {STEPS.map((step, index) => (
        <li key={step} aria-current={index === level ? "step" : undefined} className="grid gap-1.5">
          <span className={cn("h-1.5 rounded-full", index < level ? "bg-primary" : index === level ? "bg-primary/60" : "bg-muted")} />
          <span className={cn("text-[11px] leading-tight", index === level ? "font-semibold text-foreground" : "text-muted-foreground")}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function SectionPractice({ prayer, section, onNext }: { prayer: PrayerToLearn; section: number; onNext?: () => void }) {
  const state = useLearnState();
  const progress = state[prayer.id]?.[section] ?? { level: 0 };
  const text = prayer.sections[section];
  const [peek, setPeek] = useState(false);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<"learned" | "again" | null>(null);

  if (progress.learned) {
    return (
      <div className="grid gap-4">
        <p className="font-serif text-lg leading-8 sm:text-xl sm:leading-9">{text}</p>
        <p role="status" className="text-sm font-medium text-primary">
          {result === "learned" ? "Learned. " : ""}You know this section. It comes back for review {formatDue(progress.due)}.
        </p>
        <div className="flex flex-wrap gap-2">
          {onNext ? <Button onClick={onNext}>Next section <ChevronRight className="ml-1 h-4 w-4" /></Button> : null}
          <Button variant="outline" onClick={() => { setResult(null); practiceAgain(prayer.id, section); }}>
            <RotateCcw className="mr-2 h-4 w-4" />Practice again
          </Button>
        </div>
      </div>
    );
  }

  const level = Math.min(progress.level, STEPS.length - 1);
  const advance = () => {
    setPeek(false);
    finishStep(prayer.id, section, true);
  };

  return (
    <div className="grid gap-4">
      <StepTrack level={level} />
      {level === 3 ? (
        <>
          <p className="text-sm text-muted-foreground">Now from memory: tap the words in the right order.</p>
          <TapInOrder
            key={round}
            text={text}
            onDone={(slips) => {
              if (slips <= 1) {
                setResult("learned");
                finishStep(prayer.id, section, true);
              } else {
                setResult("again");
              }
            }}
          />
          {result === "again" ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">A few slips. Try it once more.</p>
              <Button variant="outline" onClick={() => { setResult(null); setRound((value) => value + 1); }}>Try again</Button>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {level === 0
              ? "Read it aloud once or twice, slowly."
              : level === 1
                ? "Say the whole section aloud, filling in the missing words."
                : "Only the first letter of each word is left. Say the whole section aloud."}
          </p>
          <p className="min-h-24 rounded-2xl border border-border/60 bg-background/45 p-4 font-serif text-lg leading-8 sm:text-xl sm:leading-9">
            {level === 0 || peek ? text : level === 1 ? faded(text) : firstLetters(text)}
          </p>
          <div className="flex flex-wrap gap-2">
            {level > 0 ? (
              <Button variant="outline" onClick={() => setPeek((value) => !value)}>
                {peek ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {peek ? "Hide it again" : "Show me"}
              </Button>
            ) : null}
            <Button onClick={advance} disabled={peek}>
              <Check className="mr-2 h-4 w-4" />{level === 0 ? "I've read it" : "I said it"}
            </Button>
          </div>
          {peek ? <p className="text-xs text-muted-foreground">Hide it, then say it once without looking to move on.</p> : null}
        </>
      )}
    </div>
  );
}

function PrayerPractice({ prayer }: { prayer: PrayerToLearn }) {
  const state = useLearnState();
  const total = prayer.sections.length;
  const known = learnedCount(state, prayer);
  const [section, setSection] = useState(() => {
    const first = prayer.sections.findIndex((_, index) => !getLearnState()[prayer.id]?.[index]?.learned);
    return first === -1 ? 0 : first;
  });
  const go = (next: number) => setSection(Math.max(0, Math.min(total - 1, next)));

  return (
    <div className="grid min-w-0 gap-4">
      <Link to={LIST_URL} className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary">
        <ChevronLeft className="h-4 w-4" />All prayers
      </Link>
      <Card className="rounded-3xl border p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Learn by heart</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{prayer.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{prayer.hint}</p>
          </div>
          <p className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2 text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Known</span>
            <span className="text-xl font-semibold text-primary">{known} / {total}</span>
          </p>
        </div>
        <Progress value={(known / total) * 100} className="mt-4 h-2" aria-label={`${known} of ${total} sections known`} />
      </Card>

      <Card className="rounded-3xl border p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Section {section + 1} of {total}</p>
          {total > 1 ? (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => go(section - 1)} disabled={section === 0} aria-label="Previous section">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => go(section + 1)} disabled={section === total - 1} aria-label="Next section">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>
        <SectionPractice
          key={`${prayer.id}-${section}`}
          prayer={prayer}
          section={section}
          onNext={section < total - 1 ? () => go(section + 1) : undefined}
        />
      </Card>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="w-fit"><RotateCcw className="mr-2 h-4 w-4" />Start this prayer over</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-[calc(100%_-_2rem)] rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Start {prayer.title} over?</AlertDialogTitle>
            <AlertDialogDescription>This clears every section you know of this prayer, and its reviews, from this device.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep progress</AlertDialogCancel>
            <AlertDialogAction onClick={() => { resetPrayer(prayer.id); setSection(0); }}>Start over</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---- Reviews that are due ----

function ReviewSession() {
  const [queue] = useState<DueReview[]>(() => dueReviews(getLearnState()));
  const [index, setIndex] = useState(0);
  const [outcome, setOutcome] = useState<boolean | null>(null);
  const current = queue[index];

  if (!current) {
    return (
      <Card className="grid gap-3 rounded-3xl border p-5 sm:p-6">
        <h2 className="text-xl font-semibold">{queue.length ? "Review done." : "Nothing to review today."}</h2>
        <p className="text-sm text-muted-foreground">Each section comes back a little later every time you remember it.</p>
        <Button asChild className="w-fit"><Link to={LIST_URL}>All prayers</Link></Button>
      </Card>
    );
  }

  return (
    <div className="grid min-w-0 gap-4">
      <Link to={LIST_URL} className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary">
        <ChevronLeft className="h-4 w-4" />All prayers
      </Link>
      <Card className="grid gap-4 rounded-3xl border p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Review {index + 1} of {queue.length}</p>
          <h2 className="mt-1 text-xl font-semibold">
            {current.prayer.title}
            {current.prayer.sections.length > 1 ? <span className="text-muted-foreground"> · section {current.section + 1}</span> : null}
          </h2>
        </div>
        {outcome === null ? (
          <TapInOrder
            key={index}
            text={current.prayer.sections[current.section]}
            onDone={(slips) => {
              const remembered = slips <= 1;
              finishReview(current.prayer.id, current.section, remembered);
              setOutcome(remembered);
            }}
          />
        ) : (
          <>
            <p className="font-serif text-lg leading-8">{current.prayer.sections[current.section]}</p>
            <p role="status" className="text-sm font-medium text-primary">
              {outcome ? "Remembered. It comes back later next time." : "A few slips. It comes back tomorrow."}
            </p>
            <Button className="w-fit" onClick={() => { setOutcome(null); setIndex((value) => value + 1); }}>
              {index + 1 < queue.length ? "Next" : "Finish"}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

// ---- The list of prayers ----

function PrayerList() {
  const state = useLearnState();
  const due = dueReviews(state);

  return (
    <div className="grid min-w-0 gap-4">
      <Card className="rounded-3xl border p-5 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-tight">Learn by heart.</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          One short section at a time: read it, then say it as the words fade, then from first letters, then tap it in order.
          Learned sections come back for a quick review after 1, 3, 7, 14 and 30 days.
        </p>
        {due.length ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <p className="min-w-0 flex-1 text-sm font-semibold">{due.length} section{due.length === 1 ? "" : "s"} to review today</p>
            <Button asChild className="rounded-full"><Link to={`${LIST_URL}&review=1`}>Start review</Link></Button>
          </div>
        ) : null}
      </Card>
      {PRAYER_GROUPS.map((group) => (
        <section key={group.id} aria-label={group.title} className="grid gap-2">
          <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.title}</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {PRAYERS_TO_LEARN.filter((prayer) => prayer.group === group.id).map((prayer) => {
              const known = learnedCount(state, prayer);
              const total = prayer.sections.length;
              const status = known === total ? "Known" : known ? `${known} of ${total} sections` : total === 1 ? "1 section" : `${total} sections`;
              return (
                <li key={prayer.id}>
                  <Link
                    to={`${LIST_URL}&prayer=${prayer.id}`}
                    className="grid h-full gap-1 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{prayer.title}</span>
                      <span className={cn("shrink-0 text-xs", known === total ? "font-semibold text-primary" : "text-muted-foreground")}>
                        {known === total ? <Check aria-hidden className="mr-1 inline h-3.5 w-3.5" /> : null}{status}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">{prayer.hint}</span>
                    {known && known < total ? <Progress value={(known / total) * 100} className="mt-1 h-1" aria-hidden /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Learn > Learn by heart. ?prayer= opens one prayer, ?review=1 runs the reviews due today. */
export function PrayerMemorizer({ defaultPrayer }: { defaultPrayer?: string }) {
  const [params] = useSearchParams();
  if (params.get("review")) return <ReviewSession />;
  const prayer = findPrayerToLearn(params.get("prayer") ?? defaultPrayer);
  return prayer ? <PrayerPractice key={prayer.id} prayer={prayer} /> : <PrayerList />;
}
