import { BookOpen, Home, Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";
import { ReadingPlans } from "@/components/app/ReadingPlans";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SectionIntro } from "@/components/app/SectionIntro";
import { FirstStepHint } from "@/components/app/FirstStepHint";
import { showError, showSuccess } from "@/utils/toast";

export type ReadTab = "daily" | "bible" | "plans";

export function ReadHub({
  tab,
  onTabChange,
  onHome,
}: {
  tab: ReadTab;
  onTabChange: (t: ReadTab) => void;
  onHome?: () => void;
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

  const actions = (
    <>
      {onHome ? (
        <Button type="button" variant="outline" size="sm" className="premium-action" onClick={onHome}>
          <Home className="mr-2 h-4 w-4" /> Today
        </Button>
      ) : null}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="outline" size="icon" className="premium-action h-10 w-10" onClick={copyLink}>
            <Link2 className="h-4 w-4" />
            <span className="sr-only">Copy link</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>
    </>
  );

  return (
    <div className="grid min-w-0 gap-4 sm:gap-5 lg:gap-6">
      <SectionIntro
        eyebrow="Scripture"
        title="Attend to the Word."
        description="Receive the appointed readings, browse Scripture, or follow a steady reading plan."
        icon={<BookOpen className="h-4 w-4" />}
        actions={actions}
      />

      <FirstStepHint
        title="Recommended: today’s readings."
        description="Begin with the Church’s daily rhythm. Browse the Bible or use a plan when you want to go further."
        actionLabel="Open Daily"
        icon={<BookOpen className="h-4 w-4" />}
        onAction={() => onTabChange("daily")}
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
