import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { openHelpPanel } from "@/lib/appEvents";
import { helpItems, rememberHelpChoice, targetPath } from "@/lib/shieldTriggers";

// Five of the shield triggers, straight on Today: one tap from the home screen to the prayer that answers the moment,
// instead of opening the Help panel first. "More" opens the panel with the rest and the crisis lines.
const ON_TODAY = ["anxious", "tempted", "angry", "tired", "sleepless"];

const chip =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 text-sm font-semibold " +
  "hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ShieldTriggers() {
  const navigate = useNavigate();
  const items = helpItems.filter((item) => ON_TODAY.includes(item.key));

  return (
    <ul aria-label="What is happening right now" className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.key}>
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
      <li>
        <button type="button" className={chip} onClick={openHelpPanel}>
          <MoreHorizontal aria-hidden className="h-4 w-4 shrink-0 text-accent" />
          More
        </button>
      </li>
    </ul>
  );
}
