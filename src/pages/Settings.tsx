import { Link } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Church,
  Globe,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/useSettings";
import type { CalendarMode, Jurisdiction, LanguagePref } from "@/lib/settings";

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground">Settings</p>
          <h1 className="text-2xl font-semibold tracking-tight">Preferences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            These are stored locally on this device.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl border-border/60"
            onClick={resetSettings}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Calendar</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose New Calendar (Gregorian) or Old Calendar (Julian).
              </p>
            </div>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />

          <div className="grid gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Mode</p>
            <Select
              value={settings.calendarMode}
              onValueChange={(v) => updateSettings({ calendarMode: v as CalendarMode })}
            >
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue placeholder="Choose calendar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gregorian">New Calendar (Gregorian)</SelectItem>
                <SelectItem value="julian">Old Calendar (Julian)</SelectItem>
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              This changes which calendar feed is used for fasting, commemorations, and lectionary.
            </p>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Jurisdiction</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Primarily affects which external links we suggest.
              </p>
            </div>
            <Church className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />

          <div className="grid gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Preferred</p>
            <Select
              value={settings.jurisdiction}
              onValueChange={(v) => updateSettings({ jurisdiction: v as Jurisdiction })}
            >
              <SelectTrigger className="h-11 rounded-2xl">
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
              <p className="mt-1 text-sm text-muted-foreground">
                For now this is used mainly for link suggestions.
              </p>
            </div>
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />

          <div className="grid gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Preferred</p>
            <Select
              value={settings.language}
              onValueChange={(v) => updateSettings({ language: v as LanguagePref })}
            >
              <SelectTrigger className="h-11 rounded-2xl">
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
              <p className="mt-1 text-sm text-muted-foreground">
                Works only in browsers that support notifications.
              </p>
            </div>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <Separator className="my-4" />

          <div className="rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Enable notifications</p>
                <p className="text-xs text-muted-foreground">Off by default</p>
              </div>
              <Switch
                checked={settings.reminders.enableNotifications}
                onCheckedChange={(checked) =>
                  updateSettings({ reminders: { enableNotifications: checked } })
                }
              />
            </div>

            <div className="mt-3 rounded-2xl border border-border/60 bg-background px-4 py-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  Notifications are optional. For reliable reminders, use the “Add reminder”
                  calendar downloads on Today/Prayer Rule.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
