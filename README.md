# Ortho Companion

A React/Vite app configured for Android packaging with Capacitor.

## Android APK packaging

Capacitor is configured with:

- App name: `Ortho Companion`
- Android package ID: `com.orthocompanion.app`
- Web build directory: `dist`

Use the package scripts when you are ready to generate/open the native Android project:

- `build` creates the web bundle Capacitor packages.
- `cap:add:android` creates the Android native project the first time.
- `cap:sync` copies the latest web build into Android.
- `cap:open` opens the Android project in Android Studio, where you can build an APK or AAB.

For future app updates, rebuild the web app, sync Capacitor, then build again from Android Studio.
