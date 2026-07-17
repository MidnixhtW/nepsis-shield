import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  Ambulance,
  BadgeCheck,
  BookOpen,
  Crosshair,
  Flag,
  Flame,
  HeartHandshake,
  HeartPulse,
  Map,
  MoonStar,
  Radio,
  Shield,
  ShieldCheck,
  Sun,
  Users,
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
import { cn } from "@/lib/utils";
import { responderModeAccentClasses, responderModeLabels, type ResponderMode } from "@/lib/responderMode";
import { showError, showSuccess } from "@/utils/toast";

type ManualEntry = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  prayer: string;
  practice: string[];
};

type RoleSection = {
  mode: ResponderMode;
  icon: ReactNode;
  title: string;
  focus: string;
  prayer: string;
  checklist: string[];
};

const roleSections: RoleSection[] = [
  {
    mode: "civilian",
    icon: <UsersRound className="h-4 w-4" />,
    title: "Civilian",
    focus: "Ordinary life, family, work, school, stress, grief, decisions, and one faithful next step at a time.",
    prayer: "Lord Jesus Christ, steady my heart in ordinary life. Teach me to pray simply, speak truthfully, love patiently, and do the next right thing with peace. Amen.",
    checklist: ["Pause before reacting: breathe once and pray simply.", "Choose one faithful next step at home, work, school, or with family.", "Ask for pastoral, professional, or trusted help when burdens are too heavy."],
  },
  {
    mode: "military",
    icon: <Flag className="h-4 w-4" />,
    title: "Military",

    focus: "Mission, lawful obedience, restraint, unit care, and returning home without hardening the heart.",
    prayer: "Lord Jesus Christ, guard me in danger, steady me under orders, and keep my strength obedient to mercy, truth, and lawful duty. Protect my unit and those we are sent to defend. Amen.",
    checklist: ["Check orders, gear, buddy, and conscience.", "Obey lawful command without surrendering mercy.", "Pray for your unit by name when possible."],
  },
  {
    mode: "law",
    icon: <ShieldCheck className="h-4 w-4" />,
    title: "Law enforcement",
    focus: "Command presence without contempt; clear words, truthful reports, restrained force, and dignity where possible.",
    prayer: "Lord Jesus Christ, guard my mind, my words, and my hands. Make me watchful without fear, firm without anger, and merciful without weakness. Amen.",
    checklist: ["Lower your voice before contact.", "Scan hands, exits, partners, and bystanders.", "Choose the least forceful lawful option that protects life."],
  },
  {
    mode: "fire",
    icon: <Flame className="h-4 w-4" />,
    title: "Fire & rescue",
    focus: "Courage with crew discipline; speed without panic; humility after the save.",
    prayer: "Lord of mercy, give me courage without recklessness, speed without panic, and love for every soul we are sent to protect. Amen.",
    checklist: ["Breathe before entry or action.", "Check assignment, air, exit, and crew.", "Afterward, offer the injured and rescued to God."],
  },
  {
    mode: "ems",
    icon: <Ambulance className="h-4 w-4" />,
    title: "EMS / medical",
    focus: "Clinical calm, truthful documentation, and seeing the patient as an icon of God under pressure.",
    prayer: "Christ the Physician, steady my hands and clear my mind. Help me treat this person, not only the problem, with skill, patience, and mercy. Amen.",
    checklist: ["Scene safe, gloves, first impression.", "Let the protocol carry what emotion cannot.", "Say one human sentence to patient or family when possible."],
  },
  {
    mode: "dispatch",
    icon: <Radio className="h-4 w-4" />,
    title: "Dispatch / comms",
    focus: "A calm voice between panic and help; location, danger, need, and a heart protected from despair.",
    prayer: "Lord Jesus Christ, make my voice calm, my listening sharp, and my heart protected from despair. Guide the responders I cannot see. Amen.",
    checklist: ["Lower your shoulders before answering.", "Clarify location, danger, and need.", "Let silence return between calls when possible."],
  },
  {
    mode: "custody",
    icon: <Users className="h-4 w-4" />,
    title: "Corrections / custody",
    focus: "Order without cruelty; restraint, vigilance, and remembrance that every confined person remains a person.",
    prayer: "Lord, set a guard over my mouth and my temper. Help me keep order with justice, restraint, and remembrance of every person’s dignity. Amen.",
    checklist: ["Enter the unit with a settled face.", "Use fewer words when provoked.", "Leave the unit at the gate after shift."],
  },
  {
    mode: "chaplain",
    icon: <HeartHandshake className="h-4 w-4" />,
    title: "Chaplain / peer support",
    focus: "Presence before answers; listening, permission, prayer when welcome, and healthy boundaries after trauma.",
    prayer: "Holy Spirit, teach me when to speak, when to be silent, and when to simply remain. Make me a servant of peace and not the center of the moment. Amen.",
    checklist: ["Arrive small and listen first.", "Ask permission before prayer or counsel.", "Consult support instead of carrying every sorrow alone."],
  },
];

