import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { ResponderMode } from "@/lib/responderMode";

export const RULE_OF_VIGILANCE_STORAGE_KEY = "nepsis:rule-of-vigilance";
export const RULE_OF_VIGILANCE_CHANGED_EVENT = "nepsis:rule-of-vigilance-changed";

/** Setup allows several needs; the first one leads the rule. */
export const MAX_VIGILANCE_NEEDS = 3;

export type VigilanceNeed =
  | "peace"

  | "discipline"
  | "anger"
  | "sleep"
  | "scripture"
  | "confession"
  | "fasting"
  | "exploring";

export type VigilanceRhythm = "morning" | "midday" | "evening" | "small";

export type RuleTarget = {
  section: "today" | "pray" | "read" | "learn";
  tab?: string;
  read?: string;
};

export type RuleVariant = {
  id: string;
  label: string;
  description: string;
  pastoralNote: string;
  practice: string;
  primaryAction: string;
  target: RuleTarget;
};

export type RuleOfVigilance = {
  /** The leading need. Rules saved before multi-select only have this field. */
  need: VigilanceNeed;
  needs?: VigilanceNeed[];
  rhythm: VigilanceRhythm;
  role: ResponderMode;
  variant?: string;
  variantLabel?: string;
  title: string;
  pastoralNote: string;
  morning: string;
  midday: string;
  evening: string;
  underPressure: string;
  primaryAction: string;
  practice?: string;
  also?: Array<{ need: VigilanceNeed; label: string; body: string }>;
  target?: RuleTarget;
};

export const needTitles: Record<VigilanceNeed, string> = {
  peace: "Rule for Peace of Heart",
  discipline: "Rule for Steady Prayer",
  anger: "Rule for Meek Strength",
  sleep: "Rule for Night Stillness",
  scripture: "Rule for Scripture Habit",
  confession: "Rule for Honest Return",
  fasting: "Rule for Embodied Watchfulness",
  exploring: "Rule for First Steps",
};

export const needLabels: Record<VigilanceNeed, string> = {
  peace: "Peace from anxiety",
  discipline: "Discipline in prayer",
  anger: "Help with anger",
  sleep: "Sleep and evening stillness",
  scripture: "Scripture habit",
  confession: "Confession preparation",
  fasting: "Fasting support",
  exploring: "Just exploring",
};

