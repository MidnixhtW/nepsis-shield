import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { AmbientTrack, AudioTrack } from "@/lib/audioTracks";

interface AudioContextType {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
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
  const [ambientTrack, setAmbientTrackState] = useState<AmbientTrack | null>(null);
  const [ambientVolume, setAmbientVolumeState] = useState(0.3);

  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);
  const generatedMainRef = useRef<GeneratedSound | null>(null);
  const generatedAmbientRef = useRef<GeneratedSound | null>(null);

  function stopGeneratedMain() {
    stopGeneratedSound(generatedMainRef.current);
    generatedMainRef.current = null;
  }

  function stopGeneratedAmbient() {
    stopGeneratedSound(generatedAmbientRef.current);
    generatedAmbientRef.current = null;
  }

  function startGeneratedMain(track: AudioTrack) {
    if (generatedMainRef.current?.trackId === track.id) {
      void generatedMainRef.current.ctx.resume();
      return;
    }

    stopGeneratedMain();

    const ctx = new window.AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);

    const palette =
      track.category === "chant"
        ? [110, 164.81, 220, 329.63]
        : track.category === "patristic"
          ? [130.81, 196, 261.63, 392]
          : [146.83, 220, 293.66, 440];

    const oscillators = palette.flatMap((frequency, index) => {
      const tone = ctx.createOscillator();
      const toneGain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      tone.type = index === 0 ? "triangle" : "sine";
      tone.frequency.value = frequency;
      tone.detune.value = index * 3;
      toneGain.gain.value = index === 0 ? 0.09 : 0.035;
      lfo.frequency.value = 0.035 + index * 0.01;
      lfoGain.gain.value = 2.5;

      lfo.connect(lfoGain);
      lfoGain.connect(tone.frequency);
      tone.connect(toneGain);
      toneGain.connect(master);
      tone.start();
      lfo.start();

      return [tone, lfo];
    });

    master.gain.exponentialRampToValueAtTime(0.24, ctx.currentTime + 1.2);
    generatedMainRef.current = { trackId: track.id, ctx, master, oscillators };
    void ctx.resume();
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
    mainAudioRef.current = new Audio();
    mainAudioRef.current.onended = () => setIsPlaying(false);

    return () => {
      mainAudioRef.current?.pause();
      stopGeneratedMain();
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

  useEffect(() => {
    if (!mainAudioRef.current || !currentTrack) return;

    if (!currentTrack.url) {
      mainAudioRef.current.pause();
      if (isPlaying) startGeneratedMain(currentTrack);
      else stopGeneratedMain();
      return;
    }

    stopGeneratedMain();

    if (mainAudioRef.current.src !== currentTrack.url) {
      mainAudioRef.current.src = currentTrack.url;
    }

    if (isPlaying) {
      mainAudioRef.current.play().catch((err) => console.log("Audio play blocked", err));
    } else {
      mainAudioRef.current.pause();
    }
  }, [currentTrack, isPlaying]);

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
    setCurrentTrack(track);
    setIsPlaying(true);
    if (!track.url) startGeneratedMain(track);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    stopGeneratedMain();
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
        playTrack,
        pauseTrack,
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
