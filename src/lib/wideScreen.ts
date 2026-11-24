// Today's secondary pieces start open where there is room (laptop and wider) and folded on phones and tablets.
export function startsOpenOnWideScreen() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(min-width: 1024px)").matches;
}
