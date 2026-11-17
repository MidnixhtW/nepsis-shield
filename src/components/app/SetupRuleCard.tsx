import { useState } from "react";
import { ChevronRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ONBOARDING_KEY, START_TUTORIAL_EVENT } from "@/components/app/QuickStartDialog";
import { getStoredItem } from "@/lib/deviceStorage";

const HIDDEN_KEY = "onboarding:setup-card-hidden";

function hiddenThisVisit() {
  try {
    return window.sessionStorage.getItem(HIDDEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function isRuleSetUp() {
  return Boolean(getStoredItem<boolean>(ONBOARDING_KEY));
}

// For someone who chose "Look around first": an inline invitation on Today, in the place the prayer plan will live.
// It sits in the page flow, so it never covers other cards, and "Not now" hides it until the next visit.
export function SetupRuleCard() {
  const [hidden, setHidden] = useState(hiddenThisVisit);
  if (hidden || isRuleSetUp()) return null;

  function hide() {
    try {
      window.sessionStorage.setItem(HIDDEN_KEY, "1");
    } catch {
      // Without session storage the card simply hides until the page reloads.
    }
    setHidden(true);
  }

  return (
    <Card className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-primary/30 p-4 sm:p-5" role="region" aria-label="Set up your daily rule">
      <Compass aria-hidden className="h-5 w-5 shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Set up your daily rule</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">A few short questions shape a small rule of prayer you can keep.</p>
      </div>
      <div className="flex basis-full justify-end gap-2 sm:basis-auto">
        <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={hide}>
          Not now
        </Button>
        <Button type="button" size="sm" className="rounded-full" onClick={() => window.dispatchEvent(new Event(START_TUTORIAL_EVENT))}>
          Set up <ChevronRight aria-hidden className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
