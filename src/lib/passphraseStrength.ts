export type PassphraseStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Very weak" | "Weak" | "Okay" | "Good" | "Strong";
  hints: string[];
};

function hasLower(s: string) {
  return /[a-z]/.test(s);
}
function hasUpper(s: string) {
  return /[A-Z]/.test(s);
}
function hasDigit(s: string) {
  return /\d/.test(s);
}
function hasSymbol(s: string) {
  return /[^A-Za-z0-9]/.test(s);
}

const COMMON = [
  "password",
  "qwerty",
  "letmein",
  "welcome",
  "admin",
  "iloveyou",
  "123456",
  "123456789",
  "000000",
];

export const strongPassphraseMessage =
  "Use a stronger passphrase: at least 12 characters, not common, with a mix of letters and numbers or symbols.";

function looksCommon(s: string) {
  const t = s.toLowerCase().replace(/\s+/g, "").trim();
  if (!t) return false;
  if (COMMON.some((c) => t.includes(c))) return true;
  if (/^(.)\1{6,}$/.test(t)) return true; // aaaaaaaa
  if (/^(012345|123456|234567|345678|456789)/.test(t)) return true;
  return false;
}

export function passphraseStrength(passphrase: string): PassphraseStrength {
  const s = passphrase;
  const hints: string[] = [];

  const len = s.length;
  const kinds = [hasLower(s), hasUpper(s), hasDigit(s), hasSymbol(s)].filter(Boolean)
    .length;

  let score = 0;

  if (len >= 10) score += 1;
  else hints.push("Use at least 12 characters.");

  if (len >= 12) score += 1;
  else hints.push("12+ characters is required for sensitive notes.");

  if (len >= 16) score += 1;
  else hints.push("16+ characters is stronger against offline guessing.");

  if (kinds >= 2) score += 1;
  else hints.push("Mix letters with numbers or symbols.");

  if (kinds >= 3) score += 1;

  if (looksCommon(s)) {
    score = Math.max(0, score - 2);
    hints.push("Avoid common patterns (e.g., 'password', '123456').");
  }

  const normalized = Math.max(0, Math.min(4, score)) as 0 | 1 | 2 | 3 | 4;

  const labelByScore: PassphraseStrength["label"][] = [
    "Very weak",
    "Weak",
    "Okay",
    "Good",
    "Strong",
  ];

  const topHints = Array.from(new Set(hints)).slice(0, 2);

  return {
    score: normalized,
    label: labelByScore[normalized],
    hints: topHints,
  };
}

export function isStrongPassphrase(passphrase: string) {
  const strength = passphraseStrength(passphrase);
  return passphrase.length >= 12 && strength.score >= 3;
}
