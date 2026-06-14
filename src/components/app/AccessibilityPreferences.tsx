import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";

export function AccessibilityPreferences() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-large-text", settings.accessibility.largeText);
    root.classList.toggle("a11y-high-contrast", settings.accessibility.highContrast);
    root.classList.toggle("a11y-reduce-motion", settings.accessibility.reduceMotion);

    return () => {
      root.classList.remove("a11y-large-text", "a11y-high-contrast", "a11y-reduce-motion");
    };
  }, [settings.accessibility.highContrast, settings.accessibility.largeText, settings.accessibility.reduceMotion]);

  return null;
}
