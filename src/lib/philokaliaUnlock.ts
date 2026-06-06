export const PHILOKALIA_UNLOCK_KEY = "nepsis-shield:philokalia-guide-unlocked";

export function isPhilokaliaUnlocked() {
  try {
    return window.localStorage.getItem(PHILOKALIA_UNLOCK_KEY) === "true";
  } catch {
    return false;
  }
}

export function unlockPhilokaliaGuide() {
  window.localStorage.setItem(PHILOKALIA_UNLOCK_KEY, "true");
}

export function lockPhilokaliaGuide() {
  window.localStorage.removeItem(PHILOKALIA_UNLOCK_KEY);
}
