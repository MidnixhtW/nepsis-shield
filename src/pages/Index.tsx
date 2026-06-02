// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Wand2, Settings2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const SECTIONS: AppSection[] = ["today", "pray", "read", "learn"];

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
  return x === "rule" || x === "prayers" || x === "counter" || x === "prep" || x === "journal";
}

function isReadTab(x: string | null): x is ReadTab {
  return x === "daily" || x === "bible" || x === "plans";
}

function isLearnTab(x: string | null): x is LearnTab {
  return x === "guide" || x === "qa" || x === "library" || x === "hymns" || x === "parish";
}

const Index = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redirect old URLs to the new, simplified structure.
  useEffect(() => {
    const raw = params.section;
    if (!raw) return;
    if (isSection(raw)) return;

    const mapped = legacyMap[raw];
    if (!mapped) return;

    const next = new URLSearchParams(searchParams);
    if (mapped.tab) next.set("tab", mapped.tab);
    else next.delete("tab");

    navigate(`/${mapped.section}?${next.toString()}`, { replace: true });
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

  function onSectionChange(next: AppSection) {
    setSection(next);
    const nextParams = new URLSearchParams(searchParams);

    const tab = nextParams.get("tab");

    // Keep sub-tab state only where it makes sense (and only if it's a valid tab for that section).
    if (next === "pray") {
      if (!isPrayerTab(tab)) nextParams.delete("tab");
    } else if (next === "learn") {
      if (!isLearnTab(tab)) nextParams.delete("tab");
    } else {
      nextParams.delete("tab");
    }

    if (next !== "read") nextParams.delete("read");

    navigate(next === "today" ? "/today" : `/${next}?${nextParams.toString()}`);
  }

  const prayerTabRaw = searchParams.get("tab");
  const prayerTab: PrayerTab = isPrayerTab(prayerTabRaw) ? prayerTabRaw : "rule";

  function setPrayerTab(t: PrayerTab) {
    const next = new URLSearchParams(searchParams);
    next.set("tab", t);
    setSearchParams(next, { replace: true });
  }

  const learnTab: LearnTab = isLearnTab(prayerTabRaw) ? prayerTabRaw : "guide";

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

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {section === "today" ? (
          <div className="grid gap-4">
            <OrthodoxHero
              onAction={(to) => {
                const next = new URLSearchParams(searchParams);

                if ((to.section === "pray" || to.section === "learn") && to.tab) next.set("tab", to.tab);
                else next.delete("tab");

                if (to.section === "read" && to.read) next.set("read", to.read);
                else next.delete("read");

                navigate(`/${to.section}?${next.toString()}`);
                setSection(to.section);
              }}
            />

            <HighlightCard
              eyebrow="Pre-mission setup"
              title="Tune the app to your calendar and jurisdiction"
              description="Set your preferred calendar once so daily readings, fast guidance, and source links stay aligned while you are away from your parish."
              icon={<Wand2 className="h-5 w-5 text-primary" />}
              actions={
                <>
                  <Button
                    type="button"
                    className="tap rounded-2xl"
                    onClick={() => navigate("/settings")}
                  >
                    <Settings2 className="mr-2 h-4 w-4" /> Open settings
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="tap rounded-2xl border-border/60 bg-background/60"
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set("tab", "hymns");
                      navigate(`/learn?${next.toString()}`);
                      setSection("learn");
                    }}
                  >
                    Field hymns
                  </Button>
                </>
              }
            />

            <TodaySaintTile onOpenSaints={() => navigate("/saints")} />

            <TodayOverview
              onNavigate={(to) => {
                const next = new URLSearchParams(searchParams);

                if ((to.section === "pray" || to.section === "learn") && to.tab) next.set("tab", to.tab);
                else next.delete("tab");

                if (to.section === "read" && to.read) next.set("read", to.read);
                else next.delete("read");

                navigate(`/${to.section}?${next.toString()}`);
                setSection(to.section);
              }}
              onOpenRoute={(path) => navigate(path)}
            />
          </div>
        ) : null}

        {section === "pray" ? (
          <PrayerHub tab={prayerTab} onTabChange={setPrayerTab} />
        ) : null}

        {section === "read" ? <ReadHub tab={readTab} onTabChange={setReadTab} /> : null}
        {section === "learn" ? (
          <LearnHub tab={learnTab} onTabChange={setLearnTab} />
        ) : null}

        <AppFooter />
      </div>
    </AppShell>
  );
};

export default Index;