// Title, description and canonical address for each public page. The app sets these as you move between pages, and
// the build writes a ready-made HTML file for each one (scripts/prerender.mjs) so crawlers and link previews that skip
// JavaScript still see the right page.

export const SITE_ORIGIN = "https://www.nepsisshield.com";
export const SITE_NAME = "Nepsis Shield";

export type RouteMeta = { path: string; title: string; description: string };

const HOME: RouteMeta = {
  path: "/",
  title: SITE_NAME,
  description:
    "Nepsis Shield: a free Orthodox Christian companion for prayer, Scripture, the saints, and the fasts, for everyday life and for those who serve.",
};

export const PUBLIC_ROUTES: RouteMeta[] = [
  {
    path: "/about",
    title: `About · ${SITE_NAME}`,
    description: "What Nepsis Shield is, who it is for, where its prayers and readings come from, and how to install it.",
  },
  {
    path: "/privacy",
    title: `Privacy and backup · ${SITE_NAME}`,
    description: "Your notes stay on your device. Export an encrypted backup, restore it, or delete everything Nepsis Shield keeps.",
  },
  { path: "/privacy-policy", title: `Privacy Policy · ${SITE_NAME}`, description: "The Nepsis Shield privacy policy." },
  { path: "/terms", title: `Terms of Use · ${SITE_NAME}`, description: "The Nepsis Shield terms of use." },
  { path: "/cookies", title: `Cookie Policy · ${SITE_NAME}`, description: "Nepsis Shield uses no tracking cookies. Here is what it keeps on your device and why." },
  {
    path: "/download",
    title: `Install · ${SITE_NAME}`,
    description: "Install Nepsis Shield on your phone: add the web app to your home screen, or download the Android app.",
  },
  {
    path: "/field-manual",
    title: `Life & Service Guide · ${SITE_NAME}`,
    description: "Orthodox guidance for military, police, fire, EMS, dispatch and chaplains: stress, grief, travel, and keeping a rule on duty.",
  },
  { path: "/release-notes", title: `What's new · ${SITE_NAME}`, description: "Release notes for each version of Nepsis Shield." },
  { path: "/saints", title: `Saints · ${SITE_NAME}`, description: "Lives of the saints, warrior saints, saints of the West, and choosing a patron saint." },
];

/** Metadata for a path; app sections and unknown paths share the home page's, so they all point crawlers home. */
export function routeMeta(pathname: string): RouteMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PUBLIC_ROUTES.find((route) => route.path === path) ?? HOME;
}

export function canonicalUrl(meta: RouteMeta) {
  return meta.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${meta.path}`;
}
