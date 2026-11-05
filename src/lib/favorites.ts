import { useEffect, useState } from "react";
import { getStoredItem, setStoredItem } from "@/lib/deviceStorage";
import { DESTINATIONS, type Destination } from "@/lib/destinations";

// Places in the app the person starred, kept on this device. Each favorite is a link inside the app.
export const FAVORITES_KEY = "favorites:v1";
const CHANGE_EVENT = "nepsis:favorites-change";
const MAX_FAVORITES = 16;

export type Favorite = { to: string; label: string; area: string };

function isFavorite(value: unknown): value is Favorite {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.to === "string" && item.to.startsWith("/") && typeof item.label === "string" && typeof item.area === "string";
}

export function getFavorites(): Favorite[] {
  const saved = getStoredItem<unknown>(FAVORITES_KEY);
  return Array.isArray(saved) ? saved.filter(isFavorite).slice(0, MAX_FAVORITES) : [];
}

function save(list: Favorite[]) {
  setStoredItem(FAVORITES_KEY, list.slice(0, MAX_FAVORITES));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function toggleFavorite(item: Favorite) {
  const list = getFavorites();
  save(list.some((favorite) => favorite.to === item.to) ? list.filter((favorite) => favorite.to !== item.to) : [item, ...list]);
}

export function favoriteFor(to: string): Favorite {
  const known: Destination | undefined = DESTINATIONS.find((destination) => destination.to === to);
  return known ? { to, label: known.label, area: known.area } : { to, label: to, area: "App" };
}

export function useFavorites() {
  const [list, setList] = useState<Favorite[]>(getFavorites);
  useEffect(() => {
    const refresh = () => setList(getFavorites());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return list;
}
