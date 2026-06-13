import { BookOpen } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";
import { SectionBar } from "@/components/app/SectionBar";
import { FirstStepHint } from "@/components/app/FirstStepHint";
import { ReadingPlans } from "@/components/app/ReadingPlans";

export type ReadTab = "daily" | "bible" | "plans";

export function ReadHub({
  tab,
  onTabChange,
}: {
  tab: ReadTab;
  onTabChange: (t: ReadTab) => void;
  onHome?: () => void;
}) {
  return (

    <div className="grid gap-4">
      <SectionBar
        title="Read"
        hint="Daily readings first; Bible and plans when you need more."
      />

      {tab !== "daily" ? (
        <FirstStepHint
          title="Return to Daily readings"
          description="Daily is the fastest route when browsing and plans feel like too much."
          actionLabel="Open Daily"
          icon={<BookOpen className="h-4 w-4" />}
          onAction={() => onTabChange("daily")}
        />
      ) : null}

      <Tabs value={tab} onValueChange={(v) => onTabChange(v as ReadTab)}>

        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl bg-muted/20 p-1">
          <TabsTrigger
            value="daily"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Daily
          </TabsTrigger>
          <TabsTrigger
            value="bible"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Bible
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <DailyReadings />
        </TabsContent>

        <TabsContent value="bible" className="mt-4">
          <OrthodoxBible />
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          <ReadingPlans />
        </TabsContent>
      </Tabs>
    </div>
  );
}