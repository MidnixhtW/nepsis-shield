import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Clock3,
  FileText,
  Pause,
  Play,
  Radio,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudio } from "@/components/app/AudioProvider";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ambientTracks, sanctuaryTracks } from "@/lib/audioTracks";

const TIMERS = ["Off", "15 min", "30 min", "60 min"] as const;
type TimerLabel = (typeof TIMERS)[number];

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// The Vigil Sanctuary: a full-screen player for the daily prayers read aloud (the app's own recordings) and for
// Ancient Faith Radio, live. Everything it shows comes from the audio itself: the real time, the real text being read,
// "Connecting" while a station loads, and a plain message when it cannot be reached.
export function MonasticAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    status,
    segmentIndex,
    position,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    skipSegment,
    seek,
    ambientTrack,
    setAmbientTrack,
    ambientVolume,
    setAmbientVolume,
  } = useAudio();
  const [open, setOpen] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [showText, setShowText] = useState(true);
  const [timer, setTimer] = useState<TimerLabel>("Off");
  const pauseRef = useRef(pauseTrack);
  // Built when the player opens, so it follows the reader and prayer length chosen in Settings.
  const tracks = useMemo(() => (currentTrack ? sanctuaryTracks() : []), [currentTrack]);

  useEffect(() => {
    pauseRef.current = pauseTrack;
  }, [pauseTrack]);

  useEffect(() => {
    if (currentTrack) setOpen(true);
  }, [currentTrack?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timer === "Off") return;
    const minutes = Number.parseInt(timer, 10);
    const timeout = window.setTimeout(() => {
      pauseRef.current();
      setTimer("Off");
    }, minutes * 60 * 1000);
    return () => window.clearTimeout(timeout);
  }, [timer]);

  if (!currentTrack) return null;

  const live = currentTrack.kind === "radio";
  const segments = currentTrack.segments ?? [];
  const segment = segments[segmentIndex];
  const connecting = isPlaying && status === "loading";
  const failed = status === "error";
  const statusLine = failed
    ? live
      ? "The station could not be reached. Check your signal and try again."
      : "This recording could not play. Check your signal and try again."
    : connecting
      ? live ? "Connecting to the station…" : "Loading…"
      : null;

  function togglePlay() {
    if (isPlaying) pauseTrack();
    else resumeTrack();
  }

  // Drawn on the page itself (a portal), so the app's animated layout cannot pull it out of place.
  if (!open) {
    return createPortal(
      <div className="fixed inset-x-3 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-xl">
        <div className="candlelight-card flex w-full items-center gap-2 rounded-full border py-2 pl-2 pr-2 backdrop-blur-xl">
          <button
            type="button"
            onClick={togglePlay}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button type="button" onClick={() => setOpen(true)} className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-semibold">{currentTrack.title}</span>
            <span className="block truncate text-sm text-muted-foreground">
              {statusLine ?? (live ? "Live radio" : segment ? segment.title : currentTrack.subtitle)}
            </span>
          </button>
          <button
            type="button"
            onClick={stopTrack}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Stop and close the player</span>
          </button>
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Vigil Sanctuary" className="fixed inset-0 z-[90] overflow-y-auto bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.18)_0%,transparent_52%),radial-gradient(circle_at_70%_20%,rgba(245,158,11,0.10)_0%,transparent_30%),linear-gradient(135deg,rgba(4,8,18,1),rgba(12,10,9,1)_55%,rgba(25,18,8,1))]" />

      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-5 sm:px-8 sm:py-8">
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={() => setOpen(false)}>
            <ChevronDown className="h-5 w-5" />
            <span className="sr-only">Minimize player</span>
          </Button>
          <p className="text-sm font-bold text-primary">Vigil Sanctuary</p>
          <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={stopTrack}>
            <X className="h-5 w-5" />
            <span className="sr-only">Stop and close</span>
          </Button>
        </div>

        <div className="flex flex-1 flex-col items-center gap-6 py-6 sm:gap-8">
          <div className="relative mt-2">
            <div className="absolute -inset-8 rounded-full bg-accent/20 blur-3xl" />
            <div className={cn("absolute -inset-3 rounded-full border border-primary/20 shadow-[0_0_80px_hsl(42_92%_58%/0.22)]", isPlaying && !connecting && "motion-safe:animate-pulse")} />
            <div className="relative grid h-[min(12rem,52vw)] w-[min(12rem,52vw)] place-items-center rounded-full border border-primary/35 bg-[radial-gradient(circle_at_50%_35%,hsl(42_92%_58%/0.18),transparent_48%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--background)))]">
              <div className="grid h-[62%] w-[62%] place-items-center rounded-full border border-primary/25 bg-background/70 text-primary shadow-inner">
                {live ? <Radio className="h-12 w-12" /> : <OrthodoxCrossIcon className="h-14 w-14" />}
              </div>
            </div>
          </div>

          <section className="w-full min-w-0 text-center">
            {live ? (
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-sm font-bold text-primary">
                <span aria-hidden className={cn("h-2 w-2 rounded-full bg-primary", isPlaying && !connecting && "motion-safe:animate-pulse")} /> Live
              </p>
            ) : (
              <p className="text-sm font-bold text-primary">Now praying</p>
            )}
            <h1 className="mx-auto mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">{currentTrack.title}</h1>
            <p className="mt-2 text-base text-muted-foreground">{currentTrack.subtitle}</p>
            {statusLine ? (
              <p role="status" className={cn("mx-auto mt-3 max-w-md text-base", failed ? "text-foreground" : "text-muted-foreground")}>
                {statusLine}
              </p>
            ) : null}
          </section>

          <section className="candlelight-card w-full rounded-[2rem] border p-5 sm:p-6">
            {live ? null : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  {segment?.title}
                  <span className="font-normal text-muted-foreground">, part {segmentIndex + 1} of {segments.length}</span>
                </p>
                <input
                  type="range"
                  aria-label="Position in this part"
                  min={0}
                  max={duration || 0}
                  step={1}
                  value={Math.min(position, duration || 0)}
                  onChange={(event) => seek(Number(event.target.value))}
                  className="h-2 w-full accent-amber-500"
                />
                <div className="flex justify-between text-sm tabular-nums text-muted-foreground">
                  <span>{clock(position)}</span>
                  <span>{clock(duration)}</span>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-6">
              {live ? null : (
                <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={segmentIndex === 0} onClick={() => skipSegment(-1)}>
                  <SkipBack className="h-5 w-5" />
                  <span className="sr-only">Previous part</span>
                </Button>
              )}
              <Button type="button" className="h-20 w-20 rounded-full text-primary-foreground" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="ml-1 h-9 w-9" />}
                <span className="sr-only">{isPlaying ? "Pause" : failed ? "Try again" : "Play"}</span>
              </Button>
              {live ? null : (
                <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-full" disabled={segmentIndex >= segments.length - 1} onClick={() => skipSegment(1)}>
                  <SkipForward className="h-5 w-5" />
                  <span className="sr-only">Next part</span>
                </Button>
              )}
            </div>

            <div className={cn("mt-6 grid gap-2", live ? "grid-cols-2" : "grid-cols-3")}>
              <ToolButton active={showMixer} icon={<SlidersHorizontal className="h-4 w-4" />} label="Ambient" onClick={() => setShowMixer((v) => !v)} />
              {live ? null : <ToolButton active={showText} icon={<FileText className="h-4 w-4" />} label="Text" onClick={() => setShowText((v) => !v)} />}
              <ToolButton
                active={timer !== "Off"}
                icon={<Clock3 className="h-4 w-4" />}
                label={timer === "Off" ? "Timer" : timer}
                onClick={() => setTimer((current) => TIMERS[(TIMERS.indexOf(current) + 1) % TIMERS.length])}
              />
            </div>

            {showMixer ? (
              <div className="mt-5 rounded-3xl bg-background/45 p-4">
                <p className="text-sm text-muted-foreground">A quiet sound under the prayer, made on your phone.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {ambientTracks.map((option) => {
                    const active = ambientTrack?.id === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        className={cn(
                          "min-h-11 rounded-2xl border px-3 py-2 text-sm font-semibold transition-colors",
                          active ? "border-primary/50 bg-primary/15 text-primary" : "border-primary/15 text-muted-foreground hover:border-primary/35 hover:text-primary",
                        )}
                        onClick={() => setAmbientTrack(active ? null : option)}
                      >
                        {option.title}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Volume2 aria-hidden className="h-4 w-4 text-primary" />
                  <input
                    type="range"
                    aria-label="Ambient volume"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(event) => setAmbientVolume(Number(event.target.value))}
                    className="h-2 w-full accent-amber-500"
                  />
                  <span className="w-12 text-right text-sm tabular-nums text-muted-foreground">{Math.round(ambientVolume * 100)}%</span>
                </div>
              </div>
            ) : null}

            {!live && showText && segment ? (
              <div className="mt-5 rounded-3xl bg-background/45 p-5 text-left">
                <p className="text-sm font-semibold text-primary">{segment.title}</p>
                <div className="scripture-text mt-3 max-h-72 space-y-3 overflow-y-auto text-lg leading-relaxed text-foreground/90">
                  {segment.lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section aria-labelledby="sanctuary-choices" className="w-full">
            <h2 id="sanctuary-choices" className="px-1 text-sm font-semibold text-muted-foreground">Listen to</h2>
            <ul className="mt-2 grid overflow-hidden rounded-2xl border border-border/60 bg-card/70">
              {tracks.map((track) => {
                const active = track.id === currentTrack.id;
                return (
                  <li key={track.id} className="border-b border-border/40 last:border-b-0">
                    <button
                      type="button"
                      aria-current={active ? "true" : undefined}
                      onClick={() => (active ? togglePlay() : playTrack(track))}
                      className={cn("flex min-h-14 w-full items-center gap-3 px-4 py-2 text-left hover:bg-accent/5", active && "bg-primary/10")}
                    >
                      {track.kind === "radio" ? <Radio aria-hidden className="h-5 w-5 shrink-0 text-accent" /> : <OrthodoxCrossIcon className="h-5 w-5 shrink-0 text-accent" />}
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold leading-tight">{track.title}</span>
                        <span className="block text-sm text-muted-foreground">{track.subtitle}</span>
                      </span>
                      {active && isPlaying ? <Pause aria-hidden className="h-4 w-4 text-primary" /> : <Play aria-hidden className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 px-1 text-sm text-muted-foreground">
              Radio is streamed live from Ancient Faith Radio and needs a signal. The prayers are the app&rsquo;s own recordings.
            </p>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ToolButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-2 text-sm font-semibold transition-colors",
        active ? "border-primary/50 bg-primary/15 text-primary" : "border-primary/15 bg-background/35 text-muted-foreground hover:border-primary/35 hover:text-primary",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
