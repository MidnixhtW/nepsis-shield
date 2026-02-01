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
    <div className="min-h-dvh bg-background">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-5xl px-3 py-3 sm:px-4">
          {header}
        </div>
      </div>

      <main className="mx-auto w-full max-w-5xl px-3 pt-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] sm:px-4">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto w-full max-w-5xl px-2 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-3">
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
                    "h-14 rounded-2xl border border-border/60 px-1 data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                    "transition-colors",
                  )}
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1">
                    <Icon className={cn("h-[18px] w-[18px]", active && "text-primary")} />
                    <span className="text-[11px] font-semibold leading-none tracking-tight">
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
  );
}

export function useAppSection() {
  const [section, setSection] = useState<AppSection>("today");
  return { section, setSection };
}