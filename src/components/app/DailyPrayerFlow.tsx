import { useEffect, useMemo, useState, type ReactNode } from "react";
import { format } from "date-fns";
import {
  Bell,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Moon,
  MoonStar,
  RotateCcw,
  Shield,
  Sun,
  Sunset,
  Type,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createSimpleIcs, downloadTextFile } from "@/lib/ics";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { showError, showSuccess } from "@/utils/toast";

type PrayerTime = "morning" | "evening" | "night";
type PrayerMode = "short" | "standard" | "long";

type PrayerStep = {
  title: string;
  body: string[];
};

type ReaderPrefs = {
  focus: boolean;
  largeText: boolean;
  night: boolean;
};

type ReminderPrefs = Record<PrayerTime, { enabled: boolean; time: string }>;

const FLOW_PREFS_KEY = "daily_prayer_flow:prefs";
const REMINDER_PREFS_KEY = "daily_prayer_flow:reminders";

const DEFAULT_READER_PREFS: ReaderPrefs = {
  focus: false,
  largeText: false,
  night: false,
};

const DEFAULT_REMINDERS: ReminderPrefs = {
  morning: { enabled: true, time: "07:00" },
  evening: { enabled: true, time: "18:00" },
  night: { enabled: false, time: "21:30" },
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
    title: "Settle",
    body: [
      "Stand or sit quietly. Make the sign of the Cross.",
      "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
    ],
  },
  {
    title: "Trisagion prayers",
    body: [
      "Holy God, Holy Mighty, Holy Immortal, have mercy on us. (3x)",
      "Glory to the Father, and to the Son, and to the Holy Spirit, now and ever and unto ages of ages. Amen.",
      "O Most Holy Trinity, have mercy on us; Lord, cleanse us from our sins; Master, pardon our transgressions; Holy One, visit and heal our infirmities for Your Name's sake.",
      "Lord, have mercy. (3x)",
      "Our Father, Who art in heaven, hallowed be Thy Name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil.",
    ],
  },
];

const shortFlows: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    commonOpening[0],
    {
      title: "Morning offering",
      body: [
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
        "Guide my thoughts, words, and actions today. Keep me watchful, humble, and ready to love the person before me. Amen.",
      ],
    },
    {
      title: "Close",
      body: ["Most Holy Theotokos, save us.", "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us. Amen."],
    },
  ],
  evening: [
    commonOpening[0],
    {
      title: "Evening review",
      body: [
        "Glory to You, O God, for the mercy of this day.",
        "Forgive what I did in thought, word, deed, and neglect. Heal what I damaged, strengthen what is weak, and teach me repentance. Amen.",
      ],
    },
    {
      title: "Close",
      body: ["Lord, have mercy. (3x)", "Through the prayers of our holy fathers, Lord Jesus Christ our God, have mercy on us. Amen."],
    },
  ],
  night: [
    commonOpening[0],
    {
      title: "Before sleep",
      body: [
        "Into Your hands, O Lord Jesus Christ, I commend my soul and body.",
        "Bless me, have mercy on me, and grant me peaceful sleep, free from every disturbance. Amen.",
      ],
    },
    {
      title: "Close",
      body: ["My hope is the Father, my refuge is the Son, my protection is the Holy Spirit: Holy Trinity, glory to You.", "Amen."],
    },
  ],
};

const standardExtras: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    commonOpening[1],
    {
      title: "To the Holy Trinity",
      body: [
        "Having arisen from sleep, we fall down before Thee, O Blessed One, and sing to Thee, O Mighty One, the angelic hymn: Holy! Holy! Holy! art Thou, O God; through the Theotokos, have mercy on us.",
        "Do Thou, O Lord, Who hast raised me from my bed and from sleep, enlighten my mind and heart, and open my lips that I may praise Thee, O Holy Trinity.",
      ],
    },
    {
      title: "Guardian angel",
      body: [
        "O Holy Angel of God, guardian and protector of my soul and body, forgive me everything by which I have offended you; protect me during this day, and guard me from every temptation of the enemy. Amen.",
      ],
    },
  ],
  evening: [
    commonOpening[1],
    {
      title: "Have mercy on us",
      body: [
        "Have mercy on us, O Lord, have mercy on us; for laying aside all excuse, we sinners offer to Thee, as to our Master, this supplication: Have mercy on us.",
        "O blessed Theotokos, open the doors of compassion to us whose hope is in you, that we may not perish but be delivered from adversity through you.",
      ],
    },
    {
      title: "Forgiveness",
      body: [
        "O Eternal God, King of every creature, Who hast enabled me to attain to this hour, forgive me the sins which I have committed this day by thought, word and deed. Grant me to pass through the sleep of this night in peace. Amen.",
      ],
    },
  ],
  night: [
    commonOpening[1],
    {
      title: "Prayer to Christ",
      body: [
        "O Lord Jesus Christ our God, as Thou art good and lovest mankind, forgive me all the sins I have committed today in word, deed, and thought.",
        "Grant me peaceful and undisturbed sleep. Send Thy guardian angel to protect and keep me from all evil. Amen.",
      ],
    },
    {
      title: "Theotokos",
      body: [
        "Beneath your compassion we take refuge, O Theotokos. Despise not our petitions in time of trouble, but deliver us from dangers, only Pure One, only Blessed One.",
      ],
    },
  ],
};

