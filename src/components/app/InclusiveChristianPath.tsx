import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Church,
  Compass,
  Hand,
  Heart,
  HeartHandshake,
  Info,
  Landmark,
  ListChecks,
  MessageCircleQuestion,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { AppSection } from "@/components/app/AppShell";

type CalendarLens = "orthodox" | "shared" | "both";

type PathAction = { section: AppSection; tab?: string; read?: string };

function FeatureCard({
  title,
  description,
  icon,
  items,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function PathButton({
  children,
  onClick,
  variant = "outline",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline";
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className="tap h-auto min-h-11 justify-start rounded-2xl border-border/60 px-4 py-3 text-left"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

const calendarContent: Record<CalendarLens, { title: string; items: string[] }> = {
  orthodox: {
    title: "Orthodox calendar",
    items: [
      "Daily saints, feasts, fasting guidance, tones, and trusted Orthodox source links.",
      "New Calendar / Old Calendar selection stays in Settings for parish alignment.",
      "Fasting guidance remains pastoral: follow your priest, health needs, and local parish practice.",
    ],
  },
  shared: {
    title: "Shared Christian highlights",
    items: [
      "Nativity/Christmas, Theophany/Epiphany, Pascha/Easter, Ascension, Pentecost, and major biblical feasts.",
      "Scripture, Psalms, the Lord's Prayer, repentance, thanksgiving, and works of mercy remain central.",
      "Helpful for Catholics, Protestants, seekers, and Orthodox users who want a simple shared view.",
    ],
  },
  both: {
    title: "Both together",
    items: [
      "Shows the shared Christian center while keeping Orthodox feasts, fasting seasons, saints, and hymn links visible.",
      "Best default for an app that welcomes all Christians without hiding its Orthodox roots.",
      "Use the app devotionally; use parish and pastoral guidance for sacramental participation.",
    ],
  },
};

export function InclusiveChristianPath({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: (to: PathAction) => void;
}) {
  const [lens, setLens] = useState<CalendarLens>("both");
  const selected = calendarContent[lens];

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="relative p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <HeartHandshake className="mr-1 h-3.5 w-3.5" /> Welcome
            </Badge>
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              Orthodox-rooted • Christian-first
            </Badge>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                For every Christian seeking a deeper life in Christ.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                A Christian prayer and formation app rooted in the Orthodox tradition, welcoming all who seek Scripture, prayer, the wisdom of the early Church, and a steadier life in Christ.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              <PathButton variant="default" onClick={() => onNavigate?.({ section: "pray", tab: "prayers" })}>
                <Hand className="mr-2 h-4 w-4" /> Start with prayer
              </PathButton>
              <PathButton onClick={() => onNavigate?.({ section: "learn", tab: "qa" })}>
                <MessageCircleQuestion className="mr-2 h-4 w-4" /> Learn Orthodoxy gently
              </PathButton>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-3 md:grid-cols-2">
            <FeatureCard
              title="Shared Christian basics"
              description="The common ground every Christian can pray and practice."
              icon={<BookOpen className="h-5 w-5" />}
              items={[
                "Daily Scripture, Gospel reading plans, Psalms, and the Lord's Prayer.",
                "Morning, evening, meal, repentance, thanksgiving, grief, and mercy prayers.",
                "Simple guidance for how to pray without assuming Orthodox background.",
              ]}
            />
            <FeatureCard
              title="Orthodox depth, offered clearly"
              description="Rooted in the Church's prayer without becoming combative."
              icon={<Church className="h-5 w-5" />}
              items={[
                "Morning/evening prayers, the Jesus Prayer — \"Lord Jesus Christ, Son of God, have mercy on me, a sinner\" — prayer rope practice, icons, feasts, fasting, saints, hymns, and propers.",
                "Beginner explanations for Theotokos, icons, Divine Liturgy, sacraments/mysteries, and Holy Tradition.",
                "Official Orthodox source links when a topic needs more than a short summary.",
              ]}
            />
          </div>

          {!compact ? (
            <>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <FeatureCard
                  title="Saints and Christian witnesses"
                  description="Examples of repentance, courage, teaching, holiness, and love for Christ."
                  icon={<UsersRound className="h-5 w-5" />}
                  items={[
                    "Orthodox saints of the day, biblical figures, early Church Fathers, martyrs, monastics, and modern saints.",
                    "Where appropriate, focus biographies on the shared Christian virtues rather than polemics.",
                    "Intercession is explained as Orthodox practice while still inviting non-Orthodox users to learn respectfully.",
                  ]}
                />
                <FeatureCard
                  title="Personal spiritual tools"
                  description="Small habits that help real people continue."
                  icon={<ListChecks className="h-5 w-5" />}
                  items={[
                    "Prayer rule, Jesus Prayer (\"Lord Jesus Christ, Son of God, have mercy on me, a sinner\") counter, stillness timer, private encrypted reflection, confession prep, and reading plans.",
                    "Gratitude, repentance, mercy, and attention prompts for everyday discipleship.",
                    "Pastoral reminders: this app supports church life; it does not replace a priest, pastor, parish, or spiritual father.",
                  ]}
                />
              </div>

              <div className="mt-3 rounded-3xl border border-border/60 bg-background/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-semibold tracking-tight">Calendar lens</h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Let people see the Christian center, the Orthodox calendar, or both together.
                    </p>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={lens}
                    onValueChange={(value) => value && setLens(value as CalendarLens)}
                    className="flex flex-wrap justify-start gap-2 sm:justify-end"
                  >
                    <ToggleGroupItem value="orthodox" className="rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10">
                      Orthodox
                    </ToggleGroupItem>
                    <ToggleGroupItem value="shared" className="rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10">
                      Shared
                    </ToggleGroupItem>
                    <ToggleGroupItem value="both" className="rounded-2xl border border-border/60 px-3 text-xs font-semibold data-[state=on]:border-primary/30 data-[state=on]:bg-primary/10">
                      Both
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <h4 className="text-sm font-semibold">{selected.title}</h4>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {selected.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <Compass className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 text-sm font-semibold">Respectful tone</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Teach Orthodox Christianity as an invitation into the fullness of the early Church, not as an attack on other Christians.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <Landmark className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 text-sm font-semibold">Early Church roots</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Keep Scripture, the Fathers, Liturgy, icons, sacraments, repentance, and the Resurrection connected as one way of life.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 text-sm font-semibold">Pastoral humility</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Fasting, confession, Communion preparation, and reception into Orthodoxy require guidance from a priest or pastor.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <PathButton onClick={() => onNavigate?.({ section: "read", read: "plans" })}>
                  <BookOpen className="mr-2 h-4 w-4" /> Gospel & Psalms plans
                </PathButton>
                <PathButton onClick={() => onNavigate?.({ section: "pray", tab: "counter" })}>
                  <Sparkles className="mr-2 h-4 w-4" /> Jesus Prayer: Lord Jesus Christ, Son of God, have mercy on me, a sinner
                </PathButton>
                <PathButton onClick={() => onNavigate?.({ section: "pray", tab: "journal" })}>
                  <Heart className="mr-2 h-4 w-4" /> Reflection journal
                </PathButton>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
