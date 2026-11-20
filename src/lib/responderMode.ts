import { useEffect, useState } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

export type ResponderMode = "civilian" | "military" | "law" | "fire" | "ems" | "dispatch" | "custody" | "chaplain";

export const DEFAULT_RESPONDER_MODE: ResponderMode = "civilian";
export const RESPONDER_MODE_STORAGE_KEY = "nepsis:responder-mode";
export const RESPONDER_MODE_CHANGED_EVENT = "nepsis:responder-mode-changed";

// Everyday life comes first: the app is for everyone, with added support for those who serve.
export const responderModeOrder: ResponderMode[] = ["civilian", "military", "law", "fire", "ems", "dispatch", "custody", "chaplain"];

export const responderModeLabels: Record<ResponderMode, string> = {
  military: "Military",
  law: "Law enforcement",
  fire: "Fire & rescue",

  ems: "EMS / medical",
  dispatch: "Dispatch / comms",
  custody: "Corrections / custody",
  chaplain: "Chaplain / peer support",
  civilian: "Everyday life",
};

export const responderModeAccentClasses: Record<ResponderMode, {
  card: string;
  badge: string;
  icon: string;
  button: string;
  soft: string;
}> = {
  military: {
    card: "border-success/40 bg-gradient-to-br from-success/16 via-card to-card/14",
    badge: "border-success/40 bg-success/[0.14] text-success dark:text-success",
    icon: "bg-success/[0.14] text-success ring-1 ring-byzantine-blue/[0.46] dark:text-success",
    button: "bg-success/[0.14] text-white hover:bg-success/[0.14] dark:bg-success/[0.14] dark:text-success dark:hover:bg-success/[0.14]",
    soft: "border-success/40 bg-success/[0.14]",
  },
  law: {
    card: "border-accent/40 bg-gradient-to-br from-accent/15 via-card to-accent/10 dark:border-accent/40 dark:from-accent/50 dark:to-accent/20",
    badge: "border-accent/40 bg-accent/[0.14] text-accent dark:border-accent/40 dark:bg-accent/[0.14] dark:text-accent",
    icon: "bg-accent/[0.14] text-accent ring-1 ring-byzantine-blue/[0.46] dark:bg-accent/[0.14] dark:text-accent dark:ring-byzantine-blue/[0.46]",
    button: "bg-accent/[0.14] text-white hover:bg-accent/[0.14] dark:bg-accent/[0.14] dark:text-accent dark:hover:bg-accent/[0.14]",
    soft: "border-accent/40 bg-accent/[0.14] dark:border-accent/40 dark:bg-accent/[0.14]",
  },
  fire: {
    card: "border-cinnabar/[0.44] bg-gradient-to-br from-cinnabar/16 via-card to-cinnabar/15",
    badge: "border-cinnabar/[0.44] bg-cinnabar/[0.14] text-cinnabar dark:text-cinnabar",
    icon: "bg-cinnabar/[0.14] text-cinnabar ring-1 ring-cinnabar/[0.48] dark:text-cinnabar",
    button: "bg-cinnabar/[0.14] text-white hover:bg-cinnabar/[0.14] dark:bg-cinnabar/[0.14] dark:text-cinnabar dark:hover:bg-cinnabar/[0.14]",
    soft: "border-cinnabar/[0.44] bg-cinnabar/[0.14]",
  },
  ems: {
    card: "border-border/[0.72] bg-gradient-to-br from-white via-card to-cinnabar/5 dark:border-border/[0.72] dark:from-white/10 dark:via-card dark:to-cinnabar/10",
    badge: "border-border/[0.72] bg-white text-foreground dark:border-border/[0.72] dark:bg-white/10 dark:text-white",
    icon: "bg-white text-cinnabar ring-1 ring-ring/[0.48] dark:bg-white/10 dark:text-cinnabar dark:ring-ring/[0.48]",
    button: "bg-white text-foreground ring-1 ring-ring/[0.48] hover:bg-card dark:bg-white dark:text-foreground dark:hover:bg-card",
    soft: "border-border/[0.72] bg-white/80 dark:border-border/[0.72] dark:bg-white/10",
  },
  dispatch: {
    card: "border-border/[0.72] bg-gradient-to-br from-primary/16 via-card to-primary/15",
    badge: "border-border/[0.72] bg-secondary/[0.48] text-primary dark:text-primary",
    icon: "bg-secondary/[0.48] text-primary ring-1 ring-ring/[0.48] dark:text-primary",
    button: "bg-secondary/[0.48] text-white hover:bg-secondary/[0.48] dark:bg-secondary/[0.48] dark:text-primary dark:hover:bg-secondary/[0.48]",
    soft: "border-border/[0.72] bg-secondary/[0.48]",
  },
  custody: {
    card: "border-border/[0.72] bg-gradient-to-br from-card/10 via-card to-card/10",
    badge: "border-border/[0.72] bg-card text-foreground dark:text-foreground",
    icon: "bg-card text-foreground ring-1 ring-ring/[0.48] dark:text-foreground",
    button: "bg-card text-white hover:bg-card dark:bg-card dark:text-foreground dark:hover:bg-card",
    soft: "border-border/[0.72] bg-card",
  },
  chaplain: {
    card: "border-icon-gold/[0.58] bg-gradient-to-br from-icon-gold/16 via-card to-icon-gold/16",
    badge: "border-icon-gold/[0.58] bg-secondary/[0.58] text-liturgical-warm dark:text-liturgical-warm",
    icon: "bg-secondary/[0.58] text-liturgical-warm ring-1 ring-icon-gold/50 dark:text-liturgical-warm",
    button: "bg-secondary/[0.58] text-white hover:bg-secondary/[0.58] dark:bg-secondary/[0.58] dark:text-liturgical-warm dark:hover:bg-secondary/[0.58]",
    soft: "border-icon-gold/[0.58] bg-secondary/[0.58]",
  },
  civilian: {
    card: "border-primary/25 bg-gradient-to-br from-primary/12 via-card to-card/10 candlelight-card",
    badge: "border-primary/35 bg-primary/12 text-liturgical-warm dark:text-liturgical-warm",
    icon: "bg-primary/12 text-liturgical-warm ring-1 ring-primary/30 dark:text-liturgical-warm",
    button: "gold-foil text-primary-foreground hover:brightness-110",
    soft: "border-primary/20 bg-primary/10",
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
