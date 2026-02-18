import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { showError, showSuccess } from "@/utils/toast";
import type { SessionSegment } from "@/lib/programs/catalog";
import { buildElevenLabsConfig, getVoiceSettings } from "@/lib/voiceSettings";
import { elevenLabsTts } from "@/lib/elevenlabs";

type PlayerState = "idle" | "playing" | "paused" | "done";

function hasSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function GuidedSessionPlayer({
  title,
  segments,
  onComplete,
}: {
  title: string;
  segments: SessionSegment[];
  onComplete?: () => void;
}) {
  const [state, setState] = useState<PlayerState>("idle");
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isonEnabled, setIsonEnabled] = useState(false);

  // Device TTS rate only (ElevenLabs has its own voice settings)
  const [rate, setRate] = useState(1);

  const cancelRef = useRef(false);
  const pausedRef = useRef(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // ElevenLabs playback
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const totalSilenceSeconds = useMemo(() => {
    return segments.reduce((sum, s) => (s.kind === "silence" ? sum + s.seconds : sum), 0);
  }, [segments]);

  useEffect(() => {
    return () => {
      stopAllSpeech();
      stopIson();
      cleanupAudioUrl();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ensureAudio() {
    if (audioCtxRef.current) return audioCtxRef.current;
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    return ctx;
  }

  function cleanupAudioUrl() {
    const url = currentAudioUrlRef.current;
    if (url) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    }
    currentAudioUrlRef.current = null;
  }

  function stopAllSpeech() {
    // Device TTS
    try {
      window.speechSynthesis?.cancel();
    } catch {
      // ignore
    }

    // ElevenLabs fetch
    try {
      abortRef.current?.abort();
    } catch {
      // ignore
    }
    abortRef.current = null;

    // ElevenLabs audio element
    try {
      audioElRef.current?.pause();
      if (audioElRef.current) audioElRef.current.currentTime = 0;
    } catch {
      // ignore
    }

    cleanupAudioUrl();
  }

  function startIson() {
    try {
      const ctx = ensureAudio();
      if (ctx.state === "suspended") void ctx.resume();
      if (oscRef.current && gainRef.current) return;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 110; // A2-ish (gentle)

      const gain = ctx.createGain();
      gain.gain.value = 0.03;

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // ignore
    }
  }

  function stopIson() {
    try {
      oscRef.current?.stop();
    } catch {
      // ignore
    }
    try {
      oscRef.current?.disconnect();
      gainRef.current?.disconnect();
    } catch {
      // ignore
    }
    oscRef.current = null;
    gainRef.current = null;
  }

  function chime() {
    try {
      const ctx = ensureAudio();
      if (ctx.state === "suspended") void ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      const t = ctx.currentTime;
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      osc.stop(t + 0.75);
    } catch {
      // ignore
    }
  }

  async function speakDevice(text: string) {
    if (!hasSpeechSynthesis()) {
      showError("Voice is not supported in this browser.");
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = Math.max(0.7, Math.min(1.25, rate));
      u.pitch = 1;
      u.volume = 1;
      u.onend = () => resolve();
      u.onerror = () => reject(new Error("speech error"));
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch (e) {
        reject(e as Error);
      }
    });
  }

  async function speakElevenLabs(text: string) {
    const settings = getVoiceSettings();
    const cfg = buildElevenLabsConfig(settings);
    if (!cfg) {
      showError("ElevenLabs is not configured. Set it up in Settings → Voice.");
      // Fallback to device voice so the session still works.
      return await speakDevice(text);
    }

    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;

    const blob = await elevenLabsTts(cfg, text, { signal: abort.signal });
    cleanupAudioUrl();
    const url = URL.createObjectURL(blob);
    currentAudioUrlRef.current = url;

    const audio = audioElRef.current ?? new Audio();
    audioElRef.current = audio;
    audio.src = url;

    return new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("audio error"));

      // If paused mid-way, we control pause/resume with audio element.
      void audio.play().catch((e) => reject(e as Error));
    });
  }

  async function speak(text: string) {
    if (!voiceEnabled) return;

    const voice = getVoiceSettings();
    if (voice.provider === "elevenlabs") {
      try {
        await speakElevenLabs(text);
        return;
      } catch {
        // fallback below
      }
    }

    try {
      await speakDevice(text);
    } catch {
      // ignore
    }
  }

  async function runFrom(startIndex: number) {
    cancelRef.current = false;
    pausedRef.current = false;

    if (isonEnabled) startIson();

    for (let i = startIndex; i < segments.length; i++) {
      if (cancelRef.current) return;

      setIdx(i);
      const seg = segments[i];

      // Pause handling (cooperative)
      while (pausedRef.current && !cancelRef.current) {
        await sleep(200);
      }

      if (cancelRef.current) return;

      if (seg.kind === "speak") {
        setRemaining(null);
        await speak(seg.text);
        continue;
      }

      // Silence segment
      const seconds = Math.max(0, Math.floor(seg.seconds));
      for (let s = seconds; s >= 1; s--) {
        if (cancelRef.current) return;
        while (pausedRef.current && !cancelRef.current) {
          await sleep(200);
        }
        if (cancelRef.current) return;
        setRemaining(s);
        await sleep(1000);
      }
      setRemaining(null);
    }

    if (isonEnabled) stopIson();
    setState("done");
    chime();
    if (navigator.vibrate) navigator.vibrate(120);
    showSuccess("Session complete.");
    onComplete?.();
  }

  function start() {
    if (state === "playing") return;
    if (state === "paused") {
      pausedRef.current = false;
      setState("playing");

      const voice = getVoiceSettings();
      if (voice.provider === "elevenlabs") {
        try {
          void audioElRef.current?.play();
        } catch {
          // ignore
        }
      } else {
        try {
          window.speechSynthesis?.resume();
        } catch {
          // ignore
        }
      }
      return;
    }

    setState("playing");
    chime();
    void runFrom(0);
  }

  function pause() {
    if (state !== "playing") return;
    pausedRef.current = true;
    setState("paused");

    const voice = getVoiceSettings();
    if (voice.provider === "elevenlabs") {
      try {
        audioElRef.current?.pause();
      } catch {
        // ignore
      }
      return;
    }

    try {
      window.speechSynthesis?.pause();
    } catch {
      // ignore
    }
  }

  function reset() {
    cancelRef.current = true;
    pausedRef.current = false;
    stopAllSpeech();
    stopIson();
    setIdx(0);
    setRemaining(null);
    setState("idle");
  }

  const current = segments[idx];
  const statusLabel =
    state === "idle"
      ? "Ready"
      : state === "playing"
        ? "Playing"
        : state === "paused"
          ? "Paused"
          : "Done";

  const providerLabel = useMemo(() => {
    const voice = getVoiceSettings();
    return voice.provider === "elevenlabs" ? "Voice: ElevenLabs" : "Voice: Device";
  }, [state]);

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <Badge className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {statusLabel}
            </Badge>
            <Badge className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {providerLabel}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Guided prayer with optional voice and silence.
          </p>
        </div>

        <div className="flex gap-2">
          {state === "playing" ? (
            <Button
              type="button"
              variant="secondary"
              className="rounded-2xl"
              onClick={pause}
            >
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          ) : (
            <Button type="button" className="rounded-2xl" onClick={start}>
              <Play className="mr-2 h-4 w-4" /> {state === "paused" ? "Resume" : "Start"}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-border/60"
            onClick={reset}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-4">
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">
            Now
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            {current?.kind === "speak"
              ? current.text
              : current?.kind === "silence"
                ? `${current.label ? `${current.label} — ` : ""}Silence${
                    typeof remaining === "number" ? ` (${formatTime(remaining)})` : ""
                  }`
                : "—"}
          </p>
          {totalSilenceSeconds > 0 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Includes {Math.round(totalSilenceSeconds / 60)} min of silence.
            </p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Voice guidance</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Device TTS or ElevenLabs (configured in Settings → Voice).
                </p>
              </div>
              <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  {voiceEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  Device rate
                </span>
                <span className="tabular-nums">{rate.toFixed(2)}×</span>
              </div>
              <Slider
                value={[rate]}
                min={0.8}
                max={1.2}
                step={0.05}
                onValueChange={(v) => setRate(v[0] ?? 1)}
                disabled={!voiceEnabled || getVoiceSettings().provider === "elevenlabs"}
                className="mt-2"
              />
            </div>

            {getVoiceSettings().provider === "device" && !hasSpeechSynthesis() ? (
              <p className="mt-2 text-xs text-destructive">
                Voice is not supported in this browser.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Ison (ambient tone)</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Optional, very quiet.
                </p>
              </div>
              <Switch
                checked={isonEnabled}
                onCheckedChange={(v) => {
                  setIsonEnabled(v);
                  if (!v) stopIson();
                }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tip: on iOS, you may need to tap Start once to allow audio.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}