import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Church,
  ExternalLink,
  HeartHandshake,
  Home,
  Lock,
  Mic,
  MicOff,
  PenLine,
  Search,
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

type GuideSource = {
  title: string;
  url: string;
  note: string;
  tags: string[];
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const sources: GuideSource[] = [
  {
    title: "OCA – The Orthodox Faith",
    url: "https://www.oca.org/orthodoxy/the-orthodox-faith",
    note: "Core catechetical library: doctrine, Scripture, worship, spirituality, sacraments, and Church life.",
    tags: ["catechism", "doctrine", "learn", "orthodox", "faith", "sacraments", "scripture"],
  },
  {
    title: "OCA – Questions & Answers",
    url: "https://www.oca.org/questions",
    note: "Pastoral explanations on fasting, confession, worship, parish life, family questions, and newcomer concerns.",
    tags: ["question", "fast", "confession", "worship", "parish", "new", "catechumen"],
  },
  {
    title: "OCA – Prayers",
    url: "https://www.oca.org/orthodoxy/prayers",
    note: "Public prayers that teach the Church’s language of repentance, daily prayer, thanksgiving, and intercession.",
    tags: ["prayer", "pray", "repentance", "psalm", "rule"],
  },
  {
    title: "OCA – Daily Readings",
    url: "https://www.oca.org/readings",
    note: "Daily Scripture and saints for keeping learning tied to the Church calendar.",
    tags: ["read", "scripture", "bible", "saints", "calendar", "daily"],
  },
  {
    title: "Antiochian Orthodox Christian Archdiocese",
    url: "https://www.antiochian.org/",
    note: "Canonical Orthodox jurisdiction in communion with the OCA, with introductory teaching and parish resources.",
    tags: ["antiochian", "learn", "new", "catechumen", "orthodox"],
  },
  {
    title: "Greek Orthodox Archdiocese of America",
    url: "https://www.goarch.org/",
    note: "Canonical Orthodox church body in communion with the OCA, with educational and liturgical resources.",
    tags: ["goarch", "greek", "learn", "new", "catechism", "orthodox"],
  },
  {
    title: "Assembly of Canonical Orthodox Bishops – Parish Directory",
    url: "https://www.assemblyofbishops.org/directories/parishes/",
    note: "Canonical Orthodox parish directory for finding churches in communion across North America.",
    tags: ["parish", "church", "directory", "communion", "oca", "find"],
  },
  {
    title: "ROCOR – Orthodox Christian Resources",
    url: "https://www.synod.com/synod/engdocuments/enart_resources.html",
    note: "Traditional Orthodox teaching and resources from ROCOR, a canonical church body in communion with the OCA.",
    tags: ["rocor", "traditional", "learn", "prayer", "orthodox"],
  },
];

const promptCards: PromptCard[] = [
  {
    title: "Prayer",
    body: "I keep failing at prayer. Give me a small Orthodox rule that is humble and realistic.",
    icon: <Church className="h-4 w-4" />,
  },
  {
    title: "Catechumen path",
    body: "I am new or becoming a catechumen. What should I learn first without getting overwhelmed?",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    title: "Mercy",
    body: "Give me one quiet act of mercy for today, not something performative.",
    icon: <HeartHandshake className="h-4 w-4" />,
  },
  {
    title: "Confession",
    body: "Help me prepare for confession with repentance, not shame or self-hatred.",
    icon: <PenLine className="h-4 w-4" />,
  },
  {
    title: "Sources",
    body: "Point me to trustworthy Orthodox catechism sources from the OCA and churches in communion.",
    icon: <Search className="h-4 w-4" />,
  },
];

function relatedSources(input: string) {
  const q = input.toLowerCase();
  const matched = sources.filter((source) => source.tags.some((tag) => q.includes(tag)));
  return (matched.length ? matched : sources.slice(0, 4)).slice(0, 4);
}

function includesAny(input: string, terms: string[]) {
  return terms.some((term) => input.includes(term));
}

function sourceLine(input: string) {
  return relatedSources(input)
    .slice(0, 2)
    .map((source) => source.title)
    .join(" and ");
}

function localGuideResponse(input: string) {
  const q = input.toLowerCase();
  const sourcesToCheck = sourceLine(input);
  const priestReminder = "Please confirm important spiritual counsel with your priest.";

  if (includesAny(q, ["suicide", "self harm", "self-harm", "hurt myself", "abuse", "danger", "emergency"])) {
    return `If there is immediate danger, abuse, self-harm, or a medical emergency, seek local emergency help now and contact trusted people near you. Do not try to carry that alone or handle it only through an app.\n\nAfter safety is addressed, bring the matter plainly to your priest and, where needed, qualified local professionals. Orthodox spiritual life is not opposed to practical protection, medical care, or asking for help.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["confession", "confess", "shame", "guilt", "repent"])) {
    return `Prepare for confession simply: pray Psalm 50/51, ask God for truth without despair, and write a short plain list of sins without long explanations or self-defense.\n\nRepentance is not self-hatred. It is returning to Christ with honesty, humility, and hope. If you feel crushed by shame, keep the preparation shorter and more concrete: what happened, what pattern you see, and what mercy you need.\n\nStart with ${sourcesToCheck} for trustworthy Orthodox background on repentance, confession, and parish life.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["pray", "prayer", "rule", "jesus prayer", "distracted", "failing"])) {
    return `Begin smaller than your ambition. A humble rule might be: the Trisagion prayers, the Lord’s Prayer, one short Psalm or Gospel reading, and a few minutes of the Jesus Prayer. Keep it steady rather than dramatic.\n\nWhen distracted, return gently. Do not judge prayer by emotion, length, novelty, or intensity. The point is faithfulness before God, not a spiritual performance.\n\nFor grounding, start with ${sourcesToCheck}, especially the Church’s public prayers and basic catechesis.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["fast", "fasting", "food", "lent", "wednesday", "friday"])) {
    return `Treat fasting as obedience and mercy, not as a private athletic achievement. Keep the fast your parish gives you, avoid judging others, and do not turn food into anxiety or pride.\n\nIf you are new, ill, pregnant, recovering, very young, elderly, or under medical constraints, ask for guidance rather than inventing strict rules. The Orthodox fast is received in the Church, not self-designed from internet fragments.\n\nCheck ${sourcesToCheck} for basic Orthodox teaching and pastoral explanations.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["catechumen", "new", "convert", "learn", "orthodox", "catechism", "doctrine"])) {
    return `Do not try to learn Orthodoxy by consuming everything at once. Begin with the Creed, the Divine Liturgy, basic prayer, Scripture as read in the Church, and regular attendance at one parish.\n\nA good path is: attend services, ask questions respectfully, read one catechetical source slowly, and practice one concrete act of obedience or mercy each week. Avoid online arguments; they often train the passions more than the heart.\n\nStart with ${sourcesToCheck}; the OCA’s The Orthodox Faith is especially useful for first foundations.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["mercy", "charity", "help", "serve", "poor", "forgive"])) {
    return `Choose one quiet act of mercy today: pray for someone who irritates you, help at home without announcing it, give privately, or apologize plainly where you have wounded someone.\n\nMercy should make the heart softer, not more proud. Keep it hidden when possible, and let it interrupt your comfort in a small concrete way.\n\nFor Orthodox grounding, check ${sourcesToCheck} and keep mercy tied to prayer, repentance, and parish life.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["source", "sources", "oca", "goarch", "antiochian", "rocor", "parish", "church", "directory"])) {
    return `For trustworthy Orthodox learning, start with OCA – The Orthodox Faith for catechesis, OCA Questions & Answers for pastoral topics, OCA Prayers for the Church’s language of prayer, and OCA Daily Readings for Scripture with the Church calendar.\n\nYou can also compare introductory resources from canonical churches in communion, including the Antiochian Archdiocese, GOARCH, and ROCOR. To find a parish, use the Assembly of Canonical Orthodox Bishops parish directory.\n\nRead slowly and locally: one parish, one priest, one source family, one next faithful step.\n\n${priestReminder}`;
  }

  return `I would handle this with a simple Orthodox pattern: pray briefly, name the concern honestly, avoid dramatic conclusions, and take one concrete faithful step today. The spiritual life is usually healed by steadiness: repentance, humility, Scripture with the Church, confession, mercy, and parish life.\n\nFor sources, start with ${sourcesToCheck}. Read slowly and prefer the guidance of your actual parish over scattered online opinions.\n\nIf this question involves a major life decision, a serious sin pattern, family conflict, mental health, or strict fasting, do not settle it alone in an app. Bring it into confession or pastoral conversation.\n\n${priestReminder}`;
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
      text: "Peace be with you. Ask plainly; I will answer locally with Orthodox sources in mind, without any API key.",
    },
  ]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const supportsVoice = useMemo(() => {
    return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
  }, []);

  const currentSources = useMemo(() => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.text;
    return relatedSources(input || lastUserMessage || "orthodox");
  }, [input, messages]);

  function askGuide(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const answer = localGuideResponse(trimmed);
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "guide", text: answer },
    ]);
    setInput("");
  }

  function startVoice() {
    if (!supportsVoice) {
      showError("Voice dictation is not available in this browser.");
      return;
    }

    const SpeechRecognitionCtor = (window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    }).SpeechRecognition ?? (window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
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
              A local LLM-style Orthodox guide grounded in OCA catechesis and canonical Orthodox resources — no API key required.
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
                    <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
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
                      placeholder="Ask about prayer, catechism, OCA sources, fasting, confession, parish life, or mercy..."
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

                <div className="grid gap-4">
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

                  <SectionCard title="Suggested sources" icon={<BookOpen className="h-4 w-4" />}>
                    <div className="grid gap-2">
                      {currentSources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-2xl border border-border/60 bg-background/55 p-3 text-sm transition-colors hover:border-primary/35 hover:bg-muted/60"
                        >
                          <span className="flex items-center justify-between gap-2 font-semibold text-foreground">
                            {source.title} <ExternalLink className="h-3.5 w-3.5 shrink-0 text-primary" />
                          </span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{source.note}</span>
                        </a>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="prayer" className="mt-4">
              <SectionCard title="Prayer without spiritual noise" icon={<Church className="h-4 w-4" />}>
                <div className="grid gap-3 sm:grid-cols-3">
                  <CalmNote title="Begin small" body="Trisagion prayers, the Lord’s Prayer, one Psalm or Gospel reading, and a few minutes of the Jesus Prayer." />
                  <CalmNote title="Keep attention" body="When distracted, return gently. Do not measure prayer by emotion, intensity, or novelty." />
                  <CalmNote title="Ask blessing" body="Let your priest help shape your rule so it is obedient, merciful, and sustainable." />
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="learn" className="mt-4">
              <SectionCard title="Source-based Orthodox learning" icon={<BookOpen className="h-4 w-4" />}>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  <p>Begin with OCA catechetical material, especially <span className="font-semibold text-foreground">The Orthodox Faith</span>.</p>
                  <p>Use OCA Questions & Answers for pastoral topics, then compare introductory materials from canonical Orthodox jurisdictions in communion such as Antiochian, GOARCH, and ROCOR resources.</p>
                  <p>Read slowly: one source, one question, one practical act of obedience.</p>
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
                      <span className="flex items-center justify-between gap-2 font-semibold text-foreground">
                        {source.title} <ExternalLink className="h-4 w-4 shrink-0 text-primary" />
                      </span>
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
