import { useEffect } from "react";
import { useNavigate } from "react-router";
import { onReminderTap, refreshPrayerReminders } from "@/lib/systemPrayerReminders";
import { refreshAppReminders } from "@/lib/appReminders";
import { COMMEMORATIONS_CHANGED_EVENT } from "@/lib/commemorations";

// In the Android app, tapping a prayer reminder opens that prayer instead of just the app, and opening the app keeps
// the reminders naming their days.
export function ReminderTapRouter() {
  const navigate = useNavigate();
  useEffect(() => onReminderTap((to) => navigate(to)), [navigate]);
  // Each open rolls the next two weeks of reminders forward, so they keep naming their days.
  useEffect(() => {
    void refreshPrayerReminders().catch(() => {});
    void refreshAppReminders();
    // The lamps reminder names how many names are on the prayer list, so re-plan when the list changes.
    const replan = () => void refreshAppReminders();
    window.addEventListener(COMMEMORATIONS_CHANGED_EVENT, replan);
    return () => window.removeEventListener(COMMEMORATIONS_CHANGED_EVENT, replan);
  }, []);
  return null;
}
