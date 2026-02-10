import { BookOpen, BookText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";

export type ReadTab = "daily" | "bible";

export function ReadHub({
  tab,
  onTabChange,
}: {
  tab: ReadTab;
  onTabChange: (t: ReadTab) => void;
}) {
  return (
    <div className="grid gap-4">
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as ReadTab)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/30 p-1">
          <TabsTrigger
            value="daily"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <BookText className="h-4 w-4 sm:mr-2" /> Lectionary
          </TabsTrigger>
          <TabsTrigger
            value="bible"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <BookOpen className="h-4 w-4 sm:mr-2" /> Bible
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <DailyReadings />
        </TabsContent>

        <TabsContent value="bible" className="mt-4">
          <OrthodoxBible />
        </TabsContent>
      </Tabs>
    </div>
  );
}
