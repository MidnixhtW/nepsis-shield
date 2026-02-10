import { BookOpen, BookText, Link2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DailyReadings } from "@/components/app/DailyReadings";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";
import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/utils/toast";

export type ReadTab = "daily" | "bible";

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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          Read
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
          onClick={copyLink}
        >
          <Link2 className="mr-2 h-4 w-4" /> Copy link
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => onTabChange(v as ReadTab)}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/20 p-1">
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