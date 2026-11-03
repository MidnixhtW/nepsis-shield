import { useState } from "react";
import { BookOpen, ExternalLink, Hand, MoonStar, Shield, Sparkles, Star, Sun, Utensils } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,

  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PrayerRule } from "@/components/app/PrayerRule";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toggleFavoritePrayer, useDailyRhythm } from "@/lib/dailyHabits";
import { cn } from "@/lib/utils";
import { morningTrinity, morningFather, morningTheotokos, morningAngel, morningPatron, eveningIntro, eveningFather, eveningChrist, eveningSpirit, eveningTheotokos, nightPrayer, theotokosShort, stMichaelInvocation, stMichaelBeforeWatch, stMichaelProtection, SAINT_PRAYERS, SAINT_FILTERS, sharedPrayerBasics, repentancePrayer, griefPrayer, thanksgivingPrayer, mercyPrayer, beforeMeals, afterMeals, ocaOccasions, favoritePrayerOptions, prayerSources } from "@/content/prayerBookTexts";

function PrayerBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">

      <p className="text-xs font-semibold tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="scripture-text mt-2 space-y-2 text-base">
        {lines.map((l, idx) => (
          <p key={idx}>{l}</p>
        ))}
      </div>
    </div>
  );
}

function LinkRow({
  label,
  href,
  note,
}: {
  label: string;
  href: string;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {note ? <p className="mt-0.5 text-xs text-muted-foreground">{note}</p> : null}
      </div>
      <Button
        asChild
        variant="outline"
        className="mt-2 w-fit shrink-0 rounded-2xl border-border/60 sm:mt-0"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          Open
        </a>
      </Button>
    </div>
  );
}

