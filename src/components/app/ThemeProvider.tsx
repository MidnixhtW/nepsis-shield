import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export const APP_THEMES = ["dark", "light", "red-dark", "police", "fire", "ems", "dispatch", "corrections"] as const;

function ThemeClassSync() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const darkLike = theme !== "light";
    root.classList.toggle("dark", darkLike);
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
      themes={[...APP_THEMES]}
    >
      <ThemeClassSync />
      {children}
    </NextThemesProvider>
  );
}