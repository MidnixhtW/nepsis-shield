import { Headphones, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareCardButton } from "@/components/app/ShareCardButton";
import { SAINT_STORIES, type SaintStory } from "@/content/familyPrayer";
import { MONTH_NAMES } from "@/content/westernSaints";
import { clipUrl, useReader } from "@/lib/narration";
import { spokenText } from "@/lib/narrationText";
import { canPlayItems, startNarration, stopReadAloud, useReadAloud } from "@/lib/readAloud";

// Days until a story's feast ("December 6"), so the nearest saint comes first.
function daysUntil(day: string, from: Date) {
  const [monthName, date] = day.split(" ");
  const month = MONTH_NAMES.indexOf(monthName);
  if (month < 0) return 400;
  const next = new Date(from.getFullYear(), month, Number(date));
  if (next < new Date(from.getFullYear(), from.getMonth(), from.getDate())) next.setFullYear(next.getFullYear() + 1);
  return Math.round((next.getTime() - from.getTime()) / 86_400_000);
}

// Learn > Saint stories: one short story per screen, swiped through like stories, each with a recording.
export function SaintStoriesFeed() {
  const reading = useReadAloud();
  const [reader] = useReader();
  const stories = [...SAINT_STORIES].sort((a, b) => daysUntil(a.day, new Date()) - daysUntil(b.day, new Date()));

  const listen = (story: SaintStory) => {
    const lines = [`${story.title}.`, ...story.story, story.lesson];
    return { text: spokenText(lines), audio: clipUrl(reader, lines) };
  };

  return (
    <div className="grid gap-3">
      <p className="px-1 text-sm text-muted-foreground">One saint per screen, about a minute each. Swipe up for the next; the nearest feast comes first.</p>
      <ol
        aria-label="Saint stories"
        className="grid h-[calc(100dvh-15rem)] min-h-[26rem] snap-y snap-mandatory auto-rows-[100%] gap-3 overflow-y-auto overscroll-contain rounded-3xl"
      >
        {stories.map((story, index) => {
          const playing = reading.title === story.title;
          const item = listen(story);
          return (
            <li key={story.saint} className="snap-start">
              <article
                aria-label={`${story.saint}: ${story.title}`}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-b from-primary/15 via-card to-card p-5 sm:p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {story.saint} · {story.day}
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{story.title}</h2>
                <div className="mt-4 grid flex-1 content-start gap-3 overflow-y-auto pr-1 scripture-text text-[1.02rem] leading-relaxed">
                  {story.story.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                  <p className="font-semibold text-accent">{story.lesson}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {canPlayItems([item]) ? (
                    <Button
                      type="button"
                      className="rounded-full"
                      aria-pressed={playing}
                      onClick={() => (playing ? stopReadAloud() : startNarration(story.title, [item]))}
                    >
                      {playing ? <Square className="mr-2 h-4 w-4" /> : <Headphones className="mr-2 h-4 w-4" />}
                      {playing ? "Stop" : "Listen"}
                    </Button>
                  ) : null}
                  <ShareCardButton card={{ eyebrow: `${story.saint} · ${story.day}`, text: story.lesson, attribution: story.title }} fileName="saint-story.png" />
                  <span className="ml-auto text-xs text-muted-foreground">{index + 1} / {stories.length}</span>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
