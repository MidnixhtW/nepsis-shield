import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { openHelpPanel } from "@/lib/appEvents";
import { helpItems, rememberHelpChoice, targetPath } from "@/lib/shieldTriggers";

// Five shield triggers on the first screen of Today, under Begin and in thumb reach: one tap to the prayer that
// answers the moment. Anger, anxiety, temptation, weariness (acedia) and pride. "More" opens the Help panel with the
// rest and the crisis lines. One swipeable row, so it never pushes Begin off the screen.
const ON_TODAY = ["angry", "anxious", "tempted", "tired", "proud"];

const chip =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 text-sm font-semibold " +
  "hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ShieldTriggers() {
  const navigate = useNavigate();
  const items = ON_TODAY.map((key) => helpItems.find((item) => item.key === key)).filter((item) => item !== undefined);

  return (
    <ul aria-label="What is happening right now" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.key} className="shrink-0">
            <button
              type="button"
              className={chip}
              aria-label={`${item.label}: ${item.line}`}
              onClick={() => {
                rememberHelpChoice(item);
                navigate(targetPath(item.target));
              }}
            >
              <Icon aria-hidden className="h-4 w-4 shrink-0 text-accent" />
              {item.label}
            </button>
          </li>
        );
      })}
      <li className="shrink-0">
        <button type="button" className={chip} onClick={openHelpPanel}>
          <MoreHorizontal aria-hidden className="h-4 w-4 shrink-0 text-accent" />
          More
        </button>
      </li>
    </ul>
  );
}
