import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Download, Hand, Home, MoreHorizontal } from "lucide-react";
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
  learn: { label: "Guide", icon: MoreHorizontal, aria: "Open guide and tools" },
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

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_12%_8%,hsl(var(--primary)/0.12),transparent_24rem),radial-gradient(circle_at_90%_28%,hsl(275_80%_60%/0.08),transparent_22rem)]" />

      <div className="sticky top-0 z-30 border-b border-border/40 bg-background/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/65">

        <div className="mx-auto w-full max-w-5xl px-3 py-2.5 sm:px-5">
          {header}
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="water-page relative z-10 mx-auto w-full max-w-5xl px-3 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-3 sm:px-5 sm:pt-6"
      >
        {children}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-3 sm:px-3">

        <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-[1.6rem] border border-border/60 bg-card/80 p-1.5 shadow-[0_18px_60px_hsl(var(--foreground)/0.18)] backdrop-blur-2xl">
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
                    "h-12 rounded-[1.15rem] bg-transparent px-1 transition-all duration-300",
                    "hover:bg-muted/55",
                    "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-[0_8px_24px_hsl(var(--primary)/0.24)]",
                  )}
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1">
                    <Icon
                      className={cn(
                        "h-[17px] w-[17px] transition-transform duration-300",
                        active ? "scale-105 text-primary-foreground" : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-semibold leading-none sm:text-[11px]",
                        active ? "text-primary-foreground" : "text-muted-foreground",
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
              "flex h-12 flex-col items-center justify-center gap-1 rounded-[1.15rem] bg-transparent px-1 text-muted-foreground transition-all duration-300 hover:bg-muted/55 hover:text-primary",
              installActive && "bg-primary text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.24)]",
            )}
          >
            <Download className={cn("h-[17px] w-[17px]", installActive ? "text-primary-foreground" : "text-muted-foreground")} />
            <span className={cn("text-[10px] font-semibold leading-none sm:text-[11px]", installActive ? "text-primary-foreground" : "text-muted-foreground")}>More</span>
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
