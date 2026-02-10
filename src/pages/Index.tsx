// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell, type AppSection } from "@/components/app/AppShell";
import { DailyReadings } from "@/components/app/DailyReadings";
import { LearnHub } from "@/components/app/LearnHub";
import { PrayerHub, type PrayerTab } from "@/components/app/PrayerHub";
import { TodayOverview } from "@/components/app/TodayOverview";
import { AppFooter } from "@/components/app/AppFooter";
import NotFound from "@/pages/NotFound";

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

    // Keep tab state only where it makes sense.
    if (next !== "pray") nextParams.delete("tab");

    navigate(next === "today" ? "/today" : `/${next}?${nextParams.toString()}`);
  }

  const prayerTab = (searchParams.get("tab") as PrayerTab | null) ?? "rule";

  function setPrayerTab(t: PrayerTab) {
    const next = new URLSearchParams(searchParams);
    next.set("tab", t);
    setSearchParams(next, { replace: true });
  }

  return (
    <AppShell header={<AppHeader />} section={section} onSectionChange={onSectionChange}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {section === "today" ? (
          <TodayOverview
            onNavigate={(to) => {
              const next = new URLSearchParams(searchParams);
              if (to.section === "pray" && to.tab) next.set("tab", to.tab);
              else next.delete("tab");
              navigate(`/${to.section}?${next.toString()}`);
              setSection(to.section);
            }}
          />
        ) : null}

        {section === "pray" ? (
          <PrayerHub tab={prayerTab} onTabChange={setPrayerTab} />
        ) : null}

        {section === "read" ? <DailyReadings /> : null}
        {section === "learn" ? <LearnHub /> : null}

        <AppFooter />
      </div>
    </AppShell>
  );
};

export default Index;