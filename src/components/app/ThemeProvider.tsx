import * as React from "react";
import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type LiturgicalMode = "liturgy" | "vespers";

function modeForHour(hour: number): LiturgicalMode {
  return hour >= 18 || hour < 6 ? "vespers" : "liturgy";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LiturgicalMode>(() => modeForHour(new Date().getHours()));

  useEffect(() => {
    function syncMode() {
      const nextMode = modeForHour(new Date().getHours());
      setMode(nextMode);
      document.documentElement.classList.remove("red-dark");
      document.documentElement.dataset.liturgicalMode = nextMode;
    }

    syncMode();
    const interval = window.setInterval(syncMode, 5 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme={mode === "vespers" ? "dark" : "light"}
      enableSystem={false}
      storageKey="ortho-companion:liturgical-mode"
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
