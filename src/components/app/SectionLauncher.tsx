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
  /** How long it takes, as a short badge ("5 min"), when that is known. */
  duration?: string;
  /** The word on the lead card's button; "Begin" unless set. */
  cta?: string;
  /** The icon that pictures it, from public/icons/tiles (e.g. "pantocrator"). Tiles with art are shown as pictures. */
  art?: string;
};

export const tileArt = (key: string) => `/icons/tiles/${key}.webp`;

export type LauncherGroup = { title: string; tiles: LauncherTile[] };

// The starting screen of Pray and Learn. One lead card (what fits now, or where you left off), then every practice as a
// compact list in a few groups. Stars live on each practice's own screen, so the list stays quiet.
export function SectionLauncher({ groups, lead }: { groups: LauncherGroup[]; lead?: { eyebrow: string; tile: LauncherTile } | null }) {
  return (
    <div className="grid gap-9">
      {lead ? <LeadCard eyebrow={lead.eyebrow} tile={lead.tile} /> : null}
      {groups.map((group) =>
        group.tiles.every((tile) => tile.art) ? <ArtShelf key={group.title} group={group} /> : <ListGroup key={group.title} group={group} />,
      )}
    </div>
  );
}

// A row of icons you swipe through, the way a prayer book opens on a picture: the icon, its name, and how long it
// takes. No line of explanation under each one; the picture and the name carry it.
function ArtShelf({ group }: { group: LauncherGroup }) {
  return (
    <section aria-labelledby={groupId(group.title)}>
      <h2 id={groupId(group.title)} className="mb-3 px-1 text-xl">
        {group.title}
      </h2>
      <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-0 [scrollbar-width:none] sm:-mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {group.tiles.map((tile) => (
          <li key={tile.to} className="w-[9.5rem] shrink-0 snap-start sm:w-44">
            <Link
              to={tile.to}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-card">
                <img
                  src={tileArt(tile.art!)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-[0.985] motion-reduce:transition-none"
                />
                <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </span>
              <span className="mt-2.5 block px-0.5 font-display text-base leading-snug">{tile.label}</span>
              {tile.duration ? <span className="meta-label mt-0.5 block px-0.5 text-muted-foreground">{tile.duration}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ListGroup({ group }: { group: LauncherGroup }) {
  return (
    <section aria-labelledby={groupId(group.title)}>
      <h2 id={groupId(group.title)} className="mb-2 px-1 text-xl">
        {group.title}
      </h2>
      <ul className="grid border-t border-border/80 sm:grid-cols-2">
        {group.tiles.map(({ to, label, duration }) => (
          <li key={to} className="border-b border-border/80">
            <Link
              to={to}
              className="flex min-h-14 items-center gap-3 px-1 py-3 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
            >
              <span className="min-w-0 flex-1 font-display text-lg leading-tight">{label}</span>
              {duration ? <span className="meta-label shrink-0 text-muted-foreground">{duration}</span> : null}
              <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// aria-labelledby takes a space-separated list of ids, so an id must not contain spaces ("Pray now" -> launcher-pray-now).
function groupId(title: string) {
  return `launcher-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

// The prayer for this hour (or where you left off), large: its icon across the top, its name, and one way in.
function LeadCard({ eyebrow, tile }: { eyebrow: string; tile: LauncherTile }) {
  if (!tile.art) {
    return (
      <Link to={tile.to} className="block border-y border-border/80 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="meta-label block text-muted-foreground">{eyebrow}</span>
        <span className="mt-1 block font-display text-3xl leading-tight">{tile.label}</span>
      </Link>
    );
  }
  return (
    <Link
      to={tile.to}
      className="group relative block overflow-hidden rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="relative block aspect-[4/3] sm:aspect-[16/7]">
        <img src={tileArt(tile.art)} alt="" decoding="async" className="h-full w-full object-cover object-[50%_22%]" />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0D0C0B] via-[#0D0C0B]/55 to-transparent" />
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <span className="min-w-0">
          <span className="meta-label block text-[#F3EFEA]/80">{eyebrow}</span>
          <span className="mt-1 block font-display text-3xl leading-tight text-[#F3EFEA]">{tile.label}</span>
          {tile.duration ? <span className="meta-label mt-1 block text-[#F3EFEA]/80">{tile.duration}</span> : null}
        </span>
        <span className="shrink-0 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-active:scale-[0.985]">
          {tile.cta ?? "Begin"}
        </span>
      </span>
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
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold tracking-tight">{title}</h1>
      {favoriteTo ? <FavoriteStar to={favoriteTo} label={title} /> : null}
    </div>
  );
}

// A section's plain name at the top of its starting screen, the same word as its tab.
export function LauncherIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-1">
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      {children}
    </div>
  );
}
