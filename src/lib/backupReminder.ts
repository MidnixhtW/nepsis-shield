import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";

/** Set after a successful encrypted export on the Privacy page. */
export const LAST_BACKUP_KEY = "backup:last-export";
const FIRST_SEEN_KEY = "backup:first-seen";
const SNOOZE_UNTIL_KEY = "backup:snooze-until";

const DAY_MS = 86_400_000;
export const BACKUP_INTERVAL_DAYS = 30;

export function recordBackup(now = Date.now()) {
  setStoredItem(LAST_BACKUP_KEY, now);
}

export function snoozeBackupReminder(now = Date.now()) {
  setStoredItem(SNOOZE_UNTIL_KEY, now + BACKUP_INTERVAL_DAYS * DAY_MS);
}

/**
 * Everything lives only on this device, so remind about a backup once a month:
 * counted from the last export, or from first use if there has never been one.
 */
export function isBackupDue(now = Date.now()) {
  let firstSeen = getStoredItem<number>(FIRST_SEEN_KEY);
  if (!firstSeen) {
    firstSeen = now;
    setStoredItem(FIRST_SEEN_KEY, now);
  }
  const snoozeUntil = getStoredItem<number>(SNOOZE_UNTIL_KEY) ?? 0;
  if (now < snoozeUntil) return false;
  const since = getStoredItem<number>(LAST_BACKUP_KEY) ?? firstSeen;
  return now - since >= BACKUP_INTERVAL_DAYS * DAY_MS;
}