const entries: ManualEntry[] = [
  {
    id: "morning-watch",
    title: "Morning watch",
    subtitle: "Begin the day before duty begins.",
    icon: <Sun className="h-4 w-4 text-primary" />,
    prayer: "Lord Jesus Christ, Son of God, guard my mind, steady my hands, and make my heart attentive today. Let my words be truthful, my courage humble, and my strength used for mercy. Amen.",
    practice: ["Make the sign of the Cross slowly.", "Pray the Jesus Prayer three times.", "Name one concrete act of mercy for the day."],
  },
  {
    id: "under-stress",
    title: "Under stress",
    subtitle: "When pressure, fear, or anger spikes.",
    icon: <AlertTriangle className="h-4 w-4 text-primary" />,
    prayer: "Lord Jesus Christ, Son of God, have mercy on me, a sinner. Quiet what is disordered in me. Give me one clear breath, one honest word, and one faithful next step. Amen.",
    practice: ["Breathe slowly before speaking.", "Do the next right thing; do not solve the whole future at once.", "If you are in immediate danger, seek safety and help first."],
  },
  {
    id: "for-courage",
    title: "For courage",
    subtitle: "Not bravado, but faithfulness under fear.",
    icon: <Crosshair className="h-4 w-4 text-primary" />,
    prayer: "Lord, teach me courage without cruelty, confidence without pride, and endurance without hardness of heart. Let me fear sin more than hardship, and let me love You above comfort. Amen.",
    practice: ["Remember: Christian courage is cruciform, not reckless.", "Ask for humility before asking for victory.", "Protect the vulnerable whenever it is within your power."],
  },
  {
    id: "wounded-sick",
    title: "For the wounded and sick",
    subtitle: "For injury, illness, trauma, and those who care for them.",
    icon: <HeartPulse className="h-4 w-4 text-primary" />,
    prayer: "O Physician of souls and bodies, visit Your servants who suffer. Strengthen the wounded, guide those who treat them, comfort those who wait, and grant healing according to Your mercy. Amen.",
    practice: ["Pray by name when possible.", "Offer practical help: presence, transport, food, calls, quiet support.", "Encourage professional and pastoral care; do not carry trauma alone."],
  },
  {
    id: "departed",
    title: "For the departed",
    subtitle: "When remembering the dead and grieving with hope.",
    icon: <MoonStar className="h-4 w-4 text-primary" />,
    prayer: "O Lord, remember Your servants who have departed this life. Grant them rest where there is no pain, sorrow, or sighing, but life everlasting, and comfort all who mourn in the hope of the Resurrection. Amen.",
    practice: ["Say their names before God.", "Grieve without despair; Christ is risen.", "Ask a priest or pastor about memorial prayers and services."],
  },
  {
    id: "after-danger",
    title: "Thanksgiving after danger",
    subtitle: "Return thanks before moving on too quickly.",
    icon: <BadgeCheck className="h-4 w-4 text-primary" />,
    prayer: "Glory to You, O God, for preserving us through danger seen and unseen. Receive our thanks, heal what has been wounded, forgive our sins, and teach us to live the time given to us with repentance and love. Amen.",
    practice: ["Give thanks even if the day was imperfect or frightening.", "Check on others after the adrenaline fades.", "Write one sentence of gratitude before sleep."],
  },
];

async function copyText(label: string, text: string) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess(`${label} copied.`);
  } catch {
    showError("Couldn't copy text.");
  }
}

