import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Crosshair, Settings2, Wand2 } from "lucide-react";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell, type AppSection } from "@/components/app/AppShell";
import { LearnHub, type LearnTab } from "@/components/app/LearnHub";
import { PrayerHub, type PrayerTab } from "@/components/app/PrayerHub";
import { ReadHub, type ReadTab } from "@/components/app/ReadHub";
import { TodayOverview } from "@/components/app/TodayOverview";
import { AppFooter } from "@/components/app/AppFooter";
import NotFound from "@/pages/NotFound";
import { OrthodoxHero } from "@/components/app/YoungAdultHero";
import { TodaySaintTile } from "@/components/app/TodaySaintTile";
import { QuickStartDialog } from "@/components/app/QuickStartDialog";
import { HighlightCard } from "@/components/app/HighlightCard";
import { ApkUpdateBanner } from "@/components/app/ApkUpdateBanner";
import { Button } from "@/components/ui/button";

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
  return x === "daily" || x === "rule" || x === "prayers" || x === "counter" || x === "prep" || x === "journal";
}

function isReadTab(x: string | null): x is ReadTab {
  return x === "daily" || x === "bible" || x === "plans";
}

function isLearnTab(x: string | null): x is LearnTab {
  return x === "welcome" || x === "guide" || x === "qa" || x === "library" || x === "hymns" || x === "parish";
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

      <div className="grid gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <ApkUpdateBanner />

        {section === "today" ? (
          <div className="grid gap-4">
            <OrthodoxHero onAction={navigateTo} />

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.5fr)] xl:items-start">
              <TodayOverview onNavigate={navigateTo} onOpenRoute={(path) => navigate(path)} />
              <TodaySaintTile onOpenSaints={() => navigate("/saints")} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <HighlightCard
                eyebrow="Field manual"
                title="Duty, stress, travel, grief, and courage"
                description="Open short prayers, practical steps, and pastoral safety notes for demanding environments."
                icon={<Crosshair className="h-5 w-5 text-primary" />}
                actions={
                  <Button
                    type="button"
                    variant="outline"
                    className="tap rounded-2xl border-border/60 bg-background/60"
                    onClick={() => navigate("/field-manual")}
                  >
                    Open Field Manual
                  </Button>
                }
              />

              <HighlightCard
                eyebrow="Setup"
                title="Calendar, jurisdiction, hymns"
                description="Adjust daily readings, fasting guidance, source links, and hymns when you need to."
                icon={<Wand2 className="h-5 w-5 text-primary" />}
                actions={
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      className="tap rounded-2xl border-border/60 bg-background/60"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings2 className="mr-2 h-4 w-4" /> Settings
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="tap rounded-2xl border-border/60 bg-background/60"
                      onClick={() => navigateTo({ section: "learn", tab: "hymns" })}
                    >
                      Hymns
                    </Button>
                  </>
                }
              />
            </div>
          </div>
        ) : null}

        {section === "pray" ? <PrayerHub tab={prayerTab} onTabChange={setPrayerTab} /> : null}
        {section === "read" ? <ReadHub tab={readTab} onTabChange={setReadTab} /> : null}
        {section === "learn" ? <LearnHub tab={learnTab} onTabChange={setLearnTab} /> : null}

        <AppFooter />
      </div>
    </AppShell>
  );
};

export default Index;
