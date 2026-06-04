import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

const APP_THEMES = ["dark", "light", "red-dark"];

function ThemeClassSync() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "red-dark") root.classList.add("dark");
  }, [theme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="ortho-companion:theme"
      themes={APP_THEMES}
    >
      <ThemeClassSync />
      {children}
    </NextThemesProvider>
  );
}