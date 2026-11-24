import type { ReactNode } from "react";
import { Flower2, Home, Moon, MoonStar, Sun, Sunset } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { CenserIcon, ChaliceIcon, GospelBookIcon, PrayerRopeIcon, ThreeBarCrossIcon } from "@/components/app/OrthodoxMotifs";
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
import { GroundMeNowSlim } from "@/components/app/GroundMeNow";
import { RosaryGuide } from "@/components/app/RosaryGuide";
import { StationsGuide } from "@/components/app/StationsGuide";
import { LectioDivina } from "@/components/app/LectioDivina";
import { WesternCompline } from "@/components/app/WesternCompline";
import { NovenaTracker } from "@/components/app/NovenaTracker";
import { LauncherIntro, SectionBackBar, SectionLauncher, type LauncherGroup } from "@/components/app/SectionLauncher";
import { t } from "@/i18n";
import { prayerMinutes } from "@/lib/prayerLength";

export type PrayerTab = "daily" | "rule" | "family" | "prayers" | "names" | "services" | "groups" | "counter" | "prep" | "communion" | "journal" | "sleep" | "rosary" | "stations" | "lectio" | "compline-west" | "novena";

// The starting screen: ways to pray, as tiles. Your own things (rule, names, journal, groups) live on Me,
// though they keep their /pray?tab=... addresses so old links and favorites still work.
const ROSARY_TILE = { to: "/pray?tab=rosary", art: "annunciation", label: "Rosary and Angelus", hint: "Western Rite devotions", icon: Flower2 };
const COMPLINE_WEST_TILE = { to: "/pray?tab=compline-west", art: "dormition", label: "Western Compline", hint: "The Western prayer before sleep", icon: MoonStar };
const NOVENA_TILE = { to: "/pray?tab=novena", art: "pentecost", label: "Novenas", hint: "Nine days for one intention", icon: CenserIcon };
const STATIONS_TILE = { to: "/pray?tab=stations", art: "lamentation", label: "Way of the Cross", hint: "Fourteen stations, for Fridays and Lent", icon: ThreeBarCrossIcon };

const launcher: LauncherGroup[] = [
  {
    title: "Pray now",
    tiles: [
      { to: "/pray?tab=daily&begin=morning", art: "pantocrator", label: "Morning prayers", hint: "Offer the day to God", icon: Sun },
      { to: "/pray?tab=daily&begin=evening", art: "theotokos", label: "Evening prayers", hint: "Give thanks, ask forgiveness", icon: Sunset },
      { to: "/pray?tab=daily&begin=night", art: "lamentation", label: "Night prayers", hint: "Into Thy hands, O Lord", icon: MoonStar },
      { to: "/pray?tab=counter", art: "ladder", label: "Jesus Prayer", hint: "Prayer rope and stillness", icon: PrayerRopeIcon },
      { to: "/pray?tab=lectio", art: "transfiguration", label: "Lectio Divina", hint: "Pray slowly with today's Gospel", icon: GospelBookIcon },
    ],
  },
  {
    title: "With the Church",
    tiles: [
      { to: "/pray?tab=services", art: "pentecost", label: "Services", hint: "Compline, the Hours, Akathist, Panikhida", icon: CenserIcon },
      { to: "/pray?tab=prayers", art: "annunciation", label: "Prayer texts", hint: "Saints, meals, needs of the day", icon: GospelBookIcon },
      { to: "/pray?tab=prep", art: "theophany", label: "Confession", hint: "Examine the heart", icon: ThreeBarCrossIcon },
      { to: "/pray?tab=communion", art: "anastasis", label: "Holy Communion", hint: "Before and after", icon: ChaliceIcon },
    ],
  },
  {
    title: "At home",
    tiles: [
      { to: "/pray?tab=family", art: "nativity", label: "Family", hint: "Evening prayer and saint stories", icon: Home },
      { to: "/pray?tab=sleep", art: "dormition", label: "Sleep", hint: "Quiet prayers for the night", icon: Moon },
    ],
  },
];

