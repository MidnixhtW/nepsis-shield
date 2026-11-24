import { MessageSquare, Phone } from "lucide-react";

// The 988 line, wherever the app offers help. Full-size text and full-size buttons: this is the line on the whole app
// that must be easiest to read and to tap, often by someone whose hands are not steady.
const action =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 text-sm font-semibold text-foreground " +
  "hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function CrisisResources() {
  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <p className="text-base leading-relaxed text-foreground">
        If you&rsquo;re thinking about harming yourself, you don&rsquo;t have to carry it alone. Call or text 988 (U.S.).
      </p>
      <p className="mt-1 text-sm leading-relaxed text-foreground/80">Veterans and service members: press 1 when calling.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href="tel:988" className={action}>
          <Phone aria-hidden className="h-4 w-4" /> Call 988
        </a>
        <a href="sms:988" className={action}>
          <MessageSquare aria-hidden className="h-4 w-4" /> Text 988
        </a>
      </div>
    </div>
  );
}
