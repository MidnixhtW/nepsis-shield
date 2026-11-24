
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { CrisisResources } from "@/components/app/CrisisResources";
import { GroundResetButton } from "@/components/app/GroundMeNow";
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
    <div className="min-w-0">
      <div className="min-w-0 break-words">
        <h2 className="text-2xl leading-tight">Take sixty seconds</h2>
        <p className="scripture-text mt-1 text-base text-muted-foreground">Breathe, pray, then choose what is happening.</p>
      </div>
      <GroundResetButton className="mt-4 h-12 w-full rounded-full text-base font-semibold">Start a 60-second reset</GroundResetButton>

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
