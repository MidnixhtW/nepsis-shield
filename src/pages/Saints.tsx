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
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Saints</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lives of the Saints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Local saint-name, patron, and prayer search with daily commemorations saved from the OCA-linked feed.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button asChild className="rounded-2xl">
            <a href="https://www.oca.org/saints/lives" target="_blank" rel="noopener noreferrer">
              OCA Lives <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Local search</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Search saints, names, patrons, and prayers</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Search works locally across the patron guide, prayer text, and every daily saint list this device has received. Daily names are refreshed from the app’s OCA-linked daily source when that feed updates.
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
                <Badge variant="outline" className="rounded-full border-border/60 bg-background/60">
                  {patronNeeds.length} patron needs
                </Badge>
                <Badge variant="outline" className="rounded-full border-border/60 bg-background/60">
                  {localStats.saints} saved daily saints
                </Badge>
                <Badge variant="outline" className="rounded-full border-border/60 bg-background/60">
                  {localStats.days} saved days
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {saintSearch ? (
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Local name matches
                </Badge>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">Saint names found on this device</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  These results come from today’s commemorations, saved daily updates, and patron-saint names.
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

        <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                Patron guide
              </Badge>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">Patron saints and prayers for common needs</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Find an Orthodox intercessor, pray a short prayer, and open further reading. The local search includes saint names, needs, keywords, notes, and prayer text.
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

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {format(today, "MMMM d")}
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {settings.calendarMode === "julian" ? "Old Calendar" : "New Calendar"}
                </Badge>
                <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Saved locally after load
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Today’s daily commemorations are added to local saint search when the feed loads.
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

        <Card className="rounded-3xl border-border/60 bg-muted/20 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Heart className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Simple Orthodox practice: “Holy [Name], pray to God for me.” Intercession is never a replacement for Christ; it is the life of the Church asking Christ for mercy together.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
