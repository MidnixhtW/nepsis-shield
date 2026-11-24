import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { CrisisResources } from "@/components/app/CrisisResources";
import { helpItems, rememberHelpChoice, targetPath, type HelpTarget } from "@/lib/shieldTriggers";

export function NeedHelpNow({
  onNavigate,
  onChoose,
}: {
  onNavigate?: (to: HelpTarget) => void;
  /** Called after a choice is made, e.g. to close the panel that holds this card. */
  onChoose?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-w-0 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-sm sm:p-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 break-words">
          <p className="text-xs font-semibold leading-snug text-primary">Need help now?</p>
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
                rememberHelpChoice(item);
                if (onNavigate) onNavigate(item.target);
                else navigate(targetPath(item.target));
                onChoose?.();
              }}
            >
              <Icon className="mr-2 h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 break-words">
                <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                <span className="block text-xs font-normal leading-snug text-muted-foreground">{item.line}</span>
              </span>
            </Button>

          );
        })}
      </div>
      <CrisisResources />
    </div>
  );
}
