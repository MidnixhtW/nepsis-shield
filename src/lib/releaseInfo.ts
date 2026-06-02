export type ReleaseNote = {
  version: string;
  date: string;
  title: string;
  changes: string[];
};

export const CURRENT_VERSION = import.meta.env.VITE_APK_VERSION || "1.0.0";

export const RELEASE_NOTES: ReleaseNote[] = [
  {
    version: CURRENT_VERSION,
    date: import.meta.env.VITE_APK_RELEASE_DATE || "Pending first APK publish",
    title: "Field Cross foundation",
    changes: [
      "Added the Orthodox Field Manual for duty, stress, travel, grief, courage, the wounded/sick, the departed, and thanksgiving after danger.",
      "Added dedicated Android APK download page with install instructions, safety notes, version display, and release metadata.",
      "Added military Orthodox cross branding, favicon, and app manifest metadata.",
      "Added offline field-mode service worker support for the app shell and core pages.",
      "Added APK build/release workflow support for debug artifacts and signed release publishing.",
    ],
  },
];
