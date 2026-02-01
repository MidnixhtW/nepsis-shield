// Update this page (the content is just a fallback if you fail to update the page)

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/app/AppHeader";
import { AppShell, type AppSection } from "@/components/app/AppShell";
import { DailyReadings } from "@/components/app/DailyReadings";
import { DailyReflection } from "@/components/app/DailyReflection";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { LearnHub } from "@/components/app/LearnHub";
import { PrayerBook } from "@/components/app/PrayerBook";
import { TodayOverview } from "@/components/app/TodayOverview";
import NotFound from "@/pages/NotFound";

const SECTIONS: AppSection[] = [
  "today",
  "prayers",
  "counter",
  "readings",
  "reflection",
  "catechesis",
];

function isSection(x: string | undefined): x is AppSection {
  return !!x && (SECTIONS as string[]).includes(x);
}

const Index = () => {
  const navigate = useNavigate();
  const params = useParams();

  const initial = useMemo<AppSection>(() => {
    if (!params.section) return "today";
    if (isSection(params.section)) return params.section;
    return "today";
  }, [params.section]);

  const [section, setSection] = useState<AppSection>(initial);

  useEffect(() => {
    if (!params.section) {
      setSection("today");
      return;
    }
    if (!isSection(params.section)) return;
    setSection(params.section);
  }, [params.section]);

  if (params.section && !isSection(params.section)) {
    return <NotFound />;
  }

  function onSectionChange(next: AppSection) {
    setSection(next);
    navigate(next === "today" ? "/today" : `/${next}`);
  }

  return (
    <AppShell header={<AppHeader />} section={section} onSectionChange={onSectionChange}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {section === "today" ? <TodayOverview onNavigate={onSectionChange} /> : null}
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