// Length badges on the daily prayers follow the length the person chose; Lectio Divina is about ten minutes.
function withDurations(groups: LauncherGroup[]): LauncherGroup[] {
  const minutes: Record<string, string> = {
    "/pray?tab=daily&begin=morning": `${prayerMinutes("morning")} min`,
    "/pray?tab=daily&begin=evening": `${prayerMinutes("evening")} min`,
    "/pray?tab=daily&begin=night": `${prayerMinutes("night")} min`,
    "/pray?tab=lectio": "10 min",
  };
  return groups.map((group) => ({ ...group, tiles: group.tiles.map((tile) => (minutes[tile.to] ? { ...tile, duration: minutes[tile.to] } : tile)) }));
}

/** The daily prayers that fit the hour: morning until noon, evening until eight, then night prayers. */
function prayerForHour(now: Date) {
  const [morning, evening, night] = launcher[0].tiles;
  const hour = now.getHours();
  if (hour >= 4 && hour < 12) return morning;
  if (hour >= 12 && hour < 20) return evening;
  return night;
}

// These open from Me, so their back link returns there.
const PERSONAL_TABS: PrayerTab[] = ["rule", "names", "groups", "journal"];

const titles: Record<PrayerTab, string> = {
  daily: "Daily prayer",
  rule: "My prayer plan",
  family: "Family",
  prayers: "Prayer texts",
  names: "Prayer list",
  services: "Services",
  groups: "Prayer groups",
  counter: "Jesus Prayer",
  sleep: "Sleep",
  prep: "Confession",
  communion: "Holy Communion",
  journal: "Journal",
  rosary: "Rosary and Angelus",
  stations: "Way of the Cross",
  lectio: "Lectio Divina",
  "compline-west": "Western Compline",
  novena: "Novenas",
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
    <div className="grid gap-4 sm:gap-5"><JesusPrayerCounter /><GroundMeNowSlim /><StillnessTimer /></div>
  ),
  sleep: <SleepMode />,
  prep: (
    <div className="grid gap-4 sm:gap-5"><PreparationChecklist /><ConfessionPrep /></div>
  ),
  communion: <CommunionPrep />,
  journal: <DailyReflection />,
  rosary: <RosaryGuide />,
  stations: <StationsGuide />,
  lectio: <LectioDivina />,
  "compline-west": <WesternCompline />,
  novena: <NovenaTracker />,
};

export function PrayerHub({ tab }: { tab: PrayerTab | null }) {
  const { settings } = useSettings();
  if (!tab) {
    // The Rosary and the Way of the Cross are for Western Rite parishes, so it shows only when that is turned on in Settings.
    const groups = settings.westernRite
      ? launcher.map((group) => (group.title === "With the Church" ? { ...group, tiles: [...group.tiles, ROSARY_TILE, STATIONS_TILE, COMPLINE_WEST_TILE, NOVENA_TILE] } : group))
      : launcher;
    const lead = prayerForHour(new Date());
    return (
      <div className="grid min-w-0 gap-5">
        <LauncherIntro title={t("pray.title")} />
        <SectionLauncher
          groups={withDurations(groups.map((group) => ({ ...group, tiles: group.tiles.filter((tile) => tile.to !== lead.to) })))}
          lead={{ eyebrow: t("pray.lead"), tile: withDurations([{ title: "", tiles: [lead] }])[0].tiles[0] }}
        />
      </div>
    );
  }

  const personal = PERSONAL_TABS.includes(tab);
  return (
    <div className="grid min-w-0 gap-4 sm:gap-5">
      <SectionBackBar backTo={personal ? "/me" : "/pray"} backLabel={personal ? "Me" : "Pray"} title={titles[tab]} favoriteTo={`/pray?tab=${tab}`} />
      {content[tab]}
    </div>
  );
}