const longExtras: Record<PrayerTime, PrayerStep[]> = {
  morning: [
    {
      title: "Psalm 50",
      body: [
        "Have mercy on me, O God, according to Thy great mercy; according to the multitude of Thy compassions blot out my transgression.",
        "Create in me a clean heart, O God, and renew a right spirit within me.",
      ],
    },
    {
      title: "The Creed",
      body: [
        "I believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible; and in one Lord Jesus Christ, the Son of God...",
        "Use this as a prompt to pray the full Creed from your prayer book when time allows.",
      ],
    },
  ],
  evening: [
    {
      title: "Longer examination",
      body: [
        "Where did I receive mercy today? Where did I refuse mercy? Whom did I wound, neglect, or judge?",
        "Lord, give me repentance without despair, truth without excuses, and courage to make peace. Amen.",
      ],
    },
    {
      title: "Intercessions",
      body: [
        "Remember, O Lord, my family, parish, clergy, friends, enemies, the sick, the suffering, travelers, captives, and all who have asked for prayer.",
      ],
    },
  ],
  night: [
    {
      title: "Quiet Jesus Prayer",
      body: [
        "Pray slowly for one to three minutes:",
        "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
      ],
    },
    {
      title: "Protection",
      body: [
        "Surround me, O Lord, with the power of Thy precious and life-giving Cross. Preserve me from every evil imagination, fear, and disturbance. Amen.",
      ],
    },
  ],
};

function buildFlow(time: PrayerTime, mode: PrayerMode) {
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

function makeReminderDate(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const start = new Date();
  start.setHours(hours || 0, minutes || 0, 0, 0);
  if (start.getTime() < Date.now()) start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 15);
  return { start, end };
}

