import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APK_DOWNLOAD_HOST, APK_DOWNLOAD_URL } from "@/lib/apkDownload";

export function ApkDownloadButton({
  size = "default",
  variant = "default",
  className = "",
  label = "Download APK",
}: {
  size?: "default" | "sm";
  variant?: "default" | "outline";
  className?: string;
  label?: string;
}) {
  return (
    <div className="inline-flex flex-col items-start gap-1">
      <Button asChild size={size} variant={variant} className={className}>
        <a href={APK_DOWNLOAD_URL}>
          <Download className="mr-2 h-4 w-4" /> {label}
        </a>
      </Button>
      <span className="text-xs text-muted-foreground">From {APK_DOWNLOAD_HOST}</span>
    </div>
  );
}
