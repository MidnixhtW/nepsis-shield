import { useMemo } from "react";
import { ClipboardCopy, Megaphone, MessageSquare, QrCode, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { APK_DOWNLOAD_IS_DIRECT, APK_DOWNLOAD_URL } from "@/lib/apkDownload";
import { showError, showSuccess } from "@/utils/toast";

function absoluteUrl(path: string) {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

async function copyToClipboard(label: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    showSuccess(`${label} copied.`);
  } catch {
    showError("Couldn't copy to clipboard.");
  }
}

export function ShareDistributionCard() {
  const { downloadPageUrl, webAppUrl, shareText, smsUrl, mailUrl } = useMemo(() => {
    const download = absoluteUrl("/download");
    const web = absoluteUrl("/today");
    const text = `Nepsis Shield is ready to install. Open this link for web install, Android APK, and QR download: ${download}`;
    return {
      downloadPageUrl: download,
      webAppUrl: web,
      shareText: text,
      smsUrl: `sms:?&body=${encodeURIComponent(text)}`,
      mailUrl: `mailto:?subject=${encodeURIComponent("Install Nepsis Shield")}&body=${encodeURIComponent(text)}`,
    };
  }, []);

  async function shareInstall() {
    if (!navigator.share) {
      await copyToClipboard("Install message", shareText);
      return;
    }

    try {
      await navigator.share({
        title: "Install Nepsis Shield",
        text: "Nepsis Shield is ready to install.",
        url: downloadPageUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      showError("Couldn't open the share sheet.");
    }
  }

  return (
    <Card className="rounded-3xl border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Megaphone className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Share kit</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Get Nepsis Shield to others</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Share the install page for the cleanest path. It includes the web app, Android APK, and QR code in one place.
          </p>
        </div>
        <Button type="button" className="rounded-2xl lg:shrink-0" onClick={shareInstall}>
          <Share2 className="mr-2 h-4 w-4" /> Share install page
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 bg-background/60 p-4 text-left" onClick={() => copyToClipboard("Download page link", downloadPageUrl)}>
          <ClipboardCopy className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Copy install link</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Best all-device link</span>
          </span>
        </Button>

        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 bg-background/60 p-4 text-left" onClick={() => copyToClipboard("Web app link", webAppUrl)}>
          <ShieldCheck className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Copy web app link</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Browser/PWA access</span>
          </span>
        </Button>

        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 bg-background/60 p-4 text-left" disabled={!APK_DOWNLOAD_IS_DIRECT} onClick={() => copyToClipboard("APK link", APK_DOWNLOAD_URL)}>
          <QrCode className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Copy APK link</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Android direct install</span>
          </span>
        </Button>

        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 bg-background/60 p-4 text-left" onClick={() => copyToClipboard("Share message", shareText)}>
          <MessageSquare className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Copy message</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Text to a group</span>
          </span>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="secondary" className="rounded-2xl bg-background/70">
          <a href={smsUrl}>Send text</a>
        </Button>
        <Button asChild variant="secondary" className="rounded-2xl bg-background/70">
          <a href={mailUrl}>Send email</a>
        </Button>
      </div>
    </Card>
  );
}
