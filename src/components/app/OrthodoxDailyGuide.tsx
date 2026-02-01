import type { ComponentType } from "react";
import {
  BookOpen,
  ExternalLink,
  HandCoins,
  HeartHandshake,
  HelpingHand,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Topic = {
  key: string;
  title: string;
  description: string;
  bullets: string[];
  sourceLabel: string;
  sourceUrl: string;
  icon: ComponentType<{ className?: string }>;
};

const TOPICS: Topic[] = [
  {
    key: "prayer",
    title: "Prayer (rule)",
    description: "Short, regular, attentive — then grow with guidance.",
    bullets: [
      "Choose a small daily rule you can keep (morning + evening).",
      "Use the Church's words (common prayers).",
      "Aim for attention and humility more than length.",
    ],
    sourceLabel: "OCA – Prayer",
    sourceUrl:
      "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-daily-cycles-of-prayer/prayer",
    icon: Sparkles,
  },
  {
    key: "fasting",
    title: "Fasting",
    description: "For repentance and love — not pride.",
    bullets: [
      "Join fasting to prayer and mercy.",
      "Avoid comparison; ask your priest for guidance if needed.",
    ],
    sourceLabel: "OCA – Orthodox fasting",
    sourceUrl: "https://www.oca.org/questions/dailylife/orthodox-fasting",
    icon: ShieldCheck,
  },
  {
    key: "almsgiving",
    title: "Almsgiving",
    description: "Keep mercy concrete: time, attention, money, forgiveness.",
    bullets: [
      "Give quietly; don't curate an image of generosity.",
      "Make a small habit you can keep weekly.",
    ],
    sourceLabel: "OCA – Almsgiving",
    sourceUrl:
      "https://www.oca.org/orthodoxy/the-orthodox-faith/spirituality/prayer-fasting-and-almsgiving/almsgiving",
    icon: HandCoins,
  },
  {
    key: "scripture",
    title: "Scripture",
    description: "Read Scripture inside the Church's life (worship, saints, tradition).",
    bullets: [
      "Keep the Gospels central; read the daily lections.",
      "Avoid sensational 'end-times' speculation.",
    ],
    sourceLabel: "OCA – Bible (Q&A)",
    sourceUrl: "https://www.oca.org/questions/scripture/bible",
    icon: BookOpen,
  },
  {
    key: "liturgy",
    title: "Divine Liturgy",
    description: "The center of Orthodox life: worship and Communion with Christ.",
    bullets: [
      "Arrive early if possible; stay for the whole service when you can.",
      "Prepare for Communion with prayer, fasting, repentance, and guidance.",
    ],
    sourceLabel: "OCA – The Divine Liturgy (Q&A)",
    sourceUrl: "https://www.oca.org/questions/divineliturgy/the-divine-liturgy",
    icon: HeartHandshake,
  },
  {
    key: "confession",
    title: "Confession",
    description: "Sacramental healing: repentance spoken honestly before God.",
    bullets: [
      "Be concrete, humble, and brief — avoid self-justification.",
      "Ask your priest for a small rule between confessions.",
    ],
    sourceLabel: "OCA – Confessing in the Presence of a Priest (Q&A)",
    sourceUrl:
      "https://www.oca.org/questions/sacramentconfession/confessing-in-the-presence-of-a-priest",
    icon: HelpingHand,
  },
];

export function OrthodoxDailyGuide() {
  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Daily Orthodox life</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A simple rhythm, with official OCA sources.
            </p>
          </div>
          <HeartHandshake className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Morning</p>
            <p className="mt-1 text-sm">Pray briefly, then read the day's Scripture.</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Day</p>
            <p className="mt-1 text-sm">Keep attention: a short Jesus Prayer, small mercy.</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Meals</p>
            <p className="mt-1 text-sm">Give thanks; follow the fast as you're able.</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Evening</p>
            <p className="mt-1 text-sm">Thank God, repent simply, forgive.</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Topics</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a section to expand.
            </p>
          </div>
          <ScrollText className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <Accordion type="single" collapsible className="w-full">
          {TOPICS.map((t) => {
            const Icon = t.icon;
            return (
              <AccordionItem key={t.key} value={t.key} className="border-none">
                <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" /> {t.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4">
                    <p className="text-sm text-muted-foreground">{t.description}</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                      {t.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant="outline"
                      className="btn-wrap rounded-2xl border-border/60"
                    >
                      <a href={t.sourceUrl} target="_blank" rel="noreferrer">
                        {t.sourceLabel} <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <p className="break-words text-xs text-muted-foreground">
                      Source: "{t.sourceUrl}"
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}

          <AccordionItem value="catechism" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <ScrollText className="h-4 w-4 text-primary" /> Catechism (PDF)
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3 rounded-2xl border border-border/60 bg-background p-4">
                <p className="text-sm text-muted-foreground">
                  A longer-format manual for adult instruction (OCA PDF).
                </p>
                <Button asChild className="btn-wrap rounded-2xl">
                  <a
                    href="https://www.oca.org/cdn/PDFs/2023-0609-EOCB.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open catechism PDF <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <p className="break-words text-xs text-muted-foreground">
                  Source: "https://www.oca.org/cdn/PDFs/2023-0609-EOCB.pdf"
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}