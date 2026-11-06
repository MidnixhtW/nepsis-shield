import { useEffect, useState } from "react";
import { Download, Trash2, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { shortFlows } from "@/content/dailyPrayerSteps";
import { READERS, clipUrl, useReader, type ReaderId } from "@/lib/narration";
import { spokenText } from "@/lib/narrationText";
import { canReadAloud, startNarration } from "@/lib/readAloud";
import { onOfflineAudioChange, readerClipUrls, removeReaderOffline, saveReaderOffline, savedClipCount } from "@/lib/offlineAudio";
import { cn } from "@/lib/utils";

// The opening of the daily prayers, as a sample of each reader.
const SAMPLE = shortFlows.morning[0].body;

// Keeps the chosen reader's recordings on the device for listening with no signal.
function OfflineReader({ reader, name }: { reader: ReaderId; name: string }) {
  const total = readerClipUrls(reader).length;
  const [saved, setSaved] = useState(0);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const refresh = () => savedClipCount(reader).then((count) => live && setSaved(count));
    refresh();
    const stop = onOfflineAudioChange(refresh);
    return () => {
      live = false;
      stop();
    };
  }, [reader]);

  if (!total || typeof caches === "undefined") return null;
  const complete = saved >= total;

  async function save() {
    setError(null);
    setProgress(0);
    try {
      await saveReaderOffline(reader, (done) => setProgress(done));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the recordings.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-background/45 p-4">
      <p className="text-sm font-semibold">Listen with no signal</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {complete
          ? `${name}'s ${total} recordings are on this device and play offline.`
          : `Save ${name}'s ${total} recordings (about 25 MB) so the prayers play on a flight or in the field.${saved ? ` ${saved} saved so far.` : ""}`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {complete ? (
          <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => void removeReaderOffline(reader)}>
            <Trash2 className="mr-1.5 h-4 w-4" /> Remove from device
          </Button>
        ) : (
          <Button type="button" size="sm" className="rounded-full" disabled={progress !== null} onClick={() => void save()}>
            <Download className="mr-1.5 h-4 w-4" />
            {progress !== null ? `Saving ${progress} of ${total}…` : `Save ${name} for offline`}
          </Button>
        )}
      </div>
      {error ? <p role="alert" className="mt-2 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

// Settings: who reads the prayers and stories aloud.
export function ReaderVoiceSettings() {
  const [reader, setReader] = useReader();

  function sample(id: ReaderId) {
    startNarration(`Sample: ${READERS.find((item) => item.id === id)?.name}`, [{ text: spokenText(SAMPLE), audio: clipUrl(id, SAMPLE) }]);
  }

  return (
    <Card id="reader" className="scroll-mt-24 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Reader</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Who reads the prayers and saint stories aloud. Anything not yet recorded is read by your device's voice.
          </p>
        </div>
        <Volume2 className="h-5 w-5 text-muted-foreground" />
      </div>
      <Separator className="my-4" />
      <div role="radiogroup" aria-label="Reader" className="grid gap-2">
        {READERS.map((item) => {
          const selected = reader === item.id;
          // "Hear" only where that reader can be heard: a recorded sample, or the device's own voice.
          const playable = item.id === "device" ? canReadAloud() : !!clipUrl(item.id, SAMPLE, true);
          return (
            <div
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3",
                selected ? "border-accent/50 bg-accent/10" : "border-border/60 bg-muted/20",
              )}
            >
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setReader(item.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              >
                <span aria-hidden className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full border", selected ? "border-accent" : "border-muted-foreground")}>
                  {selected ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{item.name}</span>
                  <span className="block text-xs text-muted-foreground">{item.note}</span>
                </span>
              </button>
              {playable ? (
                <Button type="button" variant="ghost" size="sm" className="shrink-0 rounded-full" onClick={() => sample(item.id)} aria-label={`Hear ${item.name}`}>
                  <Volume2 className="mr-1.5 h-4 w-4" /> Hear
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      {reader !== "device" ? <OfflineReader reader={reader} name={READERS.find((item) => item.id === reader)?.name ?? "Reader"} /> : null}
    </Card>
  );
}
