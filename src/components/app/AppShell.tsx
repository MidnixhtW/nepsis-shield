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
    <div className="relative min-h-dvh bg-background">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute inset-0 field-grid opacity-25" />
        <div className="absolute -left-32 -top-28 h-[22rem] w-[22rem] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -right-28 top-24 h-[18rem] w-[18rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-[34rem] h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      {/* Top chrome */}
      <div className="sticky top-0 z-30">
        <div className="bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/55">
          <div className="mx-auto w-full max-w-5xl px-3 py-3 sm:px-4">
            {header}
          </div>
        </div>
        <div className="h-px bg-border/60" />

      </div>

      <main className="mx-auto w-full max-w-5xl px-3 pt-4 pb-[calc(6.9rem+env(safe-area-inset-bottom))] sm:px-4">
        {children}
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="border-t border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
          <div className="mx-auto w-full max-w-5xl px-2 pt-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] sm:px-3">
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
                      "relative h-14 rounded-2xl border border-border/60 px-1",
                      "bg-card/40 hover:bg-card/60",
                      "data-[state=on]:border-primary/30 data-[state=on]:bg-primary/12 data-[state=on]:text-primary",
                      "transition-colors",
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-0.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-primary/80"
                      />
                    ) : null}

                    {/* Soft accent glow on the active item */}
                    {active ? (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/5 blur-md"
                      />
                    ) : null}

                    <div className="relative flex w-full flex-col items-center justify-center gap-1">
                      <Icon
                        className={cn(
                          "h-[18px] w-[18px]",
                          active ? "text-primary" : "text-muted-foreground",
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