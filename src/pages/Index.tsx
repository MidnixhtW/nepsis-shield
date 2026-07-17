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

function StructuralBlueprint() {
  const cards = [
    { title: "Morning Reflection", subtitle: "Start your day with quiet stillness.", time: "8 min" },
    { title: "Midday Reset", subtitle: "Return to prayer without friction.", time: "4 min" },
    { title: "Evening Examen", subtitle: "Close the day in peace.", time: "10 min" },
    { title: "Night Watch", subtitle: "A silent rule for rest.", time: "6 min" },
  ];

  return (
    <section className="space-y-8 rounded-[2rem] border border-stone-800/70 bg-stone-950/70 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-500/75">Daily Featured</p>
          <div className="rounded-[2rem] border border-stone-800/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] p-6 sm:p-8">
            <div className="flex min-h-[280px] flex-col justify-between gap-6 rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.18),rgba(12,10,9,0.96)_60%)] p-6 ring-1 ring-amber-500/10">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">Featured today</p>
                <h2 className="max-w-md text-3xl font-semibold tracking-tight text-stone-50 sm:text-4xl">Morning Reflection</h2>
                <p className="max-w-sm text-sm leading-6 text-stone-300">Start your day with quiet stillness.</p>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="max-w-sm rounded-2xl border border-amber-500/15 bg-stone-950/50 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-500/70">Rule of vigilance</p>
                  <p className="mt-2 text-sm text-stone-300">A generous, immersive starting point that feels calm, sacred, and easy to enter.</p>
                </div>
                <div className="hidden rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:block">
                  Gentle entry
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-500/75">Recent sessions</p>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {cards.map((card) => (
            <div
              key={card.title}
              className="min-h-[160px] min-w-[160px] rounded-[1.4rem] border border-stone-800/70 bg-stone-900/70 p-4 text-left shadow-sm"
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-100">{card.title}</p>
                  <p className="mt-2 text-xs leading-5 text-stone-400">{card.subtitle}</p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-500/75">{card.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HallowStyleOnboarding() {
  const steps = [
    {
      title: "The Native Bell",
      body: "Quiet your heart. Leave the noise of the world behind.",
      accent: "amber",
    },
    {
      title: "The Pilgrim's Path",
      body: "A short spiritual diagnostic helps shape a personal rule.",
      accent: "stone",
    },
    {
      title: "The Spiritual Rule",
      body: "Morning, midday, and night practices are gathered into one rhythm.",
      accent: "amber",
    },
  ];

  return (
    <section className="space-y-6 rounded-[2rem] border border-stone-800/70 bg-stone-950/80 p-4 sm:p-6">
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-amber-500/75">Onboarding</p>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-50">Enter the Sanctuary</h2>
        <p className="max-w-2xl text-sm leading-6 text-stone-300">A premium, Orthodox duplicate of the Hallow-style flow: immersive, guided, and centered on prayer.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[1.6rem] border border-stone-800/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">0{index + 1}</span>
              <span className={step.accent === "amber" ? "h-2 w-2 rounded-full bg-amber-400" : "h-2 w-2 rounded-full bg-stone-500"} />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-stone-50">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-300">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.8rem] border border-amber-500/15 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.18),rgba(12,10,9,0.98)_65%)] p-6">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/75">Personalized rule</p>
          <h3 className="text-2xl font-semibold tracking-tight text-stone-50">Morning, Midday, Night</h3>
          <p className="text-sm leading-6 text-stone-300">Three touchpoints, beautiful typography, soft motion, and a clear save action that feels like sealing a rule of life.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm font-semibold text-amber-100 transition-transform active:scale-[0.98]">Enter the Sanctuary</button>
          <button className="rounded-full border border-stone-700 bg-stone-900/70 px-5 py-3 text-sm font-semibold text-stone-200 transition-transform active:scale-[0.98]">Seal this Daily Rule</button>
        </div>
      </div>
    </section>
  );
}

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
    <Card className="rounded-2xl border-border/45 bg-card/85 p-4 shadow-sm">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">I want to...</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">Choose one next step</h2>
          </div>
          <Button type="button" variant="ghost" className="rounded-xl" onClick={() => onOpenRoute("/download")}>
            <Share2 className="mr-2 h-4 w-4" /> Share / install
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left"
              onClick={action.onClick}
            >
              <span className="mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                {action.icon}
              </span>
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

      <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {section === "today" ? (
          <div className="grid gap-4">
            <HallowStyleOnboarding />
            <OrthodoxHero onAction={navigateTo} />
            <StructuralBlueprint />
            <QuickActions onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
            <TodayOverview onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
          </div>
        ) : null}

        {section === "pray" ? (
          <div className="grid gap-4">
            <PrayerHub tab={prayerTab} onTabChange={setPrayerTab} onHome={() => navigateTo({ section: "today" })} />
            <div className="rounded-[2rem] border border-stone-800/70 bg-stone-950/80 p-5 text-sm leading-6 text-stone-300">
              The prayer experience should feel like a high-end liturgical media app: icon artwork, candlelit gradients, slow motion, transcript text, ambient mixer, and one clear play state.
            </div>
          </div>
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
