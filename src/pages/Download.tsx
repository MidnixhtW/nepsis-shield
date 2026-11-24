import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { clearInstallPrompt, isStandalone, subscribeToInstallPrompt, type BeforeInstallPromptEvent } from "@/components/app/PwaInstallCard";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
import { APK_DOWNLOAD_IS_DIRECT, APK_DOWNLOAD_URL } from "@/lib/apkDownload";
import { INSTALL_PAGE_URL } from "@/lib/publicSite";
import { showSuccess } from "@/utils/toast";

type Device = "iphone" | "android" | "desktop";

function detectDevice(): Device {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua) || (ua.includes("macintosh") && typeof document !== "undefined" && "ontouchend" in document)) return "iphone";
  if (ua.includes("android")) return "android";
  return "desktop";
}

// What to tap, in the browser's own words, when it cannot offer the install itself.
const STEPS: Record<Device, string[]> = {
  iphone: ["Tap the Share button at the bottom of Safari.", "Scroll down and tap Add to Home Screen.", "Tap Add. Nepsis Shield is now on your home screen."],
  android: ["Open the browser menu (the three dots at the top right).", "Tap Install app, or Add to Home screen.", "Tap Install. Nepsis Shield is now with your other apps."],
  desktop: ["Look for the install icon at the right of the address bar.", "Click it, then Install.", "To put it on your phone, open this page there, or scan the code below."],
};

// Installing, one way for each device: the browser's own install where it offers one, otherwise three short steps.
// The Android app file is a quiet link underneath, for those who want it.
export default function Download() {
  const [device, setDevice] = useState<Device>("desktop");
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [stepsOpen, setStepsOpen] = useState(false);

  useEffect(() => {
    setDevice(detectDevice());
    setInstalled(isStandalone());
    const unsubscribe = subscribeToInstallPrompt(setPrompt);
    const onInstalled = () => {
      setInstalled(true);
      clearInstallPrompt();
    };
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      unsubscribe();
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) {
      setStepsOpen(true);
      return;
    }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    clearInstallPrompt();
    if (choice.outcome === "accepted") showSuccess("Installing Nepsis Shield.");
  }

  const actionLabel = prompt ? "Install Nepsis Shield" : device === "desktop" ? "Install on this computer" : "Add to Home Screen";

  async function share() {
    const data = { title: "Nepsis Shield", text: "Orthodox prayer for every day. Free, no account, works with no signal.", url: INSTALL_PAGE_URL };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(INSTALL_PAGE_URL);
      showSuccess("Link copied.");
    } catch {
      // Closing the share sheet is not an error.
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-2xl items-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Button asChild variant="ghost" className="rounded-full px-3">
          <Link to="/today" state={LOOK_AROUND_STATE}>
            <ArrowLeft aria-hidden className="h-4 w-4" /> Today
          </Link>
        </Button>
      </header>

      <main id="main-content" className="mx-auto max-w-2xl px-5 pb-20">
        <section className="pt-10 text-center sm:pt-16">
          <h1 className="text-balance text-4xl leading-tight sm:text-5xl">Keep Nepsis Shield on your phone</h1>
          <p className="scripture-text mx-auto mt-4 text-lg text-muted-foreground">
            It opens from your home screen like any app, and the prayers and the next two weeks of the calendar are there with no signal.
          </p>

          <div className="mt-9 flex flex-col items-center gap-2">
            {installed ? (
              <>
                <Button asChild className="h-14 rounded-full px-9 text-base font-semibold">
                  <Link to="/today">Open today&rsquo;s prayers</Link>
                </Button>
                <p className="text-sm text-muted-foreground">It is already on this device.</p>
              </>
            ) : (
              <Button type="button" onClick={() => void install()} className="h-14 rounded-full px-9 text-base font-semibold">
                {actionLabel}
              </Button>
            )}
            {APK_DOWNLOAD_IS_DIRECT && device !== "iphone" ? (
              <a href={APK_DOWNLOAD_URL} className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Or download the Android app
              </a>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="share-title" className="mt-16 border-t border-border/80 pt-10">
          <h2 id="share-title" className="text-2xl">Give it to someone</h2>
          <p className="scripture-text mt-2 text-base text-muted-foreground">
            Send the link, or let them scan the code from your screen. It opens this page on their phone.
          </p>
          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div className="flex flex-col items-start gap-2">
              <Button type="button" variant="outline" onClick={() => void share()} className="h-12 rounded-full px-6">
                Share the link
              </Button>
              <a href="/install-qr.svg" download="nepsis-shield-install-qr.svg" className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Save the code to print
              </a>
            </div>
            <img src="/install-qr.svg" alt="Code that opens the Nepsis Shield install page" className="h-36 w-36 rounded-xl bg-white p-2" />
          </div>
        </section>

        {APK_DOWNLOAD_IS_DIRECT ? (
          <p className="mt-14 border-t border-border/80 pt-6 text-sm leading-relaxed text-muted-foreground">
            The Android app comes straight from the project, outside the Play Store, so Android asks once to allow installs from your
            browser. You can turn that back off afterward.
          </p>
        ) : null}
      </main>

      <Dialog open={stepsOpen} onOpenChange={setStepsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{device === "desktop" ? "Install on this computer" : "Add to Home Screen"}</DialogTitle>
            <DialogDescription>Three taps, once.</DialogDescription>
          </DialogHeader>
          <ol className="grid gap-4">
            {STEPS[device].map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="font-display text-2xl leading-none text-accent tabular-nums">{index + 1}</span>
                <span className="scripture-text text-base">{step}</span>
              </li>
            ))}
          </ol>
          <Button type="button" variant="outline" className="mt-2 h-12 rounded-full" onClick={() => setStepsOpen(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
