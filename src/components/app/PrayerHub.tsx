import type { ReactNode } from "react";
import { GroupedSections, type SectionGroup } from "@/components/app/GroupedSections";
import { CenserIcon } from "@/components/app/OrthodoxMotifs";
import { DailyPrayerFlow } from "@/components/app/DailyPrayerFlow";

import { PrayerRule } from "@/components/app/PrayerRule";
import { PrayerBook } from "@/components/app/PrayerBook";
import { CommemorationList } from "@/components/app/CommemorationList";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { DailyReflection } from "@/components/app/DailyReflection";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { StillnessTimer } from "@/components/app/StillnessTimer";
import { ConfessionPrep } from "@/components/app/ConfessionPrep";
import { SleepMode } from "@/components/app/SleepMode";
import { CommunionPrep } from "@/components/app/CommunionPrep";
import { ServicesLibrary } from "@/components/app/ServicesLibrary";
import { PrayerGroups } from "@/components/app/PrayerGroups";
import { FamilyPrayer } from "@/components/app/FamilyPrayer";
import { SectionIntro } from "@/components/app/SectionIntro";
import { GroundMeNow } from "@/components/app/GroundMeNow";

export type PrayerTab = "daily" | "rule" | "family" | "prayers" | "names" | "services" | "groups" | "counter" | "prep" | "communion" | "journal" | "sleep";

// Twelve practices in four groups, so the tab bar fits on a phone. Each tab value is still its own URL.
const groups: Array<SectionGroup<PrayerTab>> = [
  { id: "daily", label: "Daily", items: [{ value: "daily", label: "Daily prayer" }, { value: "rule", label: "My rule" }, { value: "family", label: "Family" }] },
  { id: "prayers", label: "Prayers", items: [{ value: "prayers", label: "Prayer texts" }, { value: "services", label: "Services" }, { value: "names", label: "Names" }, { value: "groups", label: "Groups" }] },
  { id: "stillness", label: "Stillness", items: [{ value: "counter", label: "Jesus Prayer" }, { value: "sleep", label: "Sleep" }] },
  { id: "prepare", label: "Prepare", items: [{ value: "prep", label: "Confession" }, { value: "communion", label: "Communion" }, { value: "journal", label: "Journal" }] },
];

const content: Record<PrayerTab, ReactNode> = {
  daily: <DailyPrayerFlow />,
  rule: <PrayerRule />,
  family: <FamilyPrayer />,
  prayers: <PrayerBook showRule={false} />,
  names: <CommemorationList />,
  services: <ServicesLibrary />,
  groups: <PrayerGroups />,
  counter: (
    <div className="grid gap-4 sm:gap-5"><GroundMeNow /><JesusPrayerCounter /><StillnessTimer /></div>
  ),
  sleep: <SleepMode />,
  prep: (
    <div className="grid gap-4 sm:gap-5"><PreparationChecklist /><ConfessionPrep /></div>
  ),
  communion: <CommunionPrep />,
  journal: <DailyReflection />,
};

export function PrayerHub({
  tab,
  onTabChange,
}: {
  tab: PrayerTab;
  onTabChange: (t: PrayerTab) => void;
  onHome?: () => void;
}) {
  return (
    <div className="grid min-w-0 gap-4 sm:gap-5 lg:gap-6">
      <SectionIntro
        eyebrow="Prayer"
        title="Make room for stillness."
        description="Begin with the daily office, or choose a focused practice for the moment you are in."
        icon={<CenserIcon className="h-5 w-5" />}
      />

      <GroupedSections groups={groups} tab={tab} onTabChange={onTabChange} content={content} />
    </div>
  );
}
