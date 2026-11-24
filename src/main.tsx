import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/400-italic.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow/700.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/literata/400.css";
import "@fontsource/literata/400-italic.css";
import "@fontsource/literata/600.css";
import "./globals.css";
import { announceUpdate, checkAndroidUpdate } from "@/lib/appUpdate";
import { refreshWebPushOnOpen } from "@/lib/webPush";
import { getStoredItem } from "@/lib/deviceStorage";
import { REMINDER_PREFS_KEY } from "@/lib/prayerReminderPrefs";

createRoot(document.getElementById("root")!).render(<App />);

// The Android app asks once a day whether a newer version is out.
void checkAndroidUpdate();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  // A new version takes over in the background. When it does on a page that was already running, say so and offer a
  // refresh, rather than reloading in the middle of someone's prayer.
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hadController) announceUpdate();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      void refreshWebPushOnOpen(getStoredItem(REMINDER_PREFS_KEY));
      // Look for a new version whenever the app comes back to the screen, not only on a fresh load.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update().catch(() => {});
      });
    }).catch(() => {
      // Offline support is best-effort; the app should still run if registration fails.
    });
  });
}
