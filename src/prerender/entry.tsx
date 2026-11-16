// Server-side entry used only at build time (scripts/prerender.mjs): renders each public page to plain HTML so the
// page's text is in the file before any JavaScript runs.
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import About from "@/pages/About";
import Download from "@/pages/Download";
import FieldManual from "@/pages/FieldManual";
import Legal from "@/pages/Legal";
import Privacy from "@/pages/Privacy";
import ReleaseNotes from "@/pages/ReleaseNotes";
import Saints from "@/pages/Saints";

export { PUBLIC_ROUTES, canonicalUrl, SITE_ORIGIN } from "@/lib/routeMeta";

const PAGES: Record<string, () => ReactNode> = {
  "/about": () => <About />,
  "/privacy": () => <Privacy />,
  "/privacy-policy": () => <Legal doc="privacy" />,
  "/terms": () => <Legal doc="terms" />,
  "/cookies": () => <Legal doc="cookies" />,
  "/download": () => <Download />,
  "/field-manual": () => <FieldManual />,
  "/release-notes": () => <ReleaseNotes />,
  "/saints": () => <Saints />,
};

export function render(path: string): string {
  const page = PAGES[path];
  if (!page) throw new Error(`No prerendered page for ${path}`);
  return renderToString(
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <StaticRouter location={path}>{page()}</StaticRouter>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}
