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
