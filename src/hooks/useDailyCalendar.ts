import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCurrentDay } from "@/hooks/useCurrentDay";
import { useSettings } from "@/hooks/useSettings";
import { fetchDailyData } from "@/lib/orthocal";

export function useDailyCalendar() {
  const today = useCurrentDay();
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
