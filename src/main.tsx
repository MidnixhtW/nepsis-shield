import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// Alegreya (a calligraphic book face, close to a printed service book) for prayers, Scripture and titles; Atkinson Hyperlegible Next for controls
// and small labels; condensed Barlow only for the duty tools in a service role.
import "@fontsource-variable/alegreya/wght.css";
import "@fontsource-variable/alegreya/wght-italic.css";
import "@fontsource-variable/atkinson-hyperlegible-next/wght.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "./globals.css";
import { announceUpdate, checkAndroidUpdate } from "@/lib/appUpdate";
import { refreshWebPushOnOpen } from "@/lib/webPush";
import { getStoredItem } from "@/lib/deviceStorage";
import { REMINDER_PREFS_KEY } from "@/lib/prayerReminderPrefs";

const TILE_ART = ["/icons/tiles/anastasis.webp", "/icons/tiles/annunciation.webp", "/icons/tiles/dormition.webp", "/icons/tiles/george.webp", "/icons/tiles/ladder.webp", "/icons/tiles/lamentation.webp", "/icons/tiles/michael.webp", "/icons/tiles/nativity.webp", "/icons/tiles/nicholas.webp", "/icons/tiles/pantocrator.webp", "/icons/tiles/pentecost.webp", "/icons/tiles/theophany.webp", "/icons/tiles/theotokos.webp", "/icons/tiles/transfiguration.webp"];

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
        // The icons on Pray and Learn too, so those rows show pictures with no signal even if they were never opened.
        setTimeout(() => ready.active?.postMessage({ type: "cache-urls", urls: TILE_ART }), 25000);
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
