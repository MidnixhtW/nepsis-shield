import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type SectionGroup<T extends string> = { id: string; label: string; items: Array<{ value: T; label: string }> };

// A few group tabs with a small picker inside each, so a long list of sections fits on a phone.
// Each section value is still its own URL (?tab=...), so links and the back button keep working.
export function GroupedSections<T extends string>({
  groups,
  tab,
  onTabChange,
  content,
}: {
  groups: Array<SectionGroup<T>>;
  tab: T;
  onTabChange: (t: T) => void;
  content: Record<T, ReactNode>;
}) {
  const activeGroup = groups.find((group) => group.items.some((item) => item.value === tab)) ?? groups[0];

  return (
    <Tabs
      value={activeGroup.id}
      onValueChange={(value) => onTabChange(groups.find((group) => group.id === value)?.items[0].value ?? groups[0].items[0].value)}
    >
      <TabsList className="premium-tabs">
        {groups.map((group) => (
          <TabsTrigger key={group.id} value={group.id} className="premium-tab flex-1">
            {group.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {groups.map((group) => (
        <TabsContent key={group.id} value={group.id} className="mt-4 sm:mt-5">
          {group.items.length > 1 ? (
            <div role="group" aria-label={`${group.label} sections`} className="mb-4 inline-flex max-w-full flex-wrap rounded-[1.25rem] border border-border/60 bg-card/60 p-1">
              {group.items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={tab === item.value}
                  onClick={() => onTabChange(item.value)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    tab === item.value ? "bg-accent/15 text-accent" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
          {group.items.some((item) => item.value === tab) ? content[tab] : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}
