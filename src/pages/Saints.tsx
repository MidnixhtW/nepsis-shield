import { useMemo, useState } from "react";
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
import { findPatronNeeds } from "@/lib/patronSaints";
import { getSettings } from "@/lib/settings";
import { showError, showSuccess } from "@/utils/toast";

const patronNeeds = [
  {
    need: "Lost things",
    saints: "Saint Phanourios",
    search: "Phanourios",
    note: "For finding what is lost and returning with gratitude.",
    prayer:
      "Holy Greatmartyr Phanourios, pray to God for me. Ask the Lord to reveal what is hidden if it is profitable for my salvation, and teach me to seek first the Kingdom of God. Amen.",
  },
  {
    need: "Anxiety, depression, and dark thoughts",
    saints: "Saints Porphyrios and Paisios",
    search: "Porphyrios Paisios",
    note: "For despondency, fear, intrusive thoughts, and the need for peace.",
    prayer:
      "Holy Elders Porphyrios and Paisios, pray to Christ our God for me. Ask Him to quiet my thoughts, guard me from despair, strengthen me to seek help, and fill my heart with repentance, hope, and the light of His mercy. Amen.",
  },
  {
    need: "Illness and healing",
    saints: "Saint Panteleimon",
    search: "Panteleimon",
    note: "For sickness, medical care, surgery, and those who treat the sick.",
    prayer:
      "Holy Greatmartyr and Healer Panteleimon, pray to God for the sick and suffering. Ask Christ the Physician of souls and bodies to grant healing, patience, courage, and salvation according to His holy will. Amen.",
  },
  {
    need: "Protection on duty",
    saints: "Holy Archangel Michael",
    search: "Archangel Michael",
    note: "For watchfulness, courage, restraint, and protection from danger.",
    prayer:
      "Holy Archangel Michael, commander of the bodiless hosts, defend us and pray to God for us. Guard us from fear, anger, pride, and every temptation that darkens the heart. Amen.",
  },
  {
    need: "Work, money, and housing",
    saints: "Saint Xenia of Petersburg",
    search: "Xenia Petersburg",
    note: "For housing, employment, provision, and trusting God in instability.",
    prayer:
      "Blessed Xenia, fool-for-Christ and quick helper, pray to God for me. Ask the Lord to provide what is needful, to open a righteous path, and to make me generous, patient, and faithful in uncertainty. Amen.",
  },
  {
    need: "Travel and safe return",
    saints: "Saint Nicholas the Wonderworker",
    search: "Nicholas Wonderworker",
    note: "For travelers, sailors, commuters, families apart, and those in danger.",
    prayer:
      "Holy Father Nicholas, wonderworker and shepherd, pray to God for all who travel by land, sea, and air. Ask the Lord to guide, protect, and return us in peace. Amen.",
  },
  {
    need: "Study, exams, and wisdom",
    saints: "The Three Holy Hierarchs",
    search: "Three Holy Hierarchs",
    note: "For learning, teaching, exams, discernment, and Orthodox formation.",
    prayer:
      "Holy Basil the Great, Gregory the Theologian, and John Chrysostom, pray to God for me. Ask the Lord to grant humility, attention, memory, wisdom, and love for the truth. Amen.",
  },
  {
    need: "Anger and strong passions",
    saints: "Saint Moses the Black",
    search: "Moses the Black",
    note: "For anger, violence, resentment, lust, addiction, and repentance after falls.",
    prayer:
      "Venerable Moses, who rose from violence to holiness by repentance, pray to God for me. Ask Christ to break the power of anger and passion, give me tears of repentance, and teach me mercy. Amen.",
  },
  {
    need: "Family and children",
    saints: "Saints Joachim and Anna",
    search: "Joachim Anna",
    note: "For marriage, children, parents, infertility, and homes under strain.",
    prayer:
      "Holy and righteous Joachim and Anna, grandparents of Christ according to the flesh, pray to God for our homes. Ask Him to bless parents and children, heal wounds, and teach us patience and love. Amen.",
  },
  {
    need: "Grief and loneliness",
    saints: "Saint Xenia of Petersburg",
    search: "Xenia Petersburg",
    note: "For widowhood, grief, abandonment, and loneliness.",
    prayer:
      "Blessed Xenia, you bore grief with holy foolishness and love for Christ. Pray for me, that sorrow may not become despair, and that Christ would comfort, strengthen, and save me. Amen.",
  },
  {
    need: "Confession and repentance",
    saints: "Saint Mary of Egypt",
    search: "Mary of Egypt",
    note: "For returning to confession, chastity, repentance, and starting again.",
    prayer:
      "Venerable Mother Mary of Egypt, pray to God for me. Ask the Lord to grant me true repentance, courage to confess, freedom from shame, and the strength to rise again. Amen.",
  },
  {
    need: "Before building or creating",
    saints: "Saint Joseph the Betrothed",
    search: "Joseph Betrothed",
    note: "For honest work, craft, discipline, and serving others through what you build.",
    prayer:
      "Holy and righteous Joseph, guardian of the Theotokos and the Christ Child, pray to God for me. Ask the Lord to bless the work of my hands, keep me humble, and make my labor useful and pure. Amen.",
  },
];

function ocaSaintSearchUrl(query: string) {
  return `https://www.oca.org/saints/lives?search=${encodeURIComponent(query)}`;
}

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

  const q = useQuery({
    queryKey: ["daily", settings.calendarMode, dayKey],
    queryFn: () => fetchDailyData(today, settings.calendarMode),
  });

  const saintSearch = search.trim();
  const matchingPatronNeeds = useMemo(
    () => (saintSearch ? findPatronNeeds(saintSearch, patronNeeds.length) : patronNeeds),
    [saintSearch],
  );
  const ocaSearchQuery = matchingPatronNeeds.length === 1 ? matchingPatronNeeds[0].search : saintSearch;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Saints</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lives of the Saints</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily commemorations, Orthodox patron saints, and short intercession prayers.
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Start here</p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">Search a saint by name or need</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Look up a saint, patron, feast, title, or condition like depression in the OCA Lives collection and patron-saints guide.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try depression, anxiety, Nicholas, Mary of Egypt…"
                  className="h-11 rounded-2xl bg-background/70"
                />
                {saintSearch ? (
                  <Button asChild className="rounded-2xl">
                    <a href={ocaSaintSearchUrl(ocaSearchQuery)} target="_blank" rel="noopener noreferrer">
                      Search lives <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button type="button" disabled className="rounded-2xl">
                    Search lives <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                There's an app for that
              </Badge>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">Patron saints for common needs</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Find an Orthodox intercessor, pray a short prayer, and open further reading. All prayer is directed to Christ, asking the saints to pray with us and for us.
              </p>
            </div>
            <Star className="h-5 w-5 text-primary" />
          </div>

          <Separator className="my-4" />

          {saintSearch ? (
            <p className="mb-3 text-sm text-muted-foreground">
              {matchingPatronNeeds.length
                ? `Showing patron saints connected with “${saintSearch}”.`
                : `No patron-saint matches found for “${saintSearch}”. Try anxiety, illness, grief, family, work, or travel.`}
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
