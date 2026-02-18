import { getStoredItem, removeStoredItem, setStoredItem } from "@/lib/deviceStorage";
import type { ElevenLabsConfig } from "@/lib/elevenlabs";

export type VoiceProvider = "device" | "elevenlabs";

export type StoredVoiceSettings = {
  provider: VoiceProvider;
  saveApiKey: boolean;
  eleven?: {
    apiKey?: string;
    voiceId: string;
    modelId: string;
    voiceSettings: {
      stability: number;
      similarity_boost: number;
      style: number;
      use_speaker_boost: boolean;
    };
  };
};

const KEY = "voice:settings";
const SESSION_KEY = "voice:session_api_key";

export const DEFAULT_VOICE_SETTINGS: StoredVoiceSettings = {
  provider: "device",
  saveApiKey: false,
  eleven: {
    voiceId: "",
    modelId: "eleven_multilingual_v2",
    voiceSettings: {
      stability: 0.4,
      similarity_boost: 0.85,
      style: 0.1,
      use_speaker_boost: true,
    },
  },
};

export function getVoiceSettings(): StoredVoiceSettings {
  const raw = getStoredItem<StoredVoiceSettings>(KEY);
  if (!raw) return DEFAULT_VOICE_SETTINGS;
  return {
    ...DEFAULT_VOICE_SETTINGS,
    ...raw,
    eleven: {
      ...DEFAULT_VOICE_SETTINGS.eleven!,
      ...(raw.eleven ?? {}),
      voiceSettings: {
        ...DEFAULT_VOICE_SETTINGS.eleven!.voiceSettings,
        ...(raw.eleven?.voiceSettings ?? {}),
      },
    },
  };
}

export function setVoiceSettings(next: StoredVoiceSettings) {
  setStoredItem(KEY, next, { ttlMs: 1000 * 60 * 60 * 24 * 365 });
}

export function getElevenLabsApiKey(settings?: StoredVoiceSettings): string | null {
  const s = settings ?? getVoiceSettings();
  if (s.saveApiKey && s.eleven?.apiKey) return s.eleven.apiKey;

  // Session-only API key
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function setElevenLabsApiKeySessionOnly(key: string | null) {
  try {
    if (!key) window.sessionStorage.removeItem(SESSION_KEY);
    else window.sessionStorage.setItem(SESSION_KEY, key);
  } catch {
    // ignore
  }
}

export function clearSavedElevenLabsApiKey() {
  const s = getVoiceSettings();
  if (s.eleven) {
    setVoiceSettings({
      ...s,
      saveApiKey: false,
      eleven: { ...s.eleven, apiKey: undefined },
    });
  }
  setElevenLabsApiKeySessionOnly(null);
}

export function buildElevenLabsConfig(settings?: StoredVoiceSettings): ElevenLabsConfig | null {
  const s = settings ?? getVoiceSettings();
  if (s.provider !== "elevenlabs") return null;
  const apiKey = getElevenLabsApiKey(s);
  const voiceId = s.eleven?.voiceId?.trim() ?? "";
  const modelId = s.eleven?.modelId?.trim() ?? "";
  if (!apiKey || !voiceId || !modelId) return null;

  return {
    apiKey,
    voiceId,
    modelId,
    voiceSettings: {
      stability: s.eleven?.voiceSettings.stability ?? 0.4,
      similarity_boost: s.eleven?.voiceSettings.similarity_boost ?? 0.85,
      style: s.eleven?.voiceSettings.style ?? 0,
      use_speaker_boost: s.eleven?.voiceSettings.use_speaker_boost ?? true,
    },
  };
}

export function removeVoiceSettings() {
  removeStoredItem(KEY);
}
