import { Link } from "react-router";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { useState, type ReactNode } from "react";
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
  Search,
  Shield,
  ShieldCheck,
  Sun,
  Users,
  UsersRound,
} from "lucide-react";
import { DutyModeCard } from "@/components/app/DutyModeCard";
import { CrisisResources } from "@/components/app/CrisisResources";
import { Input } from "@/components/ui/input";
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
import { responderModeAccentClasses, responderModeLabels, useResponderMode, type ResponderMode } from "@/lib/responderMode";
import { showError, showSuccess } from "@/utils/toast";
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumPageHeader } from "@/components/app/PremiumPageHeader";

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
    title: "Everyday life",
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
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

// Text a search can match, so "angry", "night shift" or "after a call" finds the right card.
function haystack(...parts: Array<string | string[]>) {
  return parts.flat().join(" ").toLowerCase();
}

export default function FieldManual() {
  const [query, setQuery] = useState("");
  const [mode] = useResponderMode();
  const q = query.trim().toLowerCase();
  const shownEntries = q ? entries.filter((e) => haystack(e.title, e.subtitle, e.prayer, e.practice).includes(q)) : entries;
  const shownRoles = q
    ? roleSections.filter((r) => haystack(r.title, r.focus, r.prayer, r.checklist, responderModeLabels[r.mode]).includes(q))
    : roleSections;
  const nothing = q && !shownEntries.length && !shownRoles.length;

  return (
    <PageContainer width="wide">
      <PremiumPageHeader
        eyebrow="Life & service guide"
        title="Orthodox Life & Service Guide"
        description="Short prayers and checklists for ordinary life, families, military, first responders, public safety, medical teams and chaplains."
        icon={<Crosshair className="h-5 w-5" />}
        actions={
          <>
            <Button asChild variant="outline" className="premium-action"><Link to="/today" state={LOOK_AROUND_STATE}>Back to app</Link></Button>
            <Button asChild className="rounded-2xl"><Link to="/pray?tab=prayers">Open prayer book</Link></Button>
          </>
        }
      />

      <div className="premium-card-stack mt-5">
        {/* Search first: someone under pressure should reach their card in two taps, not by scrolling. */}
        <Card className="ornate-card p-4 sm:p-5">
          <label htmlFor="manual-search" className="text-base font-semibold">What do you need right now?</label>
          <div className="relative mt-2">
            <Search aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="manual-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: anger, fear, grief"
              className="h-12 rounded-2xl pl-10 text-base"
              autoComplete="off"
            />
          </div>
          {q ? (
            <p role="status" className="mt-2 text-sm text-muted-foreground">
              {nothing ? "Nothing matches. Try a simpler word, or open the prayer book." : `${shownEntries.length + shownRoles.length} found`}
            </p>
          ) : null}
        </Card>

        {shownEntries.length ? (
          <Card className="ornate-card p-5">
            <h2 className="text-xl font-bold tracking-tight">Situations</h2>
            <p className="mt-1 text-base text-muted-foreground">Open the one you are in. A prayer, then what to do.</p>
            <Accordion type="single" collapsible className="relative mt-4 w-full" defaultValue={q && shownEntries.length === 1 ? shownEntries[0].id : undefined} key={`entries-${q}`}>
              {shownEntries.map((entry, index) => (
                <AccordionItem key={entry.id} value={entry.id} className={index === 0 ? "border-none" : "mt-3 border-none"}>
                  <AccordionTrigger className="min-h-12 rounded-2xl border border-border/60 bg-background/55 px-4 text-left text-base shadow-sm hover:border-primary/25 hover:bg-background/75 hover:no-underline">
                    <span className="inline-flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10">{entry.icon}</span>
                      <span>{entry.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="grid gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">{entry.subtitle}</p>
                        <p className="scripture-text mt-2 text-lg leading-relaxed text-foreground/90">{entry.prayer}</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
                        <p className="text-sm font-bold text-primary">Practice</p>
                        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-base leading-relaxed text-foreground/85">
                          {entry.practice.map((item) => <li key={item}>{item}</li>)}
                        </ol>
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
        ) : null}

        {shownRoles.length ? (
          <Card className="ornate-card p-5">
            <h2 className="text-xl font-bold tracking-tight">Briefs by role</h2>
            <p className="mt-1 text-base text-muted-foreground">Daily, before a shift, or after a call. Yours is open.</p>
            <Accordion type="single" collapsible className="mt-4 w-full" defaultValue={q && shownRoles.length === 1 ? shownRoles[0].mode : mode} key={`roles-${q}`}>
              {shownRoles.map((section, index) => {
                const theme = responderModeAccentClasses[section.mode];
                const copy = `${section.title}\n${section.focus}\n\nPrayer:\n${section.prayer}\n\nChecklist:\n${section.checklist.map((item, i) => `${i + 1}. ${item}`).join("\n")}`;
                return (
                  <AccordionItem key={section.mode} value={section.mode} className={index === 0 ? "border-none" : "mt-3 border-none"}>
                    <AccordionTrigger className="min-h-12 rounded-2xl border border-border/60 bg-background/55 px-4 text-left text-base shadow-sm hover:no-underline">
                      <span className="inline-flex items-center gap-2">
                        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xl", theme.icon)}>{section.icon}</span>
                        <span>{responderModeLabels[section.mode]}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-3">
                      <div className={cn("rounded-3xl border p-4 shadow-sm", theme.card)}>
                        <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3>
                        <p className="mt-1 text-base leading-relaxed text-foreground/85">{section.focus}</p>
                        <blockquote className={cn("scripture-text mt-3 rounded-2xl border p-3 text-lg leading-relaxed", theme.soft)}>{section.prayer}</blockquote>
                        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base leading-relaxed text-foreground/85">
                          {section.checklist.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                        <Button type="button" size="sm" className={cn("mt-3 rounded-2xl", theme.button)} onClick={() => copyText(section.title, copy)}>
                          Copy brief
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Card>
        ) : null}

        {!q ? <DutyModeCard /> : null}

        <Card className="ornate-card p-5">
          <h2 className="text-xl font-bold tracking-tight">Prayer and care together</h2>
          <p className="mt-2 text-base leading-relaxed text-foreground/90">
            These are original short prayers and practical prompts. They support prayer; they do not replace emergency procedures, pastoral care, or clinical support. For confession, fasting, Communion or reception into Orthodoxy, speak with an Orthodox priest. If you are not Orthodox, you are welcome to use these prayers and to speak with your pastor or chaplain.
          </p>
          <CrisisResources />
        </Card>
      </div>
    </PageContainer>
  );
}
