import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mic2, ShieldAlert, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { showError, showLoading, showSuccess, dismissToast } from "@/utils/toast";
import { elevenLabsTts } from "@/lib/elevenlabs";
import {
  buildElevenLabsConfig,
  clearSavedElevenLabsApiKey,
  DEFAULT_VOICE_SETTINGS,
  getElevenLabsApiKey,
  getVoiceSettings,
  setElevenLabsApiKeySessionOnly,
  setVoiceSettings,
  type StoredVoiceSettings,
  type VoiceProvider,
} from "@/lib/voiceSettings";

const MODEL_OPTIONS = [
  { id: "eleven_multilingual_v2", label: "Multilingual v2" },
  { id: "eleven_turbo_v2_5", label: "Turbo v2.5" },
  { id: "eleven_monolingual_v1", label: "Monolingual v1" },
] as const;

export default function Voice() {
  const initial = useMemo(() => getVoiceSettings(), []);
  const [settings, setSettings] = useState<StoredVoiceSettings>(initial);

  const [sessionApiKey, setSessionApiKey] = useState<string>(
    getElevenLabsApiKey(initial) ?? "",
  );

  const [testText, setTestText] = useState(
    "Lord Jesus Christ, Son of God, have mercy on me, a sinner.",
  );

  function save(next: StoredVoiceSettings) {
    setSettings(next);
    setVoiceSettings(next);
  }

  async function testVoice() {
    const cfg = buildElevenLabsConfig(settings);
    if (!cfg) {
      showError("Set provider to ElevenLabs and provide API key + voice ID first.");
      return;
    }

    const id = showLoading("Generating audio…");
    try {
      const blob = await elevenLabsTts(cfg, testText);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
      showSuccess("Playing.");
    } catch (e) {
      showError(e instanceof Error ? e.message : "Couldn’t generate audio.");
    } finally {
      dismissToast(id);
    }
  }

  const provider: VoiceProvider = settings.provider;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Settings</p>
          <h1 className="text-2xl font-semibold tracking-tight">Voice & audio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure guided session voice (device TTS or ElevenLabs).
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl border-border/60">
          <Link to="/today">Back to app</Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Voice provider</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Device TTS is simplest. ElevenLabs can sound more natural.
              </p>
            </div>
            <Mic2 className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <Select
            value={provider}
            onValueChange={(v) =>
              save({
                ...settings,
                provider: (v as VoiceProvider) || "device",
              })
            }
          >
            <SelectTrigger className="h-11 rounded-2xl">
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="device">Device (built-in)</SelectItem>
              <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
            </SelectContent>
          </Select>

          <p className="mt-3 text-xs text-muted-foreground">
            Note: ElevenLabs calls are made from your browser directly to ElevenLabs.
          </p>
        </Card>

        {provider === "elevenlabs" ? (
          <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold tracking-tight">ElevenLabs</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Provide your API key and voice ID.
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>

            <Separator className="my-4" />

            <div className="grid gap-3">
              <div className="rounded-2xl border border-border/60 bg-amber-50/60 p-4 text-amber-950 dark:bg-amber-500/10 dark:text-amber-50">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold">Security note</p>
                    <p className="mt-1 text-xs leading-relaxed opacity-90">
                      Storing an API key in the browser can be risky (extensions, shared devices).
                      Use session-only mode if you’re unsure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">API key</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      value={sessionApiKey}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSessionApiKey(v);
                        // Always keep session copy updated.
                        setElevenLabsApiKeySessionOnly(v || null);
                        // If save is enabled, persist into settings.
                        if (settings.saveApiKey) {
                          save({
                            ...settings,
                            eleven: {
                              ...settings.eleven!,
                              apiKey: v,
                            },
                          });
                        }
                      }}
                      placeholder="Paste your ElevenLabs API key"
                      className="h-11 rounded-2xl pl-10"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 sm:w-[15rem]">
                    <div>
                      <p className="text-sm font-medium">Save key</p>
                      <p className="text-xs text-muted-foreground">(device storage)</p>
                    </div>
                    <Switch
                      checked={settings.saveApiKey}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          clearSavedElevenLabsApiKey();
                          save({
                            ...settings,
                            saveApiKey: false,
                            eleven: { ...settings.eleven!, apiKey: undefined },
                          });
                          return;
                        }

                        // Turn on saving: store current session key.
                        save({
                          ...settings,
                          saveApiKey: true,
                          eleven: { ...settings.eleven!, apiKey: sessionApiKey },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">Voice ID</p>
                  <Input
                    value={settings.eleven?.voiceId ?? ""}
                    onChange={(e) =>
                      save({
                        ...settings,
                        eleven: { ...settings.eleven!, voiceId: e.target.value },
                      })
                    }
                    placeholder="e.g. 21m00Tcm4TlvDq8ikWAM"
                    className="h-11 rounded-2xl"
                  />
                </div>
                <div className="grid gap-2">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground">Model</p>
                  <Select
                    value={settings.eleven?.modelId ?? DEFAULT_VOICE_SETTINGS.eleven!.modelId}
                    onValueChange={(v) =>
                      save({
                        ...settings,
                        eleven: { ...settings.eleven!, modelId: v },
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue placeholder="Choose model" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODEL_OPTIONS.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Voice tuning</p>
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">Stability</p>
                    <Slider
                      value={[settings.eleven?.voiceSettings.stability ?? 0.4]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={(v) =>
                        save({
                          ...settings,
                          eleven: {
                            ...settings.eleven!,
                            voiceSettings: {
                              ...settings.eleven!.voiceSettings,
                              stability: v[0] ?? 0.4,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {String(settings.eleven?.voiceSettings.stability ?? 0.4)}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">Similarity</p>
                    <Slider
                      value={[settings.eleven?.voiceSettings.similarity_boost ?? 0.85]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={(v) =>
                        save({
                          ...settings,
                          eleven: {
                            ...settings.eleven!,
                            voiceSettings: {
                              ...settings.eleven!.voiceSettings,
                              similarity_boost: v[0] ?? 0.85,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {String(settings.eleven?.voiceSettings.similarity_boost ?? 0.85)}
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <p className="text-xs font-semibold text-muted-foreground">Style</p>
                    <Slider
                      value={[settings.eleven?.voiceSettings.style ?? 0.1]}
                      min={0}
                      max={1}
                      step={0.05}
                      onValueChange={(v) =>
                        save({
                          ...settings,
                          eleven: {
                            ...settings.eleven!,
                            voiceSettings: {
                              ...settings.eleven!.voiceSettings,
                              style: v[0] ?? 0.1,
                            },
                          },
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {String(settings.eleven?.voiceSettings.style ?? 0.1)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">Speaker boost</p>
                      <p className="text-xs text-muted-foreground">Optional</p>
                    </div>
                    <Switch
                      checked={settings.eleven?.voiceSettings.use_speaker_boost ?? true}
                      onCheckedChange={(checked) =>
                        save({
                          ...settings,
                          eleven: {
                            ...settings.eleven!,
                            voiceSettings: {
                              ...settings.eleven!.voiceSettings,
                              use_speaker_boost: checked,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground">Test</p>
                <Textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="min-h-24 rounded-2xl"
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" className="rounded-2xl" onClick={testVoice}>
                    Test voice
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-2xl border-border/60"
                    onClick={() => {
                      save(DEFAULT_VOICE_SETTINGS);
                      setSessionApiKey("");
                      setElevenLabsApiKeySessionOnly(null);
                      showSuccess("Reset voice settings.");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">How this is used</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Guided Programs use this voice setting for spoken segments. Silence segments remain silent.
          </p>
        </Card>
      </div>
    </div>
  );
}
