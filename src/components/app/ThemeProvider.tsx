import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export const APP_THEMES = ["dark", "red-dark", "blue-cream"] as const;
export type AppTheme = (typeof APP_THEMES)[number];

function ThemeClassSync() {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark" || theme === "red-dark",
    );
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
