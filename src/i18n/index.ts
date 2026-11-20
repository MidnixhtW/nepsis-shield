// Interface translation. English (en.ts) is the source; each other language is a file with the same keys.
//
// To add a language, have a fluent speaker (ideally a parish member) translate en.ts into, say, el.ts typed
// `Messages`, so a missing key fails the type check; add it to CATALOGS below; then offer it in Settings.
// Until then the app runs in English only, and `t` returns English for any key a catalog lacks.
import { en, type MessageKey, type Messages } from "@/i18n/en";

export type UiLanguage = "en";

const CATALOGS: Record<UiLanguage, Messages> = { en };

let current: UiLanguage = "en";

export function setUiLanguage(language: UiLanguage) {
  current = language;
  if (typeof document !== "undefined") document.documentElement.lang = language;
}

/** The interface text for a key, with {name} placeholders filled from `vars`. */
export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const text = CATALOGS[current]?.[key] ?? en[key];
  return vars ? text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match)) : text;
}

export type { MessageKey };
