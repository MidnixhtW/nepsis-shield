import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { useDailyCalendar } from "@/hooks/useDailyCalendar";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { DailyContentStatus } from "@/components/app/DailyContentStatus";
import { format } from "date-fns";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Leaf,
  Maximize2,
  Moon,
  MoonStar,
  RotateCcw,
  Sparkles,
  Sun,
  Sunset,
  Type,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { COMMEMORATIONS_CHANGED_EVENT, commemorationStep, getCommemorations } from "@/lib/commemorations";
import {
  clearPrayerResume,
  getPrayerResume,
  markPrayerComplete,
  savePrayerResume,
  useDailyRhythm,
} from "@/lib/dailyHabits";
import { showSuccess } from "@/utils/toast";

type PrayerTime = "morning" | "evening" | "night";

type PrayerMode = "short" | "standard" | "long" | "personal";

type PrayerStep = {
  title: string;
  body: string[];
};

type ReaderPrefs = {
  focus: boolean;
  largeText: boolean;
  night: boolean;
};

const FLOW_PREFS_KEY = "daily_prayer_flow:prefs";

const DEFAULT_READER_PREFS: ReaderPrefs = {
  focus: false,
  largeText: false,
  night: false,
};

const prayerMeta: Record<PrayerTime, { label: string; icon: ReactNode; hint: string }> = {
  morning: {
    label: "Morning",
    icon: <Sun className="h-4 w-4" />,
    hint: "Offer the day to God before the noise begins.",
  },
  evening: {
    label: "Evening",
    icon: <Sunset className="h-4 w-4" />,
    hint: "Give thanks, examine the day, and ask forgiveness.",
  },
  night: {
    label: "Night",
    icon: <MoonStar className="h-4 w-4" />,
    hint: "Commit sleep, body, and soul into God’s hands.",
  },
};

const commonOpening: PrayerStep[] = [
  {
    title: "Begin",
    body: [
      "Stand or sit quietly. Make the sign of the Cross.",
      "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      "Glory to Thee, our God, glory to Thee.",
    ],
  },
  {
    title: "O Heavenly King",
    body: [
      "O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.",
    ],
  },
  {
    title: "Trisagion prayers",
    body: [
      "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Thy Name's sake.",
      "Lord, have mercy. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
    ],
  },
];

const closingPrayers: PrayerStep = {
  title: "Close",
  body: [
    "It is truly meet to bless you, O Theotokos, ever-blessed and most pure, and the Mother of our God. More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption you gave birth to God the Word. True Theotokos, we magnify you.",
    "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
    "Lord, have mercy. (3x)",
    "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us. Amen.",
  ],
};

const shortFlows: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    commonOpening[0],
    {
      title: "Morning prayer",
      body: [
        "O Lord, grant me to greet the coming day in peace. Help me in all things to rely upon Thy holy will. In every hour of the day reveal Thy will to me.",
        "Bless my dealings with all who surround me. Teach me to treat all that comes to me throughout the day with peace of soul and with firm conviction that Thy will governs all.",
        "Guide my thoughts, words, and deeds. In unforeseen events, let me not forget that all are sent by Thee. Teach me to act firmly and wisely, without embittering or embarrassing others. Amen.",
      ],
    },
    {
      title: "Jesus Prayer: Lord Jesus Christ, Son of God, have mercy on me, a sinner",
      body: [
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner. (Repeat slowly 3, 12, or 33 times.)",
      ],
    },
    closingPrayers,
  ],
  evening: [
    commonOpening[0],
    {
      title: "Evening thanksgiving",
      body: [
        "Glory to Thee, O Lord, glory to Thee. I thank Thee for every mercy shown to me this day: for life, breath, protection, correction, forgiveness, and every good thing seen and unseen.",
        "Forgive me, O Lord, for every sin I have committed today in thought, word, deed, and neglect. Heal what I have wounded, strengthen what is weak, and grant me repentance without despair. Amen.",
      ],
    },
    {
      title: "For peace",
      body: [
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
        "Grant peace to my home, my family, my parish, and all who suffer. Teach me to forgive, to ask forgiveness, and to rest in Thy mercy. Amen.",
      ],
    },
    closingPrayers,
  ],
  night: [
    commonOpening[0],
    {
      title: "Before sleep",
      body: [
        "Into Thy hands, O Lord Jesus Christ my God, I commend my soul and body. Bless me, have mercy on me, and grant me eternal life. Amen.",
        "O Lord our God, as Thou art good and lovest mankind, forgive me all the sins I have committed this day in word, deed, and thought. Grant me peaceful and undisturbed sleep. Send Thy guardian angel to protect and keep me from every evil. Amen.",
      ],
    },
    {
      title: "Theotokos",
      body: [
        "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
      ],
    },
    closingPrayers,
  ],
};