// The first variant of each need keeps the original wording, so existing rules read the same.
export const ruleVariants: Record<VigilanceNeed, RuleVariant[]> = {
  peace: [
    {
      id: "gentle",
      label: "Gentle return",
      description: "Short prayers whenever the heart grows restless.",
      pastoralNote: "Begin gently. The goal is not to feel perfect, but to return to Christ one breath at a time.",
      practice: "When restless: 12 slow Jesus Prayers, breathing out on “have mercy on me.”",
      primaryAction: "Begin with one quiet prayer",
      target: { section: "pray", tab: "daily" },
    },
    {
      id: "anxious",
      label: "Anxious seasons",
      description: "For days when worry is loud.",
      pastoralNote: "When worry is loud, make the prayer shorter, not longer. Christ is near in the next breath.",
      practice: "Three times today, stop for one minute: breathe slowly and pray “Lord Jesus Christ, have mercy on me.”",
      primaryAction: "Start a one-minute pause",
      target: { section: "pray", tab: "counter" },
    },
    {
      id: "stillness",
      label: "Deeper stillness",
      description: "A few unhurried minutes of silence each day.",
      pastoralNote: "Peace grows in silence kept regularly. Give God a few unhurried minutes and let the mind settle in His presence.",
      practice: "Ten minutes of the Jesus Prayer with the chotki, sitting still, with the phone in another room.",
      primaryAction: "Begin stillness",
      target: { section: "pray", tab: "counter" },
    },
  ],
  discipline: [
    {
      id: "small",
      label: "Small and daily",
      description: "A short rule kept at the same time every day.",
      pastoralNote: "Small obedience kept daily is stronger than a large rule abandoned in discouragement.",
      practice: "Keep the same time and place for prayer each day, even when it is short.",
      primaryAction: "Begin today’s rule",
      target: { section: "pray", tab: "daily" },
    },
    {
      id: "morning-evening",
      label: "Morning and evening",
      description: "The Church’s rhythm at both ends of the day.",
      pastoralNote: "The Church frames the day with prayer at both ends. Keep both, even briefly.",
      practice: "Morning and evening prayers from the prayer book every day, at short or standard length.",
      primaryAction: "Open the prayer book",
      target: { section: "pray", tab: "prayers" },
    },
    {
      id: "fuller",
      label: "Fuller rule",
      description: "More prayer through the day, with a blessing.",
      pastoralNote: "Take on more only with your priest’s blessing, and keep it with joy rather than strain.",
      practice: "Morning prayers, a Psalm at midday, evening prayers, and 100 Jesus Prayers.",
      primaryAction: "Begin today’s rule",
      target: { section: "pray", tab: "rule" },
    },
  ],
  anger: [
    {
      id: "pause",
      label: "Mercy pause",
      description: "One breath and a guarded word before reacting.",
      pastoralNote: "Do not wrestle anger alone. Slow the body, soften the voice, and ask Christ to guard your hands and words.",
      practice: "Before answering in anger: one breath, unclench your hands, and pray “Set a watch, O Lord, before my mouth.”",
      primaryAction: "Start a mercy pause",
      target: { section: "pray", tab: "daily" },
    },
    {
      id: "hard-conversations",
      label: "Hard conversations",
      description: "Prepare before difficult people and moments.",
      pastoralNote: "Ask for meekness before you need it. Prepare for difficult people and moments with prayer.",
      practice: "Before a hard conversation, pray for the other person by name and decide to speak slowly.",
      primaryAction: "Pray before a hard moment",
      target: { section: "pray", tab: "prayers" },
    },
    {
      id: "reconciliation",
      label: "Seeking peace",
      description: "Let the day end without lingering resentment.",
      pastoralNote: "Anger loosens its grip when we seek peace. “Let not the sun go down upon your wrath.”",
      practice: "Each evening, name anyone you are angry with, pray for them, and take one small step toward peace.",
      primaryAction: "Begin evening examen",
      target: { section: "pray", tab: "journal" },
    },
  ],
  sleep: [
    {
      id: "descent",
      label: "Quiet descent",
      description: "Put the day down gently before sleep.",
      pastoralNote: "Let the day end without argument. Place unfinished things before God and rest as one held by mercy.",
      practice: "Phone down 30 minutes before bed; end with the Prayer of St. Symeon.",
      primaryAction: "Begin evening stillness",
      target: { section: "pray", tab: "sleep" },
    },
    {
      id: "restless-nights",
      label: "Restless nights",
      description: "For waking in the night or lying awake.",
      pastoralNote: "If sleep will not come, do not fight it. Pray simply until rest returns.",
      practice: "If you wake in the night, pray the Jesus Prayer slowly instead of reaching for the phone.",
      primaryAction: "Open sleep prayers",
      target: { section: "pray", tab: "sleep" },
    },
    {
      id: "compline",
      label: "Compline rule",
      description: "The Church’s prayer at the close of day.",
      pastoralNote: "Small Compline gathers the day into the Church’s evening prayer. Keep it as a gift, not a burden.",
      practice: "Pray Small Compline, or a portion of it, before bed.",
      primaryAction: "Begin evening prayer",
      target: { section: "pray", tab: "prayers" },
    },
  ],
  scripture: [
    {
      id: "daily-gospel",
      label: "Daily readings",
      description: "The Epistle and Gospel the Church appoints today.",
      pastoralNote: "Read less, but read attentively. One verse received with humility can illumine the whole day.",
      practice: "Read the day’s Gospel and carry one line with you.",
      primaryAction: "Open today’s reading",
      target: { section: "read", read: "daily" },
    },
    {
      id: "psalms",
      label: "Pray the Psalms",
      description: "The Church’s oldest prayer book.",
      pastoralNote: "The Psalter has been the Church’s prayer book for centuries. Let its words become your own.",
      practice: "Pray one Psalm each day, slowly, out loud if you can.",
      primaryAction: "Open the Bible",
      target: { section: "read", read: "bible" },
    },
    {
      id: "plan",
      label: "Reading plan",
      description: "Steady reading through a book of Scripture.",
      pastoralNote: "Steady reading through a book of Scripture builds understanding over time.",
      practice: "Follow a reading plan, one chapter a day, with a short prayer before and after.",
      primaryAction: "Open reading plans",
      target: { section: "read", read: "plans" },
    },
  ],
  confession: [
    {
      id: "examen",
      label: "Daily examen",
      description: "A short, hopeful look back at each day.",
      pastoralNote: "Preparation is not self-accusation without hope. It is returning to the Physician with truth and trust.",
      practice: "Each evening, name one thing to thank God for and one thing to bring to confession.",
      primaryAction: "Begin gentle examen",
      target: { section: "pray", tab: "prep" },
    },
    {
      id: "preparing",
      label: "Preparing for confession",
      description: "For the days before you go.",
      pastoralNote: "In the days before confession, look honestly at your life and trust in God’s mercy more than in your own effort.",
      practice: "This week: pray Psalm 50, go through an examen, and write down what you want to bring to your priest.",
      primaryAction: "Open confession preparation",
      target: { section: "pray", tab: "prep" },
    },
    {
      id: "after",
      label: "After confession",
      description: "Keep the peace you received.",
      pastoralNote: "After confession, guard the peace you were given. Keep the first days with thanksgiving.",
      practice: "Give thanks each day, keep any counsel your priest gave, and ask for help where you struggle.",
      primaryAction: "Begin with thanksgiving",
      target: { section: "pray", tab: "daily" },
    },
  ],
  fasting: [
    {
      id: "today",
      label: "Today’s guidance",
      description: "Follow the Church calendar day by day.",
      pastoralNote: "Keep the fast without pride and break it without despair. Let the body learn peace with the soul.",
      practice: "Keep today’s fast as your priest blesses, with mercy for yourself and others.",
      primaryAction: "Read today’s guidance",
      target: { section: "today" },
    },
    {
      id: "season",
      label: "Fasting seasons",
      description: "For Great Lent and the other fasts.",
      pastoralNote: "In fasting seasons, prayer and almsgiving keep the fast from becoming only a diet.",
      practice: "On fast days, add the Prayer of St. Ephraim and one act of almsgiving.",
      primaryAction: "Read today’s guidance",
      target: { section: "today" },
    },
    {
      id: "gentle",
      label: "Gentle fasting",
      description: "When health, duty, or family limit the fast.",
      pastoralNote: "If health, duty, or family needs limit your fast, keep what you can with your priest’s blessing, and keep it in peace.",
      practice: "Choose one small, blessed abstinence and keep it faithfully without comparing yourself to others.",
      primaryAction: "Read today’s guidance",
      target: { section: "today" },
    },
  ],
  exploring: [
    {
      id: "first-steps",
      label: "First steps",
      description: "One prayer, one reading, one act of mercy.",
      pastoralNote: "You do not need to understand everything today. Start with one prayer, one reading, and one act of mercy.",
      practice: "One prayer, one short reading, and one act of mercy, with no pressure.",
      primaryAction: "Take the first step",
      target: { section: "pray", tab: "daily" },
    },
    {
      id: "basics",
      label: "Learn the basics",
      description: "The prayers Orthodox Christians pray every day.",
      pastoralNote: "Begin with the Lord’s Prayer, the Trisagion, and the Creed, the prayers Orthodox Christians pray every day.",
      practice: "Learn one short prayer this week and pray it each morning.",
      primaryAction: "Open the Creed",
      target: { section: "learn", tab: "creed" },
    },
    {
      id: "parish",
      label: "Visit a parish",
      description: "Orthodoxy is lived with others.",
      pastoralNote: "Orthodoxy is lived in community. Often the best next step is to attend the Divine Liturgy.",
      practice: "Find a nearby parish and plan to attend a service.",
      primaryAction: "Find a parish",
      target: { section: "learn", tab: "parish" },
    },
  ],
};

