import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, type LucideIcon } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

const SECTIONS: AppSection[] = ["today", "pray", "read", "learn"];

type SectionTarget = {
  section: AppSection;
  tab?: PrayerTab | LearnTab | string;
  read?: ReadTab | string;
};

type Interest = {
  id: string;
  title: string;
  selected?: boolean;
  icon: LucideIcon;
  tone: string;
};

function isSection(x: string | undefined): x is AppSection {
  return !!x && (SECTIONS as string[]).includes(x);
}

const legacyMap: Record<string, { section: AppSection; tab?: string }> = {
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
  return x === "welcome" || x === "path" || x === "challenges" || x === "guide" || x === "qa" || x === "liturgy" || x === "audio" || x === "library" || x === "hymns" || x === "parish";
}

function resumeLabel(to: SectionTarget) {
  if (to.section === "pray") return to.tab === "daily" ? "Continue prayer" : "Return to Prayer";
  if (to.section === "read") return "Continue reading";
  if (to.section === "learn") return "Return to tools";
  return "Return to Today";
}

function OnboardingScreen({
  step,
  stepIndex,
  onBack,
  onNext,
}: {
  step: 0 | 1;
  stepIndex: number;
  onBack?: () => void;
  onNext: () => void;
}) {
  const interests: Interest[] = [
    { id: "lent", title: "Lent: The Way", icon: ChevronRight, tone: "from-amber-200 to-amber-400" },
    { id: "sleep", title: "Sleep Meditations", icon: ChevronRight, tone: "from-sky-300 to-blue-600" },
    { id: "kids", title: "Kids' Prayers", icon: ChevronRight, tone: "from-indigo-500 to-slate-900", selected: true },
    { id: "quick", title: "Quick Prayers", icon: ChevronRight, tone: "from-rose-200 to-orange-300" },
    { id: "daily", title: "Daily Meditation", icon: ChevronRight, tone: "from-emerald-700 to-stone-500", selected: true },
    { id: "rosary", title: "Rosary", icon: ChevronRight, tone: "from-teal-950 to-emerald-600" },
  ];

  return (
    <div className="min-h-[100dvh] bg-white text-black">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-4 pb-4 pt-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between text-xs font-semibold">
          <div className="rounded-full bg-black px-4 py-2 text-white">screensdesign</div>
          <div className="text-neutral-500">{stepIndex === 0 ? "74" : "75"}</div>
        </div>

        {step === 0 ? (
          <>
            <button type="button" className="mb-6 w-fit" onClick={onBack} aria-label="Go back">
              <ArrowLeft className="h-8 w-8" />
            </button>
            <h1 className="max-w-[16rem] text-4xl font-extrabold leading-tight tracking-tight">How do you want to pray?</h1>
            <p className="mt-4 text-2xl font-light text-neutral-700">Choose 2 or more interests</p>

            <div className="mt-8 grid grid-cols-2 gap-5 pb-32">
              {interests.map((interest) => (
                <button key={interest.id} type="button" className="text-left">
                  <div className={cn("relative aspect-[1.25/1] overflow-hidden rounded-[1.5rem] bg-gradient-to-br shadow-sm", interest.tone)}>
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_left,_white,_transparent_45%),radial-gradient(circle_at_bottom_right,_white,_transparent_35%)]" />
                    {interest.selected ? (
                      <div className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-black shadow">
                        <Check className="h-5 w-5" />
                      </div>
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <p className="mt-3 text-center text-lg font-semibold">{interest.title}</p>
                </button>
              ))}
            </div>

            <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md px-4 pb-5 pt-8">
              <Button type="button" className="h-16 w-full rounded-full bg-black text-xl font-semibold text-white hover:bg-black/90" onClick={onNext}>
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-10 text-[2.1rem] font-extrabold leading-tight tracking-tight">What’s your full name?</h1>
            <div className="mt-8 text-[2.15rem] font-light text-neutral-900">
              Julia Screens
              <span className="ml-1 inline-block h-12 w-0.5 animate-pulse bg-sky-500 align-middle" />
            </div>

            <div className="mt-auto pb-36">
              <Button type="button" className="h-16 w-full rounded-full bg-black text-xl font-semibold text-white hover:bg-black/90" onClick={onNext}>
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function QuickActions({ onNavigate, onOpenRoute }: { onNavigate: (to: SectionTarget) => void; onOpenRoute: (path: string) => void }) {
  const actions = [
    { label: "Pray", helper: "Begin the daily rule.", onClick: () => onNavigate({ section: "pray", tab: "daily" }) },
    { label: "Calm down", helper: "Use the Jesus Prayer reset.", onClick: () => onNavigate({ section: "pray", tab: "counter" }) },
    { label: "Read Scripture", helper: "Open today’s readings.", onClick: () => onNavigate({ section: "read", read: "daily" }) },
    { label: "Learn the faith", helper: "Open the guide and path.", onClick: () => onNavigate({ section: "learn", tab: "path" }) },
    { label: "Find a saint", helper: "Search patrons and intercession.", onClick: () => onOpenRoute("/saints") },
    { label: "Prepare", helper: "Confession and examination.", onClick: () => onNavigate({ section: "pray", tab: "prep" }) },
  ];

  return (
    <Card className="rounded-3xl border-border/45 bg-card/85 p-4 shadow-sm">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">I want to...</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">Choose one next step</h2>
          </div>
          <Button type="button" variant="ghost" className="rounded-xl" onClick={() => onOpenRoute("/download")}>
            Share / install
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Button key={action.label} type="button" variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left" onClick={action.onClick}>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight">{action.label}</span>
                <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{action.helper}</span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [onboardingStep, setOnboardingStep] = useState<0 | 1>(0);

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
    navigate(nextSection === "today" ? "/today" : qs ? `/${nextSection}` : `/${nextSection}`);
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

  return section === "today" && onboardingStep < 2 ? (
    <OnboardingScreen
      step={onboardingStep}
      stepIndex={onboardingStep}
      onBack={onboardingStep === 0 ? undefined : () => setOnboardingStep(0)}
      onNext={() => setOnboardingStep((current) => ((current + 1) as 0 | 1))}
    />
  ) : (
    <div className="min-h-screen bg-background text-foreground">
      <AppShell
        section={section}
        onSectionChange={onSectionChange}
        header={<div className="px-4 pt-4 sm:px-6 lg:px-8"><OrthodoxHero onAction={navigateTo} /></div>}
      >
        {section === "today" ? (
          <>
            <div className="px-4 sm:px-6 lg:px-8">
              <QuickActions onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
            </div>
            <div className="px-4 pb-6 sm:px-6 lg:px-8">
              <TodayOverview onNavigate={navigateTo} />
            </div>
          </>
        ) : null}
        {section === "pray" ? <PrayerHub tab={prayerTab} onTabChange={setPrayerTab} /> : null}
        {section === "read" ? <ReadHub tab={readTab} onTabChange={setSearchParams} /> : null}
        {section === "learn" ? <LearnHub tab={learnTab} onTabChange={setLearnTab} /> : null}
      </AppShell>
      <QuickStartDialog />
    </div>
  );
};

export default Index;
