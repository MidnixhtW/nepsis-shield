import { ReactNode, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, Hand, Home, MoreHorizontal, Sparkles } from "lucide-react";
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
      (["today", "pray", "read"] as AppSection[]).map((key) =>
        [key, sectionMeta[key]] as [AppSection, (typeof sectionMeta)[AppSection]],
      ),
    [],
  );
  const toolsMeta = sectionMeta.learn;
  const ToolsIcon = toolsMeta.icon;
  const toolsActive = section === "learn";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-50 rounded-2xl bg-background px-4 py-2 text-sm font-semibold shadow-lg ring-2 ring-primary focus:not-sr-only"
      >
        Skip to content
      </a>

      <div aria-hidden className="tactical-radar-field pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.12),transparent_34rem),radial-gradient(circle_at_90%_8%,hsl(var(--accent)/0.10),transparent_24rem)]" />
        <div className="radar-scope radar-scope-primary" />
        <div className="radar-scope radar-scope-secondary" />
        <div className="absolute inset-0 tactical-scanlines" />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/35" />
      </div>

      <div className="sticky top-0 z-30 border-b border-border/60 bg-background/88 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
        <div className="mx-auto w-full max-w-5xl px-4 py-2.5 sm:px-5">
          {header}
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 mx-auto w-full max-w-5xl px-4 pt-4 pb-[calc(5.8rem+env(safe-area-inset-bottom))] sm:px-5 sm:pt-5"
      >
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/92 px-3 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl supports-[backdrop-filter]:bg-background/82">
        <div className="mx-auto grid max-w-xl grid-cols-6 gap-1 rounded-3xl border border-border/50 bg-card/70 p-1 shadow-sm">
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
                    "h-11 rounded-2xl border border-transparent bg-transparent px-1 transition-colors",
                    "hover:bg-muted/70",
                    "data-[state=on]:border-primary/35 data-[state=on]:bg-primary/15 data-[state=on]:shadow-sm data-[state=on]:text-foreground",
                  )}
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1">
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px]",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-medium leading-none",
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
            to="/saints"
            aria-label="Open Saints"
            className="flex h-11 flex-col items-center justify-center gap-1 rounded-2xl border border-transparent bg-transparent px-1 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary"
          >
            <Sparkles className="h-[18px] w-[18px]" />
            <span className="text-[11px] font-medium leading-none">Saints</span>
          </Link>

          <button
            type="button"
            aria-label={toolsMeta.aria}
            className={cn(
              "flex h-11 flex-col items-center justify-center gap-1 rounded-2xl border border-transparent bg-transparent px-1 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary",
              toolsActive && "border-primary/35 bg-primary/15 text-foreground shadow-sm",
            )}
            onClick={() => onSectionChange("learn")}
          >
            <ToolsIcon className={cn("h-[18px] w-[18px]", toolsActive ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-[11px] font-medium leading-none", toolsActive ? "text-foreground" : "text-muted-foreground")}>Tools</span>
          </button>

          <Link
            to="/download"
            aria-label="Open install and share"
            className="flex h-11 flex-col items-center justify-center gap-1 rounded-2xl border border-transparent bg-transparent px-1 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary"
          >
            <Download className="h-[18px] w-[18px]" />
            <span className="text-[11px] font-medium leading-none">Install</span>
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
