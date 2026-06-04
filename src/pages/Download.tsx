import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  ExternalLink,
  FileArchive,
  Info,
  ListChecks,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { ApkDownloadButton } from "@/components/app/ApkDownloadButton";
import { ApkUpdateBanner } from "@/components/app/ApkUpdateBanner";
import { OrthodoxCrossIcon } from "@/components/app/OrthodoxCrossIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  APK_ARTIFACTS_URL,
  APK_DOWNLOAD_IS_DIRECT,
  APK_DOWNLOAD_SOURCE,
  APK_DOWNLOAD_URL,
  APK_GITHUB_REPOSITORY,
  APK_RELEASE_DATE,
  APK_REPOSITORY_STORAGE_KEY,
  APK_VERSION,
  buildLatestDebugApkUrl,
  normalizeGitHubRepository,
} from "@/lib/apkDownload";
import { RELEASE_NOTES } from "@/lib/releaseInfo";

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

export default function Download() {
  const [repoInput, setRepoInput] = useState(APK_GITHUB_REPOSITORY);
  const normalizedRepo = normalizeGitHubRepository(repoInput);
  const previewApkUrl = normalizedRepo ? buildLatestDebugApkUrl(normalizedRepo) : "";

  function saveRepository() {
    if (!normalizedRepo) return;
    window.localStorage.setItem(APK_REPOSITORY_STORAGE_KEY, normalizedRepo);
    window.location.reload();
  }

  function clearRepository() {
    window.localStorage.removeItem(APK_REPOSITORY_STORAGE_KEY);
    window.location.reload();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 glow">
            <OrthodoxCrossIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Android package
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Download Theosis Shield APK</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Orthodox Companion build for Android testing and direct install.
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

      <div className="mt-5">
        <ApkUpdateBanner showUpToDate />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden rounded-3xl border-border/60 bg-card shadow-sm">
          <div className="relative field-grid">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/65 to-accent/10" />
            <div className="relative p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  <Smartphone className="mr-1 h-3.5 w-3.5" /> Android
                </Badge>
                <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Version {APK_VERSION}
                </Badge>
                <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {APK_DOWNLOAD_IS_DIRECT ? "APK available" : "Awaiting hosted APK"}
                </Badge>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {APK_DOWNLOAD_IS_DIRECT ? "APK ready to download." : "Download page ready."}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {APK_DOWNLOAD_IS_DIRECT
                  ? "Tap the button below to download the latest Android APK from the configured GitHub release. This direct build is intended for testing and sideload installation."
                  : "The app is ready to download the rolling GitHub Release APK once a repository or direct APK URL is configured."}
              </p>

              <Separator className="my-5" />

              {APK_DOWNLOAD_IS_DIRECT ? (
                <div className="flex flex-wrap gap-2">
                  <ApkDownloadButton className="rounded-2xl" label="Download APK now" />
                  {APK_ARTIFACTS_URL ? (
                    <Button asChild variant="outline" className="rounded-2xl border-border/60">
                      <a href={APK_ARTIFACTS_URL} target="_blank" rel="noopener noreferrer">
                        Build artifacts <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-300/50 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-100">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">No repository or direct APK URL is configured yet.</p>
                      <p className="mt-1 text-xs leading-relaxed opacity-85">
                        The workflow now publishes ortho-companion-latest-debug.apk to GitHub Releases. Set VITE_GITHUB_REPOSITORY to owner/repo, or set VITE_APK_DOWNLOAD_URL to a trusted https://github.com APK URL.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Build details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Current APK metadata.</p>
            </div>
            <FileArchive className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3 text-sm">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">App name</p>
              <p className="mt-1 font-semibold">Theosis Shield</p>
              <p className="mt-1 text-xs text-muted-foreground">Orthodox Companion. Builds use simple version labels like V1, V2, and V3.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Release date</p>
              <p className="mt-1 font-semibold">{APK_RELEASE_DATE}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Build type</p>
              <p className="mt-1 font-semibold">Debug APK for testing</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Download source</p>
              <p className="mt-1 font-semibold">
                {APK_DOWNLOAD_SOURCE === "github-release"
                  ? "GitHub Release"
                  : APK_DOWNLOAD_SOURCE === "custom-url"
                    ? "Custom APK URL"
                    : "Not configured"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-4 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">APK link diagnostic</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The app now uses MidnixhtW/swift-zebra-sprint by default. Use this only if you need to override the APK source.
            </p>
          </div>
          <Info className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current APK link</p>
            <p className="mt-1 break-all text-sm font-medium">{APK_DOWNLOAD_URL}</p>
          </div>

          <div className="grid gap-2 rounded-2xl border border-border/60 bg-background/45 p-4">
            <label htmlFor="github-repo" className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              GitHub repository
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="github-repo"
                value={repoInput}
                onChange={(event) => setRepoInput(event.target.value)}
                placeholder="owner/repo or https://github.com/owner/repo"
                className="rounded-2xl border-border/60 bg-background/70"
              />
              <Button
                type="button"
                className="rounded-2xl"
                disabled={!normalizedRepo}
                onClick={saveRepository}
              >
                Save repo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl border-border/60"
                onClick={clearRepository}
              >
                Clear
              </Button>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {previewApkUrl
                ? `This will use: ${previewApkUrl}`
                : "Enter a repository in owner/repo format only if you need to override the default APK source."}
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Install instructions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Android sideload steps vary by device.
              </p>
            </div>
            <ListChecks className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3">
            <Step
              title="Download the APK"
              description="Use the download button once a direct APK URL is configured. The file should end in .apk."
            />
            <Step
              title="Allow the install source"
              description="If Android blocks the install, allow your browser or file manager to install unknown apps, then try again."
            />
            <Step
              title="Open Theosis Shield"
              description="The installed app keeps the same name. Check the build details for the current V-number."
            />
            <Step
              title="If Android says app not installed"
              description="Install updates over a build signed with the same key. If you previously installed a debug build with a different package or signature, uninstall that old test copy first."
            />
          </div>
        </Card>

        <Card className="rounded-3xl border-border/60 bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Safety note</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Sideload with care.
              </p>
            </div>
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-sm leading-relaxed text-foreground/90">
              Only install APKs from builds you trust. A debug APK is useful for testing, but a public release should be signed and distributed through a trusted channel such as Google Play, GitHub Releases, or your official website.
            </p>
          </div>

          <div className="mt-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                The debug workflow publishes a stable asset named ortho-companion-latest-debug.apk. Configure VITE_GITHUB_REPOSITORY as owner/repo, or use VITE_APK_DOWNLOAD_URL only for a trusted https://github.com APK URL.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-4 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Release notes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Latest Android package focus.</p>
          </div>
          <BadgeCheck className="h-5 w-5 text-muted-foreground" />
        </div>

        <Separator className="my-4" />

        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {RELEASE_NOTES[0]?.changes.map((change) => <li key={change}>{change}</li>)}
        </ul>

        <Button asChild variant="outline" className="mt-4 rounded-2xl border-border/60">
          <Link to="/release-notes">View full release notes</Link>
        </Button>
      </Card>
    </div>
  );
}
