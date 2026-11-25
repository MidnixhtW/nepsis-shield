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
import { RosaryGuide } from "@/components/app/RosaryGuide";
import { StationsGuide } from "@/components/app/StationsGuide";
import { LectioDivina } from "@/components/app/LectioDivina";
import { WesternCompline, WesternEveningPrayer, WesternMorningPrayer } from "@/components/app/WesternCompline";
import { GREAT_FEASTS } from "@/content/greatFeasts";
import { feastDate } from "@/lib/churchGuide";
import { isoDate, type ChurchCalendar } from "@/lib/fastingSeasons";
import type { LauncherTile } from "@/components/app/SectionLauncher";
import { NovenaTracker } from "@/components/app/NovenaTracker";
import { LauncherIntro, SectionBackBar, SectionLauncher, type LauncherGroup } from "@/components/app/SectionLauncher";
import { t } from "@/i18n";
import { prayerMinutes } from "@/lib/prayerLength";
import { artAvoidingToday } from "@/lib/hourArt";

export type PrayerTab = "daily" | "rule" | "family" | "prayers" | "names" | "services" | "groups" | "counter" | "prep" | "communion" | "journal" | "sleep" | "rosary" | "stations" | "lectio" | "compline-west" | "lauds-west" | "vespers-west" | "novena";

// The starting screen: ways to pray, as tiles. Your own things (rule, names, journal, groups) live on Me,
// though they keep their /pray?tab=... addresses so old links and favorites still work.
const ROSARY_TILE = { to: "/pray?tab=rosary", art: "annunciation", label: "Rosary and Angelus", hint: "Western Rite devotions", icon: Flower2 };
const COMPLINE_WEST_TILE = { to: "/pray?tab=compline-west", art: "dormition", label: "Western Compline", hint: "The Western prayer before sleep", icon: MoonStar };
const WESTERN_OFFICE: LauncherGroup = {
  title: "Pray now",
  tiles: [
    { to: "/pray?tab=lauds-west", art: "pantocrator", label: "Morning prayer", hint: "The Western morning office", icon: Sun },
    { to: "/pray?tab=vespers-west", art: "theotokos", label: "Evening prayer", hint: "With the Song of Mary", icon: Sunset },
    { to: "/pray?tab=compline-west", art: "lamentation", label: "Compline", hint: "The Western prayer before sleep", icon: MoonStar },
  ],
};
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
function withoutTodaysIcon(tile: LauncherTile, now: Date, calendar: ChurchCalendar): LauncherTile {
  return tile.art ? { ...tile, art: artAvoidingToday(tile.art, now, calendar) } : tile;
}

function prayerForHour(now: Date, tiles: LauncherTile[] = launcher[0].tiles) {
  const [morning, evening, night] = tiles;
  const hour = now.getHours();
  if (hour >= 4 && hour < 12) return morning;
  if (hour >= 12 && hour < 20) return evening;
  return night;
}

// On one of the Twelve Great Feasts (or Pascha), the feast leads Pray instead of the prayers for the hour.
const FEAST_ART: Record<string, string> = {
  pascha: "anastasis",
  pentecost: "pentecost",
  "nativity-of-the-theotokos": "theotokos",
  "entry-of-the-theotokos": "theotokos",
  "nativity-of-christ": "nativity",
  theophany: "theophany",
  annunciation: "annunciation",
  transfiguration: "transfiguration",
  dormition: "dormition",
};

function feastTile(now: Date, calendar: ChurchCalendar): LauncherTile | null {
  const day = isoDate(now);
  const feast = GREAT_FEASTS.find((item) => isoDate(feastDate(item, now.getFullYear(), calendar)) === day);
  if (!feast) return null;
  return { to: `/feasts/${feast.slug}`, art: FEAST_ART[feast.slug], label: feast.name, hint: "Today's feast", icon: CenserIcon, cta: "Open" };
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
  "compline-west": "Compline",
  "lauds-west": "Morning prayer",
  "vespers-west": "Evening prayer",
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
    <div className="grid gap-4 sm:gap-5"><JesusPrayerCounter /><StillnessTimer /></div>
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
  "lauds-west": <WesternMorningPrayer />,
  "vespers-west": <WesternEveningPrayer />,
  novena: <NovenaTracker />,
};

export function PrayerHub({ tab }: { tab: PrayerTab | null }) {
  const { settings } = useSettings();
  if (!tab) {
    // A Western Rite user prays the Western office first: it fills Pray now and leads for the hour, with the Rosary,
    // Stations and Novenas beside the services. The Byzantine daily prayers stay one tap away, as a plain list.
    const western = settings.westernRite && settings.jurisdiction !== "melkite" && settings.jurisdiction !== "ruthenian";
    const withWestern = (group: LauncherGroup) =>
      group.title === "With the Church" ? { ...group, tiles: [...group.tiles, ROSARY_TILE, STATIONS_TILE, NOVENA_TILE] } : group;
    const groups: LauncherGroup[] = western
      ? [
          { ...launcher[0], tiles: [...WESTERN_OFFICE.tiles, ...launcher[0].tiles.slice(3)] },
          { title: "Byzantine daily prayers", tiles: launcher[0].tiles.slice(0, 3).map((tile) => ({ ...tile, art: undefined })) },
          ...launcher.slice(1).map(withWestern),
        ]
      : settings.westernRite
        ? launcher.map((group) => (group.title === "With the Church" ? { ...group, tiles: [...group.tiles, ROSARY_TILE, STATIONS_TILE, COMPLINE_WEST_TILE, NOVENA_TILE] } : group))
        : launcher;
    const now = new Date();
    const feast = feastTile(now, settings.calendarMode);
    const lead = feast ?? withoutTodaysIcon(prayerForHour(now, western ? WESTERN_OFFICE.tiles : undefined), now, settings.calendarMode);
    const eyebrow = feast ? "Today's feast" : t("pray.lead");
    return (
      <div className="grid min-w-0 gap-5">
        <LauncherIntro title={t("pray.title")} />
        <SectionLauncher
          groups={withDurations(groups.map((group) => ({ ...group, tiles: group.tiles.filter((tile) => tile.to !== lead.to) })))}
          lead={{ eyebrow, tile: withDurations([{ title: "", tiles: [lead] }])[0].tiles[0] }}
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
