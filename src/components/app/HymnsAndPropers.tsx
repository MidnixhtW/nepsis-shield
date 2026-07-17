import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ExternalLink, Music, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAudio } from "@/components/app/AudioProvider";
import { useSettings } from "@/hooks/useSettings";
import { getSanctuaryTrack } from "@/lib/audioTracks";
import { buildOcaDailyUrl } from "@/lib/orthocal";

type DailySource = "preferred" | "oca" | "goarch";

function formatGoarchChapelUrl(date: Date) {
  // GOARCH Online Chapel: /chapel?date=M/D/YYYY
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  return `https://www.goarch.org/chapel?date=${encodeURIComponent(`${m}/${d}/${y}`)}`;
}

function dailySourceUrl(source: DailySource, preferredJurisdiction: string, date: Date) {
  if (source === "oca") return buildOcaDailyUrl(date);
  if (source === "goarch") return formatGoarchChapelUrl(date);
  // preferred
  if (preferredJurisdiction === "goarch") return formatGoarchChapelUrl(date);
  return buildOcaDailyUrl(date);
}

export function HymnsAndPropers() {
  const today = useMemo(() => new Date(), []);
  const { settings } = useSettings();
  const { playTrack } = useAudio();
  const [source, setSource] = useState<DailySource>("preferred");

  const openUrl = useMemo(
    () => dailySourceUrl(source, settings.jurisdiction, today),
    [source, settings.jurisdiction, today],
  );

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Hymns</p>
            <h2 className="text-xl font-semibold tracking-tight">Hymns & propers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Troparia/kontakia and daily texts from trusted sources.
            </p>
          </div>
          <Music className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">For</p>
              <p className="text-sm font-semibold">{format(today, "MMMM d")}</p>
            </div>

            <div className="grid gap-2 sm:justify-items-end">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Daily source</p>
              <Select value={source} onValueChange={(v) => setSource(v as DailySource)}>
                <SelectTrigger className="h-10 w-full rounded-2xl sm:w-[220px]">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preferred">Preferred (Settings)</SelectItem>
                  <SelectItem value="oca">OCA</SelectItem>
                  <SelectItem value="goarch">GOARCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button asChild className="btn-wrap rounded-2xl">
            <a href={openUrl} target="_blank" rel="noopener noreferrer">
              Open daily texts <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="btn-wrap h-11 justify-between rounded-2xl border-border/60 bg-background/50 hover:bg-background/70"
            >
              <a
                href="https://www.oca.org/saints/troparia"
                target="_blank"
                rel="noopener noreferrer"
              >
                Troparia & Kontakia (OCA) <ExternalLink className="h-4 w-4" />
              </a>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="btn-wrap h-11 justify-between rounded-2xl border-border/60 bg-background/50 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/70"
              onClick={() => playTrack(getSanctuaryTrack("byzantine-ison"))}
            >
              Play chant mode <PlayCircle className="h-4 w-4" />
            </Button>
          </div>

          <p className="break-words text-xs text-muted-foreground">
            Sources: "{buildOcaDailyUrl(today)}" • "{formatGoarchChapelUrl(today)}" •
            "https://www.oca.org/saints/troparia" • "https://dcs.goarch.org/goa/dcs/dcs.html"
          </p>
        </div>
      </Card>

    </div>
  );
}
