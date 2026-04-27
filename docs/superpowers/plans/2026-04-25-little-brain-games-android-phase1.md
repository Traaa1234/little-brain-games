# Little Brain Games — Android App Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wrap `kids-game/index.html` as a real Android app using Capacitor and produce a signed `.aab` ready for Play Store upload.

**Architecture:** Capacitor wraps the HTML in a fullscreen WebView. The Android Studio project lives under `android-app/android/`. A small `npm run sync` script copies `kids-game/index.html` → `android-app/www/` and triggers `npx cap sync android`. Plugins: `@capacitor/status-bar` and `@capacitor/splash-screen`. Signing uses an external keystore referenced by environment variables.

**Tech Stack:** Capacitor 6.x, @capacitor/android 6.x, @capacitor/status-bar 6.x, @capacitor/splash-screen 6.x, Android Studio + Gradle, Kotlin (Capacitor's generated MainActivity), JDK 17 (bundled with current Android Studio).

**Spec reference:** `docs/superpowers/specs/2026-04-25-little-brain-games-android-phase1-design.md`

**Working directory for all tasks:** `C:\Users\elinw\projects\little-brain-games`

---

## File Structure

| Path | Purpose |
|------|---------|
| `android-app/package.json` | npm metadata, Capacitor deps, `sync` script |
| `android-app/capacitor.config.json` | Capacitor app id, name, plugins |
| `android-app/www/index.html` | Build-time copy of `kids-game/index.html` (sync'd by `npm run sync`) |
| `android-app/scripts/sync-game.mjs` | Copies `kids-game/index.html` → `www/` and runs `cap sync android` |
| `android-app/.env.example` | Documented placeholder for keystore env vars |
| `android-app/.env.local` | (gitignored) Real keystore env vars on the dev machine |
| `android-app/android/app/build.gradle` | versionCode/Name + signing config (Capacitor-generated, modified by us) |
| `android-app/android/app/src/main/AndroidManifest.xml` | Orientation, configChanges, theme (modified by us) |
| `android-app/android/app/src/main/res/values/colors.xml` | App color palette (cream, coral, etc.) |
| `android-app/android/app/src/main/res/values/strings.xml` | `app_name = "Little Brain Games"` |
| `android-app/android/app/src/main/res/values/styles.xml` | `AppTheme`, `AppTheme.NoActionBarLaunch` (splash) |
| `android-app/android/app/src/main/res/drawable/ic_launcher_foreground.xml` | Adaptive icon foreground vector |
| `android-app/android/app/src/main/res/drawable/ic_launcher_background.xml` | Adaptive icon background vector |
| `android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` | Adaptive icon descriptor (square) |
| `android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` | Adaptive icon descriptor (round) |
| `android-app/android/app/src/main/res/mipmap-{m,h,xh,xxh,xxxh}dpi/ic_launcher.png` | Legacy raster icons (Android Studio Image Asset Studio generates these) |
| `android-app/android/app/src/main/res/drawable/splash.xml` | Splash drawable (cream + centered icon) |
| `android-app/store-assets/icon-512.png` | Phase 2 store-listing icon (generated in Phase 1, used in Phase 2) |
| `android-app/README.md` | Build, sync, signing, keystore-backup instructions |

---

## Task 1: Bootstrap Capacitor project

**Files:**
- Create: `android-app/package.json`
- Create: `android-app/capacitor.config.json`
- Create: `android-app/www/index.html` (placeholder)

- [ ] **Step 1: Create `android-app/` directory and minimal `www/` placeholder**

```bash
cd /c/Users/elinw/projects/little-brain-games
mkdir -p android-app/www
echo "<html><body>placeholder</body></html>" > android-app/www/index.html
```

- [ ] **Step 2: Create `android-app/package.json`**

Write this file:

```json
{
  "name": "little-brain-games-android",
  "version": "1.0.0",
  "private": true,
  "description": "Android wrapper for Little Brain Games kids' learning game",
  "type": "module",
  "scripts": {
    "sync": "node scripts/sync-game.mjs"
  },
  "dependencies": {
    "@capacitor/android": "^6.1.2",
    "@capacitor/core": "^6.1.2",
    "@capacitor/splash-screen": "^6.0.2",
    "@capacitor/status-bar": "^6.0.2"
  },
  "devDependencies": {
    "@capacitor/cli": "^6.1.2"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run from `android-app/`:

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app
npm install
```

Expected: `node_modules/` created, no errors. Warnings about engines or deprecated transitive deps are OK.

- [ ] **Step 4: Initialize Capacitor**

```bash
npx cap init "Little Brain Games" "app.kidlearn.tinygenius" --web-dir=www
```

Expected output: a new `capacitor.config.ts` (or `.json`) created. If `.ts` is created, delete it and replace with the JSON below.

- [ ] **Step 5: Replace `capacitor.config.json` (overwrite if `.ts` was created)**

Delete `capacitor.config.ts` if it exists, then write `android-app/capacitor.config.json`:

```json
{
  "appId": "app.kidlearn.tinygenius",
  "appName": "Little Brain Games",
  "webDir": "www",
  "android": {
    "allowMixedContent": false,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "backgroundColor": "#FFF8EC",
      "showSpinner": false,
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER"
    },
    "StatusBar": {
      "backgroundColor": "#FFF8EC",
      "style": "DARK",
      "overlaysWebView": false
    }
  }
}
```

- [ ] **Step 6: Verify**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app
ls package.json capacitor.config.json www/index.html
cat capacitor.config.json | grep -E '(appId|appName|webDir)'
```

Expected: all three files exist; cat output shows the three keys with the right values.

- [ ] **Step 7: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/
git commit -m "android: bootstrap Capacitor project (package.json, capacitor.config.json)"
```

---

## Task 2: Sync script + first sync

**Files:**
- Create: `android-app/scripts/sync-game.mjs`
- Create: `android-app/www/index.html` (replaced from placeholder)

- [ ] **Step 1: Write the sync script**

Create `android-app/scripts/sync-game.mjs`:

```javascript
// Copies kids-game/index.html into android-app/www/ and runs `npx cap sync android`.
// Run from android-app/ via `npm run sync`.

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "..");
const repoRoot = resolve(appRoot, "..");

const src = resolve(repoRoot, "kids-game", "index.html");
const dst = resolve(appRoot, "www", "index.html");

if (!existsSync(src)) {
  console.error(`ERROR: source HTML not found at ${src}`);
  process.exit(1);
}

mkdirSync(dirname(dst), { recursive: true });
copyFileSync(src, dst);
console.log(`copied ${src} -> ${dst}`);

// Only run cap sync if android platform has been added; on first run the platform
// doesn't exist yet, and cap sync would error out.
const androidDir = resolve(appRoot, "android");
if (existsSync(androidDir)) {
  console.log("running: npx cap sync android");
  execSync("npx cap sync android", { cwd: appRoot, stdio: "inherit" });
} else {
  console.log("(android platform not yet added; skipping cap sync)");
}
```

- [ ] **Step 2: Run the sync script**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app
npm run sync
```

Expected output:
```
copied .../kids-game/index.html -> .../android-app/www/index.html
(android platform not yet added; skipping cap sync)
```

- [ ] **Step 3: Verify the copy**

```bash
ls -la /c/Users/elinw/projects/little-brain-games/android-app/www/index.html
diff /c/Users/elinw/projects/little-brain-games/kids-game/index.html /c/Users/elinw/projects/little-brain-games/android-app/www/index.html
```

Expected: file size matches the source; `diff` produces no output (files are identical).

- [ ] **Step 4: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/scripts/ android-app/www/
git commit -m "android: add sync-game.mjs and copy initial index.html into www/"
```

---

## Task 3: Add Android platform

**Files:**
- Generated: `android-app/android/` (entire Android Studio project tree)

- [ ] **Step 1: Add the Android platform**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app
npx cap add android
```

Expected output: a new `android/` directory created with `app/`, `build.gradle`, `gradle/`, `settings.gradle`, etc. The command should report success and may print a "🎉 Capacitor Android" banner.

- [ ] **Step 2: Run sync once with the platform present**

```bash
npm run sync
```

Expected output:
```
copied ... -> ...
running: npx cap sync android
✔ Copying web assets...
✔ Updating Android plugins...
```

- [ ] **Step 3: Verify Android project structure**

```bash
ls android/app/src/main/AndroidManifest.xml
ls android/app/src/main/assets/public/index.html
ls android/build.gradle android/app/build.gradle
```

All four should exist.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/
git commit -m "android: add Android platform via npx cap add android"
```

---

## Task 4: Configure manifest (orientation, configChanges, resizeable)

**Files:**
- Modify: `android-app/android/app/src/main/AndroidManifest.xml`

- [ ] **Step 1: Read the current manifest**

```bash
cat /c/Users/elinw/projects/little-brain-games/android-app/android/app/src/main/AndroidManifest.xml
```

Note the existing `<activity android:name="...MainActivity"` element — we'll modify its attributes.

- [ ] **Step 2: Edit the activity attributes**

In `android-app/android/app/src/main/AndroidManifest.xml`, find the `<activity>` element for `MainActivity`. Make sure these attributes are present (add them if missing, replace them if already different):

```xml
android:screenOrientation="fullSensor"
android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout|uiMode"
android:resizeableActivity="true"
android:hardwareAccelerated="true"
android:exported="true"
```

The full activity tag should look approximately like:

```xml
<activity
    android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout|uiMode"
    android:name=".MainActivity"
    android:label="@string/title_activity_main"
    android:theme="@style/AppTheme.NoActionBarLaunch"
    android:launchMode="singleTask"
    android:screenOrientation="fullSensor"
    android:resizeableActivity="true"
    android:hardwareAccelerated="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

(Capacitor's generated manifest uses `android:label="@string/title_activity_main"` and `android:theme="@style/AppTheme.NoActionBarLaunch"`; preserve those.)

- [ ] **Step 3: Verify**

```bash
grep -E "screenOrientation|configChanges|resizeableActivity" /c/Users/elinw/projects/little-brain-games/android-app/android/app/src/main/AndroidManifest.xml
```

Expected: three lines printed, matching the additions above.

- [ ] **Step 4: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/app/src/main/AndroidManifest.xml
git commit -m "android: enable rotation without recreating activity (preserves game state)"
```

---

## Task 5: Update colors, strings, and theme

**Files:**
- Modify: `android-app/android/app/src/main/res/values/colors.xml`
- Modify: `android-app/android/app/src/main/res/values/strings.xml`
- Modify: `android-app/android/app/src/main/res/values/styles.xml`

- [ ] **Step 1: Replace colors.xml**

Write `android-app/android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#F4A261</color>
    <color name="colorPrimaryDark">#E76F51</color>
    <color name="colorAccent">#A8C686</color>
    <color name="background_cream">#FFF8EC</color>
    <color name="text_warm_brown">#5B3A29</color>
    <color name="ic_launcher_background">#F4A261</color>
</resources>
```

- [ ] **Step 2: Replace strings.xml**

Write `android-app/android/app/src/main/res/values/strings.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Little Brain Games</string>
    <string name="title_activity_main">Little Brain Games</string>
    <string name="package_name">app.kidlearn.tinygenius</string>
    <string name="custom_url_scheme">app.kidlearn.tinygenius</string>
</resources>
```

- [ ] **Step 3: Replace styles.xml**

Write `android-app/android/app/src/main/res/values/styles.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="android:windowBackground">@color/background_cream</item>
    </style>

    <style name="AppTheme.NoActionBarLaunch" parent="AppTheme">
        <item name="android:background">@color/background_cream</item>
        <item name="android:windowBackground">@drawable/splash</item>
    </style>
</resources>
```

- [ ] **Step 4: Verify**

```bash
grep -E "Little Brain Games|FFF8EC|F4A261" /c/Users/elinw/projects/little-brain-games/android-app/android/app/src/main/res/values/*.xml
```

Expected: at least 4 matching lines printed.

- [ ] **Step 5: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/app/src/main/res/values/
git commit -m "android: set app name, warm color palette, splash theme"
```

---

## Task 6: Adaptive icon — vector drawables

**Files:**
- Create: `android-app/android/app/src/main/res/drawable/ic_launcher_foreground.xml`
- Create: `android-app/android/app/src/main/res/drawable/ic_launcher_background.xml`
- Create: `android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`
- Create: `android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`

- [ ] **Step 1: Write the foreground vector**

Create `android-app/android/app/src/main/res/drawable/ic_launcher_foreground.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">

    <!-- Rounded "thinking head" silhouette in cream, centered in the 66dp safe zone -->
    <path
        android:fillColor="#FFF8EC"
        android:strokeColor="#5B3A29"
        android:strokeWidth="1.6"
        android:pathData="M 36 38 Q 36 26, 54 26 Q 72 26, 72 38 Q 80 40, 80 52 Q 80 64, 72 68 Q 72 80, 60 84 Q 54 86, 48 84 Q 36 80, 36 68 Q 28 64, 28 52 Q 28 40, 36 38 Z" />

    <!-- Eyes -->
    <path android:fillColor="#5B3A29" android:pathData="M 46 56 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0 Z" />
    <path android:fillColor="#5B3A29" android:pathData="M 62 56 m -2 0 a 2 2 0 1 0 4 0 a 2 2 0 1 0 -4 0 Z" />

    <!-- Smile -->
    <path
        android:fillColor="#00000000"
        android:strokeColor="#5B3A29"
        android:strokeWidth="2"
        android:strokeLineCap="round"
        android:pathData="M 46 66 Q 54 72, 62 66" />

    <!-- Three accent dots (yellow / sage / peach) suggesting the four-game variety -->
    <path android:fillColor="#E9C46A" android:pathData="M 34 36 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 Z" />
    <path android:fillColor="#A8C686" android:pathData="M 74 36 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 Z" />
    <path android:fillColor="#F6CBA3" android:pathData="M 54 30 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0 Z" />
</vector>
```

- [ ] **Step 2: Write the background vector**

Create `android-app/android/app/src/main/res/drawable/ic_launcher_background.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#F4A261"
        android:pathData="M0,0h108v108h-108z" />
</vector>
```

- [ ] **Step 3: Wire up adaptive icon descriptors**

Create `android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
```

Create `android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
```

- [ ] **Step 4: Verify XML parses**

```bash
ls android-app/android/app/src/main/res/drawable/ic_launcher_*.xml
ls android-app/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher*.xml
```

Expected: two files in `drawable/`, two files in `mipmap-anydpi-v26/`.

- [ ] **Step 5: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/app/src/main/res/drawable/ic_launcher_*.xml \
        android-app/android/app/src/main/res/mipmap-anydpi-v26/
git commit -m "android: adaptive icon (thinking-head silhouette on coral)"
```

---

## Task 7: Legacy raster icons via Android Studio Image Asset Studio

**Files:**
- Generated: `android-app/android/app/src/main/res/mipmap-{m,h,xh,xxh,xxxh}dpi/ic_launcher.png`
- Generated: `android-app/android/app/src/main/res/mipmap-{m,h,xh,xxh,xxxh}dpi/ic_launcher_round.png`

This task uses Android Studio's GUI tooling — there is no command-line equivalent that's both simple and high-quality. The Image Asset Studio reads our adaptive vector and rasterizes legacy PNGs at the right densities.

- [ ] **Step 1: Open the project in Android Studio**

```
File → Open → C:\Users\elinw\projects\little-brain-games\android-app\android
```

Wait for Gradle sync to complete (status bar at the bottom shows progress).

- [ ] **Step 2: Open Image Asset Studio**

In the Project pane, right-click `app/src/main/res` → `New` → `Image Asset`.

- [ ] **Step 3: Configure the foreground**

In the wizard:
- **Icon Type:** Launcher Icons (Adaptive and Legacy)
- **Name:** ic_launcher
- **Foreground Layer** tab:
  - Asset Type: Image
  - Path: navigate to `app/src/main/res/drawable/ic_launcher_foreground.xml`
  - (Verify the preview shows the thinking-head silhouette inside the safe zone circle)
- **Background Layer** tab:
  - Asset Type: Color
  - Color: `#F4A261`
- **Legacy** tab:
  - Generate: Yes (all of: Legacy Icon, Round Icon, Google Play Store icon)
  - Shape: Square (or Circle — your preference; some launchers crop to circle anyway)

- [ ] **Step 4: Confirm and finish**

Click `Next`, review the file changes (it will overwrite the four `mipmap-anydpi-v26/ic_launcher*.xml` files we just wrote — that's expected and fine, it produces functionally-identical XML), and click `Finish`.

- [ ] **Step 5: Save the 512×512 store icon**

Image Asset Studio also generates `playstore-icon.png` in the project root or `app/src/main/ic_launcher-playstore.png`. Find it and copy to the dedicated location:

```bash
cd /c/Users/elinw/projects/little-brain-games
mkdir -p android-app/store-assets
# Image Asset Studio puts the playstore icon at android/app/src/main/ic_launcher-playstore.png
cp android-app/android/app/src/main/ic_launcher-playstore.png android-app/store-assets/icon-512.png
```

If the file isn't at that path, check `android-app/android/app/build/generated/` or look in the project root for `*playstore*.png`.

- [ ] **Step 6: Verify**

```bash
ls android-app/android/app/src/main/res/mipmap-{m,h,xh,xxh,xxxh}dpi/
ls android-app/store-assets/icon-512.png
```

Expected: each mipmap directory contains `ic_launcher.png` (and likely `ic_launcher_round.png`); the 512×512 PNG exists in `store-assets/`.

- [ ] **Step 7: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/app/src/main/res/mipmap-mdpi/ \
        android-app/android/app/src/main/res/mipmap-hdpi/ \
        android-app/android/app/src/main/res/mipmap-xhdpi/ \
        android-app/android/app/src/main/res/mipmap-xxhdpi/ \
        android-app/android/app/src/main/res/mipmap-xxxhdpi/ \
        android-app/android/app/src/main/res/mipmap-anydpi-v26/ \
        android-app/store-assets/
git commit -m "android: rasterize legacy icons + 512x512 store icon via Image Asset Studio"
```

---

## Task 8: Splash drawable

**Files:**
- Create: `android-app/android/app/src/main/res/drawable/splash.xml`

(The activity already references `android:windowBackground = @drawable/splash` from styles.xml in Task 5.)

- [ ] **Step 1: Write the splash drawable**

Create `android-app/android/app/src/main/res/drawable/splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Cream background -->
    <item android:drawable="@color/background_cream" />

    <!-- Centered icon -->
    <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/ic_launcher" />
    </item>
</layer-list>
```

- [ ] **Step 2: Verify**

```bash
cat /c/Users/elinw/projects/little-brain-games/android-app/android/app/src/main/res/drawable/splash.xml | head -20
```

Expected: prints the file contents starting with the XML declaration.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/app/src/main/res/drawable/splash.xml
git commit -m "android: cream splash with centered icon"
```

---

## Task 9: First debug build + emulator smoke test

**Files:** none modified — this task only verifies the work so far runs.

- [ ] **Step 1: Sync to push web assets into the Android project**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app
npm run sync
```

Expected output: copy + `cap sync` both succeed.

- [ ] **Step 2: Open the project in Android Studio**

If not already open, `File → Open → C:\Users\elinw\projects\little-brain-games\android-app\android`. Wait for Gradle sync.

- [ ] **Step 3: Start an emulator**

`Tools → Device Manager → +` → create a Pixel 7 with API 34 if one doesn't exist. Click ▶️ to launch.

- [ ] **Step 4: Run the app**

Click the green Run button (▶) at the top of Android Studio with the emulator selected as target.

Expected: the project builds (~1-2 min on first build), the app installs and launches on the emulator. You should see:
- Splash: cream screen with the brain icon for ~1.5 s
- Game: the four-game UI we built

- [ ] **Step 5: Smoke test the four games on the emulator**

Click each of the four game buttons (🧠 Memory, 🎨 Pattern, 🧩 Puzzle, 🦉 Logic). Verify:
- Each game renders without errors
- Memory: a card flip works (click two cards)
- Pattern: clicking a correct option advances to the next round
- Puzzle: drag a piece (with the emulator's mouse) from the tray onto its slot — it should snap
- Logic: clicking the odd-one-out advances

- [ ] **Step 6: Run the in-page self-test**

In Android Studio: `View → Tool Windows → Logcat`. Filter by `chromium` or `Console`. Run `window.__runSelfTest()` from the Chrome DevTools-equivalent: with the emulator focused, in Chrome on your dev machine open `chrome://inspect`, find the WebView, click "inspect", then run `__runSelfTest()` in the console.

Expected: console reports something like `[selftest] N/N passed`.

If anything fails, fix and re-test before moving on.

- [ ] **Step 7: Commit (if any fixes were made; otherwise skip)**

```bash
cd /c/Users/elinw/projects/little-brain-games
git status
# If any files changed:
git add -A
git commit -m "android: fixes from emulator smoke test"
```

---

## Task 10: Generate release keystore

**Files:**
- Created (outside repo): `%USERPROFILE%\.android\keystores\littlebraingames-release.jks`
- Create: `android-app/.env.example`
- Create: `android-app/.env.local` (gitignored)

- [ ] **Step 1: Create the keystores directory**

```bash
mkdir -p ~/.android/keystores
```

- [ ] **Step 2: Generate the keystore**

```bash
keytool -genkeypair -v \
    -keystore ~/.android/keystores/littlebraingames-release.jks \
    -alias littlebraingames \
    -keyalg RSA -keysize 2048 -validity 10000
```

When prompted:
- **Keystore password:** choose a strong password (record it!)
- **First and last name:** your name (used as Common Name in the cert)
- **Organizational unit / Organization:** can leave blank or fill
- **City / State / Country code:** as appropriate
- **Confirm yes** to the summary
- **Key password:** press Enter to use the same as keystore password (recommended for simplicity)

Expected: file `littlebraingames-release.jks` exists and is readable.

- [ ] **Step 3: BACK UP THE KEYSTORE**

This is the single most important irreversible step in this entire plan. Lose this file and you can never publish updates to this app.

- Copy `~/.android/keystores/littlebraingames-release.jks` to your password manager (1Password, Bitwarden, Apple Keychain) as a file attachment, OR to encrypted cloud storage you control
- Save the keystore password and key alias in the same place
- Verify the backup is readable: open the password manager, confirm the file is there

- [ ] **Step 4: Create `.env.example` (committed)**

Write `android-app/.env.example`:

```
# Copy to .env.local and fill in the real values.
# .env.local is gitignored. Do NOT commit real keystore credentials.

KEYSTORE_FILE=C:/Users/YOUR_USERNAME/.android/keystores/littlebraingames-release.jks
KEYSTORE_PASSWORD=your-keystore-password
KEY_ALIAS=littlebraingames
KEY_PASSWORD=your-key-password
```

- [ ] **Step 5: Create `.env.local` (gitignored, on this machine only)**

Write `android-app/.env.local` with the real values you used in Step 2. The repo's `.gitignore` already excludes `.env.local`.

- [ ] **Step 6: Verify ignore is working**

```bash
cd /c/Users/elinw/projects/little-brain-games
git status android-app/
```

Expected: `.env.example` is untracked (will be committed in next step); `.env.local` is **NOT** listed — meaning git is ignoring it correctly. If `.env.local` shows up, double-check `.gitignore`.

- [ ] **Step 7: Commit `.env.example`**

```bash
git add android-app/.env.example
git commit -m "android: document keystore env vars (.env.example)"
```

---

## Task 11: Wire signing into build.gradle

**Files:**
- Modify: `android-app/android/app/build.gradle`

- [ ] **Step 1: Locate `android-app/android/app/build.gradle`**

Open it. You'll see Capacitor's generated structure with `android { ... }` containing `compileSdk`, `defaultConfig`, `buildTypes`, etc.

- [ ] **Step 2: Add a function to load `.env.local`**

At the top of the file, after the `apply plugin:` lines and before the `android { ... }` block, add:

```groovy
// Load keystore credentials from android-app/.env.local (one directory up from android/).
def loadEnvLocal() {
    def envFile = file("../../.env.local")
    def env = [:]
    if (envFile.exists()) {
        envFile.eachLine { line ->
            line = line.trim()
            if (line && !line.startsWith("#") && line.contains("=")) {
                def idx = line.indexOf("=")
                env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim()
            }
        }
    }
    return env
}
def envLocal = loadEnvLocal()
```

- [ ] **Step 3: Add `signingConfigs` inside the `android { ... }` block**

Add this block inside `android { ... }`, **before** `buildTypes { ... }`:

```groovy
    signingConfigs {
        release {
            if (envLocal.KEYSTORE_FILE && envLocal.KEYSTORE_PASSWORD && envLocal.KEY_ALIAS && envLocal.KEY_PASSWORD) {
                storeFile file(envLocal.KEYSTORE_FILE)
                storePassword envLocal.KEYSTORE_PASSWORD
                keyAlias envLocal.KEY_ALIAS
                keyPassword envLocal.KEY_PASSWORD
            }
        }
    }
```

- [ ] **Step 4: Reference the signing config in the release `buildType`**

Find the `buildTypes { release { ... } }` block. Modify the `release` entry so it looks like:

```groovy
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            if (envLocal.KEYSTORE_FILE) {
                signingConfig signingConfigs.release
            }
        }
```

(If the `release` block already had something else, preserve it; we only added the conditional `signingConfig` line.)

- [ ] **Step 5: Verify versionCode and versionName in `defaultConfig`**

In the same `build.gradle`, inside `defaultConfig { ... }`, ensure:

```groovy
        versionCode 1
        versionName "1.0.0"
        minSdkVersion 24
        targetSdkVersion 34
```

(Capacitor's default `versionCode 1` / `versionName "1.0"` — bump `"1.0"` to `"1.0.0"` for clarity. `minSdkVersion 24` / `targetSdkVersion 34` are normally set in `variables.gradle` at the project root — leave those alone if so.)

- [ ] **Step 6: Sync Gradle in Android Studio**

In Android Studio, click `File → Sync Project with Gradle Files` (or the elephant icon). Wait for sync to complete with no errors.

- [ ] **Step 7: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/android/app/build.gradle
git commit -m "android: wire release signing config from .env.local"
```

---

## Task 12: Build a signed release AAB

**Files:** none modified — this task produces the deliverable.

- [ ] **Step 1: Sync once more for safety**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app
npm run sync
```

- [ ] **Step 2: Build the release bundle**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app/android
gradlew.bat bundleRelease
```

Expected: Gradle runs for 30-60 s, ends with `BUILD SUCCESSFUL`.

If you see errors about signing config (`Keystore file not found` or similar), open `android-app/.env.local` and verify the `KEYSTORE_FILE` path uses **forward slashes** even on Windows (e.g., `C:/Users/elinw/.android/keystores/...`), not backslashes.

- [ ] **Step 3: Locate the AAB**

```bash
ls /c/Users/elinw/projects/little-brain-games/android-app/android/app/build/outputs/bundle/release/
```

Expected: `app-release.aab` (~ a few MB).

- [ ] **Step 4: Verify the AAB is signed**

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app/android
gradlew.bat signingReport
```

Expected: prints signing info; the `release` config shows your keystore details (not the default debug ones).

- [ ] **Step 5: Commit (just the build outputs are gitignored — nothing to commit here)**

No commit; this task produces an artifact, not source changes.

---

## Task 13: Real-device verification

**Files:** none modified — final manual smoke test.

- [ ] **Step 1: Enable USB debugging on a real Android device**

On the Android tablet/phone: `Settings → About → tap Build Number 7 times` to enable Developer Options. Then `Settings → Developer Options → enable USB debugging`. Connect via USB and confirm the "Allow USB debugging?" prompt.

- [ ] **Step 2: Install the debug APK on the real device**

Build a debug APK first:

```bash
cd /c/Users/elinw/projects/little-brain-games/android-app/android
gradlew.bat assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`. Drag this APK file onto the device's screen in Android Studio's Device Explorer, OR run from Android Studio with the real device selected.

- [ ] **Step 3: Run the verification checklist**

Open the app on the device. Confirm each item:

- [ ] Splash shows for ~1.5 s, fades into the game
- [ ] Game renders correctly; warm color palette is visible
- [ ] All 4 game buttons work (Memory, Pattern, Puzzle, Logic)
- [ ] Audio: complete a Memory match — chime plays through device speaker
- [ ] Drag-drop in Puzzle: drag a piece from the tray to its correct position — it snaps
- [ ] File upload in Puzzle: click "📷 Upload picture", system file picker opens, select an image — it becomes the puzzle scene
- [ ] **Rotation test (critical):** start a Puzzle, place 3-4 pieces, rotate the device 90°. The placed pieces stay placed; the puzzle is **not** restarted. Rotate back — same.
- [ ] App icon on the home screen shows the brain silhouette on coral background
- [ ] Tap-and-hold the icon → app name reads "Little Brain Games"

- [ ] **Step 4: If anything failed, fix and re-test**

Common failure modes and fixes:
- **Audio doesn't play:** ensure user has clicked something first (Web Audio policy). Already handled by the game's existing `audio.ensureCtx()` — check Logcat for errors.
- **Rotation restarts the game:** revisit Task 4; `configChanges` attribute is the fix.
- **File picker doesn't open:** verify `captureInput: true` in `capacitor.config.json` (Task 1, Step 5).

- [ ] **Step 5: Commit any fixes**

```bash
cd /c/Users/elinw/projects/little-brain-games
git status
# if any changes:
git add -A
git commit -m "android: fixes from real-device verification"
```

---

## Task 14: Project README

**Files:**
- Create: `android-app/README.md`

- [ ] **Step 1: Write the README**

Write `android-app/README.md`:

````markdown
# Little Brain Games — Android App

Capacitor wrapper for the kids' learning game. Produces a signed Android App Bundle (`.aab`) ready for the Google Play Store.

## One-time setup

You need:
- Android Studio (any recent version, with bundled JDK 17+)
- Node.js 18+ (for Capacitor CLI)

```bash
cd android-app
npm install
```

## Daily workflow

After you edit `kids-game/index.html` (the actual game):

```bash
cd android-app
npm run sync
```

This copies the HTML into `www/` and runs `npx cap sync android`.

To run on emulator or USB-connected device, open `android-app/android/` in Android Studio and click ▶.

## Release build (signed AAB)

Prerequisite: a `.env.local` file in `android-app/` with keystore credentials. See `.env.example`.

```bash
cd android-app
npm run sync
cd android
gradlew.bat bundleRelease
```

Output: `android-app/android/app/build/outputs/bundle/release/app-release.aab`.

## Keystore — CRITICAL

The release keystore at `~/.android/keystores/littlebraingames-release.jks` is used to sign every Play Store upload. Google Play locks the published listing to this exact key. **If this file is lost, you can never publish updates to this app on Play Store.**

Required backups:
- File copy in your password manager (1Password / Bitwarden / Keychain) as an attachment
- Keystore password and key alias in the same record

Verify your backup is readable before considering this app published.

## Versioning

Bump these for every Play Store upload (`android-app/android/app/build.gradle`):
- `versionCode` — integer, must increase every release (1, 2, 3...)
- `versionName` — display string, semver style ("1.0.0", "1.0.1", "1.1.0")

## Project structure

| Path | Purpose |
|------|---------|
| `www/` | Capacitor web assets (build-time copy of `../kids-game/`) |
| `scripts/sync-game.mjs` | Copies game HTML and runs `cap sync` |
| `android/` | Generated Android Studio project — open this folder in AS |
| `capacitor.config.json` | Capacitor app id, name, plugin config |
| `store-assets/` | Phase 2 inputs: 512x512 store icon, future screenshots |
| `.env.local` (gitignored) | Keystore credentials for release builds |

## Troubleshooting

- **Gradle sync fails:** ensure Android Studio's bundled JDK is selected (`File → Settings → Build → Build Tools → Gradle → Gradle JDK`).
- **`KEYSTORE_FILE` not found on Windows:** use forward slashes in the path (`C:/Users/.../littlebraingames-release.jks`), not backslashes.
- **App restarts on rotation:** check that `AndroidManifest.xml` activity has `android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout|uiMode"`.
- **Audio silent:** the user must tap something first (Android WebView Web Audio policy). Already handled by the game.
````

- [ ] **Step 2: Verify**

```bash
cat /c/Users/elinw/projects/little-brain-games/android-app/README.md | head -30
```

Expected: prints the README's first 30 lines.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/elinw/projects/little-brain-games
git add android-app/README.md
git commit -m "android: README with build, sync, signing, and keystore-backup instructions"
```

---

## Self-Review

**Spec coverage:**

- ✅ Capacitor project that wraps the HTML — Tasks 1, 2, 3
- ✅ App identity (name, package ID, version, SDK levels) — Tasks 1, 5, 11
- ✅ Adaptive icon (foreground + background, all densities) — Tasks 6, 7
- ✅ Static splash screen — Tasks 5 (theme), 8 (drawable)
- ✅ Auto-rotation without losing game state — Task 4
- ✅ Signed release AAB build pipeline — Tasks 10, 11, 12
- ✅ Debug build runnable on emulator + real device — Tasks 9, 13
- ✅ Keystore backup discipline — Task 10 Step 3, Task 14 (README)
- ✅ Color palette in Android theme — Task 5 (colors.xml)
- ✅ App name in resources — Task 5 (strings.xml)
- ✅ 512×512 store icon (Phase 2 input) — Task 7 Step 5
- ✅ README documents the workflow — Task 14
- ✅ All success criteria from spec — covered by Tasks 9, 12, 13

**Placeholder scan:** No "TBD", "TODO" placeholders. Every task has explicit code/commands. The Image Asset Studio task (7) is GUI-driven by design — that's the right tool for legacy raster icon generation.

**Type / path consistency:**
- Package ID `app.kidlearn.tinygenius` consistent across capacitor.config.json (Task 1), strings.xml (Task 5), and manifest references
- Color values (`#FFF8EC`, `#F4A261`, `#5B3A29`, `#E9C46A`, `#A8C686`, `#F6CBA3`) consistent across CSS, splash background, manifest theme, and adaptive icon
- File paths use forward slashes consistently (Bash-style); the one Windows-specific note is in the README
- `www/index.html`, `assets/public/index.html`, and `kids-game/index.html` stay in sync via `npm run sync`

No inconsistencies found.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-25-little-brain-games-android-phase1.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
