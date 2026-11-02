import { useCallback, useEffect, useState } from "react";
import { getScheduledPrayerReminders, type ScheduledPrayerReminders } from "@/lib/systemPrayerReminders";

export function usePrayerReminderStatus() {
  const [scheduled, setScheduled] = useState<ScheduledPrayerReminders>({});
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);
  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      setScheduled(await getScheduledPrayerReminders());
      setError(false);
    } catch {
      setError(true);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === "visible") void refresh();
    }
    void refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return { scheduled, checking, error, refresh };
}
