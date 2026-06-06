import { useEffect, useMemo, useState } from "react";
import { Download, MonitorSmartphone, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { showError, showSuccess } from "@/utils/toast";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && Boolean((window.navigator as { standalone?: boolean }).standalone));
}

export function PwaInstallCard() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      showSuccess("Nepsis Shield is installed.");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) setSwReady(true);
        else navigator.serviceWorker.ready.then(() => setSwReady(true)).catch(() => setSwReady(false));
      }).catch(() => setSwReady(false));
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const browserHint = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("iphone") || ua.includes("ipad")) return "On iPhone/iPad: tap Share, then Add to Home Screen.";
    if (ua.includes("android")) return "On Android: use Install when available, or browser menu → Add to Home screen.";
    return "On desktop: use the install icon in the address bar when your browser offers it.";
  }, []);

  async function install() {
    if (!installEvent) {
      showError("Use your browser menu to add Nepsis Shield to the home screen.");
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") {
      showSuccess("Installing Nepsis Shield.");
      setInstallEvent(null);
    }
  }

  async function refreshOfflineCache() {
    if (!("serviceWorker" in navigator)) {
      showError("Offline install support is not available in this browser.");
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      showError("Offline support is enabled after the production app is installed or rebuilt.");
      return;
    }

    registration.update();
    setSwReady(true);
    showSuccess("Offline support checked.");
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="h-5 w-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Web app install</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Install Nepsis Shield as a home-screen app</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This web version can be installed like an app where supported. It opens in standalone mode and keeps a basic offline shell available.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="rounded-2xl" disabled={installed || !installEvent} onClick={install}>
            <Download className="mr-2 h-4 w-4" /> {installed ? "Installed" : installEvent ? "Install web app" : "Use browser install"}
          </Button>
          <Button type="button" variant="outline" className="rounded-2xl border-border/60" onClick={refreshOfflineCache}>
            <RefreshCw className="mr-2 h-4 w-4" /> Check offline
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="font-semibold">Standalone</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {installed ? "Running as an installed app." : "Install support depends on browser and device."}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="font-semibold">Offline shell</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {swReady ? "Service worker is ready." : "Service worker registers in production builds."}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
          <p className="flex items-center gap-2 font-semibold"><Share2 className="h-4 w-4" /> Manual install</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{browserHint}</p>
        </div>
      </div>
    </Card>
  );
}
