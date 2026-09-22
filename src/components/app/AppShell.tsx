import { type ComponentType, type ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import { ByzantineDivider } from "@/components/app/ByzantineOrnament";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { CenserIcon, ChurchDomeIcon, GospelBookIcon } from "@/components/app/OrthodoxMotifs";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection = "today" | "pray" | "read" | "learn";

type SectionItem = [
  AppSection,
  { label: string; icon: ComponentType<{ className?: string }>; aria: string },
];

const sectionMeta: Record<AppSection, SectionItem[1]> = {
  today: { label: "Today", icon: OrthodoxCrossIcon, aria: "Go to Today" },
  pray: { label: "Pray", icon: CenserIcon, aria: "Go to Prayer" },
  read: { label: "Read", icon: GospelBookIcon, aria: "Go to Readings" },
  learn: { label: "Learn", icon: ChurchDomeIcon, aria: "Go to learning and tools" },
};

function ShellNavigation({
  section,
  items,
  installActive,
  onSectionChange,
  desktop = false,
}: {
  section: AppSection;
  items: SectionItem[];
  installActive: boolean;
  onSectionChange: (section: AppSection) => void;
  desktop?: boolean;
}) {
  return (
    <nav
      aria-label={desktop ? "Primary navigation" : "Mobile primary navigation"}
      className={cn(
        "orthodox-nav-frame grid w-full grid-cols-5 gap-1 border border-primary/25 bg-card/90 p-1.5 shadow-xl",
        desktop ? "max-w-[34rem] rounded-xl" : "max-w-[29rem] rounded-md",
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
              aria-label={meta.aria}
              className={cn(
                "rounded-lg bg-transparent px-1 text-muted-foreground hover:bg-muted/70 hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-[0_8px_24px_hsl(var(--primary)/0.22)]",
                desktop ? "h-10" : "h-12",
              )}
            >
              <div className={cn("flex w-full items-center justify-center", desktop ? "gap-2" : "flex-col gap-1.5")}>
                <Icon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-primary-foreground" : "text-muted-foreground")} />
                <span className={cn("font-bold leading-none", desktop ? "text-xs" : "text-[10px] sm:text-[11px]", active ? "text-primary-foreground" : "text-muted-foreground")}>
                  {meta.label}
                </span>
              </div>
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <Link
        to="/download"
        aria-label="Open more options, install, and share"
        className={cn(
          "flex items-center justify-center rounded-lg px-1 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
          desktop ? "h-10 flex-row gap-2 text-xs" : "h-12 flex-col gap-1.5 text-[10px] sm:text-[11px]",
          installActive && "bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.22)]",
        )}
      >
        <Download className={cn("h-[17px] w-[17px] shrink-0", installActive ? "text-primary-foreground" : "text-muted-foreground")} />
        <span className="font-bold leading-none">More</span>
      </Link>
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
  const location = useLocation();
  const installActive = location.pathname === "/download";
  const items = useMemo(
    () => (["today", "pray", "read", "learn"] as AppSection[]).map((key) => [key, sectionMeta[key]] as SectionItem),
    [],
  );

  return (
    <div className="youth-app-shell relative min-h-dvh min-w-0 bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-50 rounded-sm bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-sm focus:not-sr-only"
      >
        Skip to content
      </a>

      <div aria-hidden className="tactical-radar-field pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="radar-scope radar-scope-primary" />
        <div className="radar-scope radar-scope-secondary" />
        <div className="tactical-scanlines absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/35" />
      </div>

      <div className="sticky top-0 z-30 border-b border-primary/25 bg-background/85 shadow-[0_10px_35px_hsl(var(--primary)/0.12)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-6 pb-3.5 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.875rem,env(safe-area-inset-top))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] lg:px-8">
          <div className="min-w-0 flex-1">{header}</div>
          <div className="hidden shrink-0 min-[1120px]:block">
            <ShellNavigation section={section} items={items} installActive={installActive} onSectionChange={onSectionChange} desktop />
          </div>
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="water-page relative z-10 mx-auto w-full max-w-6xl pb-[calc(7.5rem+env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-5 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))] sm:pt-7 lg:px-8 lg:pt-9 min-[1120px]:pb-12"
      >
        <ByzantineDivider className="mb-8 hidden opacity-45 lg:flex" />
        {children}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-primary/25 bg-background/88 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-2 backdrop-blur-xl min-[1120px]:hidden">
        <div className="pointer-events-auto mx-auto w-full max-w-[29rem]">
          <ShellNavigation section={section} items={items} installActive={installActive} onSectionChange={onSectionChange} />
        </div>
      </div>
    </div>
  );
}

export function useAppSection() {
  const [section, setSection] = useState<AppSection>("today");
  return { section, setSection };
}
