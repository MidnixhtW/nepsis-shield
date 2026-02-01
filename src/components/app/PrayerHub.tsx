import { ScrollText, Sparkles, Target, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrayerRule } from "@/components/app/PrayerRule";
import { PrayerBook } from "@/components/app/PrayerBook";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { DailyReflection } from "@/components/app/DailyReflection";

export type PrayerTab = "rule" | "prayers" | "counter" | "journal";

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
        <TabsList
          className={cn(
            "w-full justify-start gap-1 rounded-2xl bg-muted/30 p-1",
            "flex overflow-x-auto [-webkit-overflow-scrolling:touch]",
          )}
        >
          <TabsTrigger value="rule" className="rounded-xl px-3">
            <BookMarked className="mr-2 h-4 w-4" /> Rule
          </TabsTrigger>
          <TabsTrigger value="prayers" className="rounded-xl px-3">
            <ScrollText className="mr-2 h-4 w-4" /> Texts
          </TabsTrigger>
          <TabsTrigger value="counter" className="rounded-xl px-3">
            <Target className="mr-2 h-4 w-4" /> Counter
          </TabsTrigger>
          <TabsTrigger value="journal" className="rounded-xl px-3">
            <Sparkles className="mr-2 h-4 w-4" /> Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rule" className="mt-4">
          <PrayerRule />
        </TabsContent>

        <TabsContent value="prayers" className="mt-4">
          <PrayerBook showRule={false} />
        </TabsContent>

        <TabsContent value="counter" className="mt-4">
          <JesusPrayerCounter />
        </TabsContent>

        <TabsContent value="journal" className="mt-4">
          <DailyReflection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
