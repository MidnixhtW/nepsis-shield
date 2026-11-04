import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export const APP_THEMES = ["dark", "parchment", "red-dark", "blue-cream", "lenten", "midnight", "paschal"] as const;

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange
      storageKey="ortho-companion:tactical-appearance"
      themes={[...APP_THEMES]}
    >
      <ThemeClassSync />
      {children}
    </NextThemesProvider>
  );
}
