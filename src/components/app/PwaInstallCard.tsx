import { useEffect, useMemo, useState } from "react";
import { Download, MonitorSmartphone, RefreshCw, Share2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { showError, showSuccess } from "@/utils/toast";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type InstallPromptListener = (event: BeforeInstallPromptEvent | null) => void;

let deferredInstallEvent: BeforeInstallPromptEvent | null = null;
const installPromptListeners = new Set<InstallPromptListener>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event: Event) => {
    event.preventDefault();
    deferredInstallEvent = event as BeforeInstallPromptEvent;
    installPromptListeners.forEach((listener) => listener(deferredInstallEvent));
  });
}

function subscribeToInstallPrompt(listener: InstallPromptListener) {
  installPromptListeners.add(listener);
  listener(deferredInstallEvent);
  return () => installPromptListeners.delete(listener);
}

function clearInstallPrompt() {
  deferredInstallEvent = null;
  installPromptListeners.forEach((listener) => listener(null));
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && Boolean((window.navigator as { standalone?: boolean }).standalone));
}

export function PwaInstallCard() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(deferredInstallEvent);
  const [installed, setInstalled] = useState(false);
  const [swReady, setSwReady] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const unsubscribe = subscribeToInstallPrompt(setInstallEvent);

    const onInstalled = () => {
      setInstalled(true);
      clearInstallPrompt();
      showSuccess("Nepsis Shield is installed.");
    };

    window.addEventListener("appinstalled", onInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) setSwReady(true);
        else navigator.serviceWorker.ready.then(() => setSwReady(true)).catch(() => setSwReady(false));
      }).catch(() => setSwReady(false));
    }

    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const browserHint = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes("iphone") || ua.includes("ipad")) return "On iPhone/iPad: tap Share, then Add to Home Screen.";
    if (ua.includes("android")) return "On Android: tap Install if it appears, or open the browser menu and choose Add to Home screen.";
    return "On desktop: use this button when available, or click the install icon in the address bar.";
  }, []);

  const installStatus = installed
    ? "Installed"
    : installEvent
      ? "Install ready"
      : "Manual install";

  async function install() {
    if (!installEvent) {
      showSuccess(browserHint);
      return;
    }

    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    clearInstallPrompt();

    if (choice.outcome === "accepted") {
      showSuccess("Installing Nepsis Shield.");
    } else {
      showSuccess(browserHint);
    }
  }

  async function refreshOfflineCache() {
    if (!("serviceWorker" in navigator)) {
      showError("Offline support is not available in this browser.");
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      showError("Offline support is enabled after the published app is opened once while online.");
      return;
    }

    await registration.update();
    setSwReady(true);
    showSuccess("Offline-ready pages checked.");
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <MonitorSmartphone className="h-5 w-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Web install</p>
            <Badge variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs">
              {installStatus}
            </Badge>
            <Badge variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs">
              {swReady ? "Offline shell ready" : "Offline shell pending"}
            </Badge>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Install the web app</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Add Nepsis Shield to your home screen from the browser. If the install prompt is not available on this device, use the manual steps below.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <Button type="button" className="rounded-2xl" disabled={installed} onClick={install}>
            <Download className="mr-2 h-4 w-4" /> {installed ? "Installed" : installEvent ? "Install web app" : "Show install steps"}
          </Button>
          <Button type="button" variant="outline" className="rounded-2xl border-border/60" onClick={refreshOfflineCache}>
            <RefreshCw className="mr-2 h-4 w-4" /> Check offline
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-background/45 p-4">
          <p className="flex items-center gap-2 font-semibold"><Share2 className="h-4 w-4 text-primary" /> Manual web install</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{browserHint}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-background/45 p-4">
          <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Offline shell</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Install once while online; saved pages can still open if signal drops.
          </p>
        </div>
      </div>
    </Card>
  );
}
