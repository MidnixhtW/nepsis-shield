function inferGitHubPagesRepository() {
  if (typeof window === "undefined") return "";

  const githubPagesSuffix = ".github.io";
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith(githubPagesSuffix)) return "";

  const owner = hostname.slice(0, -githubPagesSuffix.length);
  const repo = window.location.pathname.split("/").filter(Boolean)[0];

  return owner && repo ? `${owner}/${repo}` : "";
}

const githubRepository =
  import.meta.env.VITE_GITHUB_REPOSITORY || inferGitHubPagesRepository();

const latestDebugApkUrl = githubRepository
  ? `https://github.com/${githubRepository}/releases/download/android-debug-latest/ortho-companion-latest-debug.apk`
  : "";

export const APK_DOWNLOAD_URL =
  import.meta.env.VITE_APK_DOWNLOAD_URL || latestDebugApkUrl || "/download";

export const APK_DOWNLOAD_IS_DIRECT = Boolean(
  import.meta.env.VITE_APK_DOWNLOAD_URL || latestDebugApkUrl,
);

export const APK_ARTIFACTS_URL =
  import.meta.env.VITE_APK_ARTIFACTS_URL ||
  (githubRepository ? `https://github.com/${githubRepository}/releases/tag/android-debug-latest` : "");

export const APK_VERSION = import.meta.env.VITE_APK_VERSION || "1.0.0";

export const APK_RELEASE_DATE =
  import.meta.env.VITE_APK_RELEASE_DATE ||
  (APK_DOWNLOAD_IS_DIRECT ? "Latest GitHub APK release" : "Pending first APK publish");
