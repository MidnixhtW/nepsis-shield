import { BookOpen, Church, ExternalLink, Hand, Info, ListChecks, Music, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAudio } from "@/components/app/AudioProvider";
import { getSanctuaryTrack } from "@/lib/audioTracks";

const liturgyFlow = [
  {
    title: "Before Liturgy",
    cue: "Arrive early, light a candle if appropriate, venerate icons, and quiet your phone.",
    response: "Pray: Lord, have mercy. Help me stand before You with attention.",
  },
  {
    title: "The Little Entrance",
    cue: "The Gospel is carried in procession: Christ comes among His people through His Word.",

    response: "Stand attentively. Make the sign of the Cross when your parish custom does.",
  },
  {
    title: "Trisagion Hymn",
    cue: "The Church joins the angelic hymn: Holy God, Holy Mighty, Holy Immortal, have mercy on us.",
    response: "Sing or pray the hymn quietly with the congregation.",
  },
  {
    title: "Epistle and Gospel",
    cue: "Scripture is proclaimed liturgically, not as private study only.",
    response: "Stand for the Gospel. Listen for one command of Christ to carry into the week.",
  },
  {
    title: "The Cherubic Hymn",
    cue: "The faithful set aside earthly cares as the Gifts are prepared for the Great Entrance.",
    response: "Pray for the living, the departed, your parish, and those who asked your prayers.",
  },
  {
    title: "The Creed",
    cue: "The faith of the Church is confessed together before the Eucharistic prayer.",
    response: "Say the Creed with attention; do not rush the words.",
  },
  {
    title: "Anaphora",
    cue: "Thanksgiving, remembrance, offering, and the invocation of the Holy Spirit.",
    response: "Bow your heart in gratitude. If your parish kneels or bows, follow local custom.",
  },
  {
    title: "The Lord’s Prayer",
    cue: "The whole Church asks the Father for daily bread, forgiveness, and deliverance.",
    response: "Forgive others before approaching the Chalice.",
  },
  {
    title: "Holy Communion",
    cue: "Orthodox Christians receive with preparation, confession as needed, fasting, and pastoral guidance.",
    response: "If you are not receiving, pray quietly and ask for a blessing if local practice allows.",
  },
  {
    title: "After Liturgy",
    cue: "The dismissal sends you to live the Eucharistic life in the world.",
    response: "Give thanks, greet others, and carry one concrete act of mercy into the day.",
  },
];

const beginnerCues = [
  "Stand when most of the parish stands; sit when the parish sits.",
  "Cross yourself at mentions of the Trinity, petitions for mercy, and according to local custom.",
  "Do not worry about doing everything perfectly. Reverence and attention matter most.",
  "Ask a priest or trusted parishioner about Communion, confession, and parish-specific customs.",
];

const sourceLinks = [
  {
    label: "OCA — The Divine Liturgy",
    href: "https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-divine-liturgy",
  },
  {
    label: "GOARCH — Divine Liturgy text",
    href: "https://www.goarch.org/-/the-divine-liturgy-of-saint-john-chrysostom",
  },
  {
    label: "AGES Digital Chant Stand",
    href: "https://dcs.goarch.org/goa/dcs/dcs.html",
  },
];

export function DivineLiturgyCompanion() {
  const { playTrack } = useAudio();

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
        <div className="relative p-5 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/10" />

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                <Church className="mr-1 h-3.5 w-3.5" /> Liturgy mode
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
                Follow along • Learn responses • Stay prayerful
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Divine Liturgy companion</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A reverent guide for newcomers, catechumens, and lifelong Orthodox Christians who want to follow the service with more attention.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <Button asChild className="btn-wrap rounded-2xl">
                  <a href="https://www.oca.org/orthodoxy/the-orthodox-faith/worship/the-divine-liturgy" target="_blank" rel="noopener noreferrer">
                    Read full guide <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button type="button" variant="outline" className="btn-wrap rounded-2xl border-border/60 bg-background/55 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/75" onClick={() => playTrack(getSanctuaryTrack("byzantine-ison"))}>
                  Open chant mode <Music className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Service flow</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                What is happening and what to do prayerfully.
              </p>
            </div>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            {liturgyFlow.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-border/60 bg-background/50 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold tracking-tight">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.cue}</p>
                    <p className="mt-2 rounded-xl bg-muted/35 px-3 py-2 text-sm leading-relaxed">
                      <span className="font-semibold">Practice: </span>{step.response}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 content-start">
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Hand className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h3 className="text-base font-semibold tracking-tight">Newcomer cues</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {beginnerCues.map((cue) => (
                    <li key={cue}>{cue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <h3 className="text-base font-semibold tracking-tight">Communion preparation</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Preparation normally includes prayer, fasting, reconciliation, confession as needed, and blessing from your priest according to parish practice.
                </p>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 h-5 w-5 text-primary" />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold tracking-tight">Trusted sources</h3>
                <div className="mt-3 grid gap-2">
                  {sourceLinks.map((link) => (
                    <Button key={link.href} asChild variant="outline" className="btn-wrap justify-between rounded-2xl border-border/60">
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label} <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-muted/20 p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                This guide supports participation; it does not replace your parish’s service book, priest, choir director, or local customs.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
