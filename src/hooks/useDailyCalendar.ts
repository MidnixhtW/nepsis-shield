import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { useSettings } from "@/hooks/useSettings";
import { fetchDailyData } from "@/lib/orthocal";

/** The Church calendar for today, or for `offsetDays` before or after it (the readings can look back a week). */
export function useDailyCalendar(offsetDays = 0) {
  const current = useCurrentDay();
  const today = offsetDays ? addDays(current, offsetDays) : current;
  const { settings } = useSettings();
  const forceRefresh = useRef(false);
  const query = useQuery({
    queryKey: ["daily", settings.calendarMode, format(today, "yyyy-MM-dd")],
    queryFn: () => fetchDailyData(today, settings.calendarMode, forceRefresh.current),
    retry: 1,
  });

  async function retry() {
    forceRefresh.current = true;
    try {
      await query.refetch();
    } finally {
      forceRefresh.current = false;
    }
  }

  return { today, settings, query, retry };
}