export function DailyPrayerFlow() {
  const [time, setTime] = useState<PrayerTime>(() => recommendedTime());
  const [mode, setMode] = useState<PrayerMode>("short");
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [readerPrefs, setReaderPrefs] = useState<ReaderPrefs>(DEFAULT_READER_PREFS);
  const [reminders, setReminders] = useState<ReminderPrefs>(DEFAULT_REMINDERS);

  useEffect(() => {
    const saved = getStoredItem<{ mode?: PrayerMode; readerPrefs?: ReaderPrefs }>(FLOW_PREFS_KEY);
    if (saved?.mode) setMode(saved.mode);
    if (saved?.readerPrefs) setReaderPrefs({ ...DEFAULT_READER_PREFS, ...saved.readerPrefs });

    const savedReminders = getStoredItem<Partial<ReminderPrefs>>(REMINDER_PREFS_KEY);
    if (savedReminders) {
      setReminders({
        morning: { ...DEFAULT_REMINDERS.morning, ...savedReminders.morning },
        evening: { ...DEFAULT_REMINDERS.evening, ...savedReminders.evening },
        night: { ...DEFAULT_REMINDERS.night, ...savedReminders.night },
      });
    }
  }, []);

  useEffect(() => {
    setStoredItem(FLOW_PREFS_KEY, { mode, readerPrefs });
  }, [mode, readerPrefs]);

  useEffect(() => {
    setStoredItem(REMINDER_PREFS_KEY, reminders);
  }, [reminders]);

  const steps = useMemo(() => buildFlow(time, mode), [time, mode]);
  const progressKey = `${format(new Date(), "yyyy-MM-dd")}:${time}:${mode}`;
  const done = !!completed[progressKey];
  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = done ? 100 : Math.round(((stepIndex + 1) / steps.length) * 100);

  function start(nextTime: PrayerTime) {
    setTime(nextTime);
    setStepIndex(0);
  }

  function updateReminder(nextTime: PrayerTime, patch: Partial<ReminderPrefs[PrayerTime]>) {
    setReminders((prev) => ({ ...prev, [nextTime]: { ...prev[nextTime], ...patch } }));
  }

  function addReminderToCalendar(nextTime: PrayerTime) {
    try {
      const reminder = reminders[nextTime];
      const { start, end } = makeReminderDate(reminder.time);
      const label = prayerMeta[nextTime].label;
      const ics = createSimpleIcs({
        title: `${label} Prayer (Ortho Companion)`,
        description: `Open Ortho Companion and pray the ${label.toLowerCase()} rule. This calendar item is created locally from your reminder preference.`,
        start,
        end,
      });
      downloadTextFile(`${nextTime}-prayer-reminder.ics`, ics, "text/calendar");
      showSuccess(`${label} reminder downloaded.`);
    } catch {
      showError("Couldn't create reminder file.");
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">Daily Prayer Flow</h2>
              <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {prayerMeta[time].label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose morning, evening, or night and move through a calm step-by-step rule.
            </p>
          </div>
          <Shield className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 md:grid-cols-3">
          {(Object.keys(prayerMeta) as PrayerTime[]).map((key) => (
            <button
              key={key}
              type="button"
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
                Short for busy days, standard for normal use, longer when you have room.
              </p>
            </div>
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => {
                if (!value) return;
                setMode(value as PrayerMode);
                setStepIndex(0);
              }}
              className="justify-start gap-2"
            >
              {[
                ["short", "Short"],
                ["standard", "Standard"],
                ["long", "Longer"],
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
                checked={readerPrefs.focus}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, focus: checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4 text-primary" /> Large text
              </span>
              <Switch
                checked={readerPrefs.largeText}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, largeText: checked }))}
              />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Moon className="h-4 w-4 text-primary" /> Night
              </span>
              <Switch
                checked={readerPrefs.night}
                onCheckedChange={(checked) => setReaderPrefs((p) => ({ ...p, night: checked }))}
              />
            </label>
          </div>
        </div>
      </Card>

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
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{current.title}</h3>
          </div>
          {done ? (
            <Badge className="w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
              <Check className="mr-1 h-3.5 w-3.5" /> Complete
            </Badge>
          ) : null}
        </div>

        <div className="my-4">
          <Progress value={progress} className="h-2" />
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
          <div className={(readerPrefs.largeText ? "space-y-4 text-lg" : "space-y-3 text-base") + " leading-relaxed"}>
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
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => {
                if (stepIndex >= steps.length - 1) {
                  setCompleted((prev) => ({ ...prev, [progressKey]: true }));
                  return;
                }
                setStepIndex((i) => i + 1);
              }}
            >
              {stepIndex >= steps.length - 1 ? "Mark complete" : "Next"}
              {stepIndex >= steps.length - 1 ? <Check className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="rounded-2xl"
            onClick={() => {
              setStepIndex(0);
              setCompleted((prev) => ({ ...prev, [progressKey]: false }));
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset flow
          </Button>
        </div>
      </Card>

      <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Prayer reminders</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Save your preferred times and download calendar reminders for your device.
            </p>
          </div>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          {(Object.keys(prayerMeta) as PrayerTime[]).map((key) => (
            <div key={key} className="grid gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex items-center gap-3">
                <Switch
                  checked={reminders[key].enabled}
                  onCheckedChange={(checked) => updateReminder(key, { enabled: checked })}
                />
                <div>
                  <p className="text-sm font-semibold">{prayerMeta[key].label} prayer</p>
                  <p className="text-xs text-muted-foreground">
                    {reminders[key].enabled ? `Reminder set for ${reminders[key].time}` : "Reminder off"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <input
                  type="time"
                  value={reminders[key].time}
                  onChange={(event) => updateReminder(key, { time: event.target.value })}
                  className="h-10 rounded-2xl border border-input bg-background px-3 text-sm"
                  aria-label={`${prayerMeta[key].label} reminder time`}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-2xl border-border/60"
                  onClick={() => addReminderToCalendar(key)}
                  disabled={!reminders[key].enabled}
                >
                  <CalendarPlus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
