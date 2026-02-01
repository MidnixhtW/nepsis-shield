import { ReactNode, useMemo, useState } from "react";
import {
  BookOpen,
  Hand,
  HelpCircle,
  Home,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type AppSection =
  | "today"
  | "prayers"
  | "counter"
  | "readings"
  | "reflection"
  | "catechesis";

const sectionMeta: Record<
  AppSection,
  { label: string; icon: typeof Home; aria: string }
> = {
  today: { label: "Today", icon: Home, aria: "Today" },
  prayers: { label: "Prayers", icon: Hand, aria: "Prayers" },
  counter: {
    label: "Jesus Prayer Count",
    icon: ScrollText,
    aria: "Jesus Prayer counter",
  },
  readings: { label: "Readings", icon: BookOpen, aria: "Epistle and Gospel" },
  reflection: { label: "Reflect", icon: Sparkles, aria: "Reflection" },
  catechesis: { label: "Learn", icon: HelpCircle, aria: "Catechesis" },
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
        <div className="mx-auto w-full max-w-5xl px-4 py-3">{header}</div>
      </div>

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto w-full max-w-5xl px-3 py-3">
          <ToggleGroup
            type="single"
            value={section}
            onValueChange={(v) => {
              if (v) onSectionChange(v as AppSection);
            }}
            className="grid grid-cols-6 gap-2"
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
                    "h-12 rounded-2xl border border-border/60 px-1 data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                    "transition-colors",
                  )}
                >
                  <div className="flex w-full flex-col items-center justify-center gap-1">
                    <Icon className={cn("h-4 w-4", active && "text-primary")} />
                    <span className="text-[10px] font-medium leading-none">
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