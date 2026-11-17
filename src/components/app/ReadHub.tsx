import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";
import { ReadingPlans } from "@/components/app/ReadingPlans";
import { LauncherIntro } from "@/components/app/SectionLauncher";
import { t } from "@/i18n";

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
      <LauncherIntro title={t("read.title")} />

      <Tabs value={tab} onValueChange={(value) => onTabChange(value as ReadTab)}>
        <TabsList className="premium-tabs flex h-auto w-full gap-1 p-1.5 sm:gap-1.5">
          <TabsTrigger value="daily" className="premium-tab min-h-10 flex-1 px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm">Daily</TabsTrigger>
          <TabsTrigger value="bible" className="premium-tab min-h-10 flex-1 px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm">Bible</TabsTrigger>
          <TabsTrigger value="plans" className="premium-tab min-h-10 flex-1 px-3 py-2 text-xs font-medium sm:px-4 sm:text-sm">Plans</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4 sm:mt-5"><DailyReadings /></TabsContent>
        <TabsContent value="bible" className="mt-4 sm:mt-5"><OrthodoxBible /></TabsContent>
        <TabsContent value="plans" className="mt-4 sm:mt-5"><ReadingPlans /></TabsContent>
      </Tabs>
    </div>
  );
}
