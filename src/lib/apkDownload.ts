export const APK_DOWNLOAD_URL = import.meta.env.VITE_APK_DOWNLOAD_URL || "/download";

export const APK_DOWNLOAD_IS_DIRECT = Boolean(import.meta.env.VITE_APK_DOWNLOAD_URL);

export const APK_ARTIFACTS_URL = import.meta.env.VITE_APK_ARTIFACTS_URL || "";

export const APK_VERSION = import.meta.env.VITE_APK_VERSION || "1.0.0";

export const APK_RELEASE_DATE = import.meta.env.VITE_APK_RELEASE_DATE || "Pending first APK publish";
