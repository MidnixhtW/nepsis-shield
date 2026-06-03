type WrappedValue<T> = {
  __wrapped: 1;
  v: T;
  ts: number;
  exp?: number;
};

function now() {
  return Date.now();
}

function safeGetItem(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore (quota / disabled)
  }
}

function safeRemoveItem(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function safeKeys(): string[] {
  try {
    return Object.keys(window.localStorage);
  } catch {
    return [];
  }
}

function safeJsonParse(raw: string | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isWrappedValue(x: unknown): x is WrappedValue<unknown> {
  return (
    typeof x === "object" &&
    x !== null &&
    (x as { __wrapped?: unknown }).__wrapped === 1 &&
    "v" in (x as Record<string, unknown>)
  );
}

function unwrapStoredValue(raw: string | null): unknown {
  if (raw == null) return null;

  const parsed = safeJsonParse(raw);
  if (isWrappedValue(parsed)) {
    if (typeof parsed.exp === "number" && parsed.exp <= now()) return null;
    return parsed.v;
  }

  if (parsed !== null) return parsed;
  return raw;
}

function isSensitiveNoteKey(key: string) {
  return key.startsWith("reflection:") || key.startsWith("confess:note:");
}

function isEncryptedNoteValue(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { enc?: unknown }).enc === 1 &&
    typeof (value as { blob?: unknown }).blob === "object" &&
    (value as { blob?: unknown }).blob !== null
  );
}

export function getLegacyPlaintextSensitiveNote(key: string): string | null {
  if (!isSensitiveNoteKey(key)) return null;

  const value = unwrapStoredValue(safeGetItem(key));
  if (typeof value === "string") return value;
  return null;
}

export function hasLegacyPlaintextSensitiveNote(key: string): boolean {
  return getLegacyPlaintextSensitiveNote(key) !== null;
}

export function hasAnyLegacyPlaintextSensitiveNotes(): boolean {
  return safeKeys().some((key) => hasLegacyPlaintextSensitiveNote(key));
}

export function getStoredItem<T>(key: string): T | null {
  const raw = safeGetItem(key);
  if (raw == null) return null;

  const parsed = safeJsonParse(raw);
  if (isWrappedValue(parsed)) {
    if (typeof parsed.exp === "number" && parsed.exp <= now()) {
      safeRemoveItem(key);
      return null;
    }
    if (isSensitiveNoteKey(key) && !isEncryptedNoteValue(parsed.v)) return null;
    return parsed.v as T;
  }

  // Legacy plaintext sensitive notes must be explicitly migrated before use.
  const value = unwrapStoredValue(raw);
  if (isSensitiveNoteKey(key) && !isEncryptedNoteValue(value)) return null;

  // Legacy JSON (arrays/objects) or plain strings.
  if (parsed !== null) return parsed as T;
  return raw as unknown as T;
}

export function setStoredItem<T>(
  key: string,
  value: T,
  opts?: { ttlMs?: number },
) {
  const ttlMs = opts?.ttlMs;
  const wrapped: WrappedValue<T> = {
    __wrapped: 1,
    v: value,
    ts: now(),
    exp: typeof ttlMs === "number" ? now() + ttlMs : undefined,
  };
  safeSetItem(key, JSON.stringify(wrapped));
}

export function removeStoredItem(key: string) {
  safeRemoveItem(key);
}

export function clearStoredByPrefix(prefix: string) {
  for (const k of safeKeys()) {
    if (k.startsWith(prefix)) safeRemoveItem(k);
  }
}

function tryParseDayKey(s: string): number | null {
  // Accepts YYYY-MM-DD
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T00:00:00.000Z`;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

export function cleanupStoredByPrefix(prefix: string, maxAgeMs: number) {
  const cutoff = now() - maxAgeMs;

  for (const k of safeKeys()) {
    if (!k.startsWith(prefix)) continue;

    const raw = safeGetItem(k);
    const parsed = safeJsonParse(raw);

    if (isWrappedValue(parsed)) {
      const ts = typeof parsed.ts === "number" ? parsed.ts : 0;
      const exp = typeof parsed.exp === "number" ? parsed.exp : null;
      if ((exp !== null && exp <= now()) || ts <= cutoff) safeRemoveItem(k);
      continue;
    }

    // Legacy keys with date suffix: prefix + YYYY-MM-DD
    const maybeDay = k.slice(prefix.length);
    const dayTs = tryParseDayKey(maybeDay);
    if (dayTs !== null && dayTs <= cutoff) safeRemoveItem(k);
  }
}
