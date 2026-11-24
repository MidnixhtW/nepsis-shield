import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { AmbientTrack, AudioTrack } from "@/lib/audioTracks";

export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "error";

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  /** What the player is doing right now, from the audio element itself (so "loading" and "error" are real). */
  status: PlaybackStatus;
  /** Which recorded piece of a prayer is playing. */
  segmentIndex: number;
  /** Seconds into the current piece, and its length (0 for live radio). */
  position: number;
  duration: number;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  skipSegment: (direction: -1 | 1) => void;
  seek: (seconds: number) => void;
  ambientTrack: AmbientTrack | null;
  setAmbientTrack: (track: AmbientTrack | null) => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;
}

type GeneratedSound = {
  trackId: string;
  ctx: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  noise?: AudioBufferSourceNode;
};

const AudioPlaybackContext = createContext<AudioContextType | undefined>(undefined);

function stopGeneratedSound(sound: GeneratedSound | null) {
  if (!sound) return;

  const stopAt = sound.ctx.currentTime + 0.08;
  sound.master.gain.cancelScheduledValues(sound.ctx.currentTime);
  sound.master.gain.setTargetAtTime(0, sound.ctx.currentTime, 0.03);
  sound.oscillators.forEach((node) => node.stop(stopAt));
  sound.noise?.stop(stopAt);
  void sound.ctx.close();
}

