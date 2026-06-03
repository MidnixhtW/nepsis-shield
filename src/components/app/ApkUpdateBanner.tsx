import { useEffect, useState } from "react";
import { Download, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APK_VERSION } from "@/lib/apkDownload";
import { fetchLatestApkUpdate, type ApkUpdateInfo } from "@/lib/apkUpdate";

type ApkUpdateBannerProps = {
  compact?: boolean;
  showUpToDate?: boolean;
};

export function ApkUpdateBanner({ compact = false, showUpToDate = false }: ApkUpdateBannerProps) {
  const [update, setUpdate] = useState<ApkUpdateInfo | null>(null);
  const [checked, setChecked] = useState(false);

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

  if (!update && (!showUpToDate || !checked)) return null;

  if (!update) {
    return (
      <Card className="rounded-3xl border-border/60 bg-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">App is up to date</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Version {APK_VERSION} matches the latest trusted GitHub APK release.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-primary/30 bg-primary/5 p-4 shadow-sm">
      <div className={compact ? "grid gap-3" : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"}>
        <div className="flex items-start gap-3">
          <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold">Update available: v{update.version}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              You have version {APK_VERSION}. Download the trusted GitHub APK, then approve the Android install prompt to update.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button asChild className="rounded-2xl">
            <a href={update.apkUrl}>
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
