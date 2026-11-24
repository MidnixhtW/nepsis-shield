import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { STATIONS, STATIONS_CLOSE, STATIONS_RESPONSE, STATIONS_VERSICLE } from "@/content/stations";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { softHaptic } from "@/lib/haptics";

const PLACE_KEY = "stations:place";

// The Way of the Cross, one station at a time: the versicle, the station and its Scripture, a short meditation, and
// the Jesus Prayer. The place is kept on the device, so a walk broken off on a Friday resumes where it stopped.
export function StationsGuide() {
  const [index, setIndex] = useState(() => {
    const saved = getStoredItem<number>(PLACE_KEY);
    return typeof saved === "number" && saved >= 0 && saved <= STATIONS.length ? saved : 0;
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    setStoredItem(PLACE_KEY, index);
    // Move focus to the new station so screen readers announce it, but not on first open.
    if (moved.current) headingRef.current?.focus();
  }, [index]);

  function go(next: number) {
    moved.current = true;
    softHaptic();
    setIndex(next);
  }

  const done = index >= STATIONS.length;
  const station = STATIONS[Math.min(index, STATIONS.length - 1)];

  return (
    <div className="grid gap-4">
      <Card className="rounded-3xl border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">A Western devotion.</span> The Way of the Cross is prayed in
            Western Rite Orthodox parishes and by Catholics, often on Fridays and in Lent. Nine stations come from the
            Gospels; five come from holy tradition. Practice varies, so follow your parish.
          </p>
        </div>
      </Card>

      <Card className="rounded-3xl p-5 sm:p-6">
        <Progress
          value={((done ? STATIONS.length : index + 1) / STATIONS.length) * 100}
          aria-label={done ? "Way of the Cross complete" : `Station ${index + 1} of ${STATIONS.length}`}
          className="h-1.5"
        />

        {done ? (
          <div className="py-8 text-center">
            <h2 ref={headingRef} tabIndex={-1} className="text-3xl text-cinnabar focus:outline-none">
              Glory to Thy Passion, O Lord
            </h2>
            <p className="scripture-text mx-auto mt-4 max-w-md text-lg leading-relaxed">
              Glory to Thy long-suffering, O Lord, glory to Thee. Keep vigil with us until the third day.
            </p>
            <Button type="button" variant="outline" className="mt-6 rounded-2xl" onClick={() => go(0)}>
              <RotateCcw aria-hidden className="mr-2 h-4 w-4" /> Begin again
            </Button>
          </div>
        ) : (
          <div className="mt-5">
            <p className="text-sm font-semibold text-muted-foreground tabular-nums">Station {index + 1} of {STATIONS.length}</p>
            <h2 ref={headingRef} tabIndex={-1} className="mt-1 text-2xl text-cinnabar focus:outline-none sm:text-3xl">
              {station.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{station.source}</p>

            <div className="scripture-text mt-5 space-y-3 text-lg leading-relaxed">
              <p>
                <span className="font-semibold text-cinnabar">V.</span> {STATIONS_VERSICLE}
                <br />
                <span className="font-semibold text-cinnabar">R.</span> {STATIONS_RESPONSE}
              </p>
              <p>{station.meditation}</p>
              <p className="text-foreground/85">{STATIONS_CLOSE}</p>
            </div>
          </div>
        )}

        {!done ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" className="h-12 rounded-2xl px-5" disabled={index === 0} onClick={() => go(index - 1)}>
              <ChevronLeft aria-hidden className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button type="button" className="h-12 flex-1 rounded-2xl sm:flex-none sm:px-10" onClick={() => go(index + 1)}>
              {index === STATIONS.length - 1 ? "Finish" : "Next station"} <ChevronRight aria-hidden className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
