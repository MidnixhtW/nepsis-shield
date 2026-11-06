import { useEffect } from "react";
import { useSettings } from "@/hooks/useSettings";
import { fillOfflineWindow, registerBackgroundRefill } from "@/lib/offlineDays";

// Keeps the next two weeks of the Church calendar on the device: shortly after the app opens, whenever the
// connection comes back, and when the calendar (New or Old) changes. Renders nothing.
export function OfflineDaysKeeper() {
  const { settings } = useSettings();
  const mode = settings.calendarMode;

  useEffect(() => {
    let cancelled = false;
    const fill = () => {
      if (!cancelled) void fillOfflineWindow(mode);
    };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(fill, { timeout: 4000 }) : window.setTimeout(fill, 1500);
    window.addEventListener("online", fill);
    void registerBackgroundRefill();
    return () => {
      cancelled = true;
      if (!idle) window.clearTimeout(handle);
      window.removeEventListener("online", fill);
    };
  }, [mode]);

  return null;
}
