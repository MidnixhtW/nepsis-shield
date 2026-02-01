// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { AppHeader } from "@/components/app/AppHeader";
import {
  APP_SECTIONS,
  type AppSection,
  AppShell,
  useAppSection,
} from "@/components/app/AppShell";
import { DailyReadings } from "@/components/app/DailyReadings";
import { DailyReflection } from "@/components/app/DailyReflection";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { LearnHub } from "@/components/app/LearnHub";
import { PrayerBook } from "@/components/app/PrayerBook";
import { TodayOverview } from "@/components/app/TodayOverview";

function isAppSection(x: string | null): x is AppSection {
  return x != null && (APP_SECTIONS as string[]).includes(x);
}

const Index = () => {
  const [params, setParams] = useSearchParams();
  const location = useLocation();

  const initialSection = useMemo(() => {
    const fromUrl = params.get("section");
    return isAppSection(fromUrl) ? fromUrl : "today";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { section, setSection } = useAppSection(initialSection);

  // Handle back/forward: if the URL section changes, reflect it.
  useEffect(() => {
    const fromUrl = params.get("section");
    if (isAppSection(fromUrl) && fromUrl !== section) setSection(fromUrl);
    if (!fromUrl && section !== "today") {
      // Default back to today if param removed.
      setSection("today");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // When section changes, keep it reflected in the URL.
  useEffect(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (section === "today") next.delete("section");
        else next.set("section", section);
        return next;
      },
      { replace: true },
    );
  }, [section, setParams]);

  return (
    <AppShell
      header={<AppHeader />}
      section={section}
      onSectionChange={setSection}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {section === "today" ? <TodayOverview onNavigate={setSection} /> : null}
        {section === "prayers" ? <PrayerBook /> : null}
        {section === "counter" ? <JesusPrayerCounter /> : null}
        {section === "readings" ? <DailyReadings /> : null}
        {section === "reflection" ? <DailyReflection /> : null}
        {section === "catechesis" ? <LearnHub /> : null}
      </div>
    </AppShell>
  );
};

export default Index;