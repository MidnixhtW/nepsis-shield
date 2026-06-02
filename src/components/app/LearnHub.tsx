import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CatechesisQA } from "@/components/app/CatechesisQA";
import { InclusiveChristianPath } from "@/components/app/InclusiveChristianPath";
import { OrthodoxDailyGuide } from "@/components/app/OrthodoxDailyGuide";
import { SectionBar } from "@/components/app/SectionBar";
import { HymnsAndPropers } from "@/components/app/HymnsAndPropers";
import { ParishFinder } from "@/components/app/ParishFinder";

export type LearnTab = "welcome" | "guide" | "qa" | "library" | "hymns" | "parish";

export function LearnHub({
  tab,
  onTabChange,
}: {
  tab?: LearnTab;
  onTabChange?: (t: LearnTab) => void;
}) {
  return (
    <div className="grid gap-4">
      <SectionBar title="Learn" hint="Welcome, guide, Q&A, hymns, parish" />

      <Tabs
        value={tab ?? "welcome"}
        onValueChange={(v) => onTabChange?.(v as LearnTab)}
        className="w-full"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/20 p-1 sm:grid-cols-6">
          <TabsTrigger
            value="welcome"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Welcome
          </TabsTrigger>
          <TabsTrigger
            value="guide"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Guide
          </TabsTrigger>
          <TabsTrigger
            value="qa"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Q&A
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Library
          </TabsTrigger>
          <TabsTrigger
            value="hymns"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Hymns
          </TabsTrigger>
          <TabsTrigger
            value="parish"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            Parish
          </TabsTrigger>
        </TabsList>

        <TabsContent value="welcome" className="mt-4">
          <InclusiveChristianPath />
        </TabsContent>

        <TabsContent value="guide" className="mt-4">
          <OrthodoxDailyGuide />
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <CatechesisQA />
        </TabsContent>

        <TabsContent value="hymns" className="mt-4">
          <HymnsAndPropers />
        </TabsContent>

        <TabsContent value="parish" className="mt-4">
          <ParishFinder />
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">OCA library</h2>
            <p className="mt-1 text-sm text-muted-foreground">Browse the full OCA collection.</p>

            <Separator className="my-4" />

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
              >
                <a
                  href="https://www.oca.org/questions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0"
                >
                  Questions & Answers <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
              >
                <a
                  href="https://www.oca.org/orthodoxy/prayers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0"
                >
                  Prayers <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
              >
                <a
                  href="https://www.oca.org/orthodoxy/the-orthodox-faith"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0"
                >
                  The Orthodox Faith <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
              >
                <a
                  href="https://www.oca.org/readings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0"
                >
                  Daily readings <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="mt-4 break-words text-xs text-muted-foreground">
              Sources: "https://www.oca.org/questions" • "https://www.oca.org/orthodoxy/prayers" •
              "https://www.oca.org/orthodoxy/the-orthodox-faith"
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}