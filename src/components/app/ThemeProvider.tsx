import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { useSettings } from "@/hooks/useSettings";
import { liturgicalSeason } from "@/lib/liturgicalSeason";
import { useResponderMode } from "@/lib/responderMode";
import { useNow } from "@/lib/prayerHours";
import { getStoredItem } from "@/lib/deviceStorage";

export const APP_THEMES = ["seasonal", "seasonal-light", "dark", "parchment", "red-dark", "blue-cream", "lenten", "midnight", "paschal"] as const;

/** New installs follow the Church year; a Military role starts on Olive & Brass (see first-time setup). */
export const DEFAULT_THEME: AppTheme = "seasonal";

/** Themes with a light background; the rest are dark. */
export const LIGHT_THEMES: readonly string[] = ["parchment", "blue-cream", "paschal", "seasonal-light"];
export type AppTheme = (typeof APP_THEMES)[number];

/** Set when the person picks a palette. Until then the Church Year theme follows the phone's light or dark mode. */
export const THEME_CHOSEN_KEY = "nepsis:theme-chosen";
const LIGHT_QUERY = "(prefers-color-scheme: light)";

export function systemChurchYearTheme(): AppTheme {
  return typeof window !== "undefined" && window.matchMedia?.(LIGHT_QUERY).matches ? "seasonal-light" : "seasonal";
}

/** True while nobody has picked a palette: the Church Year theme, light or dark as the phone is. */
export function followsSystemAppearance(theme: string | undefined) {
  if (getStoredItem<boolean>(THEME_CHOSEN_KEY)) return false;
  return !theme || theme === "seasonal" || theme === "seasonal-light";
}

function SystemAppearanceSync() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    if (!followsSystemAppearance(theme)) return;
    const query = window.matchMedia?.(LIGHT_QUERY);
    const apply = () => {
      const next = systemChurchYearTheme();
      if (next !== theme) setTheme(next);
    };
    apply();
    query?.addEventListener?.("change", apply);
    return () => query?.removeEventListener?.("change", apply);
  }, [theme, setTheme]);
  return null;
}

function ThemeClassSync() {
  const { theme } = useTheme();

  // Dark themes also need the "dark" class (Tailwind's dark: styles). next-themes rewrites the class list
  // when the theme changes, which can drop it, so put it back whenever the classes change.
  useEffect(() => {
    const root = document.documentElement;
    const shouldBeDark = !!theme && !LIGHT_THEMES.includes(theme);
    const sync = () => {
      if (root.classList.contains("dark") !== shouldBeDark) root.classList.toggle("dark", shouldBeDark);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [theme]);

  return null;
}

// The Church Year theme reads the season and the service role from <html data-season data-role>.
// Both are kept current here (the season changes at midnight, the role whenever it is changed).
/** The light of the hour: dawn, day, evening (the lamp-lighting of Vespers) and night. Read by styles/hour-light.css. */
export function hourLight(date: Date) {
  const hour = date.getHours();
  if (hour >= 4 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function HourLightSync() {
  const now = useNow();
  const light = hourLight(now);
  useEffect(() => {
    document.documentElement.dataset.hour = light;
  }, [light]);
  return null;
}

function SeasonalThemeSync() {
  const today = useCurrentDay();
  const { settings } = useSettings();
  const [role] = useResponderMode();
  const season = liturgicalSeason(today, settings.calendarMode);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.season = season;
    if (role === "civilian") delete root.dataset.role;
    else root.dataset.role = role;
  }, [season, role]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
      storageKey="ortho-companion:tactical-appearance"
      themes={[...APP_THEMES]}
    >
      <ThemeClassSync />
      <SystemAppearanceSync />
      <SeasonalThemeSync />
      <HourLightSync />
      {children}
    </NextThemesProvider>
  );
}
