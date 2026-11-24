import type { ReactNode } from "react";
import { Link } from "react-router";
import { BookMarked, ExternalLink, Headphones, Library, MapPin, MessageCircleQuestion, Music, Route, Shield } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ChurchDomeIcon, GospelBookIcon, IconPanelIcon, SaintHaloIcon, ThreeBarCrossIcon } from "@/components/app/OrthodoxMotifs";
import { continueTile, LauncherIntro, SectionBackBar, SectionLauncher, type LauncherGroup } from "@/components/app/SectionLauncher";
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
import { useRecentPlaces } from "@/lib/recentPlaces";
import { useResponderMode } from "@/lib/responderMode";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";

export type LearnTab = "welcome" | "path" | "challenges" | "creed" | "byheart" |"guide" | "qa" | "liturgy" | "audio" | "library" | "hymns" | "parish" | "serve" | "stories";

// The starting screen: topics as tiles, the same way Pray is laid out. Each topic keeps its own URL (?tab=...).
// Older addresses still work: welcome, path and challenges are the three parts of "Your next step",
// and guide and serve both open the one page for faith at work and on duty.
// For a Melkite or Byzantine Catholic (chosen in Settings), the path into Orthodoxy is not their next step, so Start
// leads with their own path and the Orthodox road moves to the Library, kept for anyone who wants to read it.
const BECOMING_ORTHODOX = { to: "/learn?tab=welcome", art: "theophany", label: "Becoming Orthodox", hint: "From a first visit to baptism", icon: ThreeBarCrossIcon };
const ORTHODOX_FOR_REFERENCE = { to: "/learn?tab=welcome", art: "theophany", label: "How people become Orthodox", hint: "The Orthodox road, for reference", icon: ThreeBarCrossIcon };

function buildLauncher(serving: boolean, philokalia: boolean, easternCatholic = false): LauncherGroup[] {
  return [
    {
      title: "Start",
      tiles: [
        { to: "/learn?tab=path", label: "Your next step", hint: "A path for you, and small challenges", icon: Route },
        ...(easternCatholic
          ? [{ to: "/learn?tab=liturgy", label: "Byzantine prayer life", hint: "The Divine Liturgy, step by step", icon: ChurchDomeIcon }]
          : [{ ...BECOMING_ORTHODOX, art: undefined }]),
      ],
    },
    {
      title: "Saints",
      tiles: [
        { to: "/learn?tab=stories", art: "george", label: "Saint stories", hint: "One-minute stories to swipe and hear", icon: IconPanelIcon },
        { to: "/saints", art: "nicholas", label: "Lives and name days", hint: "Lives, patrons and name days", icon: SaintHaloIcon },
        serving
          ? { to: "/learn?tab=serve", art: "michael", label: "On duty", hint: "Prayer before, during and after a shift", icon: Shield }
          : { to: "/learn?tab=serve", art: "michael", label: "Faith at work", hint: "Prayer for work, stress and daily life", icon: Shield },
      ],
    },
    {
      title: "Faith and worship",
      tiles: [
        { to: "/learn?tab=byheart", label: "Learn by heart", hint: "The Creed, Our Father, Psalm 90 and more", icon: GospelBookIcon },
        { to: "/learn?tab=qa", label: "Questions and answers", hint: "Icons, fasting, saints and more", icon: MessageCircleQuestion },
        { to: "/learn?tab=liturgy", label: "Divine Liturgy", hint: "Follow the service step by step", icon: ChurchDomeIcon },
        { to: "/learn?tab=hymns", label: "Hymns of the day", hint: "Troparia and kontakia", icon: Music },
        ...(philokalia ? [{ to: "/philokalia", label: "Philokalia guide", hint: "The Fathers on watchfulness", icon: BookMarked }] : []),
      ],
    },
    {
      title: "More",
      tiles: [
        { to: "/learn?tab=parish", label: "Find a parish", hint: "Churches near you", icon: MapPin },
        ...(easternCatholic ? [{ ...ORTHODOX_FOR_REFERENCE, art: undefined }] : []),
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
  // A Melkite or Byzantine Catholic is not on the road into Orthodoxy, so that view is not offered as their next
  // step; it stays reachable from the Library ("How people become Orthodox").
  const { settings } = useSettings();
  const easternCatholic = settings.jurisdiction === "melkite" || settings.jurisdiction === "ruthenian";
  const views = NEXT_STEP_VIEWS.filter((view) => !(easternCatholic && view.tab === "welcome" && tab !== "welcome")).map((view) =>
    easternCatholic && view.tab === "welcome" ? { ...view, label: "How people become Orthodox" } : view,
  );
  return (
    <div className="grid gap-4">
      <nav aria-label="Your next step" className="flex flex-wrap gap-x-6 border-b border-border/80">
        {views.map((view) => (
          <Link
            key={view.tab}
            to={`/learn?tab=${view.tab}`}
            replace
            aria-current={view.tab === tab ? "page" : undefined}
            className={cn(
              "-mb-px inline-flex min-h-11 items-center border-b-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              view.tab === tab ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
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

    <p className="mt-4 break-words text-sm text-muted-foreground">
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
  const recent = useRecentPlaces();
  const { settings } = useSettings();
  const groups = buildLauncher(serving, philokalia, settings.jurisdiction === "melkite" || settings.jurisdiction === "ruthenian");
  const lead = continueTile(groups, recent);

  if (!tab) {
    return (
      <div className="grid min-w-0 gap-5">
        <LauncherIntro title={t("learn.title")} />
        <SectionLauncher groups={groups} lead={lead ? { eyebrow: t("learn.lead"), tile: lead } : null} />
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