const standardExtras: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    commonOpening[1],
    commonOpening[2],
    {
      title: "Prayer to the Holy Trinity",
      body: [
        "Having arisen from sleep, we fall down before Thee, O Blessed One, and sing to Thee, O Mighty One, the angelic hymn: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
        "Glory to the Father, and to the Son, and to the Holy Spirit.",
        "Do Thou, O Lord, Who hast raised me from my bed and from sleep, enlighten my mind and heart, and open my lips that I may praise Thee, O Holy Trinity: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
        "Now and ever and unto ages of ages. Amen.",
        "The Judge will come suddenly and the acts of every man will be revealed; but with fear we cry in the middle of the night: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
      ],
    },
    {
      title: "Guardian angel",
      body: [
        "O Holy Angel, keeping guard over my wretched soul and my passionate life, do not forsake me, a sinner, nor depart from me because of my incontinence. Do not give the evil enemy room to overcome me by force of this mortal body. Strengthen my weak and feeble hand, and set me on the way of salvation. Yea, O Holy Angel of God, guardian and protector of my wretched soul and body, forgive me everything by which I have offended you all the days of my life, and even what I have done this past night; protect me during this day, and guard me from every temptation of the enemy, that I may not anger God by any sin. Pray to the Lord for me, that He may confirm me in His fear and prove me a worthy servant of His goodness. Amen.",
      ],
    },
    {
      title: "App patron: St Michael the Archangel",
      body: [
        "Holy Archangel Michael, defend us in battle, guard this work, and pray to God for us.",
      ],
    },
  ],
  evening: [
    commonOpening[1],
    commonOpening[2],
    {
      title: "Have mercy on us",
      body: [
        "Have mercy on us, O Lord, have mercy on us; for laying aside all excuse, we sinners offer to Thee, as to our Master, this supplication: Have mercy on us.",
        "Glory to the Father, and to the Son, and to the Holy Spirit.",
        "O Lord, have mercy on us, for in Thee have we put our trust. Do not be angry with us, nor remember our iniquities, but look down on us even now, since Thou art compassionate, and deliver us from our enemies. For Thou art our God, and we are Thy people; we are all the work of Thy hands, and we call on Thy name.",
        "Now and ever and unto ages of ages. Amen.",
        "O blessed Theotokos, open the doors of compassion to us whose hope is in you, that we may not perish but be delivered from adversity through you, who are the salvation of the Christian people.",
      ],
    },
    {
      title: "To the Father",
      body: [
        "O Eternal God, King of every creature, Who hast enabled me to attain to this hour, forgive me the sins which I have committed this day by thought, word and deed. Cleanse my humble soul, O Lord, from every defilement of flesh and spirit. Grant me, O Lord, to pass through the sleep of this night in peace, that I may rise from my humble bed and please Thy most Holy Name all the days of my life, vanquishing the enemies both fleshly and bodiless that contend against me. Deliver me from vain thoughts that defile me, O Lord, and from evil desires. For Thine is the Kingdom, and the power, and the glory: of the Father, and of the Son, and of the Holy Spirit, now and ever and unto ages of ages. Amen.",
      ],
    },
  ],
  night: [
    commonOpening[1],
    commonOpening[2],
    {
      title: "Prayer to Christ before sleep",
      body: [
        "O Almighty Word of the Father, Jesus Christ, Who art Thyself perfect: Because of Thy great mercy, do not ever depart from me, Thy servant, but always abide in me. O Jesus, Good Shepherd of Thy sheep, let me not fall into the disobedience of the serpent, nor leave me to the will of Satan, for the seeds of corruption are in me. O Lord God adorable, O Holy King Jesus, guard me while I sleep with the unfading light, Thy Holy Spirit, through Whom Thou didst sanctify Thy disciples. Grant even to me, Thy unworthy servant, O Lord, Thy salvation upon my bed. Enlighten my mind with the light of the understanding of Thy Gospel; my soul with love of Thy Cross; my heart with the purity of Thy word; my body with Thy passionless passion; preserve my thought in Thy humility, and raise me at the time proper for Thy glorification. For Thou art most glorified with Thy Father, Who is without beginning, and Thy Most Holy Spirit, unto the ages. Amen.",
      ],
    },
    {
      title: "Into Thy hands",
      body: [
        "Into Thy hands, O Lord Jesus Christ my God, I commend my spirit. Bless me, have mercy on me, and grant me eternal life. Amen.",
      ],
    },
  ],
};

