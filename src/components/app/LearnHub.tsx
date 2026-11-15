import type { ReactNode } from "react";
import { Link } from "react-router";
import { BookMarked, BookHeart, DoorOpen, ExternalLink, Headphones, Library, MapPin, MessageCircleQuestion, Music, Route, ScrollText, Shield } from "lucide-react";
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
import { PrayerMemorizer } from "@/components/app/PrayerMemorizer";
import { DutyModeCard } from "@/components/app/DutyModeCard";
import { ForThoseWhoServe } from "@/components/app/ForThoseWhoServe";
import { BecomingOrthodox } from "@/components/app/BecomingOrthodox";
import { SaintStoriesFeed } from "@/components/app/SaintStoriesFeed";
import { isPhilokaliaUnlocked } from "@/lib/philokaliaUnlock";
import { useResponderMode } from "@/lib/responderMode";
import { cn } from "@/lib/utils";

export type LearnTab = "welcome" | "path" | "challenges" | "creed" | "byheart" |"guide" | "qa" | "liturgy" | "audio" | "library" | "hymns" | "parish" | "serve" | "stories";

// The starting screen: topics as tiles, the same way Pray is laid out. Each topic keeps its own URL (?tab=...).
// Older addresses still work: welcome, path and challenges are the three parts of "Your next step",
// and guide and serve both open the one page for faith at work and on duty.
function buildLauncher(serving: boolean, philokalia: boolean): LauncherGroup[] {
  return [
    {
      title: "Start",
      tiles: [
        { to: "/learn?tab=path", label: "Your next step", hint: "A path for you, and small challenges", icon: Route },
        { to: "/learn?tab=welcome", label: "Becoming Orthodox", hint: "From a first visit to baptism", icon: DoorOpen },
      ],
    },
    {
      title: "Faith",
      tiles: [
        { to: "/learn?tab=byheart", label: "Learn by heart", hint: "The Creed, Our Father, Psalm 90 and more", icon: ScrollText },
        { to: "/learn?tab=qa", label: "Questions and answers", hint: "Icons, fasting, saints and more", icon: MessageCircleQuestion },
      ],
    },
    {
      title: "Worship",
      tiles: [
        { to: "/learn?tab=liturgy", label: "Divine Liturgy", hint: "Follow the service step by step", icon: ChurchDomeIcon },
        { to: "/learn?tab=hymns", label: "Hymns of the day", hint: "Troparia and kontakia", icon: Music },
      ],
    },
    {
      title: "Library",
      tiles: [
        { to: "/learn?tab=stories", label: "Saint stories", hint: "One-minute stories to swipe and hear", icon: BookHeart },
        { to: "/saints", label: "Saints", hint: "Lives, patrons and name days", icon: SaintHaloIcon },
        serving
          ? { to: "/learn?tab=serve", label: "On duty", hint: "Prayer before, during and after a shift", icon: Shield }
          : { to: "/learn?tab=serve", label: "Faith at work", hint: "Prayer for work, stress and daily life", icon: Shield },
        { to: "/learn?tab=parish", label: "Find a parish", hint: "Churches near you", icon: MapPin },
        ...(philokalia ? [{ to: "/philokalia", label: "Philokalia guide", hint: "The Fathers on watchfulness", icon: BookMarked }] : []),
      ],
    },
    {
      title: "More resources",
      tiles: [
        { to: "/learn?tab=audio", label: "Audio", hint: "Chant, talks and radio", icon: Headphones },
        { to: "/learn?tab=library", label: "OCA library", hint: "Articles on the OCA website", icon: Library },
      ],
    },
  ];
}

const NEXT_STEP_VIEWS: Array<{ tab: LearnTab; label: string }> = [
  { tab: "path", label: "Your path" },
  { tab: "welcome", label: "Becoming Orthodox" },
  { tab: "challenges", label: "Challenges" },
];

// One page for the three ways in: a path chosen for you, the road into the Church, and short challenges.
function NextStep({ tab }: { tab: LearnTab }) {
  return (
    <div className="grid gap-4">
      <nav aria-label="Your next step" className="flex flex-wrap gap-1.5">
        {NEXT_STEP_VIEWS.map((view) => (
          <Link
            key={view.tab}
            to={`/learn?tab=${view.tab}`}
            replace
            aria-current={view.tab === tab ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              view.tab === tab ? "border-accent/50 bg-accent/15 text-foreground" : "border-border/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {view.label}
          </Link>
        ))}
      </nav>
      {tab === "welcome" ? (
        <>
          <BecomingOrthodox />
          <InclusiveChristianPath />
        </>
      ) : tab === "challenges" ? (
        <PrayerChallenges />
      ) : (
        <PersonalizedPath />
      )}
    </div>
  );
}

const onDuty = (
  <div className="grid gap-5">
    <DutyModeCard />
    <ForThoseWhoServe />
    <OrthodoxDailyGuide />
  </div>
);

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
  welcome: <NextStep tab="welcome" />,
  path: <NextStep tab="path" />,
  challenges: <NextStep tab="challenges" />,
  // The old Creed address opens the Creed in Learn by heart.
  creed: <PrayerMemorizer defaultPrayer="creed" />,
  byheart: <PrayerMemorizer />,
  guide: onDuty,
  qa: <CatechesisQA />,
  liturgy: <DivineLiturgyCompanion />,
  audio: <OrthodoxAudioLibrary />,
  hymns: <HymnsAndPropers />,
  parish: <ParishFinder />,
  library: ocaLibrary,
  serve: onDuty,
  stories: <SaintStoriesFeed />,
};

export function LearnHub({ tab }: { tab: LearnTab | null }) {
  const [role] = useResponderMode();
  const serving = role !== "civilian";
  const philokalia = isPhilokaliaUnlocked();

  if (!tab) {
    return (
      <div className="grid min-w-0 gap-5">
        <LauncherIntro eyebrow="Learn" title="Grow with steadiness." />
        <SectionLauncher groups={buildLauncher(serving, philokalia)} />
        {philokalia ? null : (
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">
            One more guide, on the Fathers and watchfulness, is hidden in the app. Hint: tap the shield at the top seven times.
          </p>
        )}
      </div>
    );
  }

  const workTitle = serving ? "On duty" : "Faith at work";
  const titles: Record<LearnTab, string> = {
    welcome: "Your next step",
    path: "Your next step",
    challenges: "Your next step",
    creed: "Learn by heart",
    byheart: "Learn by heart",
    qa: "Questions and answers",
    guide: workTitle,
    serve: workTitle,
    liturgy: "Divine Liturgy",
    hymns: "Hymns of the day",
    audio: "Audio",
    parish: "Find a parish",
    library: "OCA library",
    stories: "Saint stories",
  };

  return (
    <div className="grid min-w-0 gap-4 sm:gap-5">
      <SectionBackBar backTo="/learn" backLabel="Learn" title={titles[tab]} favoriteTo={`/learn?tab=${tab}`} />
      {content[tab]}
    </div>
  );
}
