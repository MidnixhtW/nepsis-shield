import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, Heart, Search, Sparkles, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchDailyData } from "@/lib/orthocal";
import { getLocalSaintIndexStats, searchLocalSaintLibrary, upsertDailySaints } from "@/lib/localSaintSearch";
import { ocaSaintSearchUrl, patronNeeds } from "@/lib/patronSaints";
import { getSettings } from "@/lib/settings";
import { showError, showSuccess } from "@/utils/toast";

async function copyPrayer(label: string, prayer: string) {
  try {
    await navigator.clipboard.writeText(prayer);
    showSuccess(`${label} prayer copied.`);
  } catch {
    showError("Couldn't copy prayer.");
  }
}

export default function Saints() {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);
  const settings = useMemo(() => getSettings(), []);
  const [search, setSearch] = useState("");
  const [localStats, setLocalStats] = useState(() => getLocalSaintIndexStats());

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, dayKey],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  const currentDaily = useMemo(
    () =>
      q.data?.saints?.length
        ? {
            dateKey: dayKey,
            calendarMode: settings.calendarMode,
            saints: q.data.saints,
            sourceUrl: q.data.sources.ocaDailyUrl,
          }
        : undefined,
    [dayKey, q.data?.saints, q.data?.sources.ocaDailyUrl, settings.calendarMode],
  );

  useEffect(() => {
    if (!currentDaily) return;
    upsertDailySaints(currentDaily);
    setLocalStats(getLocalSaintIndexStats());
  }, [currentDaily]);

  const saintSearch = search.trim();
  const localResults = useMemo(() => searchLocalSaintLibrary(saintSearch, currentDaily), [saintSearch, currentDaily]);
  const matchingPatronNeeds = localResults.patrons;
  const matchingSaintNames = localResults.saintNames;
  const ocaSearchQuery = matchingPatronNeeds[0]?.search ?? matchingSaintNames[0]?.name ?? saintSearch;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-4 sm:pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Saints</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lives of the Saints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search locally by saint, need, or prayer. Daily commemorations save automatically after they load.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
            <Link to="/today">Back</Link>
          </Button>
          <Button asChild size="sm" className="rounded-2xl">
            <a href="https://www.oca.org/saints/lives" target="_blank" rel="noopener noreferrer">
              OCA Lives <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:gap-4">
        <Card className="rounded-3xl border-primary/20 bg-card/85 p-4 shadow-sm backdrop-blur sm:p-5">
          <div className="flex items-start gap-3">
            <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary sm:grid">
              <Search className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Local search</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Saints, patrons, and prayers</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Search names, needs, and prayer text on this device.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try depression, Panteleimon, prayer, grief, Nicholas…"
                  className="h-11 rounded-2xl bg-background/70"
                />
                {saintSearch ? (
                  <Button asChild className="rounded-2xl">
                    <a href={ocaSaintSearchUrl(ocaSearchQuery)} target="_blank" rel="noopener noreferrer">
                      Search OCA lives <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button type="button" disabled className="rounded-2xl">
                    Search OCA lives <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="rounded-full border-border/50 bg-background/50">
                  {patronNeeds.length} patrons
                </Badge>
                <Badge variant="outline" className="rounded-full border-border/50 bg-background/50">
                  {localStats.saints} saints
                </Badge>
                <Badge variant="outline" className="rounded-full border-border/50 bg-background/50">
                  {localStats.days} days
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {saintSearch ? (
          <Card className="rounded-3xl border-border/50 bg-card/85 p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Name matches
                </Badge>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">Saint names</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  From today, saved daily updates, and the patron guide.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <Separator className="my-4" />

            {matchingSaintNames.length ? (
              <div className="grid gap-2 md:grid-cols-2">
                {matchingSaintNames.map((item) => (
                  <Button
                    key={`${item.source}:${item.dateKey ?? "patron"}:${item.name}`}
                    asChild
                    variant="outline"
                    className="btn-wrap h-auto min-h-12 justify-between rounded-2xl border-border/60 bg-background/50 py-3"
                  >
                    <a href={ocaSaintSearchUrl(item.name)} target="_blank" rel="noopener noreferrer">
                      <span className="min-w-0 text-left">
                        <span className="block font-semibold">{item.name}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                          {item.source === "today"
                            ? "Today’s commemoration"
                            : item.source === "patron"
                              ? "Patron guide name"
                              : `${item.dateKey} · saved daily update`}
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No local saint-name matches yet. The index grows as daily commemorations are loaded on this device.
              </p>
            )}
          </Card>
        ) : null}

        <Card className="rounded-3xl border-primary/20 bg-card/85 p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Patron guide
              </Badge>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">Patron saints and prayers</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Short prayers and Orthodox intercessors for common needs.
              </p>
            </div>
            <Star className="h-5 w-5 text-primary" />
          </div>

          <Separator className="my-4" />

          {saintSearch ? (
            <p className="mb-3 text-sm text-muted-foreground">
              {matchingPatronNeeds.length
                ? `Showing local patron and prayer matches for “${saintSearch}”.`
                : `No patron/prayer matches found for “${saintSearch}”. Try anxiety, illness, grief, family, work, travel, confession, or anger.`}
            </p>
          ) : null}

          {matchingPatronNeeds.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {matchingPatronNeeds.map((item) => (
                <div key={item.need} className="rounded-2xl border border-border/60 bg-background/60 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    {item.need}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold">{item.saints}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">{item.prayer}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-2xl border-border/60" onClick={() => void copyPrayer(item.need, item.prayer)}>
                      <Copy className="mr-2 h-4 w-4" /> Copy
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a href={ocaSaintSearchUrl(item.search)} target="_blank" rel="noopener noreferrer">
                        Read life <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              If you may harm yourself or someone else, seek immediate help from emergency services, a trusted person, clergy, or a qualified clinician. Prayer and treatment are not enemies; both can be received with humility before God.
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/50 bg-card/85 p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {format(today, "MMMM d")}
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {settings.calendarMode === "julian" ? "Old" : "New"} Calendar
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Auto-saved
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Today’s commemorations are added to local search after loading.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          {q.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : q.isError ? (
            <p className="text-sm text-destructive">Couldn't load saints today.</p>
          ) : (
            <div className="grid gap-2">
              {(q.data?.saints ?? []).length ? (
                (q.data?.saints ?? []).map((s) => (
                  <Button
                    key={s}
                    asChild
                    variant="outline"
                    className="btn-wrap h-auto min-h-12 justify-between rounded-2xl border-border/60 bg-background/50 py-3"
                  >
                    <a href={ocaSaintSearchUrl(s)} target="_blank" rel="noopener noreferrer">
                      <span className="min-w-0 text-left">
                        <span className="block font-semibold">{s}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                          Holy saint of God, pray for us.
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No saints listed.</p>
              )}
            </div>
          )}
        </Card>

        <Card className="rounded-3xl border-border/50 bg-muted/15 p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <Heart className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Simple practice: “Holy [Name], pray to God for me.”
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
