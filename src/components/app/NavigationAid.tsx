import { BookOpen, Church, Compass, Hand, Headphones, Home, Map, Search, ShieldCheck, Sparkles, Target } from "lucide-react";
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

type QuickAction = {
  label: string;
  description: string;
  icon: React.ReactNode;
  to?: TargetRoute;
  path?: string;
};

const sectionCopy: Record<AppSection, { title: string; purpose: string; callsign: string }> = {
  today: {
    title: "Today dashboard",
    purpose: "Your daily command center: prayer, fasting, readings, saints, and the next best step.",
    callsign: "HOME BASE",
  },
  pray: {
    title: "Prayer station",
    purpose: "Daily prayer, prayer rule, Jesus Prayer practice, confession prep, and private reflection.",
    callsign: "PRAYER OPS",
  },
  read: {
    title: "Reading room",
    purpose: "Daily lectionary readings, Orthodox Bible tools, and guided reading plans.",
    callsign: "SCRIPTURE INTEL",
  },
  learn: {
    title: "Tools and formation",
    purpose: "Guides, Q&A, Liturgy companion, audio, hymns, parish finder, and trusted libraries.",
    callsign: "FIELD TOOLS",
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
  { label: "Today", detail: "daily plan", icon: <Home className="h-4 w-4" />, to: { section: "today" as AppSection } },
  { label: "Pray", detail: "rule + practice", icon: <Hand className="h-4 w-4" />, to: { section: "pray" as AppSection, tab: "daily" } },
  { label: "Read", detail: "readings + Bible", icon: <BookOpen className="h-4 w-4" />, to: { section: "read" as AppSection, read: "daily" } },
  { label: "Tools", detail: "learn + parish", icon: <Map className="h-4 w-4" />, to: { section: "learn" as AppSection, tab: "welcome" } },
];

function actionsFor(section: AppSection): QuickAction[] {
  if (section === "today") {
    return [
      { label: "Start prayer", description: "Open daily prayer", icon: <Hand className="h-4 w-4" />, to: { section: "pray", tab: "daily" } },
      { label: "Read today", description: "Open lectionary", icon: <BookOpen className="h-4 w-4" />, to: { section: "read", read: "daily" } },
      { label: "Find a saint", description: "Search lives", icon: <Sparkles className="h-4 w-4" />, path: "/saints" },
    ];
  }

  if (section === "pray") {
    return [
      { label: "Daily flow", description: "Morning/evening", icon: <Hand className="h-4 w-4" />, to: { section: "pray", tab: "daily" } },
      { label: "Jesus Prayer", description: "Counter + stillness", icon: <Target className="h-4 w-4" />, to: { section: "pray", tab: "counter" } },
      { label: "Prepare", description: "Confession tools", icon: <ShieldCheck className="h-4 w-4" />, to: { section: "pray", tab: "prep" } },
    ];
  }

  if (section === "read") {
    return [
      { label: "Lectionary", description: "Today’s readings", icon: <BookOpen className="h-4 w-4" />, to: { section: "read", read: "daily" } },
      { label: "Bible", description: "Search Scripture", icon: <Search className="h-4 w-4" />, to: { section: "read", read: "bible" } },
      { label: "Plans", description: "Guided reading", icon: <Compass className="h-4 w-4" />, to: { section: "read", read: "plans" } },
    ];
  }

  return [
    { label: "Liturgy", description: "Follow services", icon: <Church className="h-4 w-4" />, to: { section: "learn", tab: "liturgy" } },
    { label: "Audio", description: "Chant + teaching", icon: <Headphones className="h-4 w-4" />, to: { section: "learn", tab: "audio" } },
    { label: "Parish", description: "Find a church", icon: <Map className="h-4 w-4" />, to: { section: "learn", tab: "parish" } },
  ];
}

export function NavigationAid({
  section,
  prayerTab,
  readTab,
  learnTab,
  onNavigate,
  onOpenRoute,
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
    <Card className="rounded-3xl border-primary/20 bg-card/78 p-4 shadow-sm backdrop-blur-xl">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              {copy.callsign}
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
              You are here: {copy.title} / {activeLabel}
            </Badge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.purpose}</p>
        </div>

        <div className="grid gap-3">
          <div className="grid grid-cols-4 gap-1 rounded-2xl border border-border/60 bg-background/45 p-1">
            {appMap.map((item) => (
              <Button
                key={item.label}
                type="button"
                variant={item.to.section === section ? "secondary" : "ghost"}
                className="tap h-auto min-h-14 flex-col gap-1 rounded-xl px-1 py-2 text-center"
                onClick={() => onNavigate(item.to)}
              >
                <span className={item.to.section === section ? "text-primary" : "text-muted-foreground"}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-semibold leading-none">{item.label}</span>
                <span className="hidden text-[10px] font-normal leading-none text-muted-foreground sm:block">
                  {item.detail}
                </span>
              </Button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {actionsFor(section).map((action) => (
              <Button
                key={action.label}
                type="button"
                variant="outline"
                className="tap h-auto min-h-12 justify-start whitespace-normal rounded-2xl border-border/70 bg-background/55 px-3 py-2 text-left hover:border-primary/35 hover:bg-muted/60"
                onClick={() => (action.path ? onOpenRoute(action.path) : action.to ? onNavigate(action.to) : undefined)}
              >
                <span className="mr-2 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  {action.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold leading-tight">{action.label}</span>
                  <span className="mt-0.5 block text-[11px] font-normal leading-tight text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
