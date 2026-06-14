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
import { AppLogo } from "@/components/app/AppLogo";
import { PwaInstallCard } from "@/components/app/PwaInstallCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AAB_DOWNLOAD_HOST,
  AAB_DOWNLOAD_IS_DIRECT,
  AAB_DOWNLOAD_SOURCE,
  AAB_DOWNLOAD_URL,
  APK_ARTIFACTS_URL,
  APK_DOWNLOAD_IS_DIRECT,
  APK_DOWNLOAD_SOURCE,
  APK_DOWNLOAD_URL,
  APK_GITHUB_REPOSITORY,
  APK_RELEASE_DATE,
  APK_REPOSITORY_STORAGE_KEY,
  APK_VERSION,
  buildLatestDebugApkUrl,
  buildReleaseAabUrl,
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
  const previewAabUrl = normalizedRepo ? buildReleaseAabUrl(normalizedRepo, APK_VERSION) : "";

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
          <AppLogo className="h-12 w-12" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Android package
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Download Nepsis Shield</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Android APK testing builds and Play Store app bundles for the service-and-protection community.
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

      <div className="mt-5">
        <PwaInstallCard />
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
                <Badge className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {AAB_DOWNLOAD_IS_DIRECT ? "Play Store AAB available" : "Awaiting hosted AAB"}
                </Badge>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {APK_DOWNLOAD_IS_DIRECT || AAB_DOWNLOAD_IS_DIRECT ? "Android downloads ready." : "Download page ready."}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Download an APK for direct device testing, or the signed Android App Bundle (.aab) for Google Play Console upload.
              </p>

              <Separator className="my-5" />

              {APK_DOWNLOAD_IS_DIRECT || AAB_DOWNLOAD_IS_DIRECT ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                    <p className="text-sm font-semibold">Testing APK</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Use this file for sideload testing on Android devices.
                    </p>
                    <div className="mt-3">
                      {APK_DOWNLOAD_IS_DIRECT ? (
                        <ApkDownloadButton className="rounded-2xl" label="Download APK" />
                      ) : (
                        <Button disabled className="rounded-2xl">APK not hosted yet</Button>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-semibold">Play Store App Bundle</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Upload this .aab file in Google Play Console for app release review.
                    </p>
                    <div className="mt-3 inline-flex flex-col items-start gap-1">
                      {AAB_DOWNLOAD_IS_DIRECT ? (
                        <Button asChild className="rounded-2xl">
                          <a href={AAB_DOWNLOAD_URL}>
                            <FileArchive className="mr-2 h-4 w-4" /> Download AAB for Play Store
                          </a>
                        </Button>
                      ) : (
                        <Button disabled className="rounded-2xl">AAB not hosted yet</Button>
                      )}
                      <span className="text-xs text-muted-foreground">From {AAB_DOWNLOAD_HOST}</span>
                    </div>
                  </div>

                  {APK_ARTIFACTS_URL ? (
                    <Button asChild variant="outline" className="rounded-2xl border-border/60 sm:col-span-2 sm:w-fit">
                      <a href={APK_ARTIFACTS_URL} target="_blank" rel="noopener noreferrer">
                        Open release/build artifacts <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-300/50 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-100">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">No repository or direct Android download URL is configured yet.</p>
                      <p className="mt-1 text-xs leading-relaxed opacity-85">
                        The release workflow now publishes APK files and a Play Store .aab. Set VITE_GITHUB_REPOSITORY to owner/repo, or set VITE_APK_DOWNLOAD_URL and VITE_AAB_DOWNLOAD_URL to trusted https://github.com release assets.
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
              <p className="mt-1 text-sm text-muted-foreground">Current Android package metadata.</p>

            </div>
            <FileArchive className="h-5 w-5 text-muted-foreground" />
          </div>

          <Separator className="my-4" />

          <div className="grid gap-3 text-sm">
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">App name</p>
              <p className="mt-1 font-semibold">Nepsis Shield</p>
              <p className="mt-1 text-xs text-muted-foreground">Orthodox Watchfulness & Prayer. Builds use simple version labels like V1, V2, and V3.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Release date</p>
              <p className="mt-1 font-semibold">{APK_RELEASE_DATE}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Build type</p>
              <p className="mt-1 font-semibold">APK for testing · AAB for Play Store upload</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Download source</p>
              <p className="mt-1 font-semibold">
                APK: {APK_DOWNLOAD_SOURCE === "github-release"
                  ? "GitHub Release"
                  : APK_DOWNLOAD_SOURCE === "custom-url"
                    ? "Custom APK URL"
                    : "Not configured"}
              </p>
              <p className="mt-1 font-semibold">
                AAB: {AAB_DOWNLOAD_SOURCE === "github-release"
                  ? "GitHub Release"
                  : AAB_DOWNLOAD_SOURCE === "custom-url"
                    ? "Custom AAB URL"
                    : "Not configured"}
              </p>
            </div>

          </div>
        </Card>
      </div>

      <Card className="mt-4 rounded-3xl border-border/60 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Android link diagnostic</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The app now uses MidnixhtW/swift-zebra-sprint by default. Use this only if you need to override the APK or AAB source.
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

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current Play Store AAB link</p>
            <p className="mt-1 break-all text-sm font-medium">{AAB_DOWNLOAD_URL || "Awaiting a V-number release or VITE_AAB_DOWNLOAD_URL"}</p>
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
                ? `APK: ${previewApkUrl}`
                : "Enter a repository in owner/repo format only if you need to override the default Android package source."}
            </p>
            {previewAabUrl ? (
              <p className="break-all text-xs leading-relaxed text-muted-foreground">AAB: {previewAabUrl}</p>
            ) : null}

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
              title="Download the APK for testing"
              description="Use the APK button for direct sideload testing on Android devices. The file should end in .apk."
            />
            <Step
              title="Download the AAB for Google Play"
              description="Use the Play Store App Bundle button for Play Console upload. The file should end in .aab and must be signed with your release key."
            />
            <Step
              title="Allow the install source"
              description="If Android blocks a sideloaded APK install, allow your browser or file manager to install unknown apps, then try again."
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
              Only install APKs from builds you trust. Use the AAB only for Play Console upload, and make sure it was signed with the release key connected to your Google Play app.
            </p>

          </div>

          <div className="mt-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                The release workflow now publishes APK files and a Play Store .aab asset. Configure VITE_GITHUB_REPOSITORY as owner/repo, or use VITE_APK_DOWNLOAD_URL and VITE_AAB_DOWNLOAD_URL only for trusted https://github.com release asset URLs.
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
