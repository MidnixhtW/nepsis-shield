import type { ReactNode } from "react";
import { Crosshair, DoorOpen, ExternalLink, Headphones, Library, ListChecks, MapPin, MessageCircleQuestion, Music, Route, ScrollText, Trophy } from "lucide-react";
import { ChurchDomeIcon, SaintHaloIcon } from "@/components/app/OrthodoxMotifs";
import { LauncherIntro, SectionBackBar, SectionLauncher, type LauncherGroup } from "@/components/app/SectionLauncher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CatechesisQA } from "@/components/app/CatechesisQA";
import { InclusiveChristianPath } from "@/components/app/InclusiveChristianPath";
import { OrthodoxDailyGuide } from "@/components/app/OrthodoxDailyGuide";
import { HymnsAndPropers } from "@/components/app/HymnsAndPropers";
import { ParishFinder } from "@/components/app/ParishFinder";
import { DivineLiturgyCompanion } from "@/components/app/DivineLiturgyCompanion";
import { OrthodoxAudioLibrary } from "@/components/app/OrthodoxAudioLibrary";
import { PrayerChallenges } from "@/components/app/PrayerChallenges";
import { PersonalizedPath } from "@/components/app/PersonalizedPath";
import { NiceneCreedMemorizer } from "@/components/app/NiceneCreedMemorizer";
import { DutyModeCard } from "@/components/app/DutyModeCard";

export type LearnTab = "welcome" | "path" | "challenges" | "creed" | "guide" | "qa" | "liturgy" | "audio" | "library" | "hymns" | "parish";

// The starting screen: topics as tiles, the same way Pray is laid out. Each topic keeps its own URL (?tab=...).
const launcher: LauncherGroup[] = [
  {
    title: "Start",
    tiles: [
      { to: "/learn?tab=welcome", label: "New to Orthodoxy?", hint: "What this app offers, gently", icon: DoorOpen },
      { to: "/learn?tab=path", label: "My path", hint: "Next steps chosen for you", icon: Route },
      { to: "/learn?tab=challenges", label: "Challenges", hint: "Small habits, a few days at a time", icon: Trophy },
    ],
  },
  {
    title: "Faith",
    tiles: [
      { to: "/learn?tab=creed", label: "The Creed", hint: "Learn the Symbol of Faith by heart", icon: ScrollText },
      { to: "/learn?tab=qa", label: "Questions and answers", hint: "Icons, fasting, saints and more", icon: MessageCircleQuestion },
      { to: "/learn?tab=guide", label: "Daily guide", hint: "Faith at work and on duty", icon: ListChecks },
    ],
  },
  {
    title: "Worship",
    tiles: [
      { to: "/learn?tab=liturgy", label: "Divine Liturgy", hint: "Follow the service step by step", icon: ChurchDomeIcon },
      { to: "/learn?tab=hymns", label: "Hymns of the day", hint: "Troparia and kontakia", icon: Music },
      { to: "/learn?tab=audio", label: "Audio", hint: "Chant, talks and radio", icon: Headphones },
    ],
  },
  {
    title: "Library",
    tiles: [
      { to: "/saints", label: "Saints", hint: "Lives, patrons and name days", icon: SaintHaloIcon },
      { to: "/field-manual", label: "Life & Service Guide", hint: "Stress, grief, duty, travel", icon: Crosshair },
      { to: "/learn?tab=parish", label: "Find a parish", hint: "Churches near you", icon: MapPin },
      { to: "/learn?tab=library", label: "OCA library", hint: "Articles on the faith", icon: Library },
    ],
  },
];

const titles: Record<LearnTab, string> = {
  welcome: "New to Orthodoxy?",
  path: "My path",
  challenges: "Challenges",
  creed: "The Creed",
  qa: "Questions and answers",
  guide: "Daily guide",
  liturgy: "Divine Liturgy",
  hymns: "Hymns of the day",
  audio: "Audio",
  parish: "Find a parish",
  library: "OCA library",
};

const ocaLibrary = (
  <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">

    <h2 className="text-xl font-semibold tracking-tight">OCA library</h2>
    <p className="mt-1 text-sm text-muted-foreground">Browse the full OCA collection.</p>

    <Separator className="my-4" />

    <div className="grid gap-2 sm:grid-cols-2">
      <Button
        asChild
        variant="outline"
        className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
      >
        <a
          href="https://www.oca.org/questions"
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0"
        >
          Questions & Answers <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
      >
        <a
          href="https://www.oca.org/orthodoxy/prayers"
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0"
        >
          Prayers <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
      >
        <a
          href="https://www.oca.org/orthodoxy/the-orthodox-faith"
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0"
        >
          The Orthodox Faith <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
      <Button
        asChild
        variant="outline"
        className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
      >
        <a
          href="https://www.oca.org/readings"
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0"
        >
          Daily readings <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>

    <p className="mt-4 break-words text-xs text-muted-foreground">
      Sources: "https://www.oca.org/questions" • "https://www.oca.org/orthodoxy/prayers" •
      "https://www.oca.org/orthodoxy/the-orthodox-faith"
    </p>
  </Card>
);

const content: Record<LearnTab, ReactNode> = {
  welcome: <InclusiveChristianPath />,
  path: <PersonalizedPath />,
  challenges: <PrayerChallenges />,
  creed: <NiceneCreedMemorizer />,
  guide: (
    <div className="grid gap-5">
      <DutyModeCard />
      <OrthodoxDailyGuide />
    </div>
  ),
  qa: <CatechesisQA />,
  liturgy: <DivineLiturgyCompanion />,
  audio: <OrthodoxAudioLibrary />,
  hymns: <HymnsAndPropers />,
  parish: <ParishFinder />,
  library: ocaLibrary,
};

export function LearnHub({ tab }: { tab: LearnTab | null }) {
  if (!tab) {
    return (
      <div className="grid min-w-0 gap-5">
        <LauncherIntro eyebrow="Learn" title="Grow with steadiness." />
        <SectionLauncher groups={launcher} />
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-4 sm:gap-5">
      <SectionBackBar backTo="/learn" backLabel="Learn" title={titles[tab]} favoriteTo={`/learn?tab=${tab}`} />
      {content[tab]}
    </div>
  );
}
