import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Newsreader (a serif cut for reading, with optical sizes) for prayers, Scripture and titles; Geist for controls
// and small labels; condensed Barlow only for the duty tools in a service role.
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/geist/wght.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
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
      // Hand the worker every script and style this first visit already loaded (plus Today, warmed on idle),
      // so the app opens offline even if the person only ever saw the landing page.
      navigator.serviceWorker.ready.then((ready) => {
        const send = () => {
          const urls = performance.getEntriesByType("resource").map((entry) => entry.name)
            .filter((url) => url.startsWith(window.location.origin + "/assets/"));
          ready.active?.postMessage({ type: "cache-urls", urls });
        };
        // Twice, so the tabs fetched on idle after the first screen are kept too.
        setTimeout(send, 6000);
        setTimeout(send, 20000);
      }).catch(() => {});
      // Look for a new version whenever the app comes back to the screen, not only on a fresh load.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update().catch(() => {});
      });
    }).catch(() => {
      // Offline support is best-effort; the app should still run if registration fails.
    });
  });
}
