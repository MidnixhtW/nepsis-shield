import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { useSettings } from "@/hooks/useSettings";
import { liturgicalSeason } from "@/lib/liturgicalSeason";
import { useResponderMode } from "@/lib/responderMode";

export const APP_THEMES = ["seasonal", "dark", "parchment", "red-dark", "blue-cream", "lenten", "midnight", "paschal"] as const;

/** New installs follow the Church year; a Military role starts on Olive & Brass (see first-time setup). */
export const DEFAULT_THEME: AppTheme = "seasonal";

/** Themes with a light background; the rest are dark. */
export const LIGHT_THEMES: readonly string[] = ["parchment", "blue-cream", "paschal"];
export type AppTheme = (typeof APP_THEMES)[number];

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
      <SeasonalThemeSync />
      {children}
    </NextThemesProvider>
  );
}
