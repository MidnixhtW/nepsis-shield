import { useEffect, useState } from "react";
import { format } from "date-fns";

export function useCurrentDay() {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function refresh() {
      const now = new Date();
      setToday((previous) => format(previous, "yyyy-MM-dd") === format(now, "yyyy-MM-dd") ? previous : now);
      clearTimeout(timer);
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 100);
    }
    function onVisible() {
      if (document.visibilityState === "visible") refresh();
    }
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return today;
}
