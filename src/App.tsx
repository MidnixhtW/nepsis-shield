import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { AccessibilityPreferences } from "@/components/app/AccessibilityPreferences";
import { ScrollToTop } from "@/components/app/ScrollToTop";
import { ConnectionStatusBanner } from "@/components/app/ConnectionStatusBanner";
import { AudioProvider } from "@/components/app/AudioProvider";

import { isPhilokaliaUnlocked } from "@/lib/philokaliaUnlock";

// Pages other than Today load on demand, keeping the first download small.
const Privacy = lazy(() => import("./pages/Privacy"));
const About = lazy(() => import("./pages/About"));
const Download = lazy(() => import("./pages/Download"));
const FieldManual = lazy(() => import("./pages/FieldManual"));
const ReleaseNotes = lazy(() => import("./pages/ReleaseNotes"));
const Saints = lazy(() => import("@/pages/Saints"));
const Settings = lazy(() => import("@/pages/Settings"));
const PhilokaliaGuide = lazy(() => import("@/pages/PhilokaliaGuide"));

const queryClient = new QueryClient();

// Cookie-free visit counts (Vercel Web Analytics), only on the public website: not in the
// Android app, local builds, or tests. The script is served from the site's own domain.
const countVisits =
  import.meta.env.PROD &&
  typeof window !== "undefined" &&
  /(^|\.)nepsisshield\.com$|\.vercel\.app$/.test(window.location.hostname);

function PhilokaliaRoute() {
  return isPhilokaliaUnlocked() ? <PhilokaliaGuide /> : <NotFound />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AccessibilityPreferences />
      <TooltipProvider>
        <AudioProvider>
          <Toaster />
          <Sonner />
          {countVisits ? <Analytics mode="production" /> : null}
          <BrowserRouter>
            <ConnectionStatusBanner />
            <ScrollToTop />
            <Suspense fallback={<div className="boot-shell" role="status" aria-label="Loading" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/privacy" element={<Privacy />} />

              <Route path="/about" element={<About />} />
              <Route path="/download" element={<Download />} />
              <Route path="/field-manual" element={<FieldManual />} />
              <Route path="/release-notes" element={<ReleaseNotes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/saints" element={<Saints />} />
              <Route path="/philokalia" element={<PhilokaliaRoute />} />
              <Route path="/:section" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
          </BrowserRouter>
        </AudioProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;