export type ElevenLabsVoiceSettings = {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
};

export type ElevenLabsConfig = {
  apiKey: string;
  voiceId: string;
  modelId: string;
  voiceSettings: ElevenLabsVoiceSettings;
};

export async function elevenLabsTts(
  cfg: ElevenLabsConfig,
  text: string,
  opts?: { signal?: AbortSignal },
): Promise<Blob> {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(cfg.voiceId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": cfg.apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: cfg.modelId,
        voice_settings: cfg.voiceSettings,
      }),
      signal: opts?.signal,
    },
  );

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`ElevenLabs request failed (${res.status}): ${msg || ""}`.trim());
  }

  return await res.blob();
}
