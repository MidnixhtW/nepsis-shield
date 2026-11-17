import type { ComponentType, ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
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

// The starting screen of Pray and Learn. One lead card (what fits now, or where you left off), then every practice as a
// compact list in a few groups. Stars live on each practice's own screen, so the list stays quiet.
export function SectionLauncher({ groups, lead }: { groups: LauncherGroup[]; lead?: { eyebrow: string; tile: LauncherTile } | null }) {
  return (
    <div className="grid gap-6">
      {lead ? <LeadCard eyebrow={lead.eyebrow} tile={lead.tile} /> : null}
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={groupId(group.title)}>
          <h3 id={groupId(group.title)} className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {group.title}
          </h3>
          <ul className="grid overflow-hidden rounded-2xl border border-border/60 bg-card sm:grid-cols-2">
            {group.tiles.map(({ to, label, hint, icon: Icon }) => (
              <li key={to} className="border-b border-border/40 last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
                <Link
                  to={to}
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <Icon className="h-5 w-5 shrink-0 text-accent" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-tight">{label}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{hint}</span>
                  </span>
                  <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// aria-labelledby takes a space-separated list of ids, so an id must not contain spaces ("Pray now" -> launcher-pray-now).
function groupId(title: string) {
  return `launcher-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function LeadCard({ eyebrow, tile }: { eyebrow: string; tile: LauncherTile }) {
  const Icon = tile.icon;
  return (
    <Link
      to={tile.to}
      className="candlelight-card group flex items-center gap-4 rounded-[1.75rem] border p-5 transition-colors hover:border-accent/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
        <Icon className="h-7 w-7" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-accent">{eyebrow}</span>
        <span className="mt-1 block text-xl font-semibold leading-tight tracking-tight">{tile.label}</span>
        <span className="mt-0.5 block text-sm text-muted-foreground">{tile.hint}</span>
      </span>
      <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** The most recently opened practice in a section that is one of its tiles, for a "Continue" lead. */
export function continueTile(groups: LauncherGroup[], recent: { to: string }[]): LauncherTile | undefined {
  const tiles = groups.flatMap((group) => group.tiles);
  for (const place of recent) {
    const tile = tiles.find((item) => item.to === place.to);
    if (tile) return tile;
  }
  return undefined;
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
