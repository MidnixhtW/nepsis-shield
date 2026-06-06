import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Church,
  HeartHandshake,
  Home,
  Lock,
  Mic,
  MicOff,
  PenLine,
  Send,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { lockPhilokaliaGuide } from "@/lib/philokaliaUnlock";
import { showError, showSuccess } from "@/utils/toast";

type Message = {
  role: "user" | "guide";
  text: string;
};

type PromptCard = {
  title: string;
  body: string;
  icon: React.ReactNode;
};

const sources = [
  {
    title: "OCA – The Orthodox Faith",
    url: "https://www.oca.org/orthodoxy/the-orthodox-faith",
    note: "A broad catechetical library for Scripture, worship, doctrine, spirituality, and Church life.",
  },
  {
    title: "OCA – Questions & Answers",
    url: "https://www.oca.org/questions",
    note: "Practical Orthodox explanations on worship, fasting, confession, parish life, and common questions.",
  },
  {
    title: "OCA – Prayers",
    url: "https://www.oca.org/orthodoxy/prayers",
    note: "Public prayer texts suitable for learning the Church’s language of prayer.",
  },
  {
    title: "OCA – Daily Readings",
    url: "https://www.oca.org/readings",
    note: "Daily Scripture and commemorations for grounding study in the Church calendar.",
  },
];

const promptCards: PromptCard[] = [
  {
    title: "Prayer",
    body: "Help me choose a small prayer rule I can keep without pride or anxiety.",
    icon: <Church className="h-4 w-4" />,
  },
  {
    title: "Learning",
    body: "I am new to Orthodoxy. What should I learn first this week?",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Mercy",
    body: "Give me one practical act of mercy I can do quietly today.",
    icon: <HeartHandshake className="h-4 w-4" />,
  },
  {
    title: "Confession",
    body: "Help me prepare for confession soberly without spiraling into shame.",
    icon: <PenLine className="h-4 w-4" />,
  },
];

function guidanceFor(input: string) {
  const q = input.toLowerCase();
  const priest = "Bring this to your priest or catechist, especially if it touches confession, fasting, your prayer rule, family duties, or a major decision.";

  if (q.includes("confess") || q.includes("confession") || q.includes("sin") || q.includes("shame")) {
    return [
      "Prepare for confession plainly and without drama. Ask: What did I do? What did I avoid doing? Where did I excuse myself? Where did I fail to love God or neighbor?",
      "Do not write a courtroom speech. Write a short list, pray for contrition, and trust Christ’s mercy. Shame says ‘hide’; repentance says ‘return.’",
      "A practical step: read Psalm 50/51, make a brief list, and ask your priest how he prefers confession to be made.",
      priest,
      "Sources to consult: OCA Questions & Answers on confession and repentance; OCA prayer resources for Psalm 50 and preparatory prayers.",
    ].join("\n\n");
  }

  if (q.includes("fast") || q.includes("food") || q.includes("calendar")) {
    return [
      "Treat fasting as medicine, not performance. The aim is prayer, repentance, mercy, and freedom from compulsion — not proving strictness.",
      "Start with the rule your parish actually keeps. If you are new, ill, pregnant, responsible for others, recovering from disordered eating, or under strain, receive guidance rather than inventing a rule alone.",
      "A practical step: choose one concrete obedience today — simplicity at meals, less indulgence, and one act of mercy.",
      priest,
      "Sources to consult: OCA Questions & Answers on fasting; your parish calendar and priest’s guidance.",
    ].join("\n\n");
  }

  if (q.includes("pray") || q.includes("prayer") || q.includes("rule") || q.includes("jesus prayer")) {
    return [
      "Keep prayer small, regular, and honest. A rule that is humble and kept is better than a grand rule abandoned after three days.",
      "A sober beginning: the Trisagion prayers, the Lord’s Prayer, a short Psalm, and a few minutes of the Jesus Prayer with attention. Stop before it becomes theatrical or self-measuring.",
      "If distracted, return gently. The point is not a feeling, but faithfulness before God.",
      priest,
      "Sources to consult: OCA prayer texts; OCA educational material on prayer and spiritual life.",
    ].join("\n\n");
  }

  if (q.includes("learn") || q.includes("catechumen") || q.includes("new") || q.includes("orthodox")) {
    return [
      "Learn Orthodoxy through worship, Scripture, parish life, and patient instruction — not by collecting online opinions.",
      "A good first order: attend services, read the Gospel daily, learn the Creed, ask simple questions, and slowly study the Church’s teaching on Christ, prayer, repentance, sacraments, and the life of mercy.",
      "Do not rush to master every controversy. Stability matters more than intensity.",
      priest,
      "Sources to consult: OCA ‘The Orthodox Faith’, OCA Questions & Answers, and the teaching offered in your parish.",
    ].join("\n\n");
  }

  if (q.includes("mercy") || q.includes("serve") || q.includes("help") || q.includes("neighbor")) {
    return [
      "Mercy should become concrete and quiet. Begin near you: family, parish, workplace, the poor, the lonely, the sick, and anyone you would rather avoid.",
      "A practical rule for today: do one hidden good work, speak one fewer harsh word, and pray for one person without announcing it.",
      "Mercy is not activism for self-image. It is love practiced under the eyes of God.",
      priest,
      "Sources to consult: OCA teaching on Christian life, charity, repentance, and parish life.",
    ].join("\n\n");
  }

  return [
    "Here is a sober way to begin: simplify the question, pray briefly, and choose the next faithful step rather than searching for a dramatic answer.",
    "Orthodox guidance is usually concrete: pray, repent, attend the services, read Scripture with the Church, practice mercy, confess honestly, and avoid spiritual self-reliance.",
    "If this question concerns your conscience, confession, fasting, spiritual rule, relationships, or a serious decision, do not settle it through an app alone.",
    priest,
    "Sources to consult: OCA ‘The Orthodox Faith’, OCA Questions & Answers, OCA prayers, and your parish priest or catechist.",
  ].join("\n\n");
}

