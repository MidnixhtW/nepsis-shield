import { Hand } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyPrayerFlow } from "@/components/app/DailyPrayerFlow";
import { PrayerRule } from "@/components/app/PrayerRule";
import { PrayerBook } from "@/components/app/PrayerBook";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { DailyReflection } from "@/components/app/DailyReflection";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { StillnessTimer } from "@/components/app/StillnessTimer";
import { ConfessionPrep } from "@/components/app/ConfessionPrep";
import { SectionBar } from "@/components/app/SectionBar";
import { FirstStepHint } from "@/components/app/FirstStepHint";

export type PrayerTab = "daily" | "rule" | "prayers" | "counter" | "prep" | "journal";

export function PrayerHub({
  tab,
  onTabChange,
}: {
  tab: PrayerTab;
  onTabChange: (t: PrayerTab) => void;
  onHome?: () => void;
}) {

  return (

    <div className="grid gap-4">
      <SectionBar
        title="Prayer"
        hint="Choose one practice; use the tabs only as needed."
      />

      {tab !== "daily" ? (
        <FirstStepHint
          title="Return to the simplest path"
          description="Daily prayer is the cleanest starting point when the tools feel like too much."
          actionLabel="Open Daily"
          icon={<Hand className="h-4 w-4" />}
          onAction={() => onTabChange("daily")}
        />
      ) : null}

      <Tabs value={tab} onValueChange={(v) => onTabChange(v as PrayerTab)}>

        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/20 p-1 sm:grid-cols-6">
          <TabsTrigger
            value="daily"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            value="rule"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <span className="hidden sm:inline">Rule</span>
            <span className="sm:hidden">Rule</span>
          </TabsTrigger>
          <TabsTrigger
            value="prayers"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Texts
          </TabsTrigger>
          <TabsTrigger
            value="counter"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Practice
          </TabsTrigger>
          <TabsTrigger
            value="prep"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Prep
          </TabsTrigger>
          <TabsTrigger
            value="journal"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <DailyPrayerFlow />
        </TabsContent>

        <TabsContent value="rule" className="mt-4">
          <PrayerRule />
        </TabsContent>

        <TabsContent value="prayers" className="mt-4">
          <PrayerBook showRule={false} />
        </TabsContent>

        <TabsContent value="counter" className="mt-4">
          <div className="grid gap-4">
            <JesusPrayerCounter />
            <StillnessTimer />
          </div>
        </TabsContent>

        <TabsContent value="prep" className="mt-4">
          <div className="grid gap-4">
            <PreparationChecklist />
            <ConfessionPrep />
          </div>
        </TabsContent>

        <TabsContent value="journal" className="mt-4">
          <DailyReflection />
        </TabsContent>
      </Tabs>
    </div>
  );
}