import type { ComponentType, ReactNode } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { FavoriteStar } from "@/components/app/FavoriteStar";

export type LauncherTile = {
  /** In-app link the tile opens, such as /pray?tab=services. */
  to: string;
  label: string;
  hint: string;
  icon: ComponentType<{ className?: string }>;
};

export type LauncherGroup = { title: string; tiles: LauncherTile[] };

// The starting screen of Pray and Learn: a two-column grid of tiles in a few groups, each one tap from its practice.
export function SectionLauncher({ groups }: { groups: LauncherGroup[] }) {
  return (
    <div className="grid gap-6">
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={`launcher-${group.title}`}>
          <h3 id={`launcher-${group.title}`} className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {group.title}
          </h3>
          <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
            {group.tiles.map(({ to, label, hint, icon: Icon }) => (
              <li key={to} className="relative">
                <Link
                  to={to}
                  className="group flex h-full min-h-[8.5rem] flex-col gap-3 rounded-2xl border border-border/60 bg-card p-3.5 transition-colors hover:border-accent/45 hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 pr-1">
                    <span className="block font-semibold leading-tight">{label}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted-foreground">{hint}</span>
                  </span>
                </Link>
                <FavoriteStar to={to} label={label} className="absolute right-1 top-1" />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// Shown above an open practice: a way back to the tiles, the practice's name, and its star.
export function SectionBackBar({ backTo, backLabel, title, favoriteTo }: { backTo: string; backLabel: string; title: string; favoriteTo?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full px-2.5">
        <Link to={backTo}>
          <ArrowLeft className="mr-1.5 h-4 w-4" /> {backLabel}
        </Link>
      </Button>
      <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground/60" />
      <h2 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">{title}</h2>
      {favoriteTo ? <FavoriteStar to={favoriteTo} label={title} /> : null}
    </div>
  );
}

export function LauncherIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="px-1">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      {children}
    </div>
  );
}