const rhythmCopy: Record<VigilanceRhythm, Pick<RuleOfVigilance, "morning" | "midday" | "evening">> = {
  morning: {
    morning: "Morning Offering, 5 minutes: make the sign of the Cross, pray the Trisagion, and read the day’s Epistle or Gospel.",
    midday: "One-minute watchfulness pause: 12 Jesus Prayers before the next task.",
    evening: "Brief examen: thank God for one mercy, confess one wound, and entrust tomorrow to Him.",
  },
  midday: {
    morning: "Short rising prayer: 'Lord, bless this day and teach me to be watchful.'",
    midday: "Main rule: 33 Jesus Prayers with the chotki, then one line of Scripture.",
    evening: "Compline portion or Psalm 50, kept quietly and without rushing.",
  },
  evening: {
    morning: "One Psalm verse before the phone: receive the day before reacting to it.",
    midday: "Mercy pause: pray for one person you would rather avoid.",
    evening: "Main rule: 10-minute Compline, slow breathing, and the Prayer of St. Symeon.",
  },
  small: {
    morning: "Thirty-second beginning: Cross yourself and say the Jesus Prayer three times.",
    midday: "Tiny return: one deep breath and 'Lord, have mercy' before continuing.",
    evening: "Thirty-second surrender: thank God for one thing and ask forgiveness for one thing.",
  },
};

