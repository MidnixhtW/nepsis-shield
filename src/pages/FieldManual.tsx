import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Crosshair,
  HeartPulse,
  Map,
  MoonStar,
  Plane,
  Shield,
  ShieldCheck,
  Sun,
  UsersRound,
} from "lucide-react";
import { DutyModeCard } from "@/components/app/DutyModeCard";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ManualEntry = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  prayer: string;
  practice: string[];
};

const entries: ManualEntry[] = [
  {
    id: "morning-watch",
    title: "Morning watch",
    subtitle: "Begin the day before duty begins.",
    icon: <Sun className="h-4 w-4 text-primary" />,
    prayer:
      "Lord Jesus Christ, Son of God, guard my mind, steady my hands, and make my heart attentive today. Let my words be truthful, my courage humble, and my strength used for mercy. Amen.",
    practice: [
      "Make the sign of the Cross slowly.",
      "Pray the Lord's Prayer or \"Lord Jesus Christ, Son of God, have mercy on me, a sinner\" three times.",
      "Name one concrete act of mercy for the day.",
    ],
  },
  {
    id: "before-duty",
    title: "Before duty",
    subtitle: "For military, first-response, public safety, medical, chaplain, or command responsibility.",
    icon: <ShieldCheck className="h-4 w-4 text-primary" />,
    prayer:
      "O Lord, bless the work set before me. Keep me from pride, carelessness, anger, and fear. Help me serve with discipline, patience, and love for every person made in Your image. Amen.",

    practice: [
      "Pause before beginning; do not rush into the day scattered.",
      "Ask God to protect those under your care.",
      "Choose restraint over reaction when pressure rises.",
    ],
  },
  {
    id: "before-travel",
    title: "Before travel",
    subtitle: "For movement, deployment, commuting, or patrol.",
    icon: <Plane className="h-4 w-4 text-primary" />,
    prayer:
      "O Christ our God, guide our going out and our coming in. Preserve travelers, drivers, pilots, crews, and all who share the road, sea, or air. Bring us where we must go in peace. Amen.",
    practice: [
      "Pray before departure rather than only after danger appears.",
      "Remember family, teammates, and strangers traveling today.",
      "Keep attention: fatigue and anger are spiritual and practical hazards.",
    ],
  },
  {
    id: "under-stress",
    title: "Under stress",
    subtitle: "When pressure, fear, or anger spikes.",
    icon: <AlertTriangle className="h-4 w-4 text-primary" />,
    prayer:
      "Lord Jesus Christ, Son of God, have mercy on me, a sinner. Quiet what is disordered in me. Give me one clear breath, one honest word, and one faithful next step. Amen.",
    practice: [
      "Breathe slowly and pray \"Lord Jesus Christ, Son of God, have mercy on me, a sinner\" once with attention.",
      "Do the next right thing; do not solve the whole future at once.",
      "If you are in immediate danger, seek safety and help first.",
    ],
  },
  {
    id: "for-courage",
    title: "For courage",
    subtitle: "Not bravado, but faithfulness under fear.",
    icon: <Crosshair className="h-4 w-4 text-primary" />,
    prayer:
      "Lord, teach me courage without cruelty, confidence without pride, and endurance without hardness of heart. Let me fear sin more than hardship, and let me love You above comfort. Amen.",
    practice: [
      "Remember: Christian courage is cruciform, not reckless.",
      "Ask for humility before asking for victory.",
      "Protect the vulnerable whenever it is within your power.",
    ],
  },
  {
    id: "wounded-sick",
    title: "For the wounded and sick",
    subtitle: "For injury, illness, trauma, and those who care for them.",
    icon: <HeartPulse className="h-4 w-4 text-primary" />,
    prayer:
      "O Physician of souls and bodies, visit Your servants who suffer. Strengthen the wounded, guide those who treat them, comfort those who wait, and grant healing according to Your mercy. Amen.",
    practice: [
      "Pray by name when possible.",
      "Offer practical help: presence, transport, food, calls, quiet support.",
      "Encourage professional care and pastoral care; do not carry trauma alone.",
    ],
  },
  {
    id: "departed",
    title: "For the departed",
    subtitle: "When remembering the dead and grieving with hope.",
    icon: <MoonStar className="h-4 w-4 text-primary" />,
    prayer:
      "O Lord, remember Your servants who have departed this life. Grant them rest where there is no pain, sorrow, or sighing, but life everlasting, and comfort all who mourn in the hope of the Resurrection. Amen.",
    practice: [
      "Say their names before God.",
      "Grieve without despair; Christ is risen.",
      "Ask a priest or pastor about memorial prayers and services.",
    ],
  },
  {
    id: "after-danger",
    title: "Thanksgiving after danger",
    subtitle: "Return thanks before moving on too quickly.",
    icon: <BadgeCheck className="h-4 w-4 text-primary" />,
    prayer:
      "Glory to You, O God, for preserving us through danger seen and unseen. Receive our thanks, heal what has been wounded, forgive our sins, and teach us to live the time given to us with repentance and love. Amen.",
    practice: [
      "Give thanks even if the day was imperfect or frightening.",
      "Check on others after the adrenaline fades.",
      "Write one sentence of gratitude before sleep.",
    ],
  },
];

function QuickCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card-interactive rounded-2xl border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="icon-medallion h-10 w-10">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function FieldManual() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="icon-medallion h-14 w-14 p-2">
            <OrthodoxCrossIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Field manual
            </p>
            <h1 className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Orthodox Field Manual
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Short prayers and battle-rhythm practices for military, first responders, public safety, medical teams, chaplains, and others who serve under pressure.
            </p>
          </div>

        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60 bg-background/60 shadow-sm backdrop-blur">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button asChild className="rounded-2xl shadow-lg shadow-primary/15">
            <Link to="/pray?tab=prayers">Open prayer book</Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="ornate-card">
          <div className="relative overflow-hidden sacred-surface field-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/30 to-accent/15" />
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-primary/20" />
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-accent/20" />
            <OrthodoxCrossIcon className="absolute -right-8 bottom-2 h-44 w-44 text-primary/10" />
            <div className="relative p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border border-primary/20 bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm">
                  <Shield className="mr-1 h-3.5 w-3.5" /> Service Orthodox rhythm
                </Badge>
                <Badge className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
                  For prayer under pressure
                </Badge>
              </div>

              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                Keep the watch. Guard the heart. Serve in Christ.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                This field manual is a devotional aid for Christians in the service-and-protection circle: military, first responders, public safety, dispatchers, medical teams, chaplains, security, and those carrying responsibility for others. These are original short prayers rooted in Orthodox language and checked for theological clarity, not official liturgical texts.
              </p>

              <div className="my-6 h-px gold-hairline" />

              <div className="grid gap-3 md:grid-cols-3">
                <QuickCard
                  title="Pray short"
                  description="Use one focused prayer when time, attention, or conditions are limited."
                  icon={<BookOpen className="h-5 w-5" />}
                />
                <QuickCard
                  title="Act with mercy"
                  description="Discipline and courage are Christian only when joined to humility and love."
                  icon={<UsersRound className="h-5 w-5" />}
                />
                <QuickCard
                  title="Seek guidance"
                  description="For confession, Communion, trauma, or moral injury, speak with a priest, chaplain, or pastor."
                  icon={<Map className="h-5 w-5" />}
                />
              </div>
            </div>
          </div>
        </Card>

        <DutyModeCard />

        <Card className="ornate-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ready reference</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Field prayers</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Open the situation you need. Keep it simple and attentive.
              </p>
            </div>
            <div className="icon-medallion h-11 w-11">
              <OrthodoxCrossIcon className="h-6 w-6" />
            </div>
          </div>

          <div className="my-4 h-px gold-hairline" />

          <Accordion type="single" collapsible className="relative w-full">
            {entries.map((entry, index) => (
              <AccordionItem
                key={entry.id}
                value={entry.id}
                className={index === 0 ? "border-none" : "mt-3 border-none"}
              >
                <AccordionTrigger className="rounded-2xl border border-border/60 bg-background/55 px-4 text-left shadow-sm backdrop-blur transition-colors hover:border-primary/25 hover:bg-background/75 hover:no-underline">
                  <span className="inline-flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10">
                      {entry.icon}
                    </span>
                    <span>{entry.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {entry.subtitle}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                        {entry.prayer}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                        Practice
                      </p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                        {entry.practice.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card className="ornate-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Care matters</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Pastoral and safety note</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This page supports prayer; it does not replace care.
              </p>
            </div>
            <div className="icon-medallion h-11 w-11">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="my-4 h-px gold-hairline" />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur">
              <p className="text-sm leading-relaxed text-foreground/90">
                For sacramental questions, confession preparation, fasting, Communion, or reception into Orthodoxy, speak with an Orthodox priest. If you are not Orthodox, you are welcome to use these prayers devotionally and to speak with your pastor or chaplain.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/50 bg-amber-500/10 p-4 text-amber-900 shadow-sm backdrop-blur dark:text-amber-100">
              <p className="text-sm leading-relaxed">
                If you may harm yourself or someone else, seek immediate help from emergency services, a trusted leader, chaplain, clinician, or crisis line. Prayer and professional care belong together.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
