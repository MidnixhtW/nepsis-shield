# Ortho Companion

A React/Vite app configured for Android packaging with Capacitor.

## Field Manual

The app includes a dedicated `/field-manual` page with military Orthodox cross branding, short field prayers, practical battle-rhythm prompts, and pastoral/safety notes for duty, stress, travel, grief, courage, the wounded/sick, the departed, and thanksgiving after danger.

## Offline field mode

The app includes a production service worker and web app manifest:

- `public/sw.js` caches the core app shell, Field Manual, Download page, Release Notes, About, Privacy, and key app routes.
- `public/offline.html` gives users a field-mode offline fallback.
- `public/manifest.webmanifest` adds installable app metadata and shortcuts for Field Manual and Prayer.

External data such as daily readings, saints, and source websites still requires connectivity.

## Android APK download

This project now includes GitHub Actions workflows for Android APK builds and releases.

Workflow files:

- `.github/workflows/android-debug-apk.yml` builds a downloadable debug APK artifact.
- `.github/workflows/android-release.yml` publishes APK files to GitHub Releases and supports optional signed release APKs.

The debug workflow uploads an artifact named:

- `ortho-companion-debug-apk`

Inside that artifact is the installable debug APK:

- `app-debug.apk`

The release workflow accepts a version number and can publish:

- debug APK for testing
- signed release APK when signing secrets are configured
- unsigned release APK only when signing secrets are missing

Signing secrets for release builds:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

The app has a dedicated `/download` page and a visible **Download APK** button in the header, footer, About page, and Download page. Configure these optional deployment variables when you have a hosted APK/artifact URL:

- `VITE_APK_DOWNLOAD_URL` — direct link to the APK file.
- `VITE_APK_ARTIFACTS_URL` — optional link to the build artifacts page.
- `VITE_APK_VERSION` — displayed APK version, defaults to `1.0.0`.
- `VITE_APK_RELEASE_DATE` — displayed release date/status.

If `VITE_APK_DOWNLOAD_URL` is not set, the button opens `/download` instead of pretending a direct APK exists.

## Android APK packaging

Capacitor is configured with:

- App name: `Ortho Companion`
- Android package ID: `com.orthocompanion.app`
- Web build directory: `dist`

## App icon assets

Military Orthodox cross source assets are included for web and Android preparation:

- `public/military-orthodox-cross.svg` for favicon/PWA use.
- `resources/android/icon-foreground.svg` for Android adaptive icon foreground artwork.
- `resources/android/icon-background.svg` for Android adaptive icon background artwork.

The automated APK workflow:

1. Installs dependencies.
2. Builds the Vite web app.
3. Generates the native Android project with Capacitor.
4. Syncs the web build into Android.
5. Builds a debug APK.
6. Uploads the APK as a downloadable workflow artifact.

For local native development, the package scripts are still available:

- `build` creates the web bundle Capacitor packages.
- `cap:add:android` creates the Android native project the first time.
- `cap:sync` copies the latest web build into Android.
- `cap:open` opens the Android project in Android Studio, where you can build an APK or AAB.

For future app updates, rebuild the web app, sync Capacitor, then build again from Android Studio or rerun the automated APK workflow.
