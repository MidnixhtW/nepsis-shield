import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "red-dark");
    root.classList.add("dark");
    root.removeAttribute("data-liturgical-mode");
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      storageKey="ortho-companion:tactical-appearance"
      themes={["dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
