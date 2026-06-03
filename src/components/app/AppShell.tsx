import { ReactNode, useMemo, useState } from "react";
import { BookOpen, GraduationCap, Hand, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection = "today" | "pray" | "read" | "learn";

const sectionMeta: Record<
  AppSection,
  { label: string; icon: typeof Home; aria: string }
> = {
  today: { label: "Today", icon: Home, aria: "Today" },
  pray: { label: "Pray", icon: Hand, aria: "Prayer" },
  read: { label: "Read", icon: BookOpen, aria: "Daily readings" },
  learn: { label: "Learn", icon: GraduationCap, aria: "Learn" },
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
      Object.entries(sectionMeta) as Array<
        [AppSection, (typeof sectionMeta)[AppSection]]
      >,
    [],
  );

  return (
    <div className="relative min-h-dvh bg-background/20">
      <a
        href="#main-content"
        className="sr-only fixed left-3 top-3 z-50 rounded-2xl bg-background px-4 py-2 text-sm font-semibold shadow-lg ring-2 ring-primary focus:not-sr-only"
      >
        Skip to content
      </a>

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 ocp-camo opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
        <div className="absolute inset-0 field-grid opacity-[0.06]" />
        <div className="absolute -left-36 -top-32 h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-32 top-16 h-[22rem] w-[22rem] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="sticky top-0 z-30">
        <div className="border-b border-border/40 bg-background/80 shadow-sm shadow-foreground/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
          <div className="mx-auto w-full max-w-6xl px-3 py-2.5 sm:px-5">
            {header}
          </div>
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-3 pt-4 pb-[calc(6.4rem+env(safe-area-inset-bottom))] sm:px-5"
      >
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 px-2 pb-2 sm:px-3">
        <div className="mx-auto max-w-2xl rounded-[1.6rem] border border-border/50 bg-background/80 shadow-[0_-12px_40px_hsl(var(--foreground)/0.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
          <div className="px-2 pt-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))] sm:px-3">
            <ToggleGroup
              type="single"
              value={section}
              onValueChange={(v) => {
                if (v) onSectionChange(v as AppSection);
              }}
              className="grid grid-cols-4 gap-2"
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
                      "relative h-12 rounded-[1.15rem] border border-border/40 px-1",
                      "bg-card/40 hover:border-primary/20 hover:bg-card/70",
                      "data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                      "transition-all duration-200",
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-px left-1/2 h-1 w-11 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/50 via-accent to-primary/50 shadow-[0_0_18px_hsl(var(--accent)/0.45)]"
                      />
                    ) : null}

                    {active ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 blur-md"
                      />
                    ) : null}

                    <div className="relative flex w-full flex-col items-center justify-center gap-1">
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px] transition-transform duration-200",
                          active ? "scale-110 text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span
                        className={cn(
                          "text-[11px] font-semibold leading-none tracking-tight",
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
          </div>
        </div>
      </div>
    </div>
  );
}

export function useAppSection() {
  const [section, setSection] = useState<AppSection>("today");
  return { section, setSection };
}