const developerPrayerRule: PrayerStep[] = [
  {
    title: "Beginning",
    body: [
      "Stand or sit attentively. Make the sign of the Cross.",
      "In the Name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      "Glory to Thee, our God, glory to Thee.",
      "O Heavenly King, the Comforter, the Spirit of Truth, Who art everywhere and fillest all things, Treasury of blessings and Giver of life: come and abide in us, and cleanse us from every impurity, and save our souls, O Good One.",
    ],
  },
  {
    title: "The Trisagion Prayers",
    body: [
      "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Thy Name's sake.",
      "Lord, have mercy. (3x)",
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
    ],
  },
  {
    title: "Psalm 50",
    body: [
      "Have mercy on me, O God, according to Thy great mercy; and according to the multitude of Thy compassions blot out my transgression.",
      "Create in me a clean heart, O God, and renew a right spirit within me. Cast me not away from Thy presence, and take not Thy Holy Spirit from me.",
      "Restore unto me the joy of Thy salvation, and with Thy governing Spirit establish me. O Lord, open Thou my lips, and my mouth shall declare Thy praise.",
    ],
  },
  {
    title: "The Creed",
    body: [
      "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
      "And in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages: Light of Light, true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made.",
      "Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried.",
      "And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again with glory to judge the living and the dead; Whose kingdom shall have no end.",
      "And in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshiped and glorified; Who spoke by the prophets.",
      "In one, holy, catholic, and apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead, and the life of the age to come. Amen.",
    ],
  },
  {
    title: "Prayer before work",
    body: [
      "O Lord Jesus Christ, Son of God, bless the work of my hands today. Make my attention sober, my decisions truthful, my speech gentle, and my craft useful to those who depend on it.",
      "Deliver me from pride, impatience, distraction, vanity, and the love of praise. Let no work of mine harm another soul. Teach me to build with humility, diligence, and mercy. Amen.",
    ],
  },
  {
    title: "Jesus Prayer",
    body: [
      "Pray slowly 33 times, or as much as your rule permits:",
      "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
    ],
  },
  {
    title: "Prayer of St. Ephraim",
    body: [
      "O Lord and Master of my life, take from me the spirit of sloth, despair, lust of power, and idle talk.",
      "But give rather the spirit of chastity, humility, patience, and love to Thy servant.",
      "Yea, O Lord and King, grant me to see my own transgressions, and not to judge my brother, for blessed art Thou, unto ages of ages. Amen.",
      "Make a prostration or deep bow if appropriate.",
    ],
  },
  {
    title: "Holy Archangel Michael",
    body: [
      "Holy Archangel Michael, commander of the bodiless hosts, defend us and pray to God for us.",
      "Guard this work from vanity, anger, confusion, and every temptation that darkens the heart. Ask the Lord to grant courage with humility, strength with mercy, and watchfulness in every duty. Amen.",
    ],
  },
  {
    title: "Intercessions",
    body: [
      "Remember, O Lord, my family, my parish, my clergy, my friends, my enemies, the sick, the suffering, travelers, captives, those in danger, those who have no one to pray for them, and all who have asked for my prayers.",
      "Pray to God for me, O holy patron saint and all saints, for I fervently flee unto you who are swift helpers and intercessors for my soul.",
    ],
  },
  {
    title: "The Theotokos",
    body: [
      "It is truly meet to bless thee, O Theotokos, ever-blessed and most pure, and the Mother of our God.",
      "More honorable than the Cherubim, and beyond compare more glorious than the Seraphim, without corruption thou gavest birth to God the Word. True Theotokos, we magnify thee.",
    ],
  },
  {
    title: "Dismissal",
    body: [
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "Lord, have mercy. (3x)",
      "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us and save us. Amen.",
    ],
  },
];

