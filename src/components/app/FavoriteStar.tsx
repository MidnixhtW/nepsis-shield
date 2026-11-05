import { Star } from "lucide-react";
import { favoriteFor, toggleFavorite, useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

// A star that adds a place to Favorites (shown on Me and Today). `to` is the in-app link.
export function FavoriteStar({ to, label, className }: { to: string; label?: string; className?: string }) {
  const favorites = useFavorites();
  const active = favorites.some((favorite) => favorite.to === to);
  const item = favoriteFor(to);
  const name = label ?? item.label;

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={active ? "In your favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite({ ...item, label: name });
      }}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "text-accent",
        className,
      )}
    >
      <Star aria-hidden className={cn("h-[18px] w-[18px]", active && "fill-current")} />
    </button>
  );
}
