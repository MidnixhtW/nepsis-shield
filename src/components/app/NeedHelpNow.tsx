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
    <div className="min-w-0 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 break-words">
          <p className="text-xs font-semibold uppercase leading-snug tracking-[0.12em] text-primary sm:tracking-[0.16em]">Need help now?</p>
          <h2 className="mt-1 text-lg font-semibold leading-tight tracking-tight sm:text-xl">Take 60 seconds. Breathe, pray, re-center.</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Choose what is happening and take one small action before you react.
          </p>
        </div>
        <ShieldAlert className="h-7 w-7 shrink-0 text-primary" />
      </div>

      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-3">

        {helpItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.key}
              type="button"
              variant="outline"
              className="h-auto max-w-full justify-start whitespace-normal rounded-2xl border-border/60 bg-background/65 px-3 py-3 text-left hover:border-primary/40"
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
              <span className="min-w-0 break-words">
                <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                <span className="block text-xs font-normal leading-snug text-muted-foreground">{item.line}</span>
              </span>
            </Button>

          );
        })}
      </div>
    </div>
  );
}
