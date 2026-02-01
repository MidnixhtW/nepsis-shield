import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // next-themes gives us class-based theming for shadcn (dark/light).
  // Default stays dark (as requested).
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="ortho-companion:theme"
    >
      {children}
    </NextThemesProvider>
  );
}