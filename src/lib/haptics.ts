import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { knotClick, markerClick, ruleDoneClick } from "@/lib/ropeSound";

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

/** A firm, silent bump for a choice that changes the app, like picking your church. */
export function choiceHaptic() {
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => vibrate(30));
    return;
  }
  vibrate(30);
}

// A knot is a clear single bump. Phone motors barely spin up in under about 20 ms, so the browser buzz is 30 ms.
export function knotHaptic() {
  knotClick();
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Medium }).catch(() => vibrate(30));
    return;
  }
  vibrate(30);
}

export function markerHaptic() {
  markerClick();
  if (Capacitor.isNativePlatform()) {
    Haptics.impact({ style: ImpactStyle.Heavy })
      .then(() => new Promise((resolve) => setTimeout(resolve, 140)))
      .then(() => Haptics.impact({ style: ImpactStyle.Heavy }))
      .catch(() => vibrate([60, 70, 60]));
    return;
  }
  vibrate([60, 70, 60]);
}

/** Today's rule prayed in full: three firm pulses. */
export function ruleDoneHaptic() {
  ruleDoneClick();
  if (Capacitor.isNativePlatform()) {
    Haptics.notification({ type: NotificationType.Success }).catch(() => vibrate([80, 80, 80, 80, 160]));
    return;
  }
  vibrate([80, 80, 80, 80, 160]);
}