function QuickCard({ title, description, icon }: { title: string; description: string; icon: ReactNode }) {
  return (
    <div className="card-interactive rounded-2xl border border-border/60 bg-background/55 p-4 shadow-sm backdrop-blur">
      <div className="flex items-start gap-3">
        <span className="icon-medallion h-10 w-10">{icon}</span>
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
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Life & service guide</p>
            <h1 className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Orthodox Life & Service Guide
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Prayers, checklists, and daily practices for ordinary life, families, military, first responders, public safety, medical teams, and chaplains.
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
            <OrthodoxCrossIcon className="absolute -right-8 bottom-2 h-44 w-44 text-primary/10" />
            <div className="relative p-5 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full border border-primary/20 bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary shadow-sm">
                  <Shield className="mr-1 h-3.5 w-3.5" /> Service Orthodox rhythm
                </Badge>
                <Badge className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
                  Copyable daily reference
                </Badge>

              </div>
              <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
                Keep the watch. Guard the heart. Serve in Christ.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                These are original short prayers and practical prompts for ordinary days and high-pressure moments. They support prayer and reflection; they do not replace emergency procedures, pastoral care, professional care, or clinical support.

              </p>
              <div className="my-6 h-px gold-hairline" />
              <div className="grid gap-3 md:grid-cols-3">
                <QuickCard title="Role-specific" description="Open the section for your occupation and copy a compact brief." icon={<BookOpen className="h-5 w-5" />} />
                <QuickCard title="Short enough for daily use" description="Prayer, focus, and checklist without long reading." icon={<UsersRound className="h-5 w-5" />} />

                <QuickCard title="Care-aware" description="Prayer belongs with priest, chaplain, clinician, and trusted support when needed." icon={<Map className="h-5 w-5" />} />
              </div>
            </div>
          </div>
        </Card>

        <DutyModeCard />

        <Card className="ornate-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Mode sections</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Life and service briefs</h2>
              <p className="mt-1 text-sm text-muted-foreground">Use these as quick daily, pre-shift, or post-call references.</p>

            </div>
            <div className="icon-medallion h-11 w-11"><Crosshair className="h-5 w-5" /></div>
          </div>
          <div className="my-4 h-px gold-hairline" />
          <div className="grid gap-3 lg:grid-cols-2">
            {roleSections.map((section) => {
              const theme = responderModeAccentClasses[section.mode];
              const copy = `${section.title}\n${section.focus}\n\nPrayer:\n${section.prayer}\n\nChecklist:\n${section.checklist.map((item, index) => `${index + 1}. ${item}`).join("\n")}`;
              return (
                <div key={section.mode} className={cn("rounded-3xl border p-4 shadow-sm", theme.card)}>
                  <div className="flex items-start gap-3">
                    <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl", theme.icon)}>{section.icon}</span>
                    <div className="min-w-0 break-words">
                      <Badge className={cn("max-w-full whitespace-normal rounded-full border px-3 py-1 text-left text-xs font-bold leading-tight", theme.badge)}>{responderModeLabels[section.mode]}</Badge>
                      <h3 className="mt-2 text-lg font-semibold tracking-tight">{section.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.focus}</p>
                    </div>
                  </div>
                  <blockquote className={cn("mt-3 rounded-2xl border p-3 text-sm leading-relaxed", theme.soft)}>{section.prayer}</blockquote>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                    {section.checklist.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <Button type="button" size="sm" className={cn("mt-3 rounded-2xl", theme.button)} onClick={() => copyText(section.title, copy)}>
                    Copy brief
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="ornate-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ready reference</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Prayers for daily life and pressure</h2>

              <p className="mt-1 text-sm text-muted-foreground">Open the situation you need. Keep it simple and attentive.</p>
            </div>
            <div className="icon-medallion h-11 w-11"><OrthodoxCrossIcon className="h-6 w-6" /></div>
          </div>
          <div className="my-4 h-px gold-hairline" />
          <Accordion type="single" collapsible className="relative w-full">
            {entries.map((entry, index) => (
              <AccordionItem key={entry.id} value={entry.id} className={index === 0 ? "border-none" : "mt-3 border-none"}>
                <AccordionTrigger className="rounded-2xl border border-border/60 bg-background/55 px-4 text-left shadow-sm backdrop-blur transition-colors hover:border-primary/25 hover:bg-background/75 hover:no-underline">
                  <span className="inline-flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10">{entry.icon}</span>
                    <span>{entry.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm backdrop-blur">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{entry.subtitle}</p>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{entry.prayer}</p>
                    </div>
                    <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Practice</p>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                        {entry.practice.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                    <Button type="button" variant="outline" className="w-fit rounded-2xl border-border/60" onClick={() => copyText(entry.title, `${entry.title}\n\n${entry.prayer}\n\nPractice:\n${entry.practice.map((item, i) => `${i + 1}. ${item}`).join("\n")}`)}>
                      Copy prayer
                    </Button>
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
              <p className="mt-1 text-sm text-muted-foreground">This page supports prayer; it does not replace care.</p>
            </div>
            <div className="icon-medallion h-11 w-11"><ShieldCheck className="h-5 w-5" /></div>
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
