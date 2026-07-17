import { useEffect, useMemo, useState } from "react";
import { BookOpen, Compass, Search, Share2, ShieldCheck, Siren, Target } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell, type AppSection } from "@/components/app/AppShell";
import { LearnHub, type LearnTab } from "@/components/app/LearnHub";
import { PrayerHub, type PrayerTab } from "@/components/app/PrayerHub";
import { ReadHub, type ReadTab } from "@/components/app/ReadHub";
import { TodayOverview } from "@/components/app/TodayOverview";
import { AppFooter } from "@/components/app/AppFooter";
import NotFound from "@/pages/NotFound";
import { OrthodoxHero } from "@/components/app/YoungAdultHero";
import { QuickStartDialog } from "@/components/app/QuickStartDialog";
import { saveGlobalResume } from "@/lib/dailyHabits";

const SECTIONS: AppSection[] = ["today", "pray", "read", "learn"];

type SectionTarget = {
  section: AppSection;
  tab?: PrayerTab | LearnTab | string;
  read?: ReadTab | string;
};

function isSection(x: string | undefined): x is AppSection {
  return !!x && (SECTIONS as string[]).includes(x);
}

const legacyMap: Record<
  string,
  { section: AppSection; tab?: string }
> = {
  prayers: { section: "pray", tab: "prayers" },
  counter: { section: "pray", tab: "counter" },
  reflection: { section: "pray", tab: "journal" },
  readings: { section: "read" },
  catechesis: { section: "learn" },
  today: { section: "today" },
};

function isPrayerTab(x: string | null): x is PrayerTab {
  return x === "daily" || x === "rule" || x === "prayers" || x === "counter" || x === "prep" || x === "journal" || x === "sleep";
}

function isReadTab(x: string | null): x is ReadTab {
  return x === "daily" || x === "bible" || x === "plans";
}

function isLearnTab(x: string | null): x is LearnTab {
  return (
    x === "welcome" ||
    x === "path" ||
    x === "challenges" ||
    x === "guide" ||
    x === "qa" ||
    x === "liturgy" ||
    x === "audio" ||
    x === "library" ||
    x === "hymns" ||
    x === "parish"
  );
}

function resumeLabel(to: SectionTarget) {
  if (to.section === "pray") return to.tab === "daily" ? "Continue prayer" : "Return to Prayer";
  if (to.section === "read") return "Continue reading";
  if (to.section === "learn") return "Return to tools";
  return "Return to Today";
}

