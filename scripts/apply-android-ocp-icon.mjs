import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const resDir = join(process.cwd(), "android", "app", "src", "main", "res");

function writeAndroidResource(relativePath, content) {
  const destination = join(resDir, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content.trimStart(), "utf8");
}

function removeAndroidResource(relativePath) {
  const destination = join(resDir, relativePath);
  if (existsSync(destination)) {
    rmSync(destination, { force: true });
  }
}

function removeLauncherIconSet(directory) {
  for (const name of ["ic_launcher", "ic_launcher_round"]) {
    for (const extension of ["xml", "png", "webp"]) {
      removeAndroidResource(`${directory}/${name}.${extension}`);
    }
  }
}

const background = `<?xml version="1.0" encoding="utf-8"?>

<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#343d29" android:pathData="M0,0h108v108h-108z" />
    <path android:fillColor="#747150" android:fillAlpha="0.95" android:pathData="M0,0h108v108h-108z" />
    <path android:fillColor="#8a805d" android:fillAlpha="0.78" android:pathData="M-10,16c20,-15 38,-13 51,-4c14,10 30,7 50,-8v27c-18,13 -36,14 -52,5c-17,-9 -31,-5 -49,10z" />
    <path android:fillColor="#4f5b39" android:fillAlpha="0.84" android:pathData="M4,78c16,-18 33,-22 48,-11c13,9 27,5 45,-11v30c-15,11 -30,12 -45,4c-17,-9 -31,-4 -48,14z" />
    <path android:fillColor="#2f3826" android:fillAlpha="0.70" android:pathData="M55,-8c12,8 18,19 15,30c-4,15 -18,20 -37,15c10,-16 12,-30 22,-45z" />
    <path android:fillColor="#c0aa78" android:fillAlpha="0.52" android:pathData="M75,33c17,7 23,21 10,34c-10,-6 -25,-4 -37,5c5,-18 12,-32 27,-39z" />
    <path android:fillColor="#596642" android:fillAlpha="0.86" android:pathData="M88,3c18,11 23,29 10,47c-15,-7 -33,-4 -48,9c4,-25 16,-47 38,-56z" />
    <path android:fillColor="#928662" android:fillAlpha="0.62" android:pathData="M-3,95c20,-13 39,-11 55,2c15,12 33,9 58,-8v22h-113z" />
</vector>`;

const foreground = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#00000000" android:pathData="M0,0h108v108h-108z" />
    <path android:fillColor="#5f713c" android:fillAlpha="0.92" android:strokeColor="#d0b063" android:strokeWidth="4.8" android:strokeLineJoin="round" android:pathData="M54,14 L86,27 L86,51 C86,73 74,93 54,102 C34,93 22,73 22,51 L22,27 Z" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M54,30 L54,83" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M43,41 L65,41" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M34,54 L74,54" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M39,71 L70,79" />
    <path android:strokeColor="#d0b063" android:strokeWidth="4.4" android:strokeLineCap="square" android:strokeAlpha="0.75" android:fillColor="#00000000" android:pathData="M38,33 L30,37 M70,33 L78,37 M38,96 L31,103 M70,96 L77,103" />
</vector>`;

const legacyIcon = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#343d29" android:pathData="M0,0h108v108h-108z" />
    <path android:fillColor="#747150" android:fillAlpha="0.95" android:pathData="M0,0h108v108h-108z" />
    <path android:fillColor="#8a805d" android:fillAlpha="0.78" android:pathData="M-10,16c20,-15 38,-13 51,-4c14,10 30,7 50,-8v27c-18,13 -36,14 -52,5c-17,-9 -31,-5 -49,10z" />
    <path android:fillColor="#4f5b39" android:fillAlpha="0.84" android:pathData="M4,78c16,-18 33,-22 48,-11c13,9 27,5 45,-11v30c-15,11 -30,12 -45,4c-17,-9 -31,-4 -48,14z" />
    <path android:fillColor="#5f713c" android:fillAlpha="0.92" android:strokeColor="#d0b063" android:strokeWidth="4.8" android:strokeLineJoin="round" android:pathData="M54,14 L86,27 L86,51 C86,73 74,93 54,102 C34,93 22,73 22,51 L22,27 Z" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M54,30 L54,83" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M43,41 L65,41" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M34,54 L74,54" />
    <path android:strokeColor="#f1e8c8" android:strokeWidth="8" android:strokeLineCap="square" android:fillColor="#00000000" android:pathData="M39,71 L70,79" />
    <path android:strokeColor="#d0b063" android:strokeWidth="4.4" android:strokeLineCap="square" android:strokeAlpha="0.75" android:fillColor="#00000000" android:pathData="M38,33 L30,37 M70,33 L78,37 M38,96 L31,103 M70,96 L77,103" />
</vector>`;

const adaptiveIcon = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`;

removeLauncherIconSet("mipmap-anydpi-v26");
for (const density of ["mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi"]) {
  removeLauncherIconSet(density);
}

writeAndroidResource("drawable/ic_launcher_background.xml", background);
writeAndroidResource("drawable/ic_launcher_foreground.xml", foreground);
writeAndroidResource("mipmap-anydpi-v26/ic_launcher.xml", adaptiveIcon);
writeAndroidResource("mipmap-anydpi-v26/ic_launcher_round.xml", adaptiveIcon);

for (const density of ["mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi"]) {
  writeAndroidResource(`${density}/ic_launcher.xml`, legacyIcon);
  writeAndroidResource(`${density}/ic_launcher_round.xml`, legacyIcon);
}

console.log("Applied OCP tactical Orthodox Android launcher icon resources after removing generated default launcher icons.");
