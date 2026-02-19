import { MapPin, ExternalLink, Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/useSettings";

type Locator = {
  label: string;
  url: string;
  hint?: string;
};

function locatorFor(jurisdiction: string): Locator[] {
  const assembly: Locator = {
    label: "Assembly of Bishops (US) — Parish Directory",
    url: "https://www.assemblyofbishops.org/directories/parishes",
    hint: "Pan-Orthodox directory (US)",
  };

  // Keep this intentionally simple: official directories where we can.
  if (jurisdiction === "goarch") {
    return [
      {
        label: "GOARCH Parish Directory",
        url: "https://www.goarch.org/parishes/",
        hint: "Greek Orthodox Archdiocese of America",
      },
      {
        label: "GOARCH ParishDirectory Search",
        url: "https://parishdirectory.goarch.org/",
        hint: "Alternate directory",
      },
      assembly,
    ];
  }

  if (jurisdiction === "antiochian") {
    return [
      {
        label: "Antiochian — Diocese Directory",
        url: "https://www.antiochian.org/parishes/diocesedirectory",
        hint: "Antiochian Orthodox Christian Archdiocese",
      },
      {
        label: "Antiochian — Parish Map",
        url: "https://www.antiochian.org/parishes/map",
        hint: "Interactive map",
      },
      {
        label: "Antiochian Directory",
        url: "https://antiochiandirectory.org/",
        hint: "Directory site",
      },
      assembly,
    ];
  }

  if (jurisdiction === "rocor") {
    return [
      {
        label: "ROCOR — Parish & Clergy Directory",
        url: "https://directory.stinnocentpress.com/",
        hint: "Russian Orthodox Church Outside Russia",
      },
      assembly,
    ];
  }

  // Default / OCA
  return [
    {
      label: "OCA Directory (Find a Parish)",
      url: "https://www.oca.org/parishes",
      hint: "Orthodox Church in America",
    },
    assembly,
  ];
}

export function ParishFinder() {
  const { settings } = useSettings();
  const locators = locatorFor(settings.jurisdiction);

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Parish</p>
            <h2 className="text-xl font-semibold tracking-tight">Parish finder</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Official directories (based on your preferred jurisdiction in Settings).
            </p>
          </div>
          <MapPin className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-2">
          {locators.map((l) => (
            <Button
              key={l.url}
              asChild
              variant="outline"
              className="btn-wrap h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
            >
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{l.label}</span>
                  {l.hint ? (
                    <span className="block truncate text-xs text-muted-foreground">
                      {l.hint}
                    </span>
                  ) : null}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
          <div className="flex items-start gap-3">
            <Church className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Tip: if you're visiting, check the parish website for service times (they can differ by
              season).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}