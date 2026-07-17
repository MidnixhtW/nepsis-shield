import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Download from "./pages/Download";
import FieldManual from "./pages/FieldManual";
import ReleaseNotes from "./pages/ReleaseNotes";
import { ThemeProvider } from "@/components/app/ThemeProvider";
import { AccessibilityPreferences } from "@/components/app/AccessibilityPreferences";
import { ScrollToTop } from "@/components/app/ScrollToTop";
import { SaintMichaelIntro } from "@/components/app/SaintMichaelIntro";
import { ConnectionStatusBanner } from "@/components/app/ConnectionStatusBanner";
import { AudioProvider } from "@/components/app/AudioProvider";
import Saints from "@/pages/Saints";

import Settings from "@/pages/Settings";
import PhilokaliaGuide from "@/pages/PhilokaliaGuide";
import { isPhilokaliaUnlocked } from "@/lib/philokaliaUnlock";

const queryClient = new QueryClient();

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
          <BrowserRouter>
            <ConnectionStatusBanner />
            <SaintMichaelIntro />
            <ScrollToTop />
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
          </BrowserRouter>
        </AudioProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;