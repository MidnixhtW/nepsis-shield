import { Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SectionBar } from "@/components/app/SectionBar";
import { showError, showSuccess } from "@/utils/toast";
import { ReadingPlans } from "@/components/app/ReadingPlans";

export type ReadTab = "daily" | "bible" | "plans";

export function ReadHub({
  tab,
  onTabChange,
}: {
  tab: ReadTab;
  onTabChange: (t: ReadTab) => void;
}) {
  async function copyLink() {
    try {
      const url = new URL(window.location.href);
      url.pathname = "/read";
      url.searchParams.set("read", tab);
      await navigator.clipboard.writeText(url.toString());
      showSuccess("Link copied.");
    } catch {
      showError("Couldn't copy link.");
    }
  }

  return (
    <div className="grid gap-4">
      <SectionBar
        title="Read"
        hint="Lectionary, Bible, plans"
        action={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
                onClick={copyLink}
              >
                <Link2 className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy link</TooltipContent>
          </Tooltip>
        }
      />

      <Tabs value={tab} onValueChange={(v) => onTabChange(v as ReadTab)}>
        <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl bg-muted/20 p-1">
          <TabsTrigger
            value="daily"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Lectionary
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