// Update this page (the content is just a fallback if you fail to update the page)

import { AppHeader } from "@/components/app/AppHeader";
import { AppShell, useAppSection } from "@/components/app/AppShell";
import { DailyReadings } from "@/components/app/DailyReadings";
import { DailyReflection } from "@/components/app/DailyReflection";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { LearnHub } from "@/components/app/LearnHub";
import { PrayerBook } from "@/components/app/PrayerBook";
import { TodayOverview } from "@/components/app/TodayOverview";

const Index = () => {
  const { section, setSection } = useAppSection();

  return (
    <AppShell header={<AppHeader />} section={section} onSectionChange={setSection}>
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