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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  APK_DOWNLOAD_HOST,
  APK_DOWNLOAD_IS_DIRECT,
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

function getDownloadPageUrl() {
  if (typeof window === "undefined") return "/download";
  return `${window.location.origin}/download`;
}

export default function Download() {
  const downloadPageUrl = getDownloadPageUrl();
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=640x640&format=png&data=${encodeURIComponent(downloadPageUrl)}`;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 glow">
            <OrthodoxCrossIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              App downloads
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Download Nepsis Shield</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose APK direct download, web download, or download a QR code to share this page.
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

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
          <div className="relative field-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/65 to-accent/10" />
            <div className="relative p-5 sm:p-6">
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

              <div className="mt-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Only install APKs from builds you trust. Android may ask you to allow installation from your browser or file manager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">QR code download</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Download the sharing QR code</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Save this QR code so others can scan it and open the download page.
              </p>
            </div>
            <QrCode className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="mx-auto max-w-64 rounded-3xl border border-border/60 bg-white p-4 shadow-sm">
            <img
              src={qrCodeUrl}
              alt="QR code for the Nepsis Shield download page"
              className="aspect-square w-full rounded-2xl"
            />
          </div>

          <Button asChild className="mt-4 w-full rounded-2xl">
            <a href={qrCodeUrl} download="nepsis-shield-download-qr.png" target="_blank" rel="noopener noreferrer">
              <DownloadIcon className="mr-2 h-4 w-4" /> Download QR code
            </a>
          </Button>

          <p className="mt-3 break-all text-xs leading-relaxed text-muted-foreground">
            QR target: {downloadPageUrl}
          </p>
        </Card>
      </div>

      <div className="mt-4">
        <PwaInstallCard />
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
              title="APK direct download"
              description="Tap Download APK on Android, open the file, and allow your browser or file manager if Android asks."
            />
            <Step
              title="Web download"
              description="Use the web download button to install the browser version to your home screen where supported."
            />
            <Step
              title="QR code download"
              description="Download the QR image and share it so someone else can scan and open this download page."
            />
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Available options only</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Other package and artifact download choices have been removed from this page.
              </p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>

          <Separator className="my-4" />

          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>APK direct download</li>
            <li>Web download</li>
            <li>QR code download</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
