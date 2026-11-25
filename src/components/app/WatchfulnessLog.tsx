import { useDailyRhythm } from "@/lib/dailyHabits";

// A private, quiet line about this week: how many days a rule was prayed. No grid, no run of days, nothing to chase.
// A missed day is simply not counted.
export function WatchfulnessLog() {
  const { log } = useDailyRhythm();
  const past = log.flat().filter((day) => !day.future);
  const week = past.slice(-7);
  const kept = week.filter((day) => day.kept).length;
  const line =
    kept === 0
      ? "No prayers marked this week yet. Today is a good day to begin."
      : `You prayed on ${kept === 1 ? "one day" : `${kept} days`} this week. Glory to God.`;

  return (
    <section aria-labelledby="watchfulness-log-title">
      <h2 id="watchfulness-log-title" className="px-1 text-xl">This week</h2>
      <p className="scripture-text mt-1 px-1 text-lg">{line}</p>
    </section>
  );
}
