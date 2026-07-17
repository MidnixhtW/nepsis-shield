import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Church,
  Eye,
  Globe,
  MonitorSmartphone,
  RotateCcw,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";
import type { CalendarMode, Jurisdiction, LanguagePref } from "@/lib/settings";
import { removeStoredItem } from "@/lib/deviceStorage";
import {
  responderModeAccentClasses,
  responderModeLabels,
  responderModeOrder,
  useResponderMode,
  type ResponderMode,
} from "@/lib/responderMode";
import { cn } from "@/lib/utils";

const calendarModes = ["gregorian", "julian"] as const;
const jurisdictions = ["oca", "goarch", "antiochian", "rocor"] as const;
const languages = ["en", "el", "ru", "ar"] as const;

function isCalendarMode(value: string): value is CalendarMode {
  return calendarModes.includes(value as CalendarMode);
}

function isJurisdiction(value: string): value is Jurisdiction {
  return jurisdictions.includes(value as Jurisdiction);
}

function isLanguagePref(value: string): value is LanguagePref {
  return languages.includes(value as LanguagePref);
}

function isResponder(value: string): value is ResponderMode {
  return responderModeOrder.includes(value as ResponderMode);
}

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [responderMode, setResponderMode] = useResponderMode();
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistration().then((registration) => setOfflineReady(Boolean(registration))).catch(() => setOfflineReady(false));
  }, []);

  function saveCalendarMode(value: string) {
    if (!isCalendarMode(value)) return;
    updateSettings({ calendarMode: value });
    toast({ title: "Calendar updated", description: "Daily guidance will use your selected calendar." });
  }

  function saveJurisdiction(value: string) {
    if (!isJurisdiction(value)) return;
    updateSettings({ jurisdiction: value });
    toast({ title: "Jurisdiction updated", description: "Source links and parish suggestions were adjusted." });
  }

  function saveLanguage(value: string) {
    if (!isLanguagePref(value)) return;
    updateSettings({ language: value });
    toast({ title: "Language updated", description: "Link suggestions will prefer that language when available." });
  }

  function saveResponderMode(value: string) {
    if (!isResponder(value)) return;
    setResponderMode(value);
    toast({ title: "Role updated", description: `${responderModeLabels[value]} mode is now your default.` });
  }

  async function setNotifications(checked: boolean) {
    if (!checked) {
      updateSettings({ reminders: { enableNotifications: false } });
      toast({ title: "Notifications off", description: "Calendar reminder downloads are still available." });
      return;
    }

    if (!("Notification" in window)) {
      updateSettings({ reminders: { enableNotifications: false } });
      toast({
        variant: "destructive",
        title: "Notifications not supported",
        description: "This browser cannot show notification reminders.",
      });
      return;
    }

    const permission =
      Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;

    if (permission !== "granted") {
      updateSettings({ reminders: { enableNotifications: false } });
      toast({
        variant: "destructive",
        title: "Notification permission needed",
        description: "Enable browser notifications first, or use the calendar reminder downloads.",
      });
      return;
    }

    updateSettings({ reminders: { enableNotifications: true } });
    toast({ title: "Notifications enabled", description: "Reminder support is now allowed on this device." });
  }

  async function checkOffline() {
    if (!("serviceWorker" in navigator)) {
      toast({ variant: "destructive", title: "Offline unavailable", description: "This browser does not support service workers." });
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      setOfflineReady(false);
      toast({ title: "Offline shell pending", description: "Install or open the production app once while online to cache core pages." });
      return;
    }

    await registration.update();
    setOfflineReady(true);
    toast({ title: "Offline checked", description: "Core offline pages are ready or updating." });
  }

  function resetOnboarding() {
    removeStoredItem("onboarding:quickstart_done");
    toast({ title: "Onboarding reset", description: "The quick-start role picker will show again next time." });
  }

  function reset() {
    resetSettings();
    toast({ title: "Settings reset", description: "Preferences are back to their defaults." });
  }

  const roleTheme = responderModeAccentClasses[responderMode];

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-24 pt-6 sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Settings</p>
          <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            These are stored locally on this device.
          </p>
        </div>
        <div className="grid gap-2 sm:flex sm:flex-wrap">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button type="button" variant="outline" className="rounded-2xl border-border/60" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className={cn("rounded-3xl p-5 shadow-sm", roleTheme.card)}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 break-words">
              <h2 className="text-base font-semibold tracking-tight">Role / mode</h2>
              <p id="role-help" className="mt-1 text-sm text-muted-foreground">
                Sets your default life/service mode across Today, the guide, and Ground Me Now.
              </p>

            </div>
            <SlidersHorizontal className="h-5 w-5 shrink-0 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="grid gap-2">
            <Label htmlFor="responder-mode" className="text-xs font-semibold tracking-wide text-muted-foreground">
              Default role
            </Label>
            <Select value={responderMode} onValueChange={saveResponderMode}>
              <SelectTrigger id="responder-mode" aria-describedby="role-help" className="h-11 rounded-2xl bg-background/70">
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent>
                {responderModeOrder.map((mode) => (
                  <SelectItem key={mode} value={mode}>{responderModeLabels[mode]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Personalization</h2>
              <p id="personalization-help" className="mt-1 text-sm text-muted-foreground">
                Choose what appears on your main dashboard.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="show-grounding" className="text-sm font-medium">Show Ground Me Now on Today</Label>
                <p className="text-xs text-muted-foreground">Keep the emergency reset visible on the dashboard.</p>
              </div>
              <Switch
                id="show-grounding"
                aria-describedby="personalization-help"
                checked={settings.personalization.showGroundingOnToday}
                onCheckedChange={(checked) => updateSettings({ personalization: { showGroundingOnToday: checked } })}
              />
            </div>
          </div>
          <Button type="button" variant="outline" className="mt-3 rounded-2xl border-border/60" onClick={resetOnboarding}>
            <RotateCcw className="mr-2 h-4 w-4" /> Reset onboarding
          </Button>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Accessibility</h2>
              <p id="accessibility-help" className="mt-1 text-sm text-muted-foreground">
                Adjust readability and motion across the app.
              </p>
            </div>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
              <div>
                <Label htmlFor="large-text" className="text-sm font-medium">Larger text</Label>
                <p className="text-xs text-muted-foreground">Increases the base reading size.</p>
              </div>
              <Switch id="large-text" checked={settings.accessibility.largeText} onCheckedChange={(checked) => updateSettings({ accessibility: { largeText: checked } })} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
              <div>
                <Label htmlFor="high-contrast" className="text-sm font-medium">High contrast</Label>
                <p className="text-xs text-muted-foreground">Strengthens text and border contrast.</p>
              </div>
              <Switch id="high-contrast" checked={settings.accessibility.highContrast} onCheckedChange={(checked) => updateSettings({ accessibility: { highContrast: checked } })} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
              <div>
                <Label htmlFor="reduce-motion" className="text-sm font-medium">Reduce motion</Label>
                <p className="text-xs text-muted-foreground">Minimizes animations and transitions.</p>
              </div>
              <Switch id="reduce-motion" checked={settings.accessibility.reduceMotion} onCheckedChange={(checked) => updateSettings({ accessibility: { reduceMotion: checked } })} />
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Offline / install readiness</h2>
              <p id="offline-help" className="mt-1 text-sm text-muted-foreground">
                Check whether the offline shell is registered on this device.
              </p>
            </div>
            <MonitorSmartphone className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className={cn("mt-0.5 h-4 w-4", offlineReady ? "text-primary" : "text-muted-foreground")} />
              <div>
                <p className="text-sm font-medium">{offlineReady ? "Offline shell registered" : "Offline shell not registered yet"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Core pages are cached by the installed production app. Dynamic external content still requires signal.
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" className="mt-3 rounded-2xl border-border/60" onClick={checkOffline}>
              Check offline status
            </Button>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Calendar</h2>
              <p id="calendar-mode-help" className="mt-1 text-sm text-muted-foreground">Choose New Calendar (Gregorian) or Old Calendar (Julian).</p>
            </div>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="grid gap-2">
            <Label htmlFor="calendar-mode" className="text-xs font-semibold tracking-wide text-muted-foreground">Mode</Label>
            <Select value={settings.calendarMode} onValueChange={saveCalendarMode}>
              <SelectTrigger id="calendar-mode" aria-describedby="calendar-mode-help" className="h-11 rounded-2xl">
                <SelectValue placeholder="Choose calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gregorian">New Calendar (Gregorian)</SelectItem>
                <SelectItem value="julian">Old Calendar (Julian)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Jurisdiction</h2>
              <p id="jurisdiction-help" className="mt-1 text-sm text-muted-foreground">Primarily affects which external links we suggest.</p>
            </div>
            <Church className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="grid gap-2">
            <Label htmlFor="jurisdiction" className="text-xs font-semibold tracking-wide text-muted-foreground">Preferred</Label>
            <Select value={settings.jurisdiction} onValueChange={saveJurisdiction}>
              <SelectTrigger id="jurisdiction" aria-describedby="jurisdiction-help" className="h-11 rounded-2xl">
                <SelectValue placeholder="Choose jurisdiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oca">OCA</SelectItem>
                <SelectItem value="goarch">GOARCH</SelectItem>
                <SelectItem value="antiochian">Antiochian</SelectItem>
                <SelectItem value="rocor">ROCOR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Language</h2>
              <p id="language-help" className="mt-1 text-sm text-muted-foreground">For now this is used mainly for link suggestions.</p>
            </div>
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="grid gap-2">
            <Label htmlFor="language" className="text-xs font-semibold tracking-wide text-muted-foreground">Preferred</Label>
            <Select value={settings.language} onValueChange={saveLanguage}>
              <SelectTrigger id="language" aria-describedby="language-help" className="h-11 rounded-2xl">
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="el">Greek</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Reminders (best-effort)</h2>
              <p id="notification-help" className="mt-1 text-sm text-muted-foreground">Works only in browsers that support notifications.</p>
            </div>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />
          <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">Enable notifications</Label>
                <p className="text-xs text-muted-foreground">{settings.reminders.enableNotifications ? "Allowed on this device" : "Off by default"}</p>
              </div>
              <Switch id="notifications" aria-describedby="notification-help" checked={settings.reminders.enableNotifications} onCheckedChange={setNotifications} />
            </div>
            <div className="mt-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Notifications are optional. For reliable reminders, use the calendar reminder downloads on Today/Prayer Rule.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
