import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Download as DownloadIcon,
  Info,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { ApkDownloadButton } from "@/components/app/ApkDownloadButton";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { PwaInstallCard } from "@/components/app/PwaInstallCard";
import { ShareDistributionCard } from "@/components/app/ShareDistributionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  APK_DOWNLOAD_HOST,
  APK_DOWNLOAD_IS_DIRECT,
  APK_DOWNLOAD_URL,
  APK_RELEASE_DATE,
  APK_VERSION,
} from "@/lib/apkDownload";

function Step({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border/60 bg-background/45 p-4">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <div>
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function QrDownloadCard({ qrCodeUrl, installPageUrl }: { qrCodeUrl: string; installPageUrl: string }) {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <QrCode className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">QR code</p>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Scan to install</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The QR code now opens this install page so every device can choose web install, APK download, or sharing options.
          </p>
          <p className="mt-3 break-all rounded-2xl border border-border/60 bg-background/50 px-3 py-2 text-xs text-muted-foreground">
            {installPageUrl}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="rounded-2xl">
              <a href={qrCodeUrl} download="nepsis-shield-install-qr.png" target="_blank" rel="noopener noreferrer">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download QR
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl border-border/60">
              <a href={installPageUrl} target="_blank" rel="noopener noreferrer">Open install page</a>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl border-border/60">
              <a href={APK_DOWNLOAD_URL}>Open APK link</a>
            </Button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-64 rounded-3xl border border-border/60 bg-white p-3 shadow-sm">
          <img
            src={qrCodeUrl}
            alt="QR code that opens the Nepsis Shield install page"
            className="aspect-square w-full rounded-2xl"
          />
        </div>
      </div>
    </Card>
  );
}

function ApkDownloadCard() {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <Smartphone className="mr-1 h-3.5 w-3.5" /> Android APK
        </Badge>
        <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          Version {APK_VERSION}
        </Badge>
        <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {APK_DOWNLOAD_IS_DIRECT ? "Direct APK available" : "Awaiting hosted APK"}
        </Badge>
      </div>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight">APK direct download</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Download the Android APK directly for device testing and sideload installs.
      </p>

      <Separator className="my-5" />

      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Nepsis Shield APK</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Release date: {APK_RELEASE_DATE}. Source: {APK_DOWNLOAD_HOST}.
            </p>
          </div>
          {APK_DOWNLOAD_IS_DIRECT ? (
            <ApkDownloadButton className="rounded-2xl" label="Download APK" />
          ) : (
            <Button disabled className="rounded-2xl">APK not hosted yet</Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          Only install APKs from builds you trust. Android may ask you to allow installation from your browser or file manager.
        </p>
      </div>
    </Card>
  );
}

export default function Download() {
  const installPageUrl = useMemo(() => {
    if (typeof window === "undefined") return "/download";
    const url = new URL(window.location.href);
    url.hash = "";
    return url.toString();
  }, []);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=640x640&format=png&margin=16&data=${encodeURIComponent(installPageUrl)}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-border/60 bg-card text-primary">
            <OrthodoxCrossIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Install
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Get Nepsis Shield</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              QR, web install, APK, and sharing tools.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/today">Back to app</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-border/60">
            <Link to="/about">About</Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <QrDownloadCard qrCodeUrl={qrCodeUrl} installPageUrl={installPageUrl} />
        <PwaInstallCard />
        <ApkDownloadCard />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Install instructions</h2>
              <p className="mt-1 text-sm text-muted-foreground">Use one of the three download options above.</p>
            </div>
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <Step
              title="QR code install"
              description="Scan or download the QR image so someone else opens this install page with web, APK, and sharing options."
            />
            <Step
              title="Web install"
              description="Use the web install button when available, or follow the browser-specific Add to Home Screen steps."
            />
            <Step
              title="APK direct download"
              description="Tap Download APK on Android, open the file, and allow your browser or file manager if Android asks."
            />
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Distribution checklist</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use this as the handoff checklist before sending the app to a group.
              </p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <Step
              title="Use QR for in-person rollout"
              description="Print or text the QR image for parish, unit, station, or team distribution."
            />
            <Step
              title="Share the install page for all devices"
              description="The install page works for every device and keeps the web app, APK, and QR code together."
            />
            <Step
              title="Use APK only for Android sideloading"
              description="Android users may need to allow installs from their browser or file manager."
            />
            <Step
              title="Tell users it is local-first"
              description="Preferences stay on their device. External readings and links still need signal."
            />
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <ShareDistributionCard />
      </div>
    </div>
  );
}
