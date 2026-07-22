import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Compass, Download, Hand, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection = "today" | "pray" | "read" | "learn";

const sectionMeta: Record<
  AppSection,
  { label: string; icon: typeof Home; aria: string }
> = {
  today: { label: "Today", icon: Home, aria: "Go to Today" },
  pray: { label: "Pray", icon: Hand, aria: "Go to Prayer" },
  read: { label: "Read", icon: BookOpen, aria: "Go to Readings" },
  learn: { label: "Learn", icon: Compass, aria: "Go to learning and tools" },
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
      (["today", "pray", "read", "learn"] as AppSection[]).map((key) =>
        [key, sectionMeta[key]] as [AppSection, (typeof sectionMeta)[AppSection]],
      ),
    [],
  );

  return (
    <div className="youth-app-shell relative min-h-dvh min-w-0 overflow-x-clip bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-50 rounded-2xl bg-background px-4 py-2 text-sm font-semibold shadow-lg ring-2 ring-primary focus:not-sr-only"
      >
        Skip to content
      </a>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-8%,hsl(var(--primary)/0.1),transparent_30rem),radial-gradient(circle_at_95%_46%,hsl(var(--accent)/0.045),transparent_26rem)]" />

      <div className="sticky top-0 z-30 border-b border-border/30 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto w-full max-w-5xl px-3 py-2.5 sm:px-5 sm:py-3">
          {header}
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="water-page relative z-10 mx-auto w-full max-w-5xl px-3 pb-[calc(7.75rem+env(safe-area-inset-bottom))] pt-4 sm:px-5 sm:pt-7"
      >
        {children}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background/[0.85] to-transparent px-2 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-7 sm:px-3">
        <div className="pointer-events-auto mx-auto grid w-full max-w-[29rem] grid-cols-5 gap-1 rounded-[1.75rem] border border-border/45 bg-card/[0.72] p-1.5 shadow-[0_24px_80px_hsl(var(--background)/0.68)] backdrop-blur-2xl">

          <ToggleGroup
            type="single"

            value={section}
            onValueChange={(v) => {
              if (v) onSectionChange(v as AppSection);
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
                  className={cn(
                    "h-12 rounded-[1.2rem] bg-transparent px-1 transition-all duration-300",
                    "hover:bg-muted/45",
                    "data-[state=on]:bg-primary/[0.12] data-[state=on]:text-primary data-[state=on]:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16),0_8px_24px_hsl(var(--background)/0.24)]",
                  )}
                >

                  <div className="flex w-full flex-col items-center justify-center gap-1.5">
                    <Icon
                      className={cn(
                        "h-[17px] w-[17px] transition-transform duration-300",
                        active ? "scale-105 text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-semibold leading-none tracking-tight sm:text-[11px]",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >

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
              "flex h-12 flex-col items-center justify-center gap-1.5 rounded-[1.2rem] bg-transparent px-1 text-muted-foreground transition-all duration-300 hover:bg-muted/45 hover:text-primary",
              installActive && "bg-primary/[0.12] text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.16),0_8px_24px_hsl(var(--background)/0.24)]",
            )}
          >

            <Download className={cn("h-[17px] w-[17px]", installActive ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-[10px] font-semibold leading-none tracking-tight sm:text-[11px]", installActive ? "text-primary" : "text-muted-foreground")}>More</span>

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
