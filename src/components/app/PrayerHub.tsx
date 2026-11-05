import type { ReactNode } from "react";
import { BookOpen, Compass, HeartHandshake, Home, Moon, MoonStar, NotebookPen, ScrollText, Sparkles, Sun, Sunset, Users } from "lucide-react";
import { CenserIcon, VigilLampIcon } from "@/components/app/OrthodoxMotifs";
import { DailyPrayerFlow } from "@/components/app/DailyPrayerFlow";
import { PrayerRule } from "@/components/app/PrayerRule";
import { PrayerBook } from "@/components/app/PrayerBook";
import { CommemorationList } from "@/components/app/CommemorationList";
import { JesusPrayerCounter } from "@/components/app/JesusPrayerCounter";
import { DailyReflection } from "@/components/app/DailyReflection";
import { PreparationChecklist } from "@/components/app/PreparationChecklist";
import { StillnessTimer } from "@/components/app/StillnessTimer";
import { ConfessionPrep } from "@/components/app/ConfessionPrep";
import { SleepMode } from "@/components/app/SleepMode";
import { CommunionPrep } from "@/components/app/CommunionPrep";
import { ServicesLibrary } from "@/components/app/ServicesLibrary";
import { PrayerGroups } from "@/components/app/PrayerGroups";
import { FamilyPrayer } from "@/components/app/FamilyPrayer";
import { GroundMeNow } from "@/components/app/GroundMeNow";
import { LauncherIntro, SectionBackBar, SectionLauncher, type LauncherGroup } from "@/components/app/SectionLauncher";

export type PrayerTab = "daily" | "rule" | "family" | "prayers" | "names" | "services" | "groups" | "counter" | "prep" | "communion" | "journal" | "sleep";

// The starting screen: every practice as a tile, one tap from praying. Each practice keeps its own URL (?tab=...).
const launcher: LauncherGroup[] = [
  {
    title: "Pray now",
    tiles: [
      { to: "/pray?tab=daily&begin=morning", label: "Morning prayers", hint: "Offer the day to God", icon: Sun },
      { to: "/pray?tab=daily&begin=evening", label: "Evening prayers", hint: "Give thanks, ask forgiveness", icon: Sunset },
      { to: "/pray?tab=daily&begin=night", label: "Night prayers", hint: "Into Thy hands, O Lord", icon: MoonStar },
      { to: "/pray?tab=counter", label: "Jesus Prayer", hint: "Prayer rope and stillness", icon: VigilLampIcon },
    ],
  },
  {
    title: "With the Church",
    tiles: [
      { to: "/pray?tab=services", label: "Services", hint: "Compline, the Hours, Akathist, Panikhida", icon: CenserIcon },
      { to: "/pray?tab=prayers", label: "Prayer texts", hint: "Saints, meals, needs of the day", icon: BookOpen },
      { to: "/pray?tab=names", label: "Names", hint: "The living and the departed", icon: ScrollText },
      { to: "/pray?tab=groups", label: "Prayer groups", hint: "Pray for each other", icon: Users },
    ],
  },
  {
    title: "Home and rule",
    tiles: [
      { to: "/pray?tab=rule", label: "My rule", hint: "Length, steps and versions", icon: Compass },
      { to: "/pray?tab=family", label: "Family", hint: "Evening prayer and saint stories", icon: Home },
      { to: "/pray?tab=sleep", label: "Sleep", hint: "Quiet prayers for the night", icon: Moon },
    ],
  },
  {
    title: "Prepare",
    tiles: [
      { to: "/pray?tab=prep", label: "Confession", hint: "Examine the heart", icon: HeartHandshake },
      { to: "/pray?tab=communion", label: "Holy Communion", hint: "Before and after", icon: Sparkles },
      { to: "/pray?tab=journal", label: "Journal", hint: "Reflect on the day", icon: NotebookPen },
    ],
  },
];

const titles: Record<PrayerTab, string> = {
  daily: "Daily prayer",
  rule: "My rule",
  family: "Family",
  prayers: "Prayer texts",
  names: "Names",
  services: "Services",
  groups: "Prayer groups",
  counter: "Jesus Prayer",
  sleep: "Sleep",
  prep: "Confession",
  communion: "Holy Communion",
  journal: "Journal",
};

const content: Record<PrayerTab, ReactNode> = {
  daily: <DailyPrayerFlow />,
  rule: <PrayerRule />,
  family: <FamilyPrayer />,
  prayers: <PrayerBook showRule={false} />,
  names: <CommemorationList />,
  services: <ServicesLibrary />,
  groups: <PrayerGroups />,
  counter: (
    <div className="grid gap-4 sm:gap-5"><GroundMeNow /><JesusPrayerCounter /><StillnessTimer /></div>
  ),
  sleep: <SleepMode />,
  prep: (
    <div className="grid gap-4 sm:gap-5"><PreparationChecklist /><ConfessionPrep /></div>
  ),
  communion: <CommunionPrep />,
  journal: <DailyReflection />,
};

export function PrayerHub({ tab }: { tab: PrayerTab | null }) {
  if (!tab) {
    return (
      <div className="grid min-w-0 gap-5">
        <LauncherIntro eyebrow="Pray" title="Make room for stillness." />
        <SectionLauncher groups={launcher} />
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-4 sm:gap-5">
      <SectionBackBar backTo="/pray" backLabel="Pray" title={titles[tab]} favoriteTo={`/pray?tab=${tab}`} />
      {content[tab]}
    </div>
  );
}
