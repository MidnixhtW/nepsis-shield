import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const androidDir = join(root, "android");
const appBuildGradle = join(androidDir, "app", "build.gradle");
const stringsXml = join(androidDir, "app", "src", "main", "res", "values", "strings.xml");
const manifestXml = join(androidDir, "app", "src", "main", "AndroidManifest.xml");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(path) {
  if (!existsSync(path)) fail(`Missing expected Android file: ${path}`);
  return readFileSync(path, "utf8");
}

function write(path, content) {
  writeFileSync(path, content, "utf8");
}

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const rawVersionCode = process.env.ANDROID_VERSION_CODE ?? process.env.GITHUB_RUN_NUMBER ?? "1";
const versionCode = Number.parseInt(rawVersionCode, 10);
if (!Number.isInteger(versionCode) || versionCode < 1) {
  fail(`ANDROID_VERSION_CODE must be a positive integer. Received: ${rawVersionCode}`);
}

const versionName = (process.env.ANDROID_VERSION_NAME ?? process.env.VITE_APK_VERSION ?? `debug-${versionCode}`).replace(/[^0-9A-Za-z._+-]/g, "-");
const applicationId = process.env.ANDROID_APPLICATION_ID?.trim();
const appName = process.env.ANDROID_APP_NAME?.trim();

let gradle = read(appBuildGradle);
if (!/versionCode\s+\d+/.test(gradle)) fail("Could not find versionCode in android/app/build.gradle");
if (!/versionName\s+["'][^"']*["']/.test(gradle)) fail("Could not find versionName in android/app/build.gradle");
gradle = gradle.replace(/versionCode\s+\d+/g, `versionCode ${versionCode}`);
gradle = gradle.replace(/versionName\s+["'][^"']*["']/g, `versionName "${versionName}"`);

if (applicationId) {
  if (!/^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/.test(applicationId)) {
    fail(`ANDROID_APPLICATION_ID is not a valid Android applicationId: ${applicationId}`);
  }
  if (!/applicationId\s+["'][^"']+["']/.test(gradle)) fail("Could not find applicationId in android/app/build.gradle");
  gradle = gradle.replace(/applicationId\s+["'][^"']+["']/g, `applicationId "${applicationId}"`);
}

write(appBuildGradle, gradle);

if (appName && existsSync(stringsXml)) {
  const safeName = escapeXml(appName);
  let strings = read(stringsXml);
  if (/<string\s+name="app_name">[\s\S]*?<\/string>/.test(strings)) {
    strings = strings.replace(/<string\s+name="app_name">[\s\S]*?<\/string>/, `<string name="app_name">${safeName}</string>`);
  } else {
    strings = strings.replace("</resources>", `    <string name="app_name">${safeName}</string>\n</resources>`);
  }
  write(stringsXml, strings);
}

if (existsSync(manifestXml)) {
  let manifest = read(manifestXml);
  const permissions = [
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.SCHEDULE_EXACT_ALARM",
    "android.permission.RECEIVE_BOOT_COMPLETED",
  ];

  for (const permission of permissions) {
    if (!manifest.includes(`android:name="${permission}"`)) {
      manifest = manifest.replace(
        /<application\b/,
        `    <uses-permission android:name="${permission}" />\n\n    <application`,
      );
    }
  }

  write(manifestXml, manifest);
}

console.log(`Patched Android build: versionCode=${versionCode}, versionName=${versionName}${applicationId ? `, applicationId=${applicationId}` : ""}${appName ? `, appName=${appName}` : ""}`);
