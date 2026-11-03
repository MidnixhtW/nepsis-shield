import { BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";
import { ReadingPlans } from "@/components/app/ReadingPlans";
import { SectionIntro } from "@/components/app/SectionIntro";

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
    <div className="grid min-w-0 gap-4 sm:gap-5 lg:gap-6">
      <SectionIntro
        eyebrow="Scripture"
        title="Attend to the Word."
        description="Receive the appointed readings, browse Scripture, or follow a steady reading plan."
        icon={<BookOpen className="h-4 w-4" />}
      />

      <Tabs value={tab} onValueChange={(value) => onTabChange(value as ReadTab)}>
        <TabsList className="premium-tabs">
          <TabsTrigger value="daily" className="premium-tab flex-1">Daily</TabsTrigger>
          <TabsTrigger value="bible" className="premium-tab flex-1">Bible</TabsTrigger>
          <TabsTrigger value="plans" className="premium-tab flex-1">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4 sm:mt-5"><DailyReadings /></TabsContent>
        <TabsContent value="bible" className="mt-4 sm:mt-5"><OrthodoxBible /></TabsContent>
        <TabsContent value="plans" className="mt-4 sm:mt-5"><ReadingPlans /></TabsContent>
      </Tabs>
    </div>
  );
}
