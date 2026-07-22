import { Hand, Home, Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyPrayerFlow } from "@/components/app/DailyPrayerFlow";
import { PrayerRule } from "@/components/app/PrayerRule";
import { PrayerBook } from "@/components/app/PrayerBook";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { DailyReflection } from "@/components/app/DailyReflection";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { StillnessTimer } from "@/components/app/StillnessTimer";
import { ConfessionPrep } from "@/components/app/ConfessionPrep";
import { SleepMode } from "@/components/app/SleepMode";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SectionIntro } from "@/components/app/SectionIntro";
import { FirstStepHint } from "@/components/app/FirstStepHint";
import { showError, showSuccess } from "@/utils/toast";

export type PrayerTab = "daily" | "rule" | "prayers" | "counter" | "prep" | "journal" | "sleep";

const prayerTabs: Array<{ value: PrayerTab; label: string }> = [
  { value: "daily", label: "Daily" },
  { value: "rule", label: "Rule" },
  { value: "prayers", label: "Prayer texts" },
  { value: "counter", label: "Stillness" },
  { value: "prep", label: "Prepare" },
  { value: "journal", label: "Journal" },
  { value: "sleep", label: "Sleep" },
];

export function PrayerHub({
  tab,
  onTabChange,
  onHome,
}: {
  tab: PrayerTab;
  onTabChange: (t: PrayerTab) => void;
  onHome?: () => void;
}) {
  async function copyLink() {
    try {
      const url = new URL(window.location.href);
      url.pathname = "/pray";
      url.searchParams.set("tab", tab);
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
    <div className="grid gap-5">
      <SectionIntro
        eyebrow="Prayer"
        title="Make room for stillness."
        description="Begin with the daily office, or choose a focused practice for the moment you are in."
        icon={<Hand className="h-4 w-4" />}
        actions={actions}
      />

      <FirstStepHint
        title="Recommended: begin with Daily."
        description="A simple, guided prayer flow is the clearest place to start. The other practices remain close when you need them."
        actionLabel="Open Daily"
        icon={<Hand className="h-4 w-4" />}
        onAction={() => onTabChange("daily")}
      />

      <Tabs value={tab} onValueChange={(value) => onTabChange(value as PrayerTab)}>
        <TabsList className="premium-tabs">
          {prayerTabs.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className="premium-tab">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="daily" className="mt-5"><DailyPrayerFlow /></TabsContent>
        <TabsContent value="rule" className="mt-5"><PrayerRule /></TabsContent>
        <TabsContent value="prayers" className="mt-5"><PrayerBook showRule={false} /></TabsContent>
        <TabsContent value="counter" className="mt-5">
          <div className="grid gap-4"><JesusPrayerCounter /><StillnessTimer /></div>
        </TabsContent>
        <TabsContent value="prep" className="mt-5">
          <div className="grid gap-4"><PreparationChecklist /><ConfessionPrep /></div>
        </TabsContent>
        <TabsContent value="journal" className="mt-5"><DailyReflection /></TabsContent>
        <TabsContent value="sleep" className="mt-5"><SleepMode /></TabsContent>
      </Tabs>
    </div>
  );
}
