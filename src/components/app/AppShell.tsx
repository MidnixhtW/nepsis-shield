import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, Hand, Home, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection = "today" | "pray" | "read" | "learn";

const sectionMeta: Record<
  AppSection,
  { label: string; icon: typeof Home; aria: string }
> = {
  today: { label: "Today", icon: Home, aria: "Go to Today" },
  pray: { label: "Prayer", icon: Hand, aria: "Go to Prayer" },
  read: { label: "Read", icon: BookOpen, aria: "Go to Readings" },
  learn: { label: "Tools", icon: MoreHorizontal, aria: "Open tools and learning" },
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
  const items = useMemo(
    () =>
      (["today", "pray", "read", "learn"] as AppSection[]).map((key) =>
        [key, sectionMeta[key]] as [AppSection, (typeof sectionMeta)[AppSection]],
      ),
    [],
  );

  return (
    <div className="relative min-h-dvh min-w-0 overflow-x-clip bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-50 rounded-2xl bg-background px-4 py-2 text-sm font-semibold shadow-lg ring-2 ring-primary focus:not-sr-only"
      >
        Skip to content
      </a>

      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-40 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.045),transparent_26rem)]" />

      <div className="sticky top-0 z-30 border-b border-border/25 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/88">
        <div className="mx-auto w-full max-w-5xl px-3 py-2 sm:px-5">
          {header}
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="water-page relative z-10 mx-auto w-full max-w-5xl px-3 pt-3 pb-[calc(6.2rem+env(safe-area-inset-bottom))] sm:px-5 sm:pt-5"
      >
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/25 bg-background/96 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-md sm:px-3">
        <div className="mx-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-2xl bg-card/80 p-1 shadow-sm ring-1 ring-border/25">
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
                    "h-12 rounded-xl bg-transparent px-1 transition-colors",
                    "hover:bg-muted/45",
                    "data-[state=on]:bg-primary/10 data-[state=on]:text-foreground",
                  )}
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1">
                    <Icon
                      className={cn(
                        "h-[17px] w-[17px]",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-medium leading-none sm:text-[11px]",
                        active ? "text-foreground" : "text-muted-foreground",
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
            aria-label="Open install and share"
            className="flex h-12 flex-col items-center justify-center gap-1 rounded-xl bg-transparent px-1 text-muted-foreground transition-colors hover:bg-muted/45 hover:text-primary"
          >
            <Download className="h-[17px] w-[17px]" />
            <span className="text-[10px] font-medium leading-none sm:text-[11px]">Install</span>
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
