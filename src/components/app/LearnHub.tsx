import { BookOpen, ExternalLink, HelpCircle, LibraryBig } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CatechesisQA } from "@/components/app/CatechesisQA";
import { OrthodoxDailyGuide } from "@/components/app/OrthodoxDailyGuide";
import { OrthodoxBible } from "@/components/app/OrthodoxBible";

export function LearnHub() {
  return (
    <div className="grid gap-4">
      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-2xl bg-muted/30 p-1 sm:grid-cols-4">
          <TabsTrigger
            value="guide"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <BookOpen className="h-4 w-4 sm:mr-2" /> Guide
          </TabsTrigger>
          <TabsTrigger
            value="qa"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <HelpCircle className="h-4 w-4 sm:mr-2" /> Q&A
          </TabsTrigger>
          <TabsTrigger
            value="bible"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <BookOpen className="h-4 w-4 sm:mr-2" /> Bible
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="min-h-10 flex-col gap-1 whitespace-normal rounded-xl px-2 py-2 text-xs leading-tight sm:flex-row sm:gap-2 sm:px-3 sm:text-sm"
          >
            <LibraryBig className="h-4 w-4 sm:mr-2" /> Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="mt-4">
          <OrthodoxDailyGuide />
        </TabsContent>

        <TabsContent value="qa" className="mt-4">
          <CatechesisQA />
        </TabsContent>

        <TabsContent value="bible" className="mt-4">
          <OrthodoxBible />
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">OCA library</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the full OCA collection (questions, prayers, and The Orthodox Faith).
            </p>

            <Separator className="my-4" />

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                asChild
                variant="outline"
                className="h-11 justify-between rounded-2xl border-border/60"
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
                className="h-11 justify-between rounded-2xl border-border/60"
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
                className="h-11 justify-between rounded-2xl border-border/60"
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
                className="h-11 justify-between rounded-2xl border-border/60"
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
              Sources: "https://www.oca.org/questions" •
              "https://www.oca.org/orthodoxy/prayers" •
              "https://www.oca.org/orthodoxy/the-orthodox-faith"
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}