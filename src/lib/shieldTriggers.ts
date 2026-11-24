import { BookOpen, Church, Crown, Flame, Heart, Moon, MoonStar, ShieldAlert, Smartphone, Users, Wind } from "lucide-react";
import type { AppSection } from "@/components/app/AppShell";
import { saveGlobalResume, setQuickState, type QuickStateKey } from "@/lib/dailyHabits";

// The shield triggers: what is happening right now, and the one small action that answers it. Used by the header's
// Help panel (all of them) and by Today (the first five, one tap from the home screen).
export type HelpTarget = { section: AppSection; tab?: string; read?: string; /** Which prayer to open first (prayer texts). */ for?: string };

export type HelpItem = {
  key: QuickStateKey;
  label: string;
  line: string;
  target: HelpTarget;
  icon: typeof ShieldAlert;
};

export const helpItems: HelpItem[] = [
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
    target: { section: "pray", tab: "prayers", for: "angry" },
    icon: Flame,
  },
  {
    key: "away",
    label: "Missing church",
    line: "Pray with the Church from where you are.",
    target: { section: "pray", tab: "prayers", for: "away" },
    icon: Church,
  },
  {
    key: "proud",
    label: "Proud",
    line: "Ask for humility.",
    target: { section: "pray", tab: "prayers", for: "proud" },
    icon: Crown,
  },
  {
    key: "tired",
    label: "Tired",
    line: "Use the short rule.",
    target: { section: "pray", tab: "daily" },
    icon: MoonStar,
  },
  {
    key: "lonely",
    label: "Lonely",
    line: "Pray for someone else.",
    target: { section: "pray", tab: "groups" },
    icon: Users,
  },
  {
    key: "sleepless",
    label: "Can't sleep",
    line: "Quiet prayers for the night.",
    target: { section: "pray", tab: "sleep" },
    icon: Moon,
  },
  {
    key: "scrolling",
    label: "Stuck scrolling",
    line: "Put it down for one minute.",
    target: { section: "pray", tab: "counter" },
    icon: Smartphone,
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

// Same URL shape Index uses, so the header's help panel can route without Today's navigator.
export function targetPath(target: HelpTarget) {
  if (target.section === "today") return "/today";
  const params = new URLSearchParams();
  if (target.tab) params.set("tab", target.tab);
  if (target.read) params.set("read", target.read);
  if (target.for) params.set("for", target.for);
  const qs = params.toString();
  return qs ? `/${target.section}?${qs}` : `/${target.section}`;
}

/** Remember the choice so the app can offer a way back to it, the same as the Help panel always has. */
export function rememberHelpChoice(item: HelpItem) {
  setQuickState(item.key);
  saveGlobalResume({
    label: `Return to ${item.label.toLowerCase()} support`,
    helper: item.line,
    target: item.target,
  });
}
