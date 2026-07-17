import { ExternalLink, Headphones, Mic2, Moon, Music, PlayCircle, Radio, ScrollText, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAudio } from "@/components/app/AudioProvider";
import { getSanctuaryTrack } from "@/lib/audioTracks";

type AudioShelf = {
  title: string;
  description: string;
  icon: React.ReactNode;
  links: { label: string; href: string; note: string }[];
};

const shelves: AudioShelf[] = [
  {
    title: "Daily listening",
    description: "Short Orthodox audio for commutes, chores, and quiet morning routines.",
    icon: <Headphones className="h-5 w-5" />,
    links: [
      {
        label: "Ancient Faith Radio",
        href: "https://www.ancientfaith.com/",
        note: "Podcasts, talks, interviews, and daily Orthodox formation.",
      },
      {
        label: "Ancient Faith — Daily Orthodox Scriptures",
        href: "https://www.ancientfaith.com/podcasts/dailyscriptures",
        note: "Daily Scripture readings with Orthodox commentary.",
      },
    ],
  },
  {
    title: "Chant and hymnody",
    description: "Byzantine and Slavic musical traditions for prayerful listening.",
    icon: <Music className="h-5 w-5" />,
    links: [
      {
        label: "AGES Digital Chant Stand",
        href: "https://dcs.goarch.org/goa/dcs/dcs.html",
        note: "Daily hymns, propers, and chant resources.",
      },
      {
        label: "OCA — Liturgical music",
        href: "https://www.oca.org/liturgics/music-downloads",
        note: "Downloadable Orthodox liturgical music from the OCA.",
      },
    ],
  },
  {
    title: "Prayers and Psalms",
    description: "Audio-friendly prayer texts for stillness, repentance, and remembrance of God.",
    icon: <ScrollText className="h-5 w-5" />,
    links: [
      {
        label: "OCA — Prayers",
        href: "https://www.oca.org/orthodoxy/prayers",
        note: "Use these texts for spoken prayer or personal recording.",
      },
      {
        label: "GOARCH Online Chapel",
        href: "https://www.goarch.org/chapel",
        note: "Daily readings, saints, and liturgical links.",
      },
    ],
  },
  {
    title: "Homilies and teaching",
    description: "Catechesis, Scripture, liturgy, and practical Orthodox life.",
    icon: <Mic2 className="h-5 w-5" />,
    links: [
      {
        label: "OCA — The Orthodox Faith",
        href: "https://www.oca.org/orthodoxy/the-orthodox-faith",
        note: "Core Orthodox teaching to pair with audio study.",
      },
      {
        label: "Patristic Nectar Publications",
        href: "https://patristicnectar.org/",
        note: "Orthodox lectures, homilies, and catechetical courses.",
      },
    ],
  },
];

const listeningRules = [
  "Choose one short episode or hymn rather than endless scrolling.",
  "Do not replace prayer with religious content. Listen, then pray simply.",
  "Use chant and Psalms to quiet the heart before sleep or before reading Scripture.",
  "If a teacher contradicts your priest or parish guidance, ask your priest.",
];

export function OrthodoxAudioLibrary() {
  const { playTrack } = useAudio();

  function openSanctuary() {
    playTrack(getSanctuaryTrack("evening-prayer-demo"));
  }

  return (
    <div className="grid gap-6">
      <Card className="candlelight-card overflow-hidden rounded-[2rem] border p-5 shadow-[0_24px_80px_hsl(35_91%_48%/0.10)] sm:p-7">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Radio className="mr-1 h-3.5 w-3.5" /> Audio sanctuary
            </Badge>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-semibold">
              Chant • prayers • homilies • Scripture
            </Badge>

          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Orthodox audio for the whole day</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Enter a quiet, full-screen player for guided prayer, chant, transcripts, ambient stillness, and a sleep-friendly timer.
              </p>
            </div>
            <Button type="button" className="gold-foil h-12 rounded-full px-6 font-bold text-primary-foreground shadow-[0_18px_55px_hsl(35_91%_48%/0.24)] transition-transform duration-200 hover:scale-[1.03] active:scale-95" onClick={openSanctuary}>
              <PlayCircle className="mr-2 h-5 w-5" /> Enter sanctuary
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {shelves.map((shelf) => (
          <Card key={shelf.title} className="rounded-3xl border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_20px_60px_hsl(35_91%_48%/0.10)]">

            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                {shelf.icon}
              </span>

              <div>
                <h3 className="text-base font-semibold tracking-tight">{shelf.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{shelf.description}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-2">
              {shelf.links.map((link) => (
                <Button key={link.href} asChild variant="outline" className="btn-wrap h-auto min-h-14 justify-between rounded-2xl border-border/60 bg-background/50 py-3 hover:bg-background/70">
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <span className="min-w-0 text-left">
                      <span className="block font-semibold">{link.label}</span>
                      <span className="mt-0.5 block text-xs font-normal leading-relaxed text-muted-foreground">{link.note}</span>
                    </span>
                    <ExternalLink className="ml-3 h-4 w-4 shrink-0" />
                  </a>
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Listening rule</h3>
            <p className="mt-1 text-sm text-muted-foreground">A simple way to keep audio from becoming noise.</p>
          </div>
          <Volume2 className="h-5 w-5 text-muted-foreground" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3 sm:grid-cols-2">
          {listeningRules.map((rule) => (
            <div key={rule} className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed">
              {rule}
            </div>
          ))}
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-muted/20 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Moon className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Sleep practice: play one quiet hymn or Psalm, then stop audio and pray the Jesus Prayer slowly until sleep comes.
          </p>
        </div>
      </Card>
    </div>
  );
}