export function PrayerBook({ showRule = true }: { showRule?: boolean }) {
  const [saintFilter, setSaintFilter] = useState<string>("all");
  const rhythm = useDailyRhythm();
  const allowedCats =
    SAINT_FILTERS.find((f) => f.id === saintFilter)?.cats ??
    SAINT_FILTERS[0].cats;
  const filteredSaints = SAINT_PRAYERS.filter((p) => allowedCats.includes(p.category));
  const favoritePrayers = favoritePrayerOptions.filter((prayer) =>
    rhythm.favoritePrayerIds.includes(prayer.id),
  );

  return (
    <div className="grid gap-4">
      {showRule ? <PrayerRule /> : null}

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Pinned prayers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Star a few prayers you want one tap away.
            </p>
          </div>
          <Star className="h-5 w-5 text-primary" />
        </div>
        <Separator className="my-4" />
        <div className="flex flex-wrap gap-2">
          {favoritePrayerOptions.map((prayer) => {
            const active = rhythm.favoritePrayerIds.includes(prayer.id);
            return (
              <Button
                key={prayer.id}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                className="rounded-2xl border-border/60"
                onClick={() => toggleFavoritePrayer(prayer.id)}
              >
                <Star className={cn("mr-2 h-3.5 w-3.5", active ? "fill-current" : "")} />
                {prayer.title}
              </Button>
            );
          })}
        </div>
        {favoritePrayers.length ? (
          <div className="mt-4 grid gap-3">
            {favoritePrayers.map((prayer) => (
              <PrayerBlock key={prayer.id} title={prayer.title} lines={prayer.lines} />
            ))}
          </div>
        ) : null}
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Prayers</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Daily prayers in-app, plus official links for many occasions.
            </p>
          </div>
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Everyday
          </Badge>
        </div>

        <Separator className="my-4" />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="shared" className="border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Shared Christian basics
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    How to use this section
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    The Lord's Prayer, Jesus Prayer, and Scripture prayer here use standard Orthodox wording. The short repentance, grief, thanksgiving, and mercy prayers below are original devotional aids, not replacements for parish prayer books or services.
                  </p>
                </div>
                <PrayerBlock title="Common starting prayers" lines={sharedPrayerBasics} />
                <PrayerBlock title="Repentance" lines={repentancePrayer} />
                <PrayerBlock title="Grief and hope" lines={griefPrayer} />
                <PrayerBlock title="Thanksgiving" lines={thanksgivingPrayer} />
                <PrayerBlock title="Mercy today" lines={mercyPrayer} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="st-michael" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-primary/25 bg-primary/10 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> St. Michael the Archangel
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-primary/25 bg-background/50 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Patron of Nepsis Shield
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    These short prayers ask St. Michael's intercession and are written as devotional aids for watchfulness, duty, protection, and mercy. For full hymn texts, use the official Orthodox links below.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/troparia/2021/11/08/103244-synaxis-of-the-archangel-michael-and-the-other-bodiless-powers"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Synaxis hymn texts (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/lives/2021/11/08/103244-synaxis-of-the-archangel-michael-and-the-other-bodiless-powers"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Life & feast note (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
                <PrayerBlock title="Invocation" lines={stMichaelInvocation} />
                <PrayerBlock title="Before watch or duty" lines={stMichaelBeforeWatch} />
                <PrayerBlock title="Protection without hatred" lines={stMichaelProtection} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="morning" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" /> Morning
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Morning Prayers" lines={morningTrinity} />
                <PrayerBlock title="To the Father" lines={morningFather} />
                <PrayerBlock title="To the Theotokos" lines={morningTheotokos} />
                <PrayerBlock title="To the Guardian Angel" lines={morningAngel} />
                <PrayerBlock title="To one's Patron Saint" lines={morningPatron} />

                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.oca.org/orthodoxy/prayers/morning-prayers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full Morning Prayers (OCA)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="evening" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <MoonStar className="h-4 w-4 text-primary" /> Evening
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Evening Prayers" lines={eveningIntro} />
                <PrayerBlock title="To the Father" lines={eveningFather} />
                <PrayerBlock title="To Jesus Christ" lines={eveningChrist} />
                <PrayerBlock title="To the Holy Spirit" lines={eveningSpirit} />
                <PrayerBlock title="To the Virgin Theotokos" lines={eveningTheotokos} />

                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.oca.org/orthodoxy/prayers/evening-prayers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full Evening Prayers (OCA)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="night" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <MoonStar className="h-4 w-4 text-primary" /> Night / before sleep
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Before sleep" lines={nightPrayer} />
                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.goarch.org/-/prayers-before-sleep"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    More prayers before sleep (GOARCH)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="occasions" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Hand className="h-4 w-4 text-primary" /> OCA: Occasions
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Official sources (OCA)
                  </p>
                  <div className="mt-3 grid gap-2">
                    {ocaOccasions.map((x) => (
                      <LinkRow key={x.href} label={x.label} href={x.href} note={x.note} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="communion" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Hand className="h-4 w-4 text-primary" /> More sources
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                {prayerSources.map((group) => (
                  <div
                    key={group.group}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                  >
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                      {group.group}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {group.items.map((x) => (
                        <LinkRow key={x.href} label={x.label} href={x.href} note={x.note} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meals" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" /> Meals
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <PrayerBlock title="Before meals" lines={beforeMeals} />
                <PrayerBlock title="After meals" lines={afterMeals} />

                <Button
                  asChild
                  variant="outline"
                  className="btn-wrap rounded-2xl border-border/60"
                >
                  <a
                    href="https://www.oca.org/orthodoxy/prayers/before-and-after-meals"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source: Before & After Meals (OCA)
                  </a>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="saints" className="mt-3 border-none">
            <AccordionTrigger className="rounded-2xl border border-border/60 bg-muted/20 px-4 text-left hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Saints & intercessions
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-3">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    How to use this
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    These are Orthodox invocations and quick prayers you can say any time. For full hymn texts (troparia/kontakia) and lives, open the official OCA links.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/troparia"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Troparia & Kontakia (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-2xl border-border/60">
                      <a
                        href="https://www.oca.org/saints/lives"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Lives of the Saints (OCA)
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <PrayerBlock title="Short prayers to the Theotokos" lines={theotokosShort} />

                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Browse
                  </p>
                  <ToggleGroup
                    type="single"
                    value={saintFilter}
                    onValueChange={(v) => v && setSaintFilter(v)}
                    className="mt-2 flex flex-wrap justify-start gap-2"
                  >
                    {SAINT_FILTERS.map((f) => (
                      <ToggleGroupItem
                        key={f.id}
                        value={f.id}
                        className="h-9 rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10"
                      >
                        {f.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Showing {filteredSaints.length}.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredSaints.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">
                            {p.title}
                          </p>
                          {p.subtitle ? (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {p.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="scripture-text mt-3 space-y-2 text-base">
                        {p.lines.map((l, idx) => (
                          <p key={idx}>{l}</p>
                        ))}
                      </div>

                      {p.ocaTroparionUrl ? (
                        <Button
                          asChild
                          variant="outline"
                          className="mt-3 w-fit rounded-2xl border-border/60"
                        >
                          <a
                            href={p.ocaTroparionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Troparion & Kontakion (OCA)
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">
                    Tip
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    For your patron saint, you can also use the "To one's Patron Saint" prayer in the Morning section and simply say the saint's name.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
}