# Ortho Companion

A React/Vite app configured for Android packaging with Capacitor.

## Android APK download

This project now includes an automated GitHub Actions workflow that builds a downloadable Android debug APK.

Workflow file:

- `.github/workflows/android-debug-apk.yml`

When the workflow runs, it uploads an artifact named:

- `ortho-companion-debug-apk`

Inside that artifact is the installable debug APK:

- `app-debug.apk`

Use this APK for testing and direct installation on Android devices. For public release through Google Play, build a signed release APK/AAB from Android Studio instead.

The app has a visible **Download APK** button in the header, footer, and About page. Configure these optional deployment variables when you have a hosted APK/artifact URL:

- `VITE_APK_DOWNLOAD_URL` — direct link to the APK file.
- `VITE_APK_ARTIFACTS_URL` — optional link to the build artifacts page.

If `VITE_APK_DOWNLOAD_URL` is not set, the button opens the About page APK section instead of pretending a direct APK exists.

## Android APK packaging

Capacitor is configured with:

- App name: `Ortho Companion`
- Android package ID: `com.orthocompanion.app`
- Web build directory: `dist`

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