function createNoise(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const trackRef = useRef<AudioTrack | null>(null);
  const segmentRef = useRef(0);
  const [ambientTrack, setAmbientTrackState] = useState<AmbientTrack | null>(null);
  const [ambientVolume, setAmbientVolumeState] = useState(0.3);

  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const generatedAmbientRef = useRef<GeneratedSound | null>(null);

  function stopGeneratedAmbient() {
    stopGeneratedSound(generatedAmbientRef.current);
    generatedAmbientRef.current = null;
  }

  function startGeneratedAmbient(track: AmbientTrack, volume: number) {
    if (generatedAmbientRef.current?.trackId === track.id) {
      generatedAmbientRef.current.master.gain.setTargetAtTime(volume * 0.5, generatedAmbientRef.current.ctx.currentTime, 0.04);
      void generatedAmbientRef.current.ctx.resume();
      return;
    }

    stopGeneratedAmbient();

    const ctx = new window.AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];
    let noise: AudioBufferSourceNode | undefined;

    if (track.id === "ison") {
      [110, 220].forEach((frequency, index) => {
        const tone = ctx.createOscillator();
        const toneGain = ctx.createGain();
        tone.type = "sine";
        tone.frequency.value = frequency;
        toneGain.gain.value = index === 0 ? 0.12 : 0.04;
        tone.connect(toneGain);
        toneGain.connect(master);
        tone.start();
        oscillators.push(tone);
      });
    } else {
      noise = createNoise(ctx);
      const filter = ctx.createBiquadFilter();
      filter.type = track.id === "rain" ? "lowpass" : "highpass";
      filter.frequency.value = track.id === "rain" ? 920 : 2200;
      noise.connect(filter);
      filter.connect(master);
      noise.start();
    }

    master.gain.linearRampToValueAtTime(volume * 0.5, ctx.currentTime + 0.6);
    generatedAmbientRef.current = { trackId: track.id, ctx, master, oscillators, noise };
    void ctx.resume();
  }

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    mainAudioRef.current = audio;
    audio.onwaiting = () => setStatus("loading");
    audio.onplaying = () => setStatus("playing");
    audio.onpause = () => setStatus((current) => (current === "error" ? current : "paused"));
    audio.onerror = () => {
      setStatus("error");
      setIsPlaying(false);
    };
    audio.ontimeupdate = () => setPosition(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    // A prayer plays piece by piece; at the end of the last piece it stops.
    audio.onended = () => {
      const segments = trackRef.current?.segments;
      if (segments && segmentRef.current < segments.length - 1) {
        segmentRef.current += 1;
        setSegmentIndex(segmentRef.current);
        return;
      }
      setIsPlaying(false);
      setStatus("idle");
    };

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    ambientAudioRef.current = new Audio();
    ambientAudioRef.current.loop = true;

    return () => {
      ambientAudioRef.current?.pause();
      stopGeneratedAmbient();
    };
  }, []);

  // Load the piece that should be playing, and play or pause it.
  useEffect(() => {
    const audio = mainAudioRef.current;
    if (!audio || !currentTrack) return;
    const src = currentTrack.segments ? currentTrack.segments[segmentIndex]?.url : currentTrack.url;
    if (!src) return;
    const absolute = new URL(src, window.location.href).href;
    if (audio.src !== absolute) {
      audio.src = src;
      setPosition(0);
      setDuration(0);
    }
    if (isPlaying) {
      setStatus((current) => (current === "playing" ? current : "loading"));
      audio.play().catch(() => {
        setStatus("error");
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack, segmentIndex, isPlaying]);

  // The lock screen and headphone buttons control the sanctuary too.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !currentTrack) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: currentTrack.title, artist: currentTrack.subtitle, album: "Nepsis Shield" });
    navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
  }, [currentTrack]);

  useEffect(() => {
    if (!ambientAudioRef.current) return;

    ambientAudioRef.current.volume = ambientVolume;

    if (!ambientTrack) {
      ambientAudioRef.current.pause();
      stopGeneratedAmbient();
      return;
    }

    if (!ambientTrack.url) {
      ambientAudioRef.current.pause();
      startGeneratedAmbient(ambientTrack, ambientVolume);
      return;
    }

    stopGeneratedAmbient();

    if (ambientAudioRef.current.src !== ambientTrack.url) {
      ambientAudioRef.current.src = ambientTrack.url;
    }
    ambientAudioRef.current.play().catch((err) => console.log("Ambient play blocked", err));
  }, [ambientTrack, ambientVolume]);

  const playTrack = (track: AudioTrack) => {
    trackRef.current = track;
    segmentRef.current = 0;
    setSegmentIndex(0);
    setPosition(0);
    setDuration(0);
    setStatus("loading");
    // Live radio starts from now, so a stream that was paused earlier is fetched fresh.
    if (track.kind === "radio" && mainAudioRef.current) mainAudioRef.current.removeAttribute("src");
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => setIsPlaying(false);

  const resumeTrack = () => {
    const audio = mainAudioRef.current;
    if (currentTrack?.kind === "radio" && audio) {
      // Resuming radio means joining it live again, so drop what was buffered when it paused.
      audio.removeAttribute("src");
      audio.load();
    }
    setIsPlaying(true);
  };

  const stopTrack = () => {
    setIsPlaying(false);
    mainAudioRef.current?.pause();
    trackRef.current = null;
    setCurrentTrack(null);
    setStatus("idle");
  };

  const skipSegment = (direction: -1 | 1) => {
    const segments = currentTrack?.segments;
    if (!segments) return;
    const next = Math.min(segments.length - 1, Math.max(0, segmentRef.current + direction));
    segmentRef.current = next;
    setSegmentIndex(next);
    setIsPlaying(true);
  };

  const seek = (seconds: number) => {
    const audio = mainAudioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.min(audio.duration, Math.max(0, seconds));
  };

  const setAmbientTrack = (track: AmbientTrack | null) => {
    setAmbientTrackState(track);
    if (!track) {
      stopGeneratedAmbient();
      return;
    }
    if (!track.url) startGeneratedAmbient(track, ambientVolume);
  };

  const setAmbientVolume = (vol: number) => {
    setAmbientVolumeState(vol);
    if (generatedAmbientRef.current) {
      generatedAmbientRef.current.master.gain.setTargetAtTime(vol * 0.5, generatedAmbientRef.current.ctx.currentTime, 0.04);
    }
  };

  return (
    <AudioPlaybackContext.Provider
      value={{
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
      }}
    >
      {children}
    </AudioPlaybackContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioPlaybackContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
}
