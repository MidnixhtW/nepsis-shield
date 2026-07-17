import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { ResponderMode } from "@/lib/responderMode";

export const RULE_OF_VIGILANCE_STORAGE_KEY = "nepsis:rule-of-vigilance";
export const RULE_OF_VIGILANCE_CHANGED_EVENT = "nepsis:rule-of-vigilance-changed";

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

export type RuleOfVigilance = {
  need: VigilanceNeed;
  rhythm: VigilanceRhythm;
  role: ResponderMode;
  title: string;
  pastoralNote: string;
  morning: string;
  midday: string;
  evening: string;
  underPressure: string;
  primaryAction: string;
};

const needCopy: Record<VigilanceNeed, Pick<RuleOfVigilance, "title" | "pastoralNote" | "primaryAction">> = {
  peace: {
    title: "Rule for Peace of Heart",
    pastoralNote: "Begin gently. The goal is not to feel perfect, but to return to Christ one breath at a time.",
    primaryAction: "Begin with one quiet prayer",
  },
  discipline: {
    title: "Rule for Steady Prayer",
    pastoralNote: "Small obedience kept daily is stronger than a large rule abandoned in discouragement.",
    primaryAction: "Begin today’s rule",
  },
  anger: {
    title: "Rule for Meek Strength",
    pastoralNote: "Do not wrestle anger alone. Slow the body, soften the voice, and ask Christ to guard your hands and words.",
    primaryAction: "Start a mercy pause",
  },
  sleep: {
    title: "Rule for Night Stillness",
    pastoralNote: "Let the day end without argument. Place unfinished things before God and rest as one held by mercy.",
    primaryAction: "Begin evening stillness",
  },
  scripture: {
    title: "Rule for Scripture Habit",
    pastoralNote: "Read less, but read attentively. One verse received with humility can illumine the whole day.",
    primaryAction: "Open today’s reading",
  },
  confession: {
    title: "Rule for Honest Return",
    pastoralNote: "Preparation is not self-accusation without hope. It is returning to the Physician with truth and trust.",
    primaryAction: "Begin gentle examen",
  },
  fasting: {
    title: "Rule for Embodied Watchfulness",
    pastoralNote: "Keep the fast without pride and break it without despair. Let the body learn peace with the soul.",
    primaryAction: "Read today’s guidance",
  },
  exploring: {
    title: "Rule for First Steps",
    pastoralNote: "You do not need to understand everything today. Start with one prayer, one reading, and one act of mercy.",
    primaryAction: "Take the first step",
  },
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

function pressureLine(role: ResponderMode, need: VigilanceNeed) {
  if (role === "military") return "Under pressure: breathe, check your buddy, obey the next lawful duty, and pray once before reacting.";
  if (role === "law") return "Under pressure: lower your voice, widen your scan, choose restraint, and keep the person before you human.";
  if (role === "fire") return "Under pressure: breathe, check your crew, take the next safe action, and pray for those in danger.";
  if (role === "ems") return "Under pressure: scene, gloves, breath, first impression, then the next protocol step with mercy.";
  if (role === "dispatch") return "Under pressure: shoulders down, voice slower, location and danger first, then one clear instruction.";
  if (role === "custody") return "Under pressure: settled face, fewer words, lawful order, least force needed, and a guarded heart.";
  if (role === "chaplain") return "Under pressure: listen first, speak softly, and remember you are not the Savior.";
  if (need === "anger") return "Under pressure: unclench your hands, say nothing for one breath, and ask Christ to guard your words.";
  if (need === "sleep") return "Under pressure: dim the room, put the phone down, breathe slowly, and let the prayer become simple.";
  return "Under pressure: breathe once, pray simply, and take only the next faithful step.";
}

export function buildRuleOfVigilance({
  need,
  rhythm,
  role,
}: {
  need: VigilanceNeed;
  rhythm: VigilanceRhythm;
  role: ResponderMode;
}): RuleOfVigilance {
  return {
    need,
    rhythm,
    role,
    ...needCopy[need],
    ...rhythmCopy[rhythm],
    underPressure: pressureLine(role, need),
  };
}

export function getStoredRuleOfVigilance() {
  return getStoredItem<RuleOfVigilance>(RULE_OF_VIGILANCE_STORAGE_KEY);
}

export function setStoredRuleOfVigilance(rule: RuleOfVigilance) {
  setStoredItem(RULE_OF_VIGILANCE_STORAGE_KEY, rule);
  window.dispatchEvent(new CustomEvent(RULE_OF_VIGILANCE_CHANGED_EVENT, { detail: rule }));
}
