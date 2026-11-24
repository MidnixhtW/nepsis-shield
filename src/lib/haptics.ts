import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

// A small bump for a knot, a firmer double pulse at a marker. The Android app uses the phone's haptic engine; in a
// browser, Android vibrates and iPhone Safari stays silent (it has no vibration API).
function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

/** The lightest touch, for turning a page of the prayers or lighting a lamp. */
export function softHaptic() {
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => vibrate(5));
    return;
  }
  vibrate(5);
}

export function knotHaptic() {
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => vibrate(12));
    return;
  }
  vibrate(12);
}

export function markerHaptic() {
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Heavy })
      .then(() => new Promise((resolve) => setTimeout(resolve, 140)))
      .then(() => Haptics.impact({ style: ImpactStyle.Heavy }))
      .catch(() => vibrate([25, 40, 25]));
    return;
  }
  vibrate([25, 40, 25]);
}