function pressureLine(role: ResponderMode, needs: VigilanceNeed[]) {
  if (role === "military") return "Under pressure: breathe, check your buddy, obey the next lawful duty, and pray once before reacting.";
  if (role === "law") return "Under pressure: lower your voice, widen your scan, choose restraint, and keep the person before you human.";
  if (role === "fire") return "Under pressure: breathe, check your crew, take the next safe action, and pray for those in danger.";
  if (role === "ems") return "Under pressure: scene, gloves, breath, first impression, then the next protocol step with mercy.";
  if (role === "dispatch") return "Under pressure: shoulders down, voice slower, location and danger first, then one clear instruction.";
  if (role === "custody") return "Under pressure: settled face, fewer words, lawful order, least force needed, and a guarded heart.";
  if (role === "chaplain") return "Under pressure: listen first, speak softly, and remember you are not the Savior.";
  if (needs.includes("anger")) return "Under pressure: unclench your hands, say nothing for one breath, and ask Christ to guard your words.";
  if (needs.includes("sleep")) return "Under pressure: dim the room, put the phone down, breathe slowly, and let the prayer become simple.";
  return "Under pressure: breathe once, pray simply, and take only the next faithful step.";
}

/** The needs a rule was built from, including rules saved before multi-select. */
export function ruleNeeds(rule: Pick<RuleOfVigilance, "need" | "needs">): VigilanceNeed[] {
  return rule.needs?.length ? rule.needs : [rule.need];
}

export function buildRuleOfVigilance({
  need,
  needs,
  rhythm,
  role,
  variant,
}: {
  need?: VigilanceNeed;
  needs?: VigilanceNeed[];
  rhythm: VigilanceRhythm;
  role: ResponderMode;
  variant?: string;
}): RuleOfVigilance {
  const chosen = (needs?.length ? needs : [need ?? "peace"]).slice(0, MAX_VIGILANCE_NEEDS);
  const lead = chosen[0];
  const variants = ruleVariants[lead];
  const picked = variants.find((option) => option.id === variant) ?? variants[0];

  return {
    need: lead,
    needs: chosen,
    rhythm,
    role,
    variant: picked.id,
    variantLabel: picked.label,
    title: needTitles[lead],
    pastoralNote: picked.pastoralNote,
    primaryAction: picked.primaryAction,
    practice: picked.practice,
    target: picked.target,
    also: chosen.slice(1).map((other) => ({ need: other, label: needLabels[other], body: ruleVariants[other][0].practice })),
    ...rhythmCopy[rhythm],
    underPressure: pressureLine(role, chosen),
  };
}

export function getStoredRuleOfVigilance() {
  return getStoredItem<RuleOfVigilance>(RULE_OF_VIGILANCE_STORAGE_KEY);
}

export function setStoredRuleOfVigilance(rule: RuleOfVigilance) {
  setStoredItem(RULE_OF_VIGILANCE_STORAGE_KEY, rule);
  window.dispatchEvent(new CustomEvent(RULE_OF_VIGILANCE_CHANGED_EVENT, { detail: rule }));
}
