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

function parseVNumber(value: string) {
  const match = value.trim().match(/^v(\d+)$/i);
  return match ? Number(match[1]) : null;
}

function isSupportedReleaseVersion(value: string) {
  return Boolean(parseSemver(value) || parseVNumber(value));
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

  const currentV = parseVNumber(currentVersion);
  const remoteV = parseVNumber(remoteTag);
  if (currentV !== null && remoteV !== null) return remoteV > currentV;

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

  // Only compare supported release tags against real APK builds. Web previews
  // should not show a stale update prompt.
  if (!APK_VERSION_IS_CONFIGURED || !isSupportedReleaseVersion(APK_VERSION)) return null;

  const response = await fetch(`https://api.github.com/repos/${normalized}/releases?per_page=10`, {
    headers: { Accept: "application/vnd.github+json" },
    referrerPolicy: "no-referrer",
  });

  if (!response.ok) return null;

  const releases = (await response.json()) as GitHubRelease[];
  const release = releases.find((item) => {
    if (item.draft || !item.tag_name || !item.html_url) return false;
    if (!isSupportedReleaseVersion(item.tag_name)) return false;
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