function QuickActions({ onNavigate, onOpenRoute }: { onNavigate: (to: SectionTarget) => void; onOpenRoute: (path: string) => void }) {
  const actions = [
    {
      label: "Pray",
      helper: "Begin the daily rule.",
      icon: <Target className="h-4 w-4" />,
      onClick: () => onNavigate({ section: "pray", tab: "daily" }),
    },
    {
      label: "Calm down",
      helper: "Use the Jesus Prayer reset.",
      icon: <Siren className="h-4 w-4" />,
      onClick: () => onNavigate({ section: "pray", tab: "counter" }),
    },
    {
      label: "Read Scripture",
      helper: "Open today’s readings.",
      icon: <BookOpen className="h-4 w-4" />,
      onClick: () => onNavigate({ section: "read", read: "daily" }),
    },
    {
      label: "Learn the faith",
      helper: "Open the guide and path.",
      icon: <Compass className="h-4 w-4" />,
      onClick: () => onNavigate({ section: "learn", tab: "path" }),
    },
    {
      label: "Find a saint",
      helper: "Search patrons and intercession.",
      icon: <Search className="h-4 w-4" />,
      onClick: () => onOpenRoute("/saints"),
    },
    {
      label: "Prepare",
      helper: "Confession and examination.",
      icon: <ShieldCheck className="h-4 w-4" />,
      onClick: () => onNavigate({ section: "pray", tab: "prep" }),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">I want to...</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Choose one next step</h2>
        </div>
        <Button type="button" variant="ghost" className="rounded-[1.15rem]" onClick={() => onOpenRoute("/download")}>
          <Share2 className="mr-2 h-4 w-4" /> Share / install
        </Button>
      </div>

      <div className="-mx-6 overflow-x-auto px-6 pb-2">
        <div className="flex snap-x snap-mandatory gap-4">
          {actions.map((action) => (
            <Card
              key={action.label}
              className="snap-start rounded-[1.25rem] border-0 bg-card/70 p-3 shadow-lg shadow-foreground/5 backdrop-blur-xl"
            >
              <Button
                type="button"
                variant="ghost"
                className="tap h-36 w-56 flex-col items-start justify-between rounded-2xl bg-background/45 p-4 text-left hover:bg-background/65"
                onClick={action.onClick}
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  {action.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-semibold leading-tight">{action.label}</span>
                  <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{action.helper}</span>
                </span>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  const navigate = useNavigate();

  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const raw = params.section;
    if (!raw) return;
    if (isSection(raw)) return;

    const mapped = legacyMap[raw];
    if (!mapped) return;

    const next = new URLSearchParams(searchParams);
    if (mapped.tab) next.set("tab", mapped.tab);
    else next.delete("tab");

    const qs = next.toString();
    navigate(qs ? `/${mapped.section}?${qs}` : `/${mapped.section}`, { replace: true });
  }, [navigate, params.section, searchParams]);

  const initial = useMemo<AppSection>(() => {
    if (!params.section) return "today";
    if (isSection(params.section)) return params.section;
    if (legacyMap[params.section]) return legacyMap[params.section].section;
    return "today";
  }, [params.section]);

  const [section, setSection] = useState<AppSection>(initial);

  useEffect(() => {
    if (!params.section) {
      setSection("today");
      return;
    }

    if (isSection(params.section)) {
      setSection(params.section);
      return;
    }

    const mapped = legacyMap[params.section];
    if (mapped) setSection(mapped.section);
  }, [params.section]);

  if (params.section && !isSection(params.section) && !legacyMap[params.section]) {
    return <NotFound />;
  }

  function navigateTo(to: SectionTarget) {
    const next = new URLSearchParams(searchParams);

    if ((to.section === "pray" || to.section === "learn") && to.tab) next.set("tab", to.tab);
    else next.delete("tab");

    if (to.section === "read" && to.read) next.set("read", to.read);
    else next.delete("read");

    saveGlobalResume({
      label: resumeLabel(to),
      helper: to.section === "today" ? "Home base" : "Last place you opened.",
      target: { section: to.section, tab: to.tab, read: to.read },
    });

    const qs = next.toString();
    navigate(to.section === "today" ? "/today" : qs ? `/${to.section}?${qs}` : `/${to.section}`);
    setSection(to.section);
  }

  function onSectionChange(nextSection: AppSection) {
    const nextParams = new URLSearchParams(searchParams);
    const tab = nextParams.get("tab");
    const read = nextParams.get("read");

    if (nextSection === "pray") {
      if (!isPrayerTab(tab)) nextParams.delete("tab");
    } else if (nextSection === "learn") {
      if (!isLearnTab(tab)) nextParams.delete("tab");
    } else {
      nextParams.delete("tab");
    }

    if (nextSection === "read") {
      if (!isReadTab(read)) nextParams.delete("read");
    } else {
      nextParams.delete("read");
    }

    const qs = nextParams.toString();
    navigate(nextSection === "today" ? "/today" : qs ? `/${nextSection}?${qs}` : `/${nextSection}`);
    setSection(nextSection);
  }

  const prayerTabRaw = searchParams.get("tab");
  const prayerTab: PrayerTab = isPrayerTab(prayerTabRaw) ? prayerTabRaw : "daily";

  function setPrayerTab(t: PrayerTab) {
    const next = new URLSearchParams(searchParams);
    next.set("tab", t);
    setSearchParams(next, { replace: true });
  }

  const learnTab: LearnTab = isLearnTab(prayerTabRaw) ? prayerTabRaw : "welcome";

  function setLearnTab(t: LearnTab) {
    const next = new URLSearchParams(searchParams);
    next.set("tab", t);
    setSearchParams(next, { replace: true });
  }

  const readTabRaw = searchParams.get("read");
  const readTab: ReadTab = isReadTab(readTabRaw) ? readTabRaw : "daily";

  function setReadTab(t: ReadTab) {
    const next = new URLSearchParams(searchParams);
    next.set("read", t);
    setSearchParams(next, { replace: true });
  }

  return (
    <AppShell header={<AppHeader />} section={section} onSectionChange={onSectionChange}>
      <QuickStartDialog />

      <div className="animate-in flex flex-col gap-8 fade-in slide-in-from-bottom-2 duration-500">
        {section === "today" ? (
          <div className="flex flex-col gap-8">
            <OrthodoxHero onAction={navigateTo} />
            <QuickActions onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
            <TodayOverview onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
          </div>
        ) : null}

        {section === "pray" ? (
          <PrayerHub tab={prayerTab} onTabChange={setPrayerTab} onHome={() => navigateTo({ section: "today" })} />
        ) : null}
        {section === "read" ? (
          <ReadHub tab={readTab} onTabChange={setReadTab} onHome={() => navigateTo({ section: "today" })} />
        ) : null}
        {section === "learn" ? (
          <LearnHub tab={learnTab} onTabChange={setLearnTab} onHome={() => navigateTo({ section: "today" })} />
        ) : null}

        <AppFooter />
      </div>

    </AppShell>
  );
};

export default Index;
