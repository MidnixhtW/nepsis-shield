import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Capacitor } from "@capacitor/core";

// Saved by MainActivity when the home-screen widget's Begin button opens the app (scripts/apply-android-widget.mjs).
export const WIDGET_ROUTE_KEY = "widget:route";

// In the Android app, the widget's Begin button opens the prayers for the hour instead of just the app.
export function WidgetRouteRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let alive = true;

    async function openSavedRoute() {
      try {
        const { Preferences } = await import("@capacitor/preferences");
        const { value } = await Preferences.get({ key: WIDGET_ROUTE_KEY });
        if (!value || !value.startsWith("/")) return;
        await Preferences.remove({ key: WIDGET_ROUTE_KEY });
        if (alive) navigate(value);
      } catch {
        // Without the route the app simply opens where it was.
      }
    }

    function onVisible() {
      if (document.visibilityState === "visible") void openSavedRoute();
    }

    void openSavedRoute();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [navigate]);

  return null;
}
