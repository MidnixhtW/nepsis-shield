import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { SectionIntro } from "@/components/app/SectionIntro";
import { GroundMeNow } from "@/components/app/GroundMeNow";
import { cn } from "@/lib/utils";

export type PrayerTab = "daily" | "rule" | "prayers" | "names" | "counter" | "prep" | "communion" | "journal" | "sleep";

// Eight practices in four groups, so the tab bar fits on a phone. Each tab value is still its own URL.
const groups: Array<{ id: string; label: string; items: Array<{ value: PrayerTab; label: string }> }> = [
  { id: "daily", label: "Daily", items: [{ value: "daily", label: "Daily prayer" }, { value: "rule", label: "My rule" }] },
  { id: "prayers", label: "Prayers", items: [{ value: "prayers", label: "Prayer texts" }, { value: "names", label: "Names" }] },
  { id: "stillness", label: "Stillness", items: [{ value: "counter", label: "Jesus Prayer" }, { value: "sleep", label: "Sleep" }] },
  { id: "prepare", label: "Prepare", items: [{ value: "prep", label: "Confession" }, { value: "communion", label: "Communion" }, { value: "journal", label: "Journal" }] },
];

const content: Record<PrayerTab, ReactNode> = {
  daily: <DailyPrayerFlow />,
  rule: <PrayerRule />,
  prayers: <PrayerBook showRule={false} />,
  names: <CommemorationList />,
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
  const activeGroup = groups.find((group) => group.items.some((item) => item.value === tab)) ?? groups[0];

  return (
    <div className="grid min-w-0 gap-4 sm:gap-5 lg:gap-6">
      <SectionIntro
        eyebrow="Prayer"
        title="Make room for stillness."
        description="Begin with the daily office, or choose a focused practice for the moment you are in."
        icon={<CenserIcon className="h-5 w-5" />}
      />

      <Tabs
        value={activeGroup.id}
        onValueChange={(value) => onTabChange(groups.find((group) => group.id === value)?.items[0].value ?? "daily")}
      >
        <TabsList className="premium-tabs">
          {groups.map((group) => (
            <TabsTrigger key={group.id} value={group.id} className="premium-tab flex-1">
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-4 sm:mt-5">
            <div role="group" aria-label={`${group.label} sections`} className="mb-4 inline-flex rounded-full border border-border/60 bg-card/60 p-1">
              {group.items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={tab === item.value}
                  onClick={() => onTabChange(item.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    tab === item.value ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {group.items.some((item) => item.value === tab) ? content[tab] : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
