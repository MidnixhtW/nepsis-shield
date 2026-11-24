import { type ComponentType, type ReactNode, useMemo } from "react";
import { UserRound } from "lucide-react";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { CenserIcon, ChurchDomeIcon, GospelBookIcon } from "@/components/app/OrthodoxMotifs";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ReadAloudBar } from "@/components/app/ReadAloudBar";
import { useReadAloud } from "@/lib/readAloud";
import { t, type MessageKey } from "@/i18n";

export type AppSection = "today" | "pray" | "read" | "learn" | "me";

type SectionItem = [
  AppSection,
  { label: MessageKey; icon: ComponentType<{ className?: string }>; aria: MessageKey },
];

const sectionMeta: Record<AppSection, SectionItem[1]> = {
  today: { label: "nav.today", icon: OrthodoxCrossIcon, aria: "nav.today.aria" },
  pray: { label: "nav.pray", icon: CenserIcon, aria: "nav.pray.aria" },
  read: { label: "nav.read", icon: GospelBookIcon, aria: "nav.read.aria" },
  learn: { label: "nav.learn", icon: ChurchDomeIcon, aria: "nav.learn.aria" },
  me: { label: "nav.me", icon: UserRound, aria: "nav.me.aria" },
};

function ShellNavigation({
  section,
  items,
  onSectionChange,
  desktop = false,
}: {
  section: AppSection;
  items: SectionItem[];
  onSectionChange: (section: AppSection) => void;
  desktop?: boolean;
}) {
  return (
    <nav
      aria-label={desktop ? t("nav.primary") : t("nav.primaryMobile")}
      className={cn(
        // A plain row of five, as on a phone's own apps: no box, no filled block. The chosen tab is marked by its color
        // and a short rule above it.
        "mx-auto grid w-full grid-cols-5 items-center",
        desktop ? "max-w-[34rem] gap-1" : "max-w-[29rem]",
      )}
    >
      <ToggleGroup
        type="single"
        value={section}
        onValueChange={(value) => value && onSectionChange(value as AppSection)}
        className="contents"
      >
        {items.map(([key, meta]) => {
          const Icon = meta.icon;
          const active = section === key;
          return (
            <ToggleGroupItem
              key={key}
              value={key}
              aria-label={t(meta.aria)}
              className={cn(
                "relative w-full justify-center whitespace-nowrap rounded-none bg-transparent px-1 text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-foreground",
                "before:absolute before:left-1/2 before:top-0 before:h-0.5 before:w-6 before:-translate-x-1/2 before:rounded-full before:bg-transparent before:transition-colors before:duration-300 data-[state=on]:before:bg-accent",
                desktop ? "h-10" : "h-12",
              )}
            >
              <div className={cn("flex w-full items-center justify-center", desktop ? "gap-2" : "flex-col gap-1.5")}>
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-accent" : "text-muted-foreground")} />
                <span className={cn("font-medium leading-none", desktop ? "text-sm" : "text-xs", active ? "text-foreground" : "text-muted-foreground")}>
                  {t(meta.label)}
                </span>
              </div>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

    </nav>
  );
}

export function AppShell({
  header,
  section,
  onSectionChange,
  children,
}: {
  header?: ReactNode;
  section: AppSection;
  onSectionChange: (section: AppSection) => void;
  children: ReactNode;
}) {
  // Leave room at the bottom for the read-aloud bar while it shows.
  const reading = !!useReadAloud().title;
  const items = useMemo(
    () => (["today", "pray", "read", "learn", "me"] as AppSection[]).map((key) => [key, sectionMeta[key]] as SectionItem),
    [],
  );

  return (
    <div className="youth-app-shell relative min-h-dvh min-w-0 bg-background text-foreground">
      {/* Safari does not move focus to the target of an in-page link, so focus main ourselves. */}
      <a
        href="#main-content"
        onClick={(event) => {
          const main = document.getElementById("main-content");
          if (!main) return;
          event.preventDefault();
          main.focus();
          main.scrollIntoView();
        }}
        className="sr-only fixed left-3 top-3 z-50 rounded-sm bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm focus:not-sr-only"
      >
        Skip to content
      </a>

      <div aria-hidden className="tactical-radar-field pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="radar-scope radar-scope-primary" />
        <div className="radar-scope radar-scope-secondary" />
        <div className="tactical-scanlines absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/35" />
      </div>

      <div className="sticky top-0 z-30 border-b border-primary/25 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 pb-3.5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.875rem,env(safe-area-inset-top))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:px-8">
          <div className="min-w-0 flex-1">{header}</div>
          <div className="hidden w-[34rem] shrink-0 min-[1120px]:block">
            <ShellNavigation section={section} items={items} onSectionChange={onSectionChange} desktop />
          </div>
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className={cn("water-page relative z-10 mx-auto w-full max-w-6xl pb-[calc(7.5rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-5 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pt-7 lg:px-8 lg:pt-9 min-[1120px]:pb-12", reading && "pb-[calc(11.5rem+env(safe-area-inset-bottom))] min-[1120px]:pb-28")}
      >
        {children}
      </main>

      <div className="fixed inset-x-0 bottom-5 z-40 mx-auto hidden w-full max-w-md px-4 min-[1120px]:block">
        <ReadAloudBar />
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 pb-[calc(0.35rem+env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-2 backdrop-blur-xl min-[1120px]:hidden">
        <div className="pointer-events-auto mx-auto grid w-full max-w-[29rem] gap-2">
          <ReadAloudBar />
          <ShellNavigation section={section} items={items} onSectionChange={onSectionChange} />
        </div>
      </div>
    </div>
  );
}
