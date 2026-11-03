import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, Crosshair, Download, ExternalLink, Home, Settings, Sparkles } from "lucide-react";
import { ChurchDomeIcon } from "@/components/app/OrthodoxMotifs";
import { GroupedSections, type SectionGroup } from "@/components/app/GroupedSections";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CatechesisQA } from "@/components/app/CatechesisQA";
import { InclusiveChristianPath } from "@/components/app/InclusiveChristianPath";
import { OrthodoxDailyGuide } from "@/components/app/OrthodoxDailyGuide";
import { SectionIntro } from "@/components/app/SectionIntro";
import { HymnsAndPropers } from "@/components/app/HymnsAndPropers";
import { ParishFinder } from "@/components/app/ParishFinder";
import { DivineLiturgyCompanion } from "@/components/app/DivineLiturgyCompanion";
import { OrthodoxAudioLibrary } from "@/components/app/OrthodoxAudioLibrary";
import { FirstStepHint } from "@/components/app/FirstStepHint";
import { PrayerChallenges } from "@/components/app/PrayerChallenges";
import { PersonalizedPath } from "@/components/app/PersonalizedPath";
import { NiceneCreedMemorizer } from "@/components/app/NiceneCreedMemorizer";
import { DutyModeCard } from "@/components/app/DutyModeCard";

export type LearnTab = "welcome" | "path" | "challenges" | "creed" | "guide" | "qa" | "liturgy" | "audio" | "library" | "hymns" | "parish";

// Eleven sections in four groups, the same way Pray is laid out, so the tab bar fits on a phone.
const groups: Array<SectionGroup<LearnTab>> = [
  { id: "start", label: "Start", items: [{ value: "welcome", label: "Welcome" }, { value: "path", label: "My path" }, { value: "challenges", label: "Challenges" }] },
  { id: "faith", label: "Faith", items: [{ value: "creed", label: "Creed" }, { value: "qa", label: "Q&A" }, { value: "guide", label: "Daily guide" }] },
  { id: "worship", label: "Worship", items: [{ value: "liturgy", label: "Liturgy" }, { value: "hymns", label: "Hymns" }, { value: "audio", label: "Audio" }] },
  { id: "resources", label: "Resources", items: [{ value: "parish", label: "Find a parish" }, { value: "library", label: "OCA library" }] },
];

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

export function LearnHub({
  tab,
  onTabChange,
  onHome,
}: {
  tab?: LearnTab;
  onTabChange?: (t: LearnTab) => void;
  onHome?: () => void;
}) {
  return (
    <div className="grid min-w-0 gap-4 sm:gap-5 lg:gap-6">
      <SectionIntro
        eyebrow="Learn"
        title="Grow with steadiness."
        description="Follow a personal path, understand Orthodox worship, and keep trusted resources close without becoming overwhelmed."
        icon={<ChurchDomeIcon className="h-5 w-5" />}
        actions={

          onHome ? (
            <Button type="button" variant="outline" size="sm" className="premium-action" onClick={onHome}>
              <Home className="mr-2 h-4 w-4" /> Today
            </Button>
          ) : null
        }
      />

      <FirstStepHint
        title="Recommended: build your personal path."

        description="Choose what you need most and how much time you have; the app will recommend a simple starting rhythm."
        actionLabel="Open Path"
        icon={<Sparkles className="h-4 w-4" />}
        onAction={() => onTabChange?.("path")}
      />

      <Card className="premium-surface rounded-[1.35rem] p-4 sm:rounded-[1.75rem] sm:p-5 lg:p-6">
        <div className="relative flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div>
            <p className="premium-eyebrow">Tool library</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">Quick access</h2>
          </div>

          <p className="text-xs text-muted-foreground">Secondary features live here.</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <Button type="button" variant="outline" className="h-auto min-w-0 justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left" onClick={() => onTabChange?.("creed")}>
            <BookOpenCheck className="mr-2 h-4 w-4 shrink-0 text-primary" /> <span className="truncate">Memorize the Creed</span>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left">
            <Link to="/saints"><Sparkles className="mr-2 h-4 w-4 text-primary" /> Saints</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left">
            <Link to="/field-manual"><Crosshair className="mr-2 h-4 w-4 text-primary" /> Life & Service Guide</Link>
          </Button>

          <Button asChild variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left">
            <Link to="/download"><Download className="mr-2 h-4 w-4 text-primary" /> Install / Share</Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto justify-start rounded-xl px-3 py-3 text-left">
            <Link to="/settings"><Settings className="mr-2 h-4 w-4 text-primary" /> Settings</Link>
          </Button>
        </div>
      </Card>

      <GroupedSections groups={groups} tab={tab ?? "welcome"} onTabChange={(t) => onTabChange?.(t)} content={content} />
    </div>
  );
}