import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Copy, ExternalLink, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchDailyData } from "@/lib/orthocal";
import { searchLocalSaintLibrary, upsertDailySaints } from "@/lib/localSaintSearch";
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
  const [showAllPatrons, setShowAllPatrons] = useState(false);

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
  }, [currentDaily]);

  const saintSearch = search.trim();
  const localResults = useMemo(() => searchLocalSaintLibrary(saintSearch, currentDaily), [saintSearch, currentDaily]);
  const matchingPatronNeeds = localResults.patrons;
  const visiblePatronNeeds = saintSearch || showAllPatrons ? matchingPatronNeeds : matchingPatronNeeds.slice(0, 6);
  const hiddenPatronCount = Math.max(matchingPatronNeeds.length - visiblePatronNeeds.length, 0);
  const matchingSaintNames = localResults.saintNames;
  const ocaSearchQuery = matchingPatronNeeds[0]?.search ?? matchingSaintNames[0]?.name ?? saintSearch;

  return (
    <div className="mx-auto w-full max-w-4xl px-3 pb-24 pt-3 sm:px-4 sm:pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Saints</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lives of the Saints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search by saint, need, or prayer.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-xl border-border/60">
          <a href="https://www.oca.org/saints/lives" target="_blank" rel="noopener noreferrer">
            OCA Lives <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5">
        <Card className="rounded-2xl border-primary/15 bg-card/90 p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <div className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary sm:grid">
              <Search className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold tracking-tight">Search saints, patrons, and prayers</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Try a saint name or a need like grief, travel, illness, anger, or depression.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by need, name, or prayer…"
                  className="h-11 rounded-xl bg-background/70"
                />
                {saintSearch ? (
                  <Button asChild className="rounded-xl">
                    <a href={ocaSaintSearchUrl(ocaSearchQuery)} target="_blank" rel="noopener noreferrer">
                      Search OCA lives <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-2 text-sm font-semibold text-muted-foreground">
                    Enter a saint name to search OCA lives
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">

                {patronNeeds.length} patron entries · local search updates daily
              </p>
            </div>
          </div>
        </Card>

        {saintSearch ? (
          <Card className="rounded-2xl border-border/50 bg-card/80 p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Saint name matches</h2>
                <p className="mt-1 text-sm text-muted-foreground">From today, saved daily updates, and the patron guide.</p>
              </div>
              <Badge variant="outline" className="rounded-full border-border/60 bg-background/50">
                {matchingSaintNames.length} found
              </Badge>
            </div>

            {matchingSaintNames.length ? (
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {matchingSaintNames.map((item) => (
                  <Button
                    key={`${item.source}:${item.dateKey ?? "patron"}:${item.name}`}
                    asChild
                    variant="outline"
                    className="btn-wrap h-auto min-h-12 justify-between rounded-xl border-border/60 bg-background/45 py-3"
                  >
                    <a href={ocaSaintSearchUrl(item.name)} target="_blank" rel="noopener noreferrer">
                      <span className="min-w-0 text-left">
                        <span className="block font-medium">{item.name}</span>
                        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                          {item.source === "today"
                            ? "Today’s commemoration"
                            : item.source === "patron"
                              ? "Patron guide name"
                              : `${item.dateKey} · saved update`}
                        </span>
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No local saint-name matches yet. The index grows as daily commemorations are loaded on this device.
              </p>
            )}
          </Card>
        ) : null}

        <Card className="rounded-2xl border-border/50 bg-card/85 p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Patron saints and prayers</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Compact guidance for common needs. Open a card to read and copy the prayer.
              </p>
            </div>
            <Badge variant="outline" className="rounded-full border-border/60 bg-background/50">
              {matchingPatronNeeds.length} entries
            </Badge>
          </div>

          {saintSearch ? (
            <p className="mt-4 text-sm text-muted-foreground">
              {matchingPatronNeeds.length
                ? `Showing patron and prayer matches for “${saintSearch}”.`
                : `No patron/prayer matches found for “${saintSearch}”. Try anxiety, illness, grief, family, work, travel, confession, or anger.`}
            </p>
          ) : null}

          {matchingPatronNeeds.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {visiblePatronNeeds.map((item) => (
                <details key={item.need} className="group rounded-xl border border-border/50 bg-background/45 p-3 shadow-sm sm:p-4">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold tracking-tight text-foreground">{item.need}</p>
                        <h3 className="mt-1 text-sm font-medium text-primary">{item.saints}</h3>
                      </div>
                      <span className="mt-0.5 shrink-0 text-xs font-medium text-muted-foreground group-open:hidden">Prayer</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                  </summary>

                  <div className="mt-3 border-t border-border/50 pt-3">
                    <p className="text-sm leading-relaxed text-foreground/90">{item.prayer}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" className="rounded-xl border-border/60" onClick={() => void copyPrayer(item.need, item.prayer)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy prayer
                      </Button>
                      <Button asChild variant="ghost" size="sm" className="rounded-xl">
                        <a href={ocaSaintSearchUrl(item.search)} target="_blank" rel="noopener noreferrer">
                          Read life <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          ) : null}

          {hiddenPatronCount ? (
            <div className="mt-4 flex justify-center">
              <Button type="button" variant="outline" className="rounded-xl border-border/60" onClick={() => setShowAllPatrons(true)}>
                Show {hiddenPatronCount} more saints
              </Button>
            </div>
          ) : null}

          <p className="mt-4 rounded-xl border border-border/50 bg-background/45 p-3 text-xs leading-relaxed text-muted-foreground">
            If you may harm yourself or someone else, seek immediate help from emergency services, a trusted person, clergy, or a qualified clinician. Prayer and treatment are not enemies.
          </p>
        </Card>

        <Card className="rounded-2xl border-border/50 bg-card/70 p-4 shadow-sm sm:p-5">
          <details>
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Today’s commemorations</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(today, "MMMM d")} · {settings.calendarMode === "julian" ? "Old" : "New"} Calendar · Auto-saved
                  </p>
                </div>
                <span className="text-xs font-medium text-muted-foreground">Open list</span>
              </div>
            </summary>

            <div className="mt-4 grid gap-2 border-t border-border/50 pt-4">
              {q.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : q.isError ? (
                <p className="text-sm text-destructive">Couldn't load saints today.</p>
              ) : (q.data?.saints ?? []).length ? (
                (q.data?.saints ?? []).map((s) => (
                  <Button
                    key={s}
                    asChild
                    variant="ghost"
                    className="btn-wrap h-auto min-h-11 justify-between rounded-xl px-3 py-2"
                  >
                    <a href={ocaSaintSearchUrl(s)} target="_blank" rel="noopener noreferrer">
                      <span className="font-medium">{s}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No saints listed.</p>
              )}
            </div>
          </details>
        </Card>

        <p className="px-1 text-center text-sm leading-relaxed text-muted-foreground">
          Simple practice: “Holy [Name], pray to God for me.”
        </p>
      </div>
    </div>
  );
}
