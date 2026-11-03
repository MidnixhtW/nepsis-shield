function escapeText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function toIcsDate(dt: Date) {
  // UTC form YYYYMMDDTHHMMSSZ
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  const hh = String(dt.getUTCHours()).padStart(2, "0");
  const mm = String(dt.getUTCMinutes()).padStart(2, "0");
  const ss = String(dt.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

export function createSimpleIcs(opts: {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  dailyReminder?: boolean;
}) {
  const uid = `${Math.random().toString(16).slice(2)}@orthocompanion`;
  const dtstamp = toIcsDate(new Date());
  // Floating local times keep recurring prayer reminders at the chosen hour through DST.
  const eventDate = (date: Date) => opts.dailyReminder
    ? `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`
    : toIcsDate(date);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nepsis Shield//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${eventDate(opts.start)}`,
    `DTEND:${eventDate(opts.end)}`,
    `SUMMARY:${escapeText(opts.title)}`,
    opts.description ? `DESCRIPTION:${escapeText(opts.description)}` : null,
    ...(opts.dailyReminder ? ["RRULE:FREQ=DAILY", "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:PT0M", `DESCRIPTION:${escapeText(opts.title)}`, "END:VALARM"] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n") + "\r\n";
}

function toIcsDay(date: Date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

/** All-day events, each with an alert at 6 PM the evening before (e.g. when a fast begins). */
export function createAllDayEventsIcs(events: Array<{ uid: string; title: string; description?: string; date: Date; yearly?: boolean }>) {
  const dtstamp = toIcsDate(new Date());
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Nepsis Shield//EN", "CALSCALE:GREGORIAN"];
  for (const event of events) {
    const next = new Date(event.date);
    next.setDate(next.getDate() + 1);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}@nepsisshield`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${toIcsDay(event.date)}`,
      `DTEND;VALUE=DATE:${toIcsDay(next)}`,
      `SUMMARY:${escapeText(event.title)}`,
      ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
      ...(event.yearly ? ["RRULE:FREQ=YEARLY"] : []),
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "TRIGGER:-PT6H",
      `DESCRIPTION:${escapeText(event.title)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

export function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
