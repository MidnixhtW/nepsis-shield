import { Link } from "react-router-dom";
import { Crosshair, Download, ExternalLink, Home, Settings, Sparkles } from "lucide-react";
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
import { DivineLiturgyCompanion } from "@/components/app/DivineLiturgyCompanion";
import { OrthodoxAudioLibrary } from "@/components/app/OrthodoxAudioLibrary";
import { FirstStepHint } from "@/components/app/FirstStepHint";
import { PrayerChallenges } from "@/components/app/PrayerChallenges";
import { PersonalizedPath } from "@/components/app/PersonalizedPath";

export type LearnTab = "welcome" | "path" | "challenges" | "guide" | "qa" | "liturgy" | "audio" | "library" | "hymns" | "parish";

export function LearnHub({
  tab,
  onTabChange,
  onHome,
}: {
  tab?: LearnTab;
  onTabChange?: (t: LearnTab) => void;
  onHome?: () => void;
}) {
  return (
    <div className="grid gap-4">
      <SectionBar
        title="Tools"
        hint="Personal path, challenges, guide, Q&A, liturgy, audio, hymns, parish, library"
        action={
          onHome ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
              onClick={onHome}
            >
              <Home className="mr-2 h-4 w-4" /> Today
            </Button>
          ) : null
        }
      />

      <FirstStepHint
        title="New here? Build your personal path."
        description="Choose what you need most and how much time you have; the app will recommend a simple starting rhythm."
        actionLabel="Open Path"
        icon={<Sparkles className="h-4 w-4" />}
        onAction={() => onTabChange?.("path")}
      />

      <Card className="rounded-2xl border-border/45 bg-card/85 p-4 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Tool hub</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight">Quick access</h2>
          </div>
          <p className="text-xs text-muted-foreground">Secondary features live here.</p>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Button asChild variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left">
            <Link to="/saints"><Sparkles className="mr-2 h-4 w-4 text-primary" /> Saints</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left">
            <Link to="/field-manual"><Crosshair className="mr-2 h-4 w-4 text-primary" /> Field Manual</Link>
          </Button>
          <Button asChild variant="outline" className="h-auto justify-start rounded-xl border-border/60 bg-background/50 px-3 py-3 text-left">
            <Link to="/download"><Download className="mr-2 h-4 w-4 text-primary" /> Install / Share</Link>
          </Button>
          <Button asChild variant="ghost" className="h-auto justify-start rounded-xl px-3 py-3 text-left">
            <Link to="/settings"><Settings className="mr-2 h-4 w-4 text-primary" /> Settings</Link>
          </Button>
        </div>
      </Card>

      <Tabs
        value={tab ?? "welcome"}
        onValueChange={(v) => onTabChange?.(v as LearnTab)}
        className="w-full"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/20 p-1 sm:grid-cols-5 lg:grid-cols-10">
          <TabsTrigger
            value="welcome"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Start
          </TabsTrigger>
          <TabsTrigger
            value="path"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Path
          </TabsTrigger>
          <TabsTrigger
            value="challenges"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Challenges
          </TabsTrigger>
          <TabsTrigger
            value="guide"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Guide
          </TabsTrigger>
          <TabsTrigger
            value="qa"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Q&A
          </TabsTrigger>
          <TabsTrigger
            value="liturgy"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Liturgy
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Audio
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Library
          </TabsTrigger>
          <TabsTrigger
            value="hymns"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Hymns
          </TabsTrigger>
          <TabsTrigger
            value="parish"
            className="min-h-10 rounded-xl px-2 py-2 text-xs leading-tight sm:text-sm"
          >
            Parish
          </TabsTrigger>
        </TabsList>

        <TabsContent value="welcome" className="mt-4">
          <InclusiveChristianPath />
        </TabsContent>

        <TabsContent value="path" className="mt-4">
          <PersonalizedPath />
        </TabsContent>

        <TabsContent value="challenges" className="mt-4">
          <PrayerChallenges />
        </TabsContent>

        <TabsContent value="guide" className="mt-4">
          <OrthodoxDailyGuide />
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <CatechesisQA />
        </TabsContent>

        <TabsContent value="liturgy" className="mt-4">
          <DivineLiturgyCompanion />
        </TabsContent>

        <TabsContent value="audio" className="mt-4">
          <OrthodoxAudioLibrary />
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