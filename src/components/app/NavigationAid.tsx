import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AppSection } from "@/components/app/AppShell";
import type { LearnTab } from "@/components/app/LearnHub";
import type { PrayerTab } from "@/components/app/PrayerHub";
import type { ReadTab } from "@/components/app/ReadHub";

type TargetRoute = {
  section: AppSection;
  tab?: PrayerTab | LearnTab | string;
  read?: ReadTab | string;
};

const sectionCopy: Record<AppSection, { title: string; purpose: string }> = {
  today: {
    title: "Today",
    purpose: "Start here and take the next clear step.",
  },
  pray: {
    title: "Pray",
    purpose: "Daily prayer, prayer texts, Jesus Prayer, prep, and journal.",
  },
  read: {
    title: "Read",
    purpose: "Daily readings, the Bible, and guided reading plans.",
  },
  learn: {
    title: "Tools",
    purpose: "Guides, Q&A, liturgy help, audio, hymns, parish, and library.",
  },
};

const tabLabels: Record<string, string> = {
  daily: "Daily",
  rule: "Rule",
  prayers: "Texts",
  counter: "Jesus Prayer",
  prep: "Prep",
  journal: "Journal",
  bible: "Bible",
  plans: "Plans",
  welcome: "Start",
  guide: "Guide",
  qa: "Q&A",
  liturgy: "Liturgy",
  audio: "Audio",
  library: "Library",
  hymns: "Hymns",
  parish: "Parish",
};

export function NavigationAid({
  section,
  prayerTab,
  readTab,
  learnTab,
}: {
  section: AppSection;
  prayerTab: PrayerTab;
  readTab: ReadTab;
  learnTab: LearnTab;
  onNavigate: (to: TargetRoute) => void;
  onOpenRoute: (path: string) => void;
}) {
  const copy = sectionCopy[section];
  const activeTab = section === "pray" ? prayerTab : section === "read" ? readTab : section === "learn" ? learnTab : "Overview";
  const activeLabel = typeof activeTab === "string" ? tabLabels[activeTab] ?? activeTab : activeTab;

  return (
    <div className="rounded-3xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>{copy.title}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{activeLabel}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.purpose}</p>
        </div>
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs font-semibold">
          Use bottom tabs to move around
        </Badge>
      </div>
    </div>
  );
}
