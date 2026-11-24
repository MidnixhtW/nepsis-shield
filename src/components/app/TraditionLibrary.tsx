import { ChevronRight } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { getTradition, libraryFor } from "@/lib/tradition";

// The Library follows the person's church: the Western Rite vicariate, the Melkite eparchy, the Byzantine Catholic
// metropolia, or the OCA.
export function TraditionLibrary() {
  const { settings } = useSettings();
  const library = libraryFor(getTradition(settings));
  return (
    <div className="grid gap-4 px-1">
      <p className="text-base text-muted-foreground">{library.intro}</p>
      <ul className="border-t border-border/80">
        {library.links.map((link) => (
          <li key={link.url} className="border-b border-border/80">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-3 py-3">
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg">{link.label}</span>
                <span className="block text-sm text-muted-foreground">{link.hint}</span>
              </span>
              <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
