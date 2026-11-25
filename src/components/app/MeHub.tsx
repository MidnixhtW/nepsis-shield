import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { FavoriteStar } from "@/components/app/FavoriteStar";
import { WatchfulnessLog } from "@/components/app/WatchfulnessLog";
import { PatronOpening } from "@/components/app/PatronOpening";
import { PrayerPartner } from "@/components/app/PrayerPartner";
import { useFavorites } from "@/lib/favorites";
import { useRecentPlaces } from "@/lib/recentPlaces";
import { CURRENT_VERSION } from "@/lib/releaseInfo";
import { PolicyLinks } from "@/components/app/PolicyLinks";
import { t } from "@/i18n";

// One row style and one heading style for the whole screen, the same as the lists on Learn: a title in the book face,
// a plain line under it, a rule between rows.
function Row({ to, label, hint, trailing }: { to: string; label: string; hint?: string; trailing?: ReactNode }) {
  return (
    <li className="relative border-b border-border/80">
      <Link
        to={to}
        className="flex min-h-14 items-center gap-3 px-1 py-3 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-lg leading-tight">{label}</span>
          {hint ? <span className="mt-0.5 block truncate text-sm text-muted-foreground">{hint}</span> : null}
        </span>
        {trailing ? <span className="w-9 shrink-0" /> : <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </Link>
      {trailing ? <span className="absolute right-0 top-1/2 -translate-y-1/2">{trailing}</span> : null}
    </li>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 px-1 text-xl">{title}</h2>
      {children}
    </section>
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
    <div className="mx-auto grid w-full max-w-3xl gap-8">
      {/* Settings has one home, the App list below; the header menu covers search and themes on every screen. */}
      <div className="px-1">
        <h1 className="text-3xl sm:text-4xl">{t("me.title")}</h1>
      </div>

      <PatronOpening />

      <WatchfulnessLog />

      <PrayerPartner />

      <Section title="Favorites">
        {favorites.length ? (
          <ul className="grid border-t border-border/80">
            {favorites.map((favorite) => (
              <Row key={favorite.to} to={favorite.to} label={favorite.label} hint={favorite.area} trailing={<FavoriteStar to={favorite.to} label={favorite.label} />} />
            ))}
          </ul>
        ) : (
          <p className="border-y border-border/80 px-1 py-3 text-sm leading-relaxed text-muted-foreground">
            Tap the star on any prayer, service or topic to add it to Favorites, here and on Today.
          </p>
        )}
      </Section>

      {recent.length ? (
        <Section title="Recently opened">
          <ul className="grid border-t border-border/80">
            {recent.map((place) => (
              <Row key={place.to} to={place.to} label={place.label} hint={`${place.area}, ${timeAgo(place.at).toLowerCase()}`} />
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title="Yours">
        <ul className="grid border-t border-border/80 sm:grid-cols-2 sm:gap-x-6">
          <Row to="/pray?tab=rule" label="My prayer plan" hint="Your rule of prayer: length and steps" />
          <Row to="/pray?tab=names" label="Prayer list" hint="Names of the living and the departed" />
          <Row to="/pray?tab=journal" label="Journal" hint="Reflections and the day's examen" />
          <Row to="/pray?tab=groups" label="Prayer groups" hint="Groups you have joined" />
          <Row to="/pray?tab=prayers" label="Pinned prayers" hint="Prayer texts you pinned" />
        </ul>
      </Section>

      <Section title="App">
        <ul className="grid border-t border-border/80 sm:grid-cols-2 sm:gap-x-6">
          <Row to="/settings" label="Settings" hint="Reminders, calendar, text size" />
          <Row to="/privacy" label="Your data and backup" hint="Your data stays on this device" />
          <Row to="/download" label="Install / share" hint="Android app, home screen, QR code" />
          <Row to="/about" label="About" hint="Purpose, sources and what's new" />
        </ul>
        <div className="px-1 pt-2">
          <span className="text-xs font-medium text-muted-foreground">Version {CURRENT_VERSION}</span>
        </div>
      </Section>
      <PolicyLinks />
    </div>
  );
}