function SectionCard({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Card className="rounded-3xl border-border/60 bg-card/90 p-5 text-card-foreground shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">{icon}</span>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <Separator className="my-4" />
      {children}
    </Card>
  );
}

function CalmNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/55 p-4">
      <p className="font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export default function PhilokaliaGuide() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "guide",
      text: "Peace be with you. I can offer practical, source-minded Orthodox guidance for prayer, learning, mercy, and confession preparation. I am not a replacement for your priest.",
    },
  ]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const supportsVoice = useMemo(() => {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }, []);

  function askGuide(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "guide", text: guidanceFor(trimmed) },
    ]);
    setInput("");
  }

  function startVoice() {
    if (!supportsVoice) {
      showError("Voice dictation is not available in this browser.");
      return;
    }

    const SpeechRecognitionCtor = (window as unknown as {
      SpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
    }).SpeechRecognition ?? (window as unknown as {
      webkitSpeechRecognition?: new () => {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
    }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput((current) => [current, transcript].filter(Boolean).join(" "));
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function lockAgain() {
    lockPhilokaliaGuide();
    showSuccess("Philokalia Guide hidden again.");
    navigate("/today", { replace: true });
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div aria-hidden className="tactical-radar-field pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),transparent_34rem)]" />
        <div className="radar-scope radar-scope-primary" />
        <div className="radar-scope radar-scope-secondary" />
        <div className="absolute inset-0 tactical-scanlines" />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-24 pt-5 sm:px-5">
        <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
              Hidden companion
            </Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Philokalia Guide</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A sober Orthodox guide for prayer, learning, mercy, confession preparation, and source-based education. Confirm spiritual counsel with your priest.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-2xl border-border/60 bg-background/55">
              <Link to="/today"><Home className="mr-2 h-4 w-4" /> Main app</Link>
            </Button>
            <Button type="button" variant="outline" className="rounded-2xl border-border/60 bg-background/55" onClick={lockAgain}>
              <Lock className="mr-2 h-4 w-4" /> Hide again
            </Button>
          </div>
        </header>

        <div className="mt-5 rounded-3xl border border-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl sm:p-4">
          <Tabs defaultValue="ask" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl bg-muted/20 p-1 sm:grid-cols-6">
              <TabsTrigger value="ask" className="rounded-xl">Ask</TabsTrigger>
              <TabsTrigger value="prayer" className="rounded-xl">Prayer</TabsTrigger>
              <TabsTrigger value="learn" className="rounded-xl">Learn</TabsTrigger>
              <TabsTrigger value="mercy" className="rounded-xl">Mercy</TabsTrigger>
              <TabsTrigger value="confess" className="rounded-xl">Confess</TabsTrigger>
              <TabsTrigger value="sources" className="rounded-xl">Sources</TabsTrigger>
            </TabsList>

            <TabsContent value="ask" className="mt-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                <SectionCard title="Ask Philokalia Guide" icon={<Sprout className="h-4 w-4" />}>
                  <div className="space-y-3">
                    <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
                      {messages.map((message, index) => (
                        <div
                          key={`${message.role}-${index}`}
                          className={
                            "rounded-2xl border p-4 text-sm leading-relaxed " +
                            (message.role === "guide"
                              ? "border-border/60 bg-background/60 text-foreground"
                              : "ml-6 border-primary/25 bg-primary/10 text-foreground")
                          }
                        >
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            {message.role === "guide" ? "Philokalia Guide" : "You"}
                          </p>
                          <p className="whitespace-pre-line">{message.text}</p>
                        </div>
                      ))}
                    </div>

                    <Textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      placeholder="Ask about prayer, learning, mercy, fasting, confession preparation, or parish life..."
                      className="min-h-28 rounded-2xl border-border/60 bg-background/70 text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" className="rounded-2xl" onClick={() => askGuide()}>
                        <Send className="mr-2 h-4 w-4" /> Ask
                      </Button>
                      <Button type="button" variant="outline" className="rounded-2xl border-border/60 bg-background/55" onClick={listening ? stopVoice : startVoice}>
                        {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {listening ? "Stop dictation" : "Voice dictation"}
                      </Button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Quiet prompts" icon={<ShieldCheck className="h-4 w-4" />}>
                  <div className="grid gap-2">
                    {promptCards.map((card) => (
                      <button
                        key={card.title}
                        type="button"
                        className="rounded-2xl border border-border/60 bg-background/55 p-4 text-left transition-colors hover:border-primary/35 hover:bg-muted/60"
                        onClick={() => askGuide(card.body)}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <span className="text-primary">{card.icon}</span> {card.title}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{card.body}</span>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </TabsContent>

            <TabsContent value="prayer" className="mt-4">
              <SectionCard title="Prayer without spiritual noise" icon={<Church className="h-4 w-4" />}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <CalmNote title="Begin small" body="Trisagion prayers, the Lord’s Prayer, one Psalm, and a few minutes of the Jesus Prayer." />
                  <CalmNote title="Keep attention" body="When distracted, return gently. Do not measure prayer by emotion or novelty." />
                  <CalmNote title="Ask blessing" body="Let your priest help shape your rule so it is obedient, merciful, and sustainable." />
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="learn" className="mt-4">
              <SectionCard title="Source-based Orthodox learning" icon={<BookOpen className="h-4 w-4" />}>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>Learn through the Church: worship, Scripture, parish instruction, tested catechetical sources, and patience.</p>
                  <p>A good weekly rhythm: attend services, read the Gospel, learn the Creed, review one OCA article, and write one question for your priest or catechist.</p>
                  <p>Avoid treating the internet as a spiritual elder. Use sources to become teachable, not argumentative.</p>
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="mercy" className="mt-4">
              <SectionCard title="Mercy practiced quietly" icon={<HeartHandshake className="h-4 w-4" />}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Pray for someone who irritates you before speaking about them.",
                    "Do one hidden act of help at home, parish, or work.",
                    "Give without making your gift part of your identity.",
                    "If you failed someone, apologize plainly and without self-defense.",
                  ].map((item) => (
                    <div key={item} className="flex gap-2 rounded-2xl border border-border/60 bg-background/55 p-4 text-sm leading-relaxed text-muted-foreground">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="confess" className="mt-4">
              <SectionCard title="Confession preparation" icon={<PenLine className="h-4 w-4" />}>
                <div className="grid gap-3">
                  <CalmNote title="Pray" body="Begin with Psalm 50/51 and ask God for truth without despair." />
                  <CalmNote title="Name" body="Write a short plain list. Avoid explanations unless your priest asks." />
                  <CalmNote title="Return" body="Confession is not self-hatred. It is returning to Christ’s mercy." />
                  <CalmNote title="Confirm" body="Ask your priest how often to confess and how to prepare in your parish." />
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="sources" className="mt-4">
              <SectionCard title="Sources to check" icon={<BookOpen className="h-4 w-4" />}>
                <div className="grid gap-3">
                  {sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-border/60 bg-background/55 p-4 transition-colors hover:border-primary/35 hover:bg-muted/60"
                    >
                      <span className="font-semibold text-foreground">{source.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{source.note}</span>
                    </a>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
