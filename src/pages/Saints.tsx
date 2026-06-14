import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { ExternalLink, Heart, Search, Sparkles, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { fetchDailyData } from "@/lib/orthocal";
import { getSettings } from "@/lib/settings";

const patronTopics = [
  { topic: "Illness and healing", saint: "Saint Panteleimon", prayer: "Holy Greatmartyr Panteleimon, pray to God for healing and courage." },
  { topic: "Work and provision", saint: "Saint Nicholas", prayer: "Holy Father Nicholas, pray that I may serve generously and trust God." },
  { topic: "Anxiety and despondency", saint: "Saint Porphyrios", prayer: "Saint Porphyrios, pray that Christ’s love may quiet my heart." },
  { topic: "Family and children", saint: "Saints Joachim and Anna", prayer: "Holy Joachim and Anna, pray for our homes and children." },
  { topic: "Study and wisdom", saint: "Saint Basil the Great", prayer: "Holy Basil, pray that I may seek truth with humility." },
  { topic: "Repentance", saint: "Saint Mary of Egypt", prayer: "Holy Mother Mary, pray that I may rise again through repentance." },
];

function ocaSaintSearchUrl(query: string) {
  return `https://www.oca.org/saints/lives?search=${encodeURIComponent(query)}`;
}

export default function Saints() {
  const today = useMemo(() => new Date(), []);
  const dayKey = useMemo(() => format(today, "yyyy-MM-dd"), [today]);
  const settings = useMemo(() => getSettings(), []);
  const [search, setSearch] = useState("");

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, dayKey],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  const saintSearch = search.trim();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Saints</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lives of the Saints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Today’s commemorations, saint search, patron topics, and short intercession prayers.
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
                  Tap to open OCA lives
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pick one saint and ask their prayers throughout the day.
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

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Search className="mt-1 h-5 w-5 text-primary" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold tracking-tight">Search a saint by name</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Look up a saint, patron, feast, or title in the OCA Lives collection.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try Nicholas, Mary of Egypt, John Chrysostom…"
                  className="h-11 rounded-2xl"
                />
                <Button asChild disabled={!saintSearch} className="rounded-2xl">
                  <a href={saintSearch ? ocaSaintSearchUrl(saintSearch) : "#"} target="_blank" rel="noopener noreferrer">
                    Search lives <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Patron saints by topic</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A quick starting point for intercession and further reading.
              </p>
            </div>
            <Star className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3 sm:grid-cols-2">
            {patronTopics.map((item) => (
              <div key={item.topic} className="rounded-2xl border border-border/60 bg-background/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {item.topic}
                </p>
                <h3 className="mt-1 text-sm font-semibold">{item.saint}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.prayer}</p>
                <Button asChild variant="outline" size="sm" className="mt-3 rounded-2xl border-border/60">
                  <a href={ocaSaintSearchUrl(item.saint)} target="_blank" rel="noopener noreferrer">
                    Read life <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-muted/20 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Heart className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Simple practice: “Holy [Name], pray to God for me.” Intercession is part of Eastern Christian life, always directed toward Christ and His mercy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