const longExtras: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    {
      title: "Psalm 50 excerpts",
      body: [
        "Have mercy on me, O God, according to Thy great mercy; and according to the multitude of Thy compassions blot out my transgression.",
        "Wash me thoroughly from mine iniquity, and cleanse me from my sin. For I know mine iniquity, and my sin is ever before me.",
        "Against Thee only have I sinned and done this evil before Thee, that Thou mightest be justified in Thy words and prevail when Thou art judged.",

        "Create in me a clean heart, O God, and renew a right spirit within me. Cast me not away from Thy presence, and take not Thy Holy Spirit from me.",
        "Restore unto me the joy of Thy salvation, and with Thy governing Spirit establish me. O Lord, open Thou my lips, and my mouth shall declare Thy praise.",
      ],
    },
    {
      title: "The Creed",
      body: [
        "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.",
        "And in one Lord Jesus Christ, the Son of God, the Only-begotten, begotten of the Father before all ages: Light of Light, true God of true God; begotten, not made; of one essence with the Father, by Whom all things were made.",
        "Who for us men and for our salvation came down from heaven, and was incarnate of the Holy Spirit and the Virgin Mary, and became man. And He was crucified for us under Pontius Pilate, and suffered, and was buried.",
        "And the third day He rose again, according to the Scriptures, and ascended into heaven, and sits at the right hand of the Father. And He shall come again with glory to judge the living and the dead; Whose kingdom shall have no end.",
        "And in the Holy Spirit, the Lord, the Giver of Life, Who proceeds from the Father; Who with the Father and the Son together is worshiped and glorified; Who spoke by the prophets.",
        "In one, holy, catholic, and apostolic Church. I acknowledge one baptism for the remission of sins. I look for the resurrection of the dead, and the life of the age to come. Amen.",
      ],
    },
  ],
  evening: [
    {
      title: "Examination of conscience",
      body: [
        "O Lord, reveal to me where I sinned today by thought, word, deed, or neglect. Show me where I was proud, angry, impure, lazy, fearful, unmerciful, or inattentive to prayer.",
        "Do not let shame drive me away from Thee. Give me true repentance, courage to confess what must be confessed, and a humble heart that seeks mercy rather than excuses. Amen.",
      ],
    },
    {
      title: "Intercessions",
      body: [
        "Remember, O Lord, my family, my parish, my clergy, my friends, my enemies, the sick, the suffering, travelers, captives, those in danger, those who have no one to pray for them, and all who have asked for my prayers.",
        "Grant rest, O Lord, to Thy departed servants, and make their memory to be eternal. Amen.",
      ],
    },
  ],
  night: [
    {
      title: "Jesus Prayer: Lord Jesus Christ, Son of God, have mercy on me, a sinner",
      body: [
        "Pray slowly for one to three minutes:",
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
      ],
    },
    {
      title: "Protection by the Cross",
      body: [
        "Let God arise, let His enemies be scattered; let those who hate Him flee from before His face.",
        "Surround me, O Lord, with the power of Thy precious and life-giving Cross. Preserve me from every evil imagination, fear, disturbance, and assault of the enemy. Amen.",
      ],
    },
    {
      title: "Prayer to the Theotokos",
      body: [
        "O most holy Theotokos, save and protect me. Cover me with your holy protection through this night, and deliver me from all evil by your prayers to Christ our God. Amen.",
      ],
    },
  ],
};

function buildFlow(time: PrayerTime, mode: PrayerMode) {
  if (mode === "personal") return developerPrayerRule;
  if (mode === "short") return shortFlows[time];
  if (mode === "standard") return [shortFlows[time][0], ...standardExtras[time], ...shortFlows[time].slice(1)];
  return [shortFlows[time][0], ...standardExtras[time], ...longExtras[time], ...shortFlows[time].slice(1)];
}

function recommendedTime(): PrayerTime {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 20) return "evening";
  return "night";
}

