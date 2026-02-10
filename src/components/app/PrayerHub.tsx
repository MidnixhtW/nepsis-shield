import { ScrollText, Sparkles, Target, BookMarked, ClipboardCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrayerRule } from "@/components/app/PrayerRule";
import { PrayerBook } from "@/components/app/PrayerBook";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { DailyReflection } from "@/components/app/DailyReflection";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { StillnessTimer } from "@/components/app/StillnessTimer";
import { ConfessionPrep } from "@/components/app/ConfessionPrep";

export type PrayerTab = "rule" | "prayers" | "counter" | "prep" | "journal";

export function PrayerHub({
  tab,
  onTabChange,
}: {
  tab: PrayerTab;
  onTabChange: (t: PrayerTab) => void;
}) {
  return (
    <div className="grid gap-4">
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as PrayerTab)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/30 p-1 sm:grid-cols-5">
          <TabsTrigger
            value="rule"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <BookMarked className="h-4 w-4 sm:mr-2" /> Rule
          </TabsTrigger>
          <TabsTrigger
            value="prayers"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <ScrollText className="h-4 w-4 sm:mr-2" /> Texts
          </TabsTrigger>
          <TabsTrigger
            value="counter"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Target className="h-4 w-4 sm:mr-2" /> Practice
          </TabsTrigger>
          <TabsTrigger
            value="prep"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <ClipboardCheck className="h-4 w-4 sm:mr-2" /> Prep
          </TabsTrigger>
          <TabsTrigger
            value="journal"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <Sparkles className="h-4 w-4 sm:mr-2" /> Journal
          </TabsTrigger>
        </TabsList>

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