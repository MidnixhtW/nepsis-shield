import { BookOpen, Flame, Heart, MoonStar, ShieldAlert, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppSection } from "@/components/app/AppShell";
import { saveGlobalResume, setQuickState, type QuickStateKey } from "@/lib/dailyHabits";

type Target = { section: AppSection; tab?: string; read?: string };

const helpItems: Array<{
  key: QuickStateKey;
  label: string;
  line: string;
  target: Target;
  icon: typeof ShieldAlert;
}> = [
  {
    key: "anxious",
    label: "Anxious",
    line: "Breathe. Jesus Prayer.",
    target: { section: "pray", tab: "counter" },
    icon: Wind,
  },
  {
    key: "tempted",
    label: "Tempted",
    line: "Interrupt the spiral.",
    target: { section: "pray", tab: "prep" },
    icon: ShieldAlert,
  },
  {
    key: "angry",
    label: "Angry",
    line: "Pause before acting.",
    target: { section: "pray", tab: "prayers" },
    icon: Flame,
  },
  {
    key: "tired",
    label: "Tired",
    line: "Use the short rule.",
    target: { section: "pray", tab: "daily" },
    icon: MoonStar,
  },
  {
    key: "dry",
    label: "Dry",
    line: "Read one passage.",
    target: { section: "read", read: "daily" },
    icon: BookOpen,
  },
  {
    key: "grateful",
    label: "Grateful",
    line: "Write thanks.",
    target: { section: "pray", tab: "journal" },
    icon: Heart,
  },
];

export function NeedHelpNow({
  onNavigate,
}: {
  onNavigate?: (to: Target) => void;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Need help now</p>
          <p className="text-xs text-muted-foreground">One tap. One small act.</p>
        </div>
        <ShieldAlert className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {helpItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.key}
              type="button"
              variant="outline"
              className="h-auto justify-start rounded-2xl border-border/60 px-3 py-3 text-left"
              onClick={() => {
                setQuickState(item.key);
                saveGlobalResume({
                  label: `Return to ${item.label.toLowerCase()} support`,
                  helper: item.line,
                  target: item.target,
                });
                onNavigate?.(item.target);
              }}
            >
              <Icon className="mr-2 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                <span className="block text-xs font-normal text-muted-foreground">{item.line}</span>
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
