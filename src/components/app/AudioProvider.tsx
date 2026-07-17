import { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  category: "prayer" | "chant" | "patristic";
}

interface AmbientTrack {
  id: string;
  title: string;
  url: string;
}

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

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ambientTrack, setAmbientTrackState] = useState<AmbientTrack | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.3);

  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    mainAudioRef.current = new Audio();
    mainAudioRef.current.onended = () => setIsPlaying(false);

    return () => {
      mainAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    ambientAudioRef.current = new Audio();
    ambientAudioRef.current.loop = true;

    return () => {
      ambientAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!mainAudioRef.current || !currentTrack) return;

    if (!currentTrack.url) {
      mainAudioRef.current.pause();
      return;
    }

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

    if (ambientTrack?.url) {
      if (ambientAudioRef.current.src !== ambientTrack.url) {
        ambientAudioRef.current.src = ambientTrack.url;
      }
      ambientAudioRef.current.play().catch((err) => console.log("Ambient play blocked", err));
    } else {
      ambientAudioRef.current.pause();
    }
  }, [ambientTrack, ambientVolume]);

  const playTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const setAmbientTrack = (track: AmbientTrack | null) => {
    setAmbientTrackState(track);
  };

  return (
    <AudioContext.Provider
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
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used within an AudioProvider");
  return context;
}
