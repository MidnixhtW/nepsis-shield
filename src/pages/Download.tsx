import { INSTALL_PAGE_URL } from "@/lib/publicSite";
import { CURRENT_VERSION } from "@/lib/releaseInfo";
import { Link } from "react-router";
import { LOOK_AROUND_STATE } from "@/lib/appEvents";
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
import { PageContainer } from "@/components/app/PageContainer";
import { PremiumPageHeader } from "@/components/app/PremiumPageHeader";
import {
  APK_CHANNEL,
  APK_CHANNEL_LABEL,
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

function QrDownloadCard({ qrCodeUrl, installPageUrl }: { qrCodeUrl: string; installPageUrl: string }) {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <QrCode className="h-5 w-5" />
            <p className="text-xs font-semibold">QR code</p>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Scan to install</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            The code opens this page, so anyone can install the app on their own phone in a few taps.
          </p>
          <p className="mt-3 break-all rounded-2xl border border-border/60 bg-background/50 px-3 py-2 text-xs text-muted-foreground">
            {installPageUrl}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild className="rounded-2xl">
              <a href={qrCodeUrl} download="nepsis-shield-install-qr.svg" target="_blank" rel="noopener noreferrer">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download QR
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl border-border/60">
              <a href={installPageUrl} target="_blank" rel="noopener noreferrer">Open install page</a>
            </Button>
          </div>
        </div>

        <div className="qr-code-surface mx-auto w-full max-w-64 rounded-3xl border border-border/60 bg-white p-3 shadow-sm">
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

// The version people see: the one set for the Android build, else the app's own version (never a build label).
const SHOWN_VERSION = APK_VERSION === "web-preview" ? CURRENT_VERSION : APK_VERSION;

function ApkDownloadCard() {
  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          <Smartphone className="mr-1 h-3.5 w-3.5" /> Android only
        </Badge>
        <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {APK_CHANNEL_LABEL} · v{SHOWN_VERSION}
        </Badge>
        <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {APK_DOWNLOAD_IS_DIRECT ? "Ready to install" : "Coming soon"}
        </Badge>
      </div>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight">Android Direct Install (v{SHOWN_VERSION})</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {APK_CHANNEL === "release"
          ? "Download the signed Android app and install it directly."
          : "Optional. Most people only need the app above. On Android you can also install it directly: same app, works offline, and it updates as new versions come out."}
      </p>

      <Separator className="my-5" />

      <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Nepsis Shield for Android</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {APK_RELEASE_DATE}. Downloads from {APK_DOWNLOAD_HOST}.
            </p>
          </div>
          {APK_DOWNLOAD_IS_DIRECT ? (
            <ApkDownloadButton className="rounded-2xl" label="Download APK" />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 px-4 py-2 text-sm font-semibold text-muted-foreground">
              Coming soon
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          This file comes straight from the Nepsis Shield project. Because it is not from the Play Store, Android asks once to allow installs from your browser. That is normal, and you can turn it back off after.
        </p>
      </div>
    </Card>
  );
}

export default function Download() {
  const installPageUrl = INSTALL_PAGE_URL;
  // Made once from INSTALL_PAGE_URL and kept with the site, so showing it asks no other server.
  const qrCodeUrl = "/install-qr.svg";

  return (
    <PageContainer>
      <PremiumPageHeader
        eyebrow="Install & share"
        title="Take Nepsis Shield with you"
        description="Add it to your home screen in a few taps. It works offline and needs no account."
        icon={<OrthodoxCrossIcon className="h-6 w-6" />}
        actions={
          <>
            <Button asChild variant="outline" className="premium-action"><Link to="/today" state={LOOK_AROUND_STATE}>Back to app</Link></Button>
            <Button asChild variant="outline" className="premium-action"><Link to="/about">About</Link></Button>
          </>
        }
      />

      <div className="premium-card-stack mt-5">

        <PwaInstallCard />
        <QrDownloadCard qrCodeUrl={qrCodeUrl} installPageUrl={installPageUrl} />
        <ApkDownloadCard />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Install instructions</h2>
              <p className="mt-1 text-sm text-muted-foreground">The web app is the simplest way, on any phone.</p>
            </div>
            <Info className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <Step
              title="Web install"
              description="Tap Install when your browser offers it, or use Add to Home Screen from the browser menu."
            />
            <Step
              title="Share with someone"
              description="Show or send the QR code; it opens this page on their phone."
            />
            <Step
              title="Android public beta"
              description="Optional. Download it on Android, open the file, and allow the install if Android asks."
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
              description="The install page works on every device and keeps the web app and QR code together."
            />
            <Step
              title="Point people to the web app first"
              description="Offer the Android public beta to those who want it."
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
    </PageContainer>
  );
}
