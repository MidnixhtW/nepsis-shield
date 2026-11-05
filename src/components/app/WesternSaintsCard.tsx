import { ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MONTH_NAMES, WESTERN_SAINTS, type WesternSaint } from "@/content/westernSaints";
import { setPatronSaint } from "@/lib/patronSaint";
import { ocaSaintSearchUrl } from "@/lib/patronSaints";
import { showSuccess } from "@/utils/toast";

function choose(saint: WesternSaint) {
  setPatronSaint({ name: saint.name.replace(/^Saint /, "St. ").replace(/,.*$/, ""), month: saint.month, day: saint.day });
  showSuccess(`${saint.name} saved as your patron saint.`);
}

// Saints page: the Western saints of the undivided Church, in feast order, with name days.
export function WesternSaintsCard() {
  return (
    <Card id="west" className="scroll-mt-24 rounded-2xl border-border/50 bg-card/85 p-4 shadow-sm sm:p-5">
      <details>
        <summary className="cursor-pointer list-none rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Saints of the West</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Orthodox saints of Britain, Ireland, Gaul and Rome from before 1054, honoured East and West. Dear to Western Rite parishes, and to anyone with one of their names.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full border-border/60 bg-background/50">
              {WESTERN_SAINTS.length} saints
            </Badge>
          </div>
        </summary>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {WESTERN_SAINTS.map((saint) => (
            <li key={saint.name} className="rounded-xl border border-border/50 bg-background/45 p-3 shadow-sm sm:p-4">
              <p className="text-xs font-medium text-muted-foreground">
                {MONTH_NAMES[saint.month - 1]} {saint.day} · {saint.region}
              </p>
              <h3 className="mt-1 text-sm font-semibold tracking-tight text-primary">{saint.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{saint.line}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" className="rounded-xl border-border/60" onClick={() => choose(saint)} aria-label={`Make ${saint.name} my patron saint`}>
                  <Star className="mr-1.5 h-4 w-4" /> My patron
                </Button>
                <Button asChild variant="ghost" size="sm" className="rounded-xl">
                  <a href={ocaSaintSearchUrl(saint.search)} target="_blank" rel="noopener noreferrer">
                    Read life <ExternalLink className="ml-1.5 h-4 w-4" /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </details>
    </Card>
  );
}
