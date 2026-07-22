import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("red-dark");
    root.removeAttribute("data-liturgical-mode");
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="ortho-companion:appearance-v2"
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
