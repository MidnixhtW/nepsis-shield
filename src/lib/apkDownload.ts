export const APK_REPOSITORY_STORAGE_KEY = "ortho-companion:apk-github-repository";
export const DEFAULT_APK_GITHUB_REPOSITORY = "MidnixhtW/swift-zebra-sprint";

export function normalizeGitHubRepository(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const githubUrlMatch = trimmed.match(/github\.com\/([^/\s]+)\/([^/\s#?]+)/i);
  const candidate = githubUrlMatch ? `${githubUrlMatch[1]}/${githubUrlMatch[2]}` : trimmed;
  const cleaned = candidate.replace(/^@/, "").replace(/\.git$/i, "");

  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(cleaned) ? cleaned : "";
}

function getStoredGitHubRepository() {
  if (typeof window === "undefined") return "";
  try {
    return normalizeGitHubRepository(
      window.localStorage.getItem(APK_REPOSITORY_STORAGE_KEY) || "",
    );
  } catch {
    return "";
  }
}

function inferGitHubPagesRepository() {
  if (typeof window === "undefined") return "";

  const githubPagesSuffix = ".github.io";
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith(githubPagesSuffix)) return "";

  const owner = hostname.slice(0, -githubPagesSuffix.length);
  const repo = window.location.pathname.split("/").filter(Boolean)[0];

  return normalizeGitHubRepository(owner && repo ? `${owner}/${repo}` : "");
}

export function buildLatestDebugApkUrl(repository: string) {
  const normalized = normalizeGitHubRepository(repository);
  return normalized
    ? `https://github.com/${normalized}/releases/download/android-debug-latest/ortho-companion-latest-debug.apk`
    : "";
}

export function buildApkArtifactsUrl(repository: string) {
  const normalized = normalizeGitHubRepository(repository);
  return normalized
    ? `https://github.com/${normalized}/releases/tag/android-debug-latest`
    : "";
}

export const APK_GITHUB_REPOSITORY = normalizeGitHubRepository(
  import.meta.env.VITE_GITHUB_REPOSITORY ||
    inferGitHubPagesRepository() ||
    getStoredGitHubRepository() ||
    DEFAULT_APK_GITHUB_REPOSITORY,
);

const latestDebugApkUrl = buildLatestDebugApkUrl(APK_GITHUB_REPOSITORY);

export function trustedGitHubHttpsUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const trustedHosts = new Set(["github.com"]);
    return url.protocol === "https:" && trustedHosts.has(url.hostname.toLowerCase())
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

const customApkDownloadUrl = trustedGitHubHttpsUrl(import.meta.env.VITE_APK_DOWNLOAD_URL || "");
const customApkArtifactsUrl = trustedGitHubHttpsUrl(import.meta.env.VITE_APK_ARTIFACTS_URL || "");

export const APK_DOWNLOAD_URL = customApkDownloadUrl || latestDebugApkUrl || "/download";

export const APK_DOWNLOAD_IS_DIRECT = Boolean(customApkDownloadUrl || latestDebugApkUrl);

export const APK_ARTIFACTS_URL =
  customApkArtifactsUrl || buildApkArtifactsUrl(APK_GITHUB_REPOSITORY);

export const APK_VERSION_IS_CONFIGURED = Boolean(import.meta.env.VITE_APK_VERSION);

export const APK_VERSION = import.meta.env.VITE_APK_VERSION || "web-preview";

export const APK_RELEASE_DATE =
  import.meta.env.VITE_APK_RELEASE_DATE ||
  (APK_DOWNLOAD_IS_DIRECT ? "Latest GitHub APK release" : "Pending repository configuration");

export const APK_DOWNLOAD_SOURCE = customApkDownloadUrl
  ? "custom-url"
  : APK_GITHUB_REPOSITORY
    ? "github-release"
    : "missing-config";

export const APK_DOWNLOAD_HOST = APK_DOWNLOAD_URL.startsWith("https://")
  ? new URL(APK_DOWNLOAD_URL).hostname
  : "this site";
