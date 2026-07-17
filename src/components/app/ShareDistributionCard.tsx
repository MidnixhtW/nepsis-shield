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
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      showSuccess(`${label} copied.`);
      return;
    } catch {
      // Fall through to the textarea copy method below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("copy failed");
    showSuccess(`${label} copied.`);
  } catch {
    showError("Couldn't copy to clipboard.");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function ShareDistributionCard() {
  const { downloadPageUrl, webAppUrl, shareText, redditText, smsUrl, mailUrl } = useMemo(() => {
    const download = absoluteUrl("/download");
    const web = absoluteUrl("/today");
    const text = `Nepsis Shield is ready to install. Open this link for web install, Android APK, and QR download: ${download}`;
    const reddit = `I built Nepsis Shield, a field-ready Orthodox prayer and watchfulness companion for daily discipline, Scripture, saints, and practical support under pressure. It is local-first, installable as a web app, and includes an Android APK/QR install page. I would appreciate blunt feedback on the onboarding, Today flow, and whether the Field Manual is useful: ${download}`;
    return {
      downloadPageUrl: download,
      webAppUrl: web,
      shareText: text,
      redditText: reddit,
      smsUrl: `sms:?&body=${encodeURIComponent(text)}`,
      mailUrl: `mailto:?subject=${encodeURIComponent("Install Nepsis Shield")}&body=${encodeURIComponent(text)}`,
    };
  }, []);

  async function shareInstall() {
    if (typeof navigator.share !== "function") {
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
      await copyToClipboard("Install message", shareText);
    }
  }

  return (
    <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Megaphone className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">Share</p>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Share the app</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Send one clean install link with web, APK, QR, and a Reddit-ready feedback message.
          </p>
        </div>
        <Button type="button" className="rounded-2xl lg:shrink-0" onClick={shareInstall}>
          <Share2 className="mr-2 h-4 w-4" /> Share
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 p-3 text-left" onClick={() => copyToClipboard("Download page link", downloadPageUrl)}>
          <ClipboardCopy className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Install link</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">All devices</span>
          </span>
        </Button>

        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 p-3 text-left" onClick={() => copyToClipboard("Web app link", webAppUrl)}>
          <ShieldCheck className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Web link</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Browser/PWA</span>
          </span>
        </Button>

        {APK_DOWNLOAD_IS_DIRECT ? (
          <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 p-3 text-left" onClick={() => copyToClipboard("APK link", APK_DOWNLOAD_URL)}>
            <QrCode className="mr-3 h-4 w-4 shrink-0 text-primary" />
            <span>
              <span className="block text-sm font-semibold">APK link</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Android</span>
            </span>
          </Button>
        ) : (
          <div className="flex h-auto items-center justify-start rounded-2xl border border-dashed border-border/70 bg-muted/30 p-3 text-left">
            <QrCode className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              <span className="block text-sm font-semibold text-muted-foreground">APK pending</span>
              <span className="mt-1 block text-xs font-normal text-muted-foreground">Not hosted yet</span>
            </span>
          </div>
        )}

        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 p-3 text-left" onClick={() => copyToClipboard("Share message", shareText)}>

          <MessageSquare className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Message</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Copy text</span>
          </span>
        </Button>

        <Button type="button" variant="outline" className="h-auto justify-start rounded-2xl border-border/60 p-3 text-left" onClick={() => copyToClipboard("Reddit feedback post", redditText)}>
          <Megaphone className="mr-3 h-4 w-4 shrink-0 text-primary" />
          <span>
            <span className="block text-sm font-semibold">Reddit copy</span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Feedback post</span>
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
