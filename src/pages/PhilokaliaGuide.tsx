import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
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
    note: "Canonical Orthodox jurisdiction with introductory teaching and parish resources.",
    tags: ["antiochian", "learn", "new", "catechumen", "orthodox"],
  },
  {
    title: "Greek Orthodox Archdiocese of America",
    url: "https://www.goarch.org/",
    note: "Canonical Orthodox church body with educational and liturgical resources.",
    tags: ["goarch", "greek", "learn", "new", "catechism", "orthodox"],
  },
  {
    title: "Assembly of Canonical Orthodox Bishops – Parish Directory",
    url: "https://www.assemblyofbishops.org/directories/parishes/",
    note: "Canonical Orthodox parish directory for finding churches across North America.",
    tags: ["parish", "church", "directory", "communion", "oca", "find"],
  },
  {
    title: "ROCOR – Orthodox Christian Resources",
    url: "https://www.synod.com/synod/engdocuments/enart_resources.html",
    note: "Traditional Orthodox teaching and resources from ROCOR.",
    tags: ["rocor", "traditional", "learn", "prayer", "orthodox"],
  },
];

const promptCards: PromptCard[] = [
  {
    title: "Prayer",
    body: "I keep failing at prayer. Give me a small Eastern Christian rule that is humble and realistic.",
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
    body: "Point me to trustworthy Eastern Christian catechism sources from the OCA and churches in communion.",
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

function guideResponse(input: string) {
  const q = input.toLowerCase();
  const sourcesToCheck = sourceLine(input);
  const priestReminder = "Please confirm important spiritual counsel with your priest, pastor, or chaplain.";

  if (includesAny(q, ["suicide", "self harm", "self-harm", "hurt myself", "abuse", "danger", "emergency"])) {
    return `If there is immediate danger, abuse, self-harm, or a medical emergency, seek local emergency help now and contact trusted people near you. Do not try to carry that alone or handle it only through an app.\n\nAfter safety is addressed, bring the matter plainly to your priest or pastor and, where needed, qualified local professionals. Eastern Christian spiritual life is not opposed to practical protection, medical care, or asking for help.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["confession", "confess", "shame", "guilt", "repent"])) {
    return `Prepare for confession simply: pray Psalm 50/51, ask God for truth without despair, and write a short plain list of sins without long explanations or self-defense.\n\nRepentance is not self-hatred. It is returning to Christ with honesty, humility, and hope. If you feel crushed by shame, keep the preparation shorter and more concrete: what happened, what pattern you see, and what mercy you need.\n\nStart with ${sourcesToCheck} for trustworthy Eastern Christian background on repentance, confession, and parish life.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["pray", "prayer", "rule", "jesus prayer", "distracted", "failing"])) {
    return `Begin smaller than your ambition. A humble rule might be: the Trisagion prayers, the Lord’s Prayer, one short Psalm or Gospel reading, and a few minutes of the Jesus Prayer. Keep it steady rather than dramatic.\n\nWhen distracted, return gently. Do not judge prayer by emotion, length, novelty, or intensity. The point is faithfulness before God, not a spiritual performance.\n\nFor grounding, start with ${sourcesToCheck}, especially the Church’s public prayers and basic catechesis.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["fast", "fasting", "food", "lent", "wednesday", "friday"])) {
    return `Treat fasting as obedience and mercy, not as a private athletic achievement. Keep the fast your parish gives you, avoid judging others, and do not turn food into anxiety or pride.\n\nIf you are new, ill, pregnant, recovering, very young, elderly, or under medical constraints, ask for guidance rather than inventing strict rules. The Eastern fast is received in the Church, not self-designed from internet fragments.\n\nCheck ${sourcesToCheck} for basic Eastern Christian teaching and pastoral explanations.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["catechumen", "new", "convert", "learn", "orthodox", "catechism", "doctrine"])) {
    return `Do not try to learn the Christian East by consuming everything at once. Begin with the Creed, the Divine Liturgy, basic prayer, Scripture as read in the Church, and regular attendance at one parish.\n\nA good path is: attend services, ask questions respectfully, read one catechetical source slowly, and practice one concrete act of obedience or mercy each week. Avoid online arguments; they often train the passions more than the heart.\n\nStart with ${sourcesToCheck}; the OCA’s The Orthodox Faith is especially useful for Orthodox foundations within the wider Eastern Christian tradition.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["mercy", "charity", "help", "serve", "poor", "forgive"])) {
    return `Choose one quiet act of mercy today: pray for someone who irritates you, help at home without announcing it, give privately, or apologize plainly where you have wounded someone.\n\nMercy should make the heart softer, not more proud. Keep it hidden when possible, and let it interrupt your comfort in a small concrete way.\n\nFor Eastern Christian grounding, check ${sourcesToCheck} and keep mercy tied to prayer, repentance, and parish life.\n\n${priestReminder}`;
  }

  if (includesAny(q, ["source", "sources", "oca", "goarch", "antiochian", "rocor", "parish", "church", "directory"])) {
    return `For trustworthy Eastern Christian learning, start with OCA – The Orthodox Faith for Orthodox catechesis, OCA Questions & Answers for pastoral topics, OCA Prayers for the Church’s language of prayer, and OCA Daily Readings for Scripture with the Church calendar.\n\nYou can also compare introductory resources from canonical churches, including the Antiochian Archdiocese, GOARCH, and ROCOR. To find a parish, use the Assembly of Canonical Orthodox Bishops parish directory.\n\nRead slowly and locally: one parish, one priest or pastor, one source family, one next faithful step.\n\n${priestReminder}`;
  }

  return `I would handle this with a simple Eastern Christian pattern: pray briefly, name the concern honestly, avoid dramatic conclusions, and take one concrete faithful step today. The spiritual life is usually healed by steadiness: repentance, humility, Scripture with the Church, confession, mercy, and parish life.\n\nFor sources, start with ${sourcesToCheck}. Read slowly and prefer the guidance of your actual parish over scattered online opinions.\n\nIf this question involves a major life decision, a serious sin pattern, family conflict, mental health, or strict fasting, do not settle it alone in an app. Bring it into confession or pastoral conversation.\n\n${priestReminder}`;
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
      text: "Peace be with you. Ask plainly; this guide will answer from its built-in Eastern Christian source notes.",
    },
  ]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const sourceSuggestions = useMemo(() => relatedSources(input || messages[messages.length - 1]?.text || ""), [input, messages]);

  function askGuide(text = input) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const answer = guideResponse(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "guide", text: answer },
    ]);
    setInput("");
  }

  function startVoice() {
    const SpeechRecognitionCtor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      showError("Voice dictation is not available in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) setInput((prev) => [prev, transcript].filter(Boolean).join(" "));
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }

  function hideGuide() {
    lockPhilokaliaGuide();
    showSuccess("Philokalia Guide hidden again.");
    navigate("/today");
  }

  return (
    <div className="min-h-dvh bg-background px-4 pb-24 pt-6 text-foreground">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">Hidden guide</Badge>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Philokalia Guide</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A restrained Eastern Christian watchfulness guide with built-in source notes from OCA catechesis and canonical Orthodox resources.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="rounded-2xl border-border/60">
              <Link to="/today"><Home className="mr-2 h-4 w-4" /> Today</Link>
            </Button>
            <Button type="button" variant="outline" className="rounded-2xl border-border/60" onClick={hideGuide}>
              <Lock className="mr-2 h-4 w-4" /> Hide again
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
          <Tabs defaultValue="ask" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-muted/30 p-1">
              <TabsTrigger value="ask" className="rounded-xl">Ask</TabsTrigger>
              <TabsTrigger value="sources" className="rounded-xl">Sources</TabsTrigger>
              <TabsTrigger value="rule" className="rounded-xl">Rule</TabsTrigger>
            </TabsList>

            <TabsContent value="ask" className="mt-4">
              <div className="grid gap-4">
                <SectionCard title="Ask Philokalia Guide" icon={<Sprout className="h-4 w-4" />}>
                  <div className="grid max-h-[26rem] gap-3 overflow-y-auto pr-1">
                    {messages.map((message, index) => (
                      <div
                        key={`${message.role}-${index}`}
                        className={message.role === "guide" ? "rounded-2xl border border-border/60 bg-muted/25 p-4" : "rounded-2xl border border-primary/20 bg-primary/10 p-4"}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                          {message.role === "guide" ? "Philokalia Guide" : "You"}
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2">
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
                      <Button type="button" variant="outline" className="rounded-2xl border-border/60" onClick={listening ? stopVoice : startVoice}>
                        {listening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                        {listening ? "Stop" : "Dictate"}
                      </Button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Quiet prompts" icon={<ShieldCheck className="h-4 w-4" />}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {promptCards.map((card) => (
                      <button
                        key={card.title}
                        type="button"
                        onClick={() => askGuide(card.body)}
                        className="rounded-2xl border border-border/60 bg-background/55 p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">{card.icon}{card.title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{card.body}</span>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="mt-4">
              <SectionCard title="Source-based Eastern Christian learning" icon={<BookOpen className="h-4 w-4" />}>
                <div className="grid gap-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Start with OCA catechesis, OCA Questions & Answers, OCA Prayers, and OCA Daily Readings. Compare introductory resources from canonical Orthodox jurisdictions, and bring important questions to your priest or pastor.
                  </p>
                  {sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl border border-border/60 bg-background/55 p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                        {source.title}
                        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{source.note}</span>
                    </a>
                  ))}
                </div>
              </SectionCard>
            </TabsContent>

            <TabsContent value="rule" className="mt-4">
              <SectionCard title="A sober rule of use" icon={<Church className="h-4 w-4" />}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CalmNote title="Pray first" body="Begin with the Jesus Prayer or Psalm 50/51 before asking a question." />
                  <CalmNote title="Keep it short" body="Ask one concrete question. Avoid endless browsing or spiritual curiosity." />
                  <CalmNote title="Confirm locally" body="Let your priest help shape fasting, confession, parish practice, and spiritual discipline." />
                  <CalmNote title="Choose mercy" body="End with one small act of repentance, gratitude, forgiveness, or service." />
                </div>
              </SectionCard>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 content-start">
            <SectionCard title="Suggested sources" icon={<Search className="h-4 w-4" />}>
              <div className="grid gap-2">
                {sourceSuggestions.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-border/60 bg-background/55 p-3 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="font-semibold">{source.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{source.note}</span>
                  </a>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Pastoral guardrail" icon={<HeartHandshake className="h-4 w-4" />}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This page is a study and watchfulness aid. It does not replace confession, parish life, pastoral counsel, emergency help, or clinical care.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
