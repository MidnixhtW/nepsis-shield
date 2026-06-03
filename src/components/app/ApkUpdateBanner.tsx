import { useEffect, useState } from "react";
import { Download, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APK_VERSION, APK_VERSION_IS_CONFIGURED } from "@/lib/apkDownload";
import { fetchLatestApkUpdate, type ApkUpdateInfo } from "@/lib/apkUpdate";

const DOWNLOADED_UPDATE_KEY = "ortho-companion:downloaded-apk-version";

type ApkUpdateBannerProps = {
  compact?: boolean;
  showUpToDate?: boolean;
};

function formatVersion(version: string) {
  const trimmed = version.trim();
  const vNumber = trimmed.match(/^v(\d+)$/i);
  if (vNumber) return `V${vNumber[1]}`;
  if (/^\d+\.\d+\.\d+(?:[-+].*)?$/.test(trimmed)) return `V${trimmed}`;
  return trimmed;
}

function getDownloadedVersion() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(DOWNLOADED_UPDATE_KEY) || "";
  } catch {
    return "";
  }
}

function setDownloadedVersion(version: string) {
  try {
    window.localStorage.setItem(DOWNLOADED_UPDATE_KEY, version);
  } catch {
    // Ignore storage failures; the download should still proceed.
  }
}

export function ApkUpdateBanner({ compact = false, showUpToDate = false }: ApkUpdateBannerProps) {
  const [update, setUpdate] = useState<ApkUpdateInfo | null>(null);
  const [checked, setChecked] = useState(false);
  const [downloadedVersion, setDownloadedVersionState] = useState(() => getDownloadedVersion());

  useEffect(() => {
    let cancelled = false;

    fetchLatestApkUpdate()
      .then((latest) => {
        if (!cancelled) setUpdate(latest);
      })
      .catch(() => {
        if (!cancelled) setUpdate(null);
      })
      .finally(() => {
        if (!cancelled) setChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const downloadedThisUpdate = update && downloadedVersion === update.version;

  if (downloadedThisUpdate) return null;

  if (!update && (!showUpToDate || !checked || !APK_VERSION_IS_CONFIGURED)) return null;

  if (!update) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">App is up to date</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Version {formatVersion(APK_VERSION)} matches the latest trusted GitHub APK release.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const displayVersion = formatVersion(update.version);

  return (
    <Card className="rounded-3xl border-primary/30 bg-primary/5 p-4 shadow-sm">
      <div className={compact ? "grid gap-3" : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"}>
        <div className="flex items-start gap-3">
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Update available: {displayVersion}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              You have version {formatVersion(APK_VERSION)}. Download the trusted GitHub APK, then approve the Android install prompt to update.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button asChild className="rounded-2xl">
            <a
              href={update.apkUrl}
              onClick={() => {
                setDownloadedVersion(update.version);
                setDownloadedVersionState(update.version);
              }}
            >
              <Download className="mr-2 h-4 w-4" /> Download update
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-2xl border-border/60 bg-background/70">
            <a href={update.releaseUrl} target="_blank" rel="noopener noreferrer">
              Release notes <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
