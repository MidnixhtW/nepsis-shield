import { useEffect } from "react";
import { useNavigate } from "react-router";
import { onReminderTap } from "@/lib/systemPrayerReminders";

// In the Android app, tapping a prayer reminder opens that prayer instead of just the app.
export function ReminderTapRouter() {
  const navigate = useNavigate();
  useEffect(() => onReminderTap((to) => navigate(to)), [navigate]);
  return null;
}
