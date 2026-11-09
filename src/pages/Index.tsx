import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { AppHeader } from "@/components/app/AppHeader";

import { AppShell, type AppSection } from "@/components/app/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import type { LearnTab } from "@/components/app/LearnHub";
import type { PrayerTab } from "@/components/app/PrayerHub";
import type { ReadTab } from "@/components/app/ReadHub";
import { QuickStartDialog } from "@/components/app/QuickStartDialog";
import NotFound from "@/pages/NotFound";
import { saveGlobalResume } from "@/lib/dailyHabits";
import { recordVisit } from "@/lib/recentPlaces";

const loadLearnHub = () => import("@/components/app/LearnHub");
const loadPrayerHub = () => import("@/components/app/PrayerHub");
const loadReadHub = () => import("@/components/app/ReadHub");
const loadMeHub = () => import("@/components/app/MeHub");

const LearnHub = lazy(() => loadLearnHub().then((module) => ({ default: module.LearnHub })));
const PrayerHub = lazy(() => loadPrayerHub().then((module) => ({ default: module.PrayerHub })));
const ReadHub = lazy(() => loadReadHub().then((module) => ({ default: module.ReadHub })));
const TodayOverview = lazy(() => import("@/components/app/TodayOverview").then((module) => ({ default: module.TodayOverview })));
const MeHub = lazy(() => loadMeHub().then((module) => ({ default: module.MeHub })));

// Fetch the other tabs once the first screen is up, so switching tabs never shows the loading placeholder.
function preloadTabs() {
  const load = () => {
    void loadPrayerHub();
    void loadReadHub();
    void loadLearnHub();
    void loadMeHub();
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 3000 });
  else setTimeout(load, 1500);
}

// Shaped like the screen it stands in for, so the page never looks empty while a tab loads.
function SectionPlaceholder() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto grid w-full max-w-4xl gap-5">
      <Skeleton className="h-56 rounded-3xl" />
      <Skeleton className="h-36 rounded-3xl" />
      <Skeleton className="h-24 rounded-3xl" />
    </div>
  );
}
const MonasticAudioPlayer = lazy(() => import("@/components/app/MonasticAudioPlayer").then((module) => ({ default: module.MonasticAudioPlayer })));

const SECTIONS: AppSection[] = ["today", "pray", "read", "learn", "me"];

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
  return x === "daily" || x === "rule" || x === "family" || x === "prayers" || x === "names" || x === "services" || x === "groups" || x === "counter" || x === "prep" || x === "communion" || x === "journal" || x === "sleep" || x === "rosary";
}

function isReadTab(x: string | null): x is ReadTab {
  return x === "daily" || x === "bible" || x === "plans";
}

function isLearnTab(x: string | null): x is LearnTab {
  return (
    x === "welcome" ||
    x === "path" ||
    x === "challenges" ||
    x === "creed" ||
    x === "guide" ||
    x === "qa" ||
    x === "liturgy" ||
    x === "audio" ||
    x === "library" ||
    x === "hymns" ||
    x === "parish" ||
    x === "serve" ||
    x === "stories"
  );
}

function resumeLabel(to: SectionTarget) {
  if (to.section === "pray") return to.tab === "daily" ? "Continue prayer" : "Return to Prayer";
  if (to.section === "read") return "Continue reading";
  if (to.section === "learn") return "Return to tools";
  return "Return to Today";
}

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Remember the place for "Recently opened" on Me.
  useEffect(() => {
    recordVisit(location.pathname, location.search);
  }, [location.pathname, location.search]);

  useEffect(preloadTabs, []);

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

  // A tab in the bar always opens that tab's own starting screen, the way most apps behave.
  function onSectionChange(nextSection: AppSection) {
    navigate(`/${nextSection}`);
    setSection(nextSection);
  }

  // With no ?tab= the Pray and Learn tabs open on their tiles.
  const tabRaw = searchParams.get("tab");
  const prayerTab: PrayerTab | null = isPrayerTab(tabRaw) ? tabRaw : null;
  const learnTab: LearnTab | null = isLearnTab(tabRaw) ? tabRaw : null;

  const readTabRaw = searchParams.get("read");
  const readTab: ReadTab = isReadTab(readTabRaw) ? readTabRaw : "daily";

  function setReadTab(t: ReadTab) {
    const next = new URLSearchParams(searchParams);
    next.set("read", t);
    setSearchParams(next, { replace: true });
  }

  return (
    <QuickStartDialog>
    <AppShell header={<AppHeader />} section={section} onSectionChange={onSectionChange}>
      <Suspense fallback={<SectionPlaceholder />}>
        <MonasticAudioPlayer />

        <div className="grid gap-8 sm:gap-10 lg:gap-12">
          {section === "today" ? (
            <div className="mx-auto grid w-full max-w-4xl gap-5 sm:gap-6 lg:max-w-6xl">
              <TodayOverview onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
            </div>
          ) : null}

          {section === "pray" ? (
            <PrayerHub key={prayerTab ?? "home"} tab={prayerTab} />
          ) : null}
          {section === "read" ? (
            <ReadHub tab={readTab} onTabChange={setReadTab} onHome={() => navigateTo({ section: "today" })} />
          ) : null}
          {section === "learn" ? (
            <LearnHub key={learnTab ?? "home"} tab={learnTab} />
          ) : null}
          {section === "me" ? <MeHub /> : null}

        </div>
      </Suspense>
    </AppShell>
    </QuickStartDialog>
  );
};

export default Index;