function fastingLabel(description: string, exception?: string) {
  return exception ? `${description} · ${exception}` : description;
}

function BeginTodayCalendar() {
  const { today, query: q, retry } = useDailyCalendar();

  if (q.isLoading) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-5 text-sm text-muted-foreground shadow-sm">
        Loading today’s fasting and saints…
      </div>
    );
  }

  if (!q.data) {
    return <DailyContentStatus date={today} failed={true} refreshing={q.isFetching} onRetry={retry} />;
  }

  const saints = q.data.saints.slice(0, 4);
  const firstSaint = saints[0];

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 bg-card shadow-sm">
      <DailyContentStatus date={today} data={q.data} failed={q.isError} refreshing={q.isFetching} onRetry={retry} />
      <div className="border-b border-border/60 bg-primary/5 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Before you begin</p>
        <h3 className="mt-1 text-lg font-semibold tracking-tight">Today in the Church</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Let the calendar set the tone: fasting teaches watchfulness, and the saints remind us we never pray alone.
        </p>
      </div>

      <div className="grid gap-0 divide-y divide-border/60 md:grid-cols-2 md:divide-x md:divide-y-0">
        <section className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-500/12 text-amber-700 dark:text-amber-200">
              <Leaf className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Fasting today</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed">
                {fastingLabel(q.data.fasting.description, q.data.fasting.exception)}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Follow your parish calendar, health needs, and priest’s blessing.
              </p>
            </div>
          </div>
        </section>

        <section className="p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Saints of the day</p>
              <div className="mt-1 grid gap-1.5">
                {saints.length ? (
                  saints.map((saint) => (
                    <p key={saint} className="text-sm leading-relaxed">
                      {saint}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">See today’s calendar commemorations.</p>
                )}
              </div>
              {firstSaint ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 h-auto min-h-9 rounded-2xl border-border/60 bg-background/60 text-xs"
                  asChild
                >
                  <a href={`https://www.oca.org/saints/lives?search=${encodeURIComponent(firstSaint)}`} target="_blank" rel="noopener noreferrer"><span className="sr-only"> (opens in a new tab) </span>
                    Read first life <ExternalLink aria-hidden="true" className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
}

function PrayerFlowSteps({ current }: { current: number }) {
  const items = ["Prepare", "Pray", "Continue"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item, index) => {
        const active = index === current;
        const complete = index < current;
        return (
          <div
            key={item}
            aria-current={active ? "step" : undefined}
            className={
              "rounded-2xl border px-3 py-2 text-center text-xs font-semibold transition-colors " +
              (active
                ? "border-primary/40 bg-primary/10 text-primary"
                : complete
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
                  : "border-border/60 bg-muted/20 text-muted-foreground")
            }
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

export function DailyPrayerFlow() {
  const [time, setTime] = useState<PrayerTime>(() => recommendedTime());
  const [mode, setMode] = useState<PrayerMode>("short");
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>(DEFAULT_READER_PREFS);
  const [hydrated, setHydrated] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const today = useCurrentDay();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusNextStep = useRef(false);
  const rhythm = useDailyRhythm();

  useEffect(() => {
    const saved = getStoredItem<{ time?: PrayerTime; mode?: PrayerMode; readerPrefs?: ReaderPrefs }>(FLOW_PREFS_KEY);
    if (saved?.time) setTime(saved.time);
    if (saved?.mode) setMode(saved.mode);
    if (saved?.readerPrefs) setReaderPrefs({ ...DEFAULT_READER_PREFS, ...saved.readerPrefs });

    const resume = getPrayerResume();
    if (resume) {
      setTime(resume.time);
      setMode(resume.mode);
      setStepIndex(resume.stepIndex);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredItem(FLOW_PREFS_KEY, { time, mode, readerPrefs });
  }, [hydrated, mode, readerPrefs, time]);

  const [names, setNames] = useState(getCommemorations);
  useEffect(() => {
    const refresh = () => setNames(getCommemorations());
    window.addEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(COMMEMORATIONS_CHANGED_EVENT, refresh);
  }, []);
  // Names from the Names tab are prayed just before the closing prayer.
  const steps = useMemo(() => {
    const flow = buildFlow(time, mode);
    const remember = commemorationStep(names);
    return remember ? [...flow.slice(0, -1), remember, flow[flow.length - 1]] : flow;
  }, [time, mode, names]);
  const progressKey = `${format(today, "yyyy-MM-dd")}:${time}:${mode}`;
  const storedPrayerKey = mode === "personal" ? "personal" : time;
  const done = completed[progressKey] ?? !!rhythm.today.prayers[storedPrayerKey];
  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = done ? 100 : Math.round(((stepIndex + 1) / steps.length) * 100);
  const flowStage = done ? 2 : stepIndex === 0 ? 0 : 1;

  useEffect(() => {
    if (!focusNextStep.current) return;
    headingRef.current?.focus();
    focusNextStep.current = false;
  }, [stepIndex, done, progressKey]);

  useEffect(() => {
    if (!hydrated || done) return;
    savePrayerResume({
      time,
      mode,
      stepIndex: Math.min(stepIndex, steps.length - 1),
      totalSteps: steps.length,
      title: current.title,
    });
  }, [current.title, done, hydrated, mode, stepIndex, steps.length, time]);

  function start(nextTime: PrayerTime) {
    setTime(nextTime);
    setStepIndex(0);
  }

  function goBack() {
    focusNextStep.current = true;
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    focusNextStep.current = true;
    if (stepIndex >= steps.length - 1) {
      setCompleted((prev) => ({ ...prev, [progressKey]: true }));
      markPrayerComplete(mode === "personal" ? "personal" : time, mode);
      showSuccess("Prayer marked complete for today.");
      setImmersive(false);
      return;
    }
    // Beginning the prayer opens the distraction-free view.
    if (stepIndex === 0) setImmersive(true);
    setStepIndex((i) => i + 1);
  }

  const nextLabel = stepIndex >= steps.length - 1 ? "Mark complete" : stepIndex === 0 ? "Begin prayer" : "Next";
  const nextIcon = stepIndex >= steps.length - 1 ? <Check className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />;

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">Daily Prayer Flow</h2>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {mode === "personal" ? "Developer's Rule" : prayerMeta[time].label}
              </Badge>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Set the rule, receive today’s Church calendar, then pray one step at a time.
            </p>
          </div>
          <div className="grid gap-2">
            <PrayerFlowSteps current={flowStage} />
            <p className="text-xs leading-relaxed text-muted-foreground lg:text-right">
              Keep the movement simple: prepare the heart, pray the rule, then carry it into the day.
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 md:grid-cols-3">
          {(Object.keys(prayerMeta) as PrayerTime[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={time === key}
              className={
                "tap rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
                (time === key
                  ? "border-primary/40 bg-primary/10"
                  : "border-border/60 bg-background/50 hover:bg-background/80")
              }
              onClick={() => start(key)}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  {prayerMeta[key].icon}
                </span>
                {prayerMeta[key].label}
              </span>
              <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                {prayerMeta[key].hint}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 rounded-2xl border border-border/60 bg-background/45 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold">Prayer rule length</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Short for busy days, standard for normal use, longer when you have room, or the developer's rule for a fuller Orthodox anchor.
              </p>
            </div>
            <ToggleGroup
              type="single"
              aria-label="Prayer rule length"
              value={mode}
              onValueChange={(value) => {
                if (!value) return;
                setMode(value as PrayerMode);
                setStepIndex(0);
              }}
              className="flex-wrap justify-start gap-2"
            >
              {[
                ["short", "Short"],
                ["standard", "Standard"],
                ["long", "Longer"],
                ["personal", "Developer's Rule"],
              ].map(([value, label]) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="rounded-2xl border border-border/60 px-3 data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10"
                >
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">

              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Eye className="h-4 w-4 text-primary" /> Focus
              </span>
              <Switch
                aria-label="Focus prayer reading"
                checked={readerPrefs.focus}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, focus: checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4 text-primary" /> Large text
              </span>
              <Switch
                aria-label="Large prayer text"
                checked={readerPrefs.largeText}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, largeText: checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Moon className="h-4 w-4 text-primary" /> Night
              </span>
              <Switch
                aria-label="Night prayer reading"
                checked={readerPrefs.night}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, night: checked }))}
              />
            </label>
          </div>
        </div>
      </Card>

      {stepIndex === 0 && !done ? <BeginTodayCalendar /> : null}

      <Card
        className={
          "rounded-3xl border-border/60 p-5 shadow-sm transition-colors " +
          (readerPrefs.night
            ? "bg-slate-950 text-slate-100"
            : readerPrefs.focus
              ? "bg-background"
              : "bg-card")
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <h3 ref={headingRef} tabIndex={-1} aria-label={`${done ? "Prayer complete. " : ""}Step ${stepIndex + 1} of ${steps.length}: ${current.title}`} className="mt-1 rounded text-2xl font-semibold tracking-tight focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">{current.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {done ? (
              <Badge className="w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
                <Check className="mr-1 h-3.5 w-3.5" /> Complete
              </Badge>
            ) : null}
            <Button type="button" variant="outline" size="sm" className="rounded-2xl border-border/60" onClick={() => setImmersive(true)}>
              <Maximize2 className="mr-2 h-4 w-4" /> Full screen
            </Button>
          </div>
        </div>

        <div className="my-4">
          <Progress value={progress} aria-label="Prayer progress" aria-valuetext={done ? "Prayer complete" : `Step ${stepIndex + 1} of ${steps.length}`} className="h-2" />
        </div>

        <div
          className={
            "rounded-2xl border p-4 " +
            (readerPrefs.night
              ? "border-slate-700 bg-slate-900/80"
              : readerPrefs.focus
                ? "border-border/50 bg-background"
                : "border-border/60 bg-muted/20")
          }
        >
          <div className={"scripture-text " + (readerPrefs.largeText ? "space-y-4 text-xl" : "space-y-3 text-lg")}>
            {current.body.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>

        {!readerPrefs.focus ? (
          <p className="mt-3 text-xs text-muted-foreground">
            This app supports your prayer life; keep your parish, priest, and printed prayer book at the center.
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-border/60"
              onClick={goBack}
              disabled={stepIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="button" className="rounded-2xl" onClick={goNext}>
              {nextLabel}
              {nextIcon}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="rounded-2xl"
            onClick={() => {
              setStepIndex(0);
              setCompleted((prev) => ({ ...prev, [progressKey]: false }));
              clearPrayerResume();
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset flow
          </Button>

        </div>
      </Card>

      <Link
        to="/settings#prayer-reminders"
        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-4 w-4 shrink-0 text-accent" />
        <span className="min-w-0 flex-1">Prayer reminders are in Settings.</span>
        <ChevronRight className="h-4 w-4 shrink-0" />
      </Link>

      {/* Distraction-free prayer: one step at a time, large text, app menus hidden. */}
      <Dialog.Root open={immersive} onOpenChange={setImmersive}>
        <Dialog.Portal>
          <Dialog.Content
            aria-describedby={undefined}
            className={
              "fixed inset-0 z-[70] flex h-dvh flex-col text-foreground outline-none " +
              (readerPrefs.night ? "bg-slate-950 text-slate-100" : "bg-background")
            }
          >
            <header className="mx-auto flex w-full max-w-2xl shrink-0 items-center justify-between gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                {mode === "personal" ? "Developer's Rule" : `${prayerMeta[time].label} prayer`} · {stepIndex + 1} / {steps.length}
              </p>
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close full-screen prayer</span>
                </Button>
              </Dialog.Close>
            </header>
            <Progress value={progress} aria-hidden className="mx-auto mt-3 h-1 w-[min(42rem,calc(100%-2.5rem))]" />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
                <Dialog.Title className="text-3xl font-semibold tracking-tight sm:text-4xl">{current.title}</Dialog.Title>
                <div className={"scripture-text mt-6 " + (readerPrefs.largeText ? "space-y-6 text-2xl" : "space-y-5 text-xl")}>
                  {current.body.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <footer className="shrink-0 border-t border-border/50 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-5 sm:px-8">
                <Button type="button" variant="outline" className="h-12 rounded-2xl border-border/60 px-5" onClick={goBack} disabled={stepIndex === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" className="h-12 flex-1 rounded-2xl sm:flex-none sm:px-8" onClick={goNext}>
                  {nextLabel}
                  {nextIcon}
                </Button>
              </div>
            </footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
