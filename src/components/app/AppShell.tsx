import { type ComponentType, type ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download } from "lucide-react";
import { ByzantineDivider } from "@/components/app/ByzantineOrnament";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { CenserIcon, ChurchDomeIcon, GospelBookIcon } from "@/components/app/OrthodoxMotifs";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection = "today" | "pray" | "read" | "learn";

const sectionMeta: Record<
  AppSection,
  { label: string; icon: ComponentType<{ className?: string }>; aria: string }
> = {
  today: { label: "Today", icon: OrthodoxCrossIcon, aria: "Go to Today" },
  pray: { label: "Pray", icon: CenserIcon, aria: "Go to Prayer" },
  read: { label: "Read", icon: GospelBookIcon, aria: "Go to Readings" },
  learn: { label: "Learn", icon: ChurchDomeIcon, aria: "Go to learning and tools" },
};

export function AppShell({
  header,
  section,
  onSectionChange,
  children,
}: {
  header?: ReactNode;
  section: AppSection;
  onSectionChange: (s: AppSection) => void;
  children: ReactNode;
}) {
  const location = useLocation();
  const installActive = location.pathname === "/download";
  const items = useMemo(
    () =>
      (["today", "pray", "read", "learn"] as AppSection[]).map(
        (key) => [key, sectionMeta[key]] as [AppSection, (typeof sectionMeta)[AppSection]],
      ),
    [],
  );

  return (
    <div className="youth-app-shell relative min-h-dvh min-w-0 overflow-x-clip bg-background text-foreground">
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
        <div className="mx-auto w-full max-w-6xl px-4 py-3.5 sm:px-6 lg:px-8">{header}</div>
      </div>

      <main
        id="main-content"

        tabIndex={-1}
        className="water-page relative z-10 mx-auto w-full max-w-6xl px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10"
      >
        <ByzantineDivider className="mb-8 hidden opacity-45 lg:flex" />
        {children}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-primary/25 bg-background/88 px-3 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
        <div className="orthodox-nav-frame pointer-events-auto mx-auto grid w-full max-w-[29rem] grid-cols-5 gap-1 rounded-md border border-primary/25 bg-card/90 p-1.5 shadow-xl">

          <ToggleGroup
            type="single"
            value={section}
            onValueChange={(value) => {
              if (value) onSectionChange(value as AppSection);
            }}
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
                  className="h-12 rounded-xl bg-transparent px-1 text-muted-foreground hover:bg-muted/70 hover:text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-[0_8px_24px_hsl(var(--primary)/0.22)]"
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1.5">
                    <Icon className={cn("h-[17px] w-[17px]", active ? "text-primary-foreground" : "text-muted-foreground")} />
                    <span className={cn("text-[10px] font-bold leading-none sm:text-[11px]", active ? "text-primary-foreground" : "text-muted-foreground")}>
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
              "flex h-12 flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-muted-foreground hover:bg-muted/70 hover:text-foreground",
              installActive && "bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.22)]",
            )}
          >
            <Download className={cn("h-[17px] w-[17px]", installActive ? "text-primary-foreground" : "text-muted-foreground")} />
            <span className={cn("text-[10px] font-bold leading-none sm:text-[11px]", installActive ? "text-primary-foreground" : "text-muted-foreground")}>
              More
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}

export function useAppSection() {
  const [section, setSection] = useState<AppSection>("today");
  return { section, setSection };
}
