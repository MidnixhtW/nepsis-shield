import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Clock3,

  FileText,
  Minus,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAudio } from "@/components/app/AudioProvider";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { ambientTracks, sanctuaryTracks } from "@/lib/audioTracks";

const transcript = [
  "O Heavenly King, Comforter, Spirit of Truth, come and abide in us.",
  "Cleanse us from every stain, and save our souls, O Good One.",
  "Lord Jesus Christ, Son of God, have mercy on me.",
  "Into Thy hands, O Lord, I commend my spirit and this day.",
];

export function MonasticAudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    ambientTrack,
    setAmbientTrack,
    ambientVolume,
    setAmbientVolume,
  } = useAudio();
  const [open, setOpen] = useState(false);
  const [showMixer, setShowMixer] = useState(false);
  const [showText, setShowText] = useState(false);
  const [timer, setTimer] = useState("Off");
  const pauseTrackRef = useRef(pauseTrack);

  useEffect(() => {
    pauseTrackRef.current = pauseTrack;
  }, [pauseTrack]);

  useEffect(() => {
    if (currentTrack) setOpen(true);
  }, [currentTrack]);

  useEffect(() => {
    if (timer === "Off") return;

    const minutes = timer === "20 min" ? 20 : 45;
    const timeout = window.setTimeout(() => {
      pauseTrackRef.current();
      setTimer("Off");
    }, minutes * 60 * 1000);

    return () => window.clearTimeout(timeout);
  }, [timer]);

  if (!currentTrack) return null;

  const activeLine = transcript[1];

  const activeTrackIndex = Math.max(0, sanctuaryTracks.findIndex((track) => track.id === currentTrack.id));

  function togglePlay() {
    if (isPlaying) pauseTrack();
    else playTrack(currentTrack);
  }

  function playAdjacentTrack(direction: -1 | 1) {
    const nextIndex = (activeTrackIndex + direction + sanctuaryTracks.length) % sanctuaryTracks.length;
    playTrack(sanctuaryTracks[nextIndex]);
  }

  if (!open) {
    return (
      <div className="fixed inset-x-3 bottom-20 z-40 mx-auto max-w-xl sm:bottom-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="candlelight-card group flex w-full items-center gap-3 rounded-full border px-4 py-3 text-left shadow-[0_22px_70px_hsl(35_91%_48%/0.22)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{currentTrack.title}</span>
            <span className="block truncate text-xs text-muted-foreground">Tap to return to the sanctuary</span>
          </span>
          <Volume2 className="h-4 w-4 text-primary" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.18)_0%,transparent_52%),radial-gradient(circle_at_70%_20%,rgba(245,158,11,0.10)_0%,transparent_30%),linear-gradient(135deg,rgba(4,8,18,1),rgba(12,10,9,1)_55%,rgba(25,18,8,1))]" />

      <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col px-5 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(false)}>
            <ChevronDown className="h-5 w-5" />
            <span className="sr-only">Minimize player</span>
          </Button>
          <div className="text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">Vigil Sanctuary</p>
            <p className="mt-1 text-xs text-muted-foreground">{currentTrack.category}</p>
          </div>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(false)}>
            <Minus className="h-5 w-5" />
            <span className="sr-only">Close fullscreen</span>
          </Button>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
          <div className="relative mt-4">
            <div className="absolute -inset-12 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -inset-4 animate-pulse rounded-full border border-primary/20 shadow-[0_0_80px_hsl(42_92%_58%/0.22)]" />
            <div className="relative grid h-64 w-64 place-items-center rounded-full border border-primary/35 bg-[radial-gradient(circle_at_50%_35%,hsl(42_92%_58%/0.18),transparent_48%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--background)))] shadow-[inset_0_1px_0_hsl(42_92%_76%/0.24),0_30px_100px_hsl(35_91%_48%/0.18)] sm:h-72 sm:w-72">
              <div className="grid h-40 w-40 place-items-center rounded-full border border-primary/25 bg-background/70 text-primary shadow-inner">
                <OrthodoxCrossIcon className="h-20 w-20" />
              </div>
            </div>
          </div>

          <section className="w-full text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Now praying</p>
            <h1 className="mx-auto mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">{currentTrack.title}</h1>
            <p className="mx-auto mt-5 max-w-md text-lg italic leading-relaxed text-foreground/80">“{activeLine}”</p>
          </section>

          <section className="candlelight-card w-full rounded-[2rem] border p-5 sm:p-6">
            <div className="space-y-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-primary/15">
                <div className="h-full w-[38%] rounded-full bg-primary gold-foil" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>03:48</span>
                <span>10:00</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6">
              <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-full text-muted-foreground transition-colors hover:text-primary" onClick={() => playAdjacentTrack(-1)}>
                <SkipBack className="h-5 w-5" />
                <span className="sr-only">Previous sanctuary track</span>
              </Button>
              <Button type="button" className="gold-foil h-20 w-20 rounded-full text-primary-foreground shadow-[0_18px_55px_hsl(35_91%_48%/0.28)] transition-transform duration-200 hover:scale-105 active:scale-95" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="ml-1 h-9 w-9" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-full text-muted-foreground transition-colors hover:text-primary" onClick={() => playAdjacentTrack(1)}>
                <SkipForward className="h-5 w-5" />
                <span className="sr-only">Next sanctuary track</span>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <ToolButton active={showMixer} icon={<SlidersHorizontal className="h-4 w-4" />} label="Ambient" onClick={() => setShowMixer((v) => !v)} />
              <ToolButton active={showText} icon={<FileText className="h-4 w-4" />} label="Text" onClick={() => setShowText((v) => !v)} />
              <ToolButton active={timer !== "Off"} icon={<Clock3 className="h-4 w-4" />} label={timer} onClick={() => setTimer((current) => (current === "Off" ? "20 min" : current === "20 min" ? "45 min" : "Off"))} />
            </div>

            {showMixer ? (
              <div className="mt-5 rounded-3xl bg-background/45 p-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {ambientTracks.map((option) => {
                    const active = ambientTrack?.id === option.id;
                    return (
                      <button

                        key={option.id}
                        type="button"
                        className={cn(
                          "rounded-2xl border px-3 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5",
                          active ? "border-primary/50 bg-primary/15 text-primary shadow-[0_12px_35px_hsl(35_91%_48%/0.14)]" : "border-primary/15 text-muted-foreground hover:border-primary/35 hover:text-primary",
                        )}
                        onClick={() => setAmbientTrack(active ? null : option)}
                      >
                        {option.title}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Volume2 className="h-4 w-4 text-primary" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVolume}
                    onChange={(event) => setAmbientVolume(Number(event.target.value))}
                    className="h-1 w-full accent-amber-500"
                  />

                  <span className="w-10 text-right text-xs text-muted-foreground">{Math.round(ambientVolume * 100)}%</span>
                </div>
              </div>
            ) : null}

            {showText ? (
              <div className="mt-5 rounded-3xl bg-background/45 p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Prayer text</p>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/85">
                  {transcript.map((line) => (
                    <p key={line} className={line === activeLine ? "text-primary" : undefined}>{line}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}

function ToolButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5",
        active ? "border-primary/50 bg-primary/15 text-primary shadow-[0_12px_35px_hsl(35_91%_48%/0.14)]" : "border-primary/15 bg-background/35 text-muted-foreground hover:border-primary/35 hover:text-primary",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}
