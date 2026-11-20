import { useEffect } from "react";
import { useLocation } from "react-router";
import { canonicalUrl, routeMeta } from "@/lib/routeMeta";

function setMeta(selector: string, attribute: "content" | "href", value: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, value);
}

/** Keeps the page title, description and canonical link in step with the page being shown. */
export function RouteMetaSync() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = routeMeta(pathname);
    const url = canonicalUrl(meta);
    document.title = meta.title;
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="description"]', "content", meta.description);
  }, [pathname]);
  return null;
}
