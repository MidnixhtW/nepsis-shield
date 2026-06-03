# App icon source assets

These SVG files are source assets for Android launcher/adaptive icons:

- `android/icon-foreground.svg`
- `android/icon-background.svg`

The artwork uses an OCP-inspired tactical background and an Orthodox cross whose lower footrest slopes downward on the right side.

The APK workflows run `npm run android:apply-icon`, which writes matching adaptive icon XML into the generated Android project before Gradle builds the APK. The web/PWA icon is `public/military-orthodox-cross.svg`.
