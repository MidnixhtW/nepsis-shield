import {
  APK_GITHUB_REPOSITORY,
  APK_VERSION,
  APK_VERSION_IS_CONFIGURED,
  normalizeGitHubRepository,
  trustedGitHubHttpsUrl,
} from "@/lib/apkDownload";

export type ApkUpdateInfo = {
  version: string;
  tagName: string;
  releaseUrl: string;
  apkUrl: string;
  publishedAt: string;
  name: string;
};

type GitHubReleaseAsset = {
  name?: string;
  browser_download_url?: string;
};

type GitHubRelease = {
  tag_name?: string;
  name?: string;
  html_url?: string;
  published_at?: string;
  draft?: boolean;
  assets?: GitHubReleaseAsset[];
};

function normalizeVersion(value: string) {
  return value.trim().replace(/^v/i, "");
}

function parseSemver(value: string): [number, number, number] | null {
  const match = normalizeVersion(value).match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function isRemoteVersionNewer(currentVersion: string, remoteTag: string) {
  const current = parseSemver(currentVersion);
  const remote = parseSemver(remoteTag);

  if (current && remote) {
    for (let i = 0; i < 3; i += 1) {
      if (remote[i] > current[i]) return true;
      if (remote[i] < current[i]) return false;
    }
    return false;
  }

  return normalizeVersion(remoteTag) !== normalizeVersion(currentVersion);
}

function chooseApkAsset(assets: GitHubReleaseAsset[] | undefined) {
  const apkAssets = (assets || []).filter((asset) => {
    const name = asset.name || "";
    return name.toLowerCase().endsWith(".apk") && trustedGitHubHttpsUrl(asset.browser_download_url || "");
  });

  return (
    apkAssets.find((asset) => /signed.*release/i.test(asset.name || "")) ||
    apkAssets.find((asset) => /release/i.test(asset.name || "")) ||
    apkAssets[0]
  );
}

export async function fetchLatestApkUpdate(repository = APK_GITHUB_REPOSITORY) {
  const normalized = normalizeGitHubRepository(repository);
  if (!normalized) return null;

  // Only compare semver release tags against real semver APK builds. Debug builds
  // like "debug-22" and web previews should not show a stale v1.0.0 update prompt.
  if (!APK_VERSION_IS_CONFIGURED || !parseSemver(APK_VERSION)) return null;

  const response = await fetch(`https://api.github.com/repos/${normalized}/releases?per_page=10`, {
    headers: { Accept: "application/vnd.github+json" },
    referrerPolicy: "no-referrer",
  });

  if (!response.ok) return null;

  const releases = (await response.json()) as GitHubRelease[];
  const release = releases.find((item) => {
    if (item.draft || !item.tag_name || !item.html_url) return false;
    if (!parseSemver(item.tag_name)) return false;
    return Boolean(chooseApkAsset(item.assets));
  });
  if (!release?.tag_name || !release.html_url) return null;
  if (!isRemoteVersionNewer(APK_VERSION, release.tag_name)) return null;

  const releaseUrl = trustedGitHubHttpsUrl(release.html_url);
  const apkAsset = chooseApkAsset(release.assets);
  const apkUrl = trustedGitHubHttpsUrl(apkAsset?.browser_download_url || "");

  if (!releaseUrl || !apkUrl) return null;

  return {
    version: normalizeVersion(release.tag_name),
    tagName: release.tag_name,
    releaseUrl,
    apkUrl,
    publishedAt: release.published_at || "",
    name: release.name || release.tag_name,
  } satisfies ApkUpdateInfo;
}
