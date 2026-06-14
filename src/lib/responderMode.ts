import { useEffect, useState } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type ResponderMode = "military" | "law" | "fire" | "ems" | "dispatch" | "custody" | "chaplain";

export const DEFAULT_RESPONDER_MODE: ResponderMode = "military";
export const RESPONDER_MODE_STORAGE_KEY = "nepsis:responder-mode";
export const RESPONDER_MODE_CHANGED_EVENT = "nepsis:responder-mode-changed";

export const responderModeOrder: ResponderMode[] = ["military", "law", "fire", "ems", "dispatch", "custody", "chaplain"];

export const responderModeLabels: Record<ResponderMode, string> = {
  military: "Military",
  law: "Law enforcement",
  fire: "Fire & rescue",
  ems: "EMS / medical",
  dispatch: "Dispatch / comms",
  custody: "Corrections / custody",
  chaplain: "Chaplain / peer support",
};

export const responderModeShortLabels: Record<ResponderMode, string> = {
  military: "Military",
  law: "Law",
  fire: "Fire",
  ems: "EMS",
  dispatch: "Dispatch",
  custody: "Custody",
  chaplain: "Chaplain",
};

export const responderModeAccentClasses: Record<ResponderMode, {
  card: string;
  badge: string;
  icon: string;
  button: string;
  soft: string;
}> = {
  military: {
    card: "border-lime-700/30 bg-gradient-to-br from-lime-700/10 via-card to-stone-500/10",
    badge: "border-lime-700/30 bg-lime-700/10 text-lime-900 dark:text-lime-300",
    icon: "bg-lime-700/10 text-lime-900 ring-1 ring-lime-700/25 dark:text-lime-300",
    button: "bg-lime-800 text-white hover:bg-lime-900 dark:bg-lime-400 dark:text-lime-950 dark:hover:bg-lime-300",
    soft: "border-lime-700/20 bg-lime-700/10",
  },
  law: {
    card: "border-blue-950/35 bg-gradient-to-br from-blue-950/15 via-card to-blue-900/10 dark:border-blue-400/25 dark:from-blue-950/50 dark:to-blue-800/20",
    badge: "border-blue-950/30 bg-blue-950/10 text-blue-950 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-200",
    icon: "bg-blue-950/10 text-blue-950 ring-1 ring-blue-950/25 dark:bg-blue-400/10 dark:text-blue-200 dark:ring-blue-400/25",
    button: "bg-blue-950 text-white hover:bg-blue-900 dark:bg-blue-500 dark:text-blue-950 dark:hover:bg-blue-400",
    soft: "border-blue-950/20 bg-blue-950/10 dark:border-blue-400/20 dark:bg-blue-400/10",
  },
  fire: {
    card: "border-red-500/30 bg-gradient-to-br from-red-500/10 via-card to-orange-500/10",
    badge: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    icon: "bg-red-500/10 text-red-700 ring-1 ring-red-500/25 dark:text-red-300",
    button: "bg-red-700 text-white hover:bg-red-800 dark:bg-red-500 dark:text-red-950 dark:hover:bg-red-400",
    soft: "border-red-500/20 bg-red-500/10",
  },
  ems: {
    card: "border-slate-200 bg-gradient-to-br from-white via-card to-red-500/5 dark:border-white/20 dark:from-white/10 dark:via-card dark:to-red-500/10",
    badge: "border-slate-200 bg-white text-slate-900 dark:border-white/20 dark:bg-white/10 dark:text-white",
    icon: "bg-white text-red-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-red-300 dark:ring-white/20",
    button: "bg-white text-slate-950 ring-1 ring-slate-300 hover:bg-slate-100 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
    soft: "border-slate-200 bg-white/80 dark:border-white/20 dark:bg-white/10",
  },
  dispatch: {
    card: "border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-card to-fuchsia-500/10",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    icon: "bg-violet-500/10 text-violet-700 ring-1 ring-violet-500/25 dark:text-violet-300",
    button: "bg-violet-700 text-white hover:bg-violet-800 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400",
    soft: "border-violet-500/20 bg-violet-500/10",
  },
  custody: {
    card: "border-slate-500/30 bg-gradient-to-br from-slate-500/10 via-card to-zinc-500/10",
    badge: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    icon: "bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/25 dark:text-slate-300",
    button: "bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-300 dark:text-slate-950 dark:hover:bg-slate-200",
    soft: "border-slate-500/20 bg-slate-500/10",
  },
  chaplain: {
    card: "border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-yellow-500/10",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
    icon: "bg-amber-500/10 text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-300",
    button: "bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300",
    soft: "border-amber-500/20 bg-amber-500/10",
  },
};

export function isResponderMode(value: unknown): value is ResponderMode {
  return typeof value === "string" && responderModeOrder.includes(value as ResponderMode);
}

export function getStoredResponderMode(): ResponderMode {
  const stored = getStoredItem<ResponderMode>(RESPONDER_MODE_STORAGE_KEY);
  return isResponderMode(stored) ? stored : DEFAULT_RESPONDER_MODE;
}

export function setStoredResponderMode(mode: ResponderMode) {
  setStoredItem(RESPONDER_MODE_STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent(RESPONDER_MODE_CHANGED_EVENT, { detail: mode }));
}

export function useResponderMode() {
  const [mode, setModeState] = useState<ResponderMode>(() => getStoredResponderMode());

  useEffect(() => {
    function sync(event: Event) {
      const next = event instanceof CustomEvent && isResponderMode(event.detail)
        ? event.detail
        : getStoredResponderMode();
      setModeState(next);
    }

    window.addEventListener(RESPONDER_MODE_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(RESPONDER_MODE_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function setMode(next: ResponderMode) {
    setStoredResponderMode(next);
    setModeState(next);
  }

  return [mode, setMode] as const;
}
