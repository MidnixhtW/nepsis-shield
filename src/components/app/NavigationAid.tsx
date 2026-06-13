import { BookOpen, Hand, Home, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    purpose: "Your home base for the next clear step.",
  },
  pray: {
    title: "Prayer",
    purpose: "Prayer rule, Jesus Prayer, confession prep, and journal.",
  },
  read: {
    title: "Read",
    purpose: "Daily readings, Bible browsing, and reading plans.",
  },
  learn: {
    title: "Tools",
    purpose: "Q&A, liturgy help, audio, hymns, parish resources, and library links.",
  },
};

const tabLabels: Record<string, string> = {
  daily: "Daily",
  rule: "Rule",
  prayers: "Texts",
  counter: "Practice",
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

const appMap = [
  { label: "Today", icon: <Home className="h-4 w-4" />, to: { section: "today" as AppSection } },
  { label: "Prayer", icon: <Hand className="h-4 w-4" />, to: { section: "pray" as AppSection, tab: "daily" } },
  { label: "Read", icon: <BookOpen className="h-4 w-4" />, to: { section: "read" as AppSection, read: "daily" } },
  { label: "Tools", icon: <Map className="h-4 w-4" />, to: { section: "learn" as AppSection, tab: "welcome" } },
];

export function NavigationAid({
  section,
  prayerTab,
  readTab,
  learnTab,
  onNavigate,
}: {
  section: AppSection;
  prayerTab: PrayerTab;
  readTab: ReadTab;
  learnTab: LearnTab;
  onNavigate: (to: TargetRoute) => void;
  onOpenRoute: (path: string) => void;
}) {
  const copy = sectionCopy[section];
  const activeTab = section === "pray" ? prayerTab : section === "read" ? readTab : section === "learn" ? learnTab : "overview";
  const activeLabel = activeTab === "overview" ? "Overview" : tabLabels[activeTab] ?? activeTab;

  return (
    <Card className="rounded-3xl border-border/60 bg-card/80 p-3 shadow-sm backdrop-blur-xl sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {copy.title}
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
              {activeLabel}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.purpose}</p>
        </div>

        <div className="grid grid-cols-4 gap-1 rounded-2xl border border-border/60 bg-background/45 p-1 lg:min-w-[360px]">
          {appMap.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant={item.to.section === section ? "secondary" : "ghost"}
              className="tap h-10 rounded-xl px-1 text-xs font-semibold"
              onClick={() => onNavigate(item.to)}
            >
              <span className={item.to.section === section ? "mr-1.5 text-primary" : "mr-1.5 text-muted-foreground"}>
                {item.icon}
              </span>
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
