import type { AppSection } from "@/components/app/AppShell";
import { NeedHelpNow } from "@/components/app/NeedHelpNow";

type NavigateTarget = { section: AppSection; tab?: string; read?: string; path?: string };

export function TodayRhythmDashboard({
  onNavigate,
}: {
  onNavigate?: (to: NavigateTarget) => void;
}) {
  return <NeedHelpNow onNavigate={onNavigate} />;
}
