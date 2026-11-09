import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router";
import { Bookmark, ChevronRight, Clock, Compass, Download, Info, Menu, NotebookPen, ScrollText, Settings as SettingsIcon, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FavoriteStar } from "@/components/app/FavoriteStar";
import { WatchfulnessLog } from "@/components/app/WatchfulnessLog";
import { PrayerPartner } from "@/components/app/PrayerPartner";
import { openAppMenu } from "@/lib/appEvents";
import { useFavorites } from "@/lib/favorites";
import { useRecentPlaces } from "@/lib/recentPlaces";
import { CURRENT_VERSION } from "@/lib/releaseInfo";

function Row({ to, icon: Icon, label, hint, trailing }: { to: string; icon: ComponentType<{ className?: string }>; label: string; hint?: string; trailing?: ReactNode }) {
  return (
    <li className="relative">
      <Link
        to={to}
        className="flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon className="h-5 w-5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold leading-tight">{label}</span>
          {hint ? <span className="mt-0.5 block truncate text-xs text-muted-foreground">{hint}</span> : null}
        </span>
        {trailing ? <span className="w-9 shrink-0" /> : <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </Link>
      {trailing ? <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span> : null}
    </li>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="rounded-3xl border p-2 sm:p-3">
      <h3 className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
      {children}
    </Card>
  );
}

function timeAgo(at: number) {
  const minutes = Math.round((Date.now() - at) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

// Everything personal in one place: the week, favorites, recent places, your own lists, and the app's settings.
export function MeHub() {
  const favorites = useFavorites();
  const recent = useRecentPlaces();

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4 sm:gap-5">
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Me</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Your prayer life</h2>
        </div>
        <Button asChild variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full" aria-label="Settings">
          <Link to="/settings"><SettingsIcon className="h-[18px] w-[18px]" /></Link>
        </Button>
      </div>

      <WatchfulnessLog />

      <PrayerPartner />

      <Section title="Favorites">
        {favorites.length ? (
          <ul className="grid">
            {favorites.map((favorite) => (
              <Row key={favorite.to} to={favorite.to} icon={Bookmark} label={favorite.label} hint={favorite.area} trailing={<FavoriteStar to={favorite.to} label={favorite.label} />} />
            ))}
          </ul>
        ) : (
          <p className="px-3 pb-3 text-sm leading-relaxed text-muted-foreground">
            Tap the star on any prayer, service or topic to keep it here and on Today.
          </p>
        )}
      </Section>

      {recent.length ? (
        <Section title="Recently opened">
          <ul className="grid">
            {recent.map((place) => (
              <Row key={place.to} to={place.to} icon={Clock} label={place.label} hint={`${place.area} · ${timeAgo(place.at)}`} />
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Yours">
        <ul className="grid sm:grid-cols-2">
          <Row to="/pray?tab=rule" icon={Compass} label="My prayer plan" hint="Your rule of prayer: length and steps" />
          <Row to="/pray?tab=names" icon={ScrollText} label="Prayer list" hint="Names of the living and the departed" />
          <Row to="/pray?tab=journal" icon={NotebookPen} label="Journal" hint="Reflections and the day's examen" />
          <Row to="/pray?tab=groups" icon={Users} label="Prayer groups" hint="Groups you have joined" />
          <Row to="/pray?tab=prayers" icon={Sparkles} label="Pinned prayers" hint="Prayers you starred" />
        </ul>
      </Section>

      <Section title="App">
        <ul className="grid sm:grid-cols-2">
          <Row to="/settings" icon={SettingsIcon} label="Settings" hint="Reminders, calendar, text size" />
          <Row to="/privacy" icon={Shield} label="Privacy and backup" hint="Your data stays on this device" />
          <Row to="/download" icon={Download} label="Install / share" hint="Android app, home screen, QR code" />
          <Row to="/about" icon={Info} label="About" hint="Purpose, sources and what's new" />
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2 pt-1">
          <Button type="button" variant="ghost" size="sm" className="rounded-full px-2.5" onClick={openAppMenu}>
            <Menu className="mr-2 h-4 w-4" /> Menu, search and themes
          </Button>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Version {CURRENT_VERSION}</span>
        </div>
      </Section>
    </div>
  );
}
