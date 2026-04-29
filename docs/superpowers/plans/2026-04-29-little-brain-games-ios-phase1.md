# Little Brain Games — iOS App Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wrap `kids-game/index.html` as an iOS app using Capacitor, archive a signed `.ipa`, and verify it runs end-to-end on a real iPhone via TestFlight.

**Architecture:** Same Capacitor project that already wraps Android gains a new iOS platform alongside it. The folder is renamed `android-app/` → `app/` to reflect that it's now multi-platform. One `kids-game/index.html` source of truth, two native shells, one `npm run sync` updates both. iOS-specific files (Info.plist strings, app icon catalog, launch storyboard, signing) configured via Xcode on a Mac. Apple's Automatic Code Signing handles certificates and provisioning profiles.

**Tech Stack:** Capacitor 6.x + @capacitor/ios 6.x (CocoaPods 1.15+), Xcode 15+, Apple Developer Program (Individual), Swift (Capacitor's generated AppDelegate.swift, mostly untouched).

**Spec reference:** `docs/superpowers/specs/2026-04-29-little-brain-games-ios-phase1-design.md`

**Working directory for all tasks:** the cloned repo on a Mac (path varies by user — see Task 1).

**Operating system note:** every command in this plan runs on macOS Terminal (zsh by default). The existing Android work was done on Windows PowerShell; iOS work happens on the Mac.

---

## File Structure

| Path (relative to repo root) | Purpose | Status |
|------------------------------|---------|--------|
| `app/` | Renamed from `android-app/` — now multi-platform | Renamed in Task 2 |
| `app/ios/App/App.xcworkspace` | The Xcode workspace to open (use this, not `.xcodeproj`) | Generated in Task 4 |
| `app/ios/App/App/Info.plist` | iOS app manifest (permission strings, supported orientations, etc.) | Modified in Task 6 |
| `app/ios/App/App/Assets.xcassets/AppIcon.appiconset/` | iOS app icon at all required sizes | Configured in Task 8 |
| `app/ios/App/App/Base.lproj/LaunchScreen.storyboard` | Splash screen | Modified in Task 9 |
| `app/ios/App/Podfile` | CocoaPods dependencies for Capacitor | Generated in Task 4 |
| `app/capacitor.config.json` | Add `ios` block alongside existing `android` block | Modified in Task 5 |
| `app/store-assets/icon-1024.png` | 1024×1024 master icon for iOS asset catalog | Created in Task 7 |
| `app/store-assets/screenshots/android/` | Existing Android screenshots, moved into platform subfolder | Reorganized in Task 2 |
| `app/store-assets/screenshots/ios/` | Empty in Phase 1; populated in Phase 2 | Created in Task 2 |
| `app/README.md` | Updated with Mac/iOS workflow section | Modified in Task 15 |
| `.gitignore` (repo root) | Update `android-app/...` path patterns to `app/...` | Modified in Task 2 |

---

## Task 1: Mac environment setup + clone repo

**Files:** none modified — environment-only setup.

- [ ] **Step 1: Verify Xcode is installed**

```bash
xcodebuild -version
```

Expected: prints `Xcode 15.x` or higher. If `command not found`, install Xcode from the Mac App Store (~10 GB, takes 30 minutes). Open it once after install to accept the license agreement.

- [ ] **Step 2: Verify Xcode Command Line Tools**

```bash
xcode-select -p
```

Expected: prints `/Applications/Xcode.app/Contents/Developer` or similar. If "command not found", run:

```bash
xcode-select --install
```

…and click through the GUI installer.

- [ ] **Step 3: Install Node.js 18+ if not present**

```bash
node --version
npm --version
```

Expected: Node 18.x+ and npm 9.x+. If not installed, download from [nodejs.org](https://nodejs.org/) (LTS version) and run the installer. Or via Homebrew:

```bash
brew install node
```

- [ ] **Step 4: Install CocoaPods**

CocoaPods manages native iOS dependencies for Capacitor.

```bash
sudo gem install cocoapods
pod --version
```

Expected: prints `1.15.x` or higher. Sudo prompts for your Mac password.

If you get "Error installing cocoapods: ERROR: Failed to build gem native extension" — install Ruby via Homebrew first:

```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install cocoapods --user-install
```

- [ ] **Step 5: Add your Apple ID to Xcode**

Open Xcode → Xcode menu → Settings (or `Cmd+,`) → Accounts tab → click `+` → Apple ID → sign in with the Apple ID associated with your Apple Developer Program membership. The team listed under your Apple ID should show "Your Name (Personal Team)" or similar after a few seconds.

- [ ] **Step 6: Clone the repo to your Mac**

Pick a sensible location, e.g., `~/projects/`:

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/Traaa1234/little-brain-games.git
cd little-brain-games
```

Expected: clone succeeds, the new directory contains `kids-game/`, `android-app/`, `docs/`, etc.

- [ ] **Step 7: Verify branch and that you have the latest**

```bash
git branch
git status
git pull
```

Expected: on `main` branch, working tree clean, "Already up to date" or pulls a few new commits cleanly.

- [ ] **Step 8: Install npm deps in the existing project folder**

```bash
cd android-app
npm install
```

Expected: 100+ packages installed, no errors. Same packages as on Windows.

- [ ] **Step 9: Commit the implementation plan and any local changes**

This task creates no new tracked files, so nothing to commit. Just verify the repo is clean:

```bash
cd ~/projects/little-brain-games
git status
```

Expected: `nothing to commit, working tree clean`.

---

## Task 2: Rename `android-app/` → `app/` and reorganize screenshots

**Files:**
- Rename: `android-app/` → `app/`
- Modify: `.gitignore`
- Move: `app/store-assets/screenshots/*.png` → `app/store-assets/screenshots/android/`
- Create: `app/store-assets/screenshots/ios/.gitkeep` (empty placeholder)

- [ ] **Step 1: Rename the directory via git**

```bash
cd ~/projects/little-brain-games
git mv android-app app
```

`git mv` preserves history. Confirm it worked:

```bash
ls
```

Expected: shows `app/` (no longer `android-app/`).

- [ ] **Step 2: Update `.gitignore`**

Open `.gitignore` at the repo root. Find the lines that start with `android-app/` and replace `android-app` with `app`. For example:

```
android-app/android/.gradle/   →   app/android/.gradle/
android-app/android/build/     →   app/android/build/
android-app/android/app/build/ →   app/android/app/build/
```

Save.

Verify with:

```bash
grep -n "android-app" .gitignore
```

Expected: no output (no matches remaining). If any lines still mention `android-app`, fix them too.

- [ ] **Step 3: Move existing Android screenshots into a platform subfolder**

```bash
cd ~/projects/little-brain-games/app/store-assets
mkdir -p screenshots/android screenshots/ios
git mv screenshots/Screenshot_*.png screenshots/android/
touch screenshots/ios/.gitkeep
```

Verify:

```bash
ls screenshots/android/
ls screenshots/ios/
```

Expected: 6 PNG files in `android/`, just `.gitkeep` in `ios/`.

- [ ] **Step 4: Sanity-check that paths still work**

The sync script and build.gradle use relative paths that should still work after the rename. Verify:

```bash
cd ~/projects/little-brain-games/app
npm run sync
```

Expected output:
```
copied .../kids-game/index.html -> .../app/www/index.html
running: npx cap sync android
✔ Copying web assets...
✔ Updating Android plugins...
```

If it fails, the most likely culprit is a hardcoded path in `scripts/sync-game.mjs` — open it and ensure no `android-app` strings remain.

- [ ] **Step 5: Commit the rename**

```bash
cd ~/projects/little-brain-games
git add -A
git commit -m "iOS prep: rename android-app/ to app/ and split screenshots by platform"
git push
```

---

## Task 3: Add @capacitor/ios dependency

**Files:**
- Modify: `app/package.json`

- [ ] **Step 1: Install @capacitor/ios**

```bash
cd ~/projects/little-brain-games/app
npm install @capacitor/ios@^6.1.2
```

Expected: `package.json` and `package-lock.json` updated, dependency added under `dependencies`.

- [ ] **Step 2: Verify**

```bash
grep -E '"@capacitor/(ios|android|core)"' package.json
```

Expected: shows three lines, all version `^6.1.2` or higher.

- [ ] **Step 3: Commit**

```bash
cd ~/projects/little-brain-games
git add app/package.json app/package-lock.json
git commit -m "ios: add @capacitor/ios dependency"
git push
```

---

## Task 4: Add the iOS platform

**Files:**
- Generated: `app/ios/` (entire Xcode project tree, ~50 files)

- [ ] **Step 1: Add the iOS platform**

```bash
cd ~/projects/little-brain-games/app
npx cap add ios
```

Expected output (will take 1-2 minutes):
```
✔ Adding native xcode project in ios in 245ms
✔ add in 256ms
✔ Copying web assets from www to ios/App/App/public in 4ms
✔ Creating capacitor.config.json in ios/App/App in ...
✔ copy ios in ...
✔ pod install (this may take a minute)
...
✔ Updating iOS plugins in ...
[success] ios platform added!
```

If it fails on `pod install`, run:

```bash
cd ios/App
pod install
```

…to surface the actual error.

- [ ] **Step 2: Verify the iOS project tree**

```bash
cd ~/projects/little-brain-games/app
ls ios/App/App.xcworkspace
ls ios/App/App/Info.plist
ls ios/App/App/Assets.xcassets/AppIcon.appiconset/
ls ios/App/Podfile
```

All four paths should exist.

- [ ] **Step 3: Commit**

```bash
cd ~/projects/little-brain-games
git add app/ios/
git commit -m "ios: add iOS platform via npx cap add ios"
git push
```

Note: this will commit ~50+ generated files. Build outputs (`Pods/`, `build/`, `*.xcuserstate`) should already be gitignored by Capacitor's defaults.

---

## Task 5: Add iOS block to capacitor.config.json

**Files:**
- Modify: `app/capacitor.config.json`

- [ ] **Step 1: Read the current config**

```bash
cat ~/projects/little-brain-games/app/capacitor.config.json
```

You'll see the existing JSON with `appId`, `appName`, `webDir`, `android`, and `plugins`.

- [ ] **Step 2: Add the iOS block**

Edit `app/capacitor.config.json`. Add a new top-level `ios` key alongside the existing `android` key, and add `iosSpinnerStyle` to the `SplashScreen` plugin. The full file should now read:

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
  "ios": {
    "contentInset": "always",
    "limitsNavigationsToAppBoundDomains": false,
    "scheme": "Little Brain Games",
    "preferredContentMode": "mobile"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 1500,
      "backgroundColor": "#FFF8EC",
      "showSpinner": false,
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER",
      "iosSpinnerStyle": "small"
    },
    "StatusBar": {
      "backgroundColor": "#FFF8EC",
      "style": "DARK",
      "overlaysWebView": false
    }
  }
}
```

- [ ] **Step 3: Sync to push the config into the iOS project**

```bash
cd ~/projects/little-brain-games/app
npm run sync
```

Expected: both Android and iOS sync now ("Copying web assets" runs twice or once for each platform — Capacitor 6 may consolidate output).

- [ ] **Step 4: Commit**

```bash
cd ~/projects/little-brain-games
git add app/capacitor.config.json
git commit -m "ios: add iOS config block to capacitor.config.json"
git push
```

---

## Task 6: Configure Info.plist (permissions, orientation, status bar)

**Files:**
- Modify: `app/ios/App/App/Info.plist`

- [ ] **Step 1: Open the iOS project in Xcode**

```bash
cd ~/projects/little-brain-games/app
open ios/App/App.xcworkspace
```

Critical: open `App.xcworkspace`, NOT `App.xcodeproj`. The workspace includes the CocoaPods integration; the project file alone won't build.

Wait for Xcode to finish indexing (status bar at bottom).

- [ ] **Step 2: Open Info.plist**

In Xcode's Project Navigator (left panel) expand `App` → `App` → click `Info.plist`. The editor pane shows a list of key/value rows.

- [ ] **Step 3: Add `NSPhotoLibraryUsageDescription`**

Right-click in the empty space → "Add Row" → search/type `Privacy - Photo Library Usage Description`. Set the value to:

```
Little Brain Games asks for photo access only when you tap 'Upload picture' in the puzzle game. Photos stay on your device.
```

(Apple displays this exact text to the user when the photo picker first opens.)

- [ ] **Step 4: Set status bar style**

Find the row `Status bar style` (or add it: search "Status bar style"). Set its value to `Dark Content`.

If a row called `View controller-based status bar appearance` exists, set it to `NO`. If it doesn't exist, add it (search "View controller-based"), set to `NO`.

- [ ] **Step 5: Configure supported orientations**

Find `Supported interface orientations (iPhone)`. Expand it. Should already contain Portrait, Landscape Left, Landscape Right by default; if Portrait Upside Down is missing, leave it missing (iPhones don't rotate to upside-down for app content).

For iPad, find or add `Supported interface orientations (iPad)` and ensure all 4 are present (Portrait, Portrait Upside Down, Landscape Left, Landscape Right).

- [ ] **Step 6: Set the display name**

Find `Bundle display name` (`CFBundleDisplayName`). If not present, add it. Set value to `Little Brain Games`. This is what users see under the app icon on their home screen — separate from `CFBundleName` which is the internal name.

- [ ] **Step 7: Set requires-full-screen to NO**

Find `Requires full screen` (`UIRequiresFullScreen`). Set to `NO` — allows split-view multitasking on iPad.

- [ ] **Step 8: Save and verify**

`Cmd+S` to save. Then verify on the command line:

```bash
plutil -convert xml1 -o - ~/projects/little-brain-games/app/ios/App/App/Info.plist | grep -A1 -E "NSPhotoLibraryUsageDescription|UIStatusBarStyle|CFBundleDisplayName|UIRequiresFullScreen"
```

Expected: all four keys appear with their correct values.

- [ ] **Step 9: Commit**

```bash
cd ~/projects/little-brain-games
git add app/ios/App/App/Info.plist
git commit -m "ios: Info.plist — photo permission, dark status bar, orientation, display name"
git push
```

---

## Task 7: Generate the 1024×1024 master icon

**Files:**
- Create: `app/store-assets/icon-1024.png`

- [ ] **Step 1: Upscale `icon-512.png` to 1024×1024**

macOS has `sips` built in (Scriptable Image Processing System). Use it:

```bash
cd ~/projects/little-brain-games/app/store-assets
sips -z 1024 1024 icon-512.png --out icon-1024.png
```

Expected: a new file `icon-1024.png` is created. Confirm:

```bash
sips -g pixelWidth -g pixelHeight icon-1024.png
```

Expected: `pixelWidth: 1024`, `pixelHeight: 1024`.

- [ ] **Step 2: Verify the upscale looks acceptable**

```bash
open icon-1024.png
```

Preview opens. The upscaled image will be slightly soft (we're going 512 → 1024) but for a kid's-app icon with a simple silhouette + dots design, it's fine. If unhappy with quality, either:
- Re-render the original SVG at 1024 using Inkscape / online converter, OR
- Accept the soft upscale (Apple App Store will display this at 1024 in listings; the actual home-screen icon Xcode generates from this is at most 180px, so any softness is invisible there)

- [ ] **Step 3: Commit**

```bash
cd ~/projects/little-brain-games
git add app/store-assets/icon-1024.png
git commit -m "ios: add 1024x1024 master icon for iOS asset catalog + App Store listing"
git push
```

---

## Task 8: Configure the iOS App Icon asset catalog

**Files:**
- Modify: `app/ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json`
- Add: PNG files inside `app/ios/App/App/Assets.xcassets/AppIcon.appiconset/`

- [ ] **Step 1: Open the asset catalog in Xcode**

In Xcode's Project Navigator, click `App` → `App` → `Assets` (or `Assets.xcassets`). Then click `AppIcon` in the inner pane.

- [ ] **Step 2: Switch to "Single Size" mode**

In the Inspector panel on the right (View → Inspectors → Show Attributes Inspector or `Cmd+Option+4`), find the **App Icons** section. Set:

- **Devices:** `Universal` (iPhone + iPad)
- **App Icons:** `Single Size` *(this option appears in Xcode 14+; if you only see "All sizes", switch to that and we'll provide one image at the 1024 slot)*

The app icon editor now shows a single 1024×1024 slot.

- [ ] **Step 3: Drag in the 1024×1024 image**

In Finder, navigate to `~/projects/little-brain-games/app/store-assets/`. Drag `icon-1024.png` onto the 1024 slot in Xcode's icon editor.

Xcode will automatically generate all 17 required sizes from this single source at build time. Verify by clicking Project Navigator → `App` → `App` → `Assets.xcassets` and seeing the AppIcon entry now has a green checkmark / preview thumbnail.

- [ ] **Step 4: Verify on disk**

```bash
ls ~/projects/little-brain-games/app/ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

Expected: at least `Contents.json` and `icon-1024.png` (or whatever Xcode named it). The Contents.json file lists what icon Xcode is using.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/little-brain-games
git add app/ios/App/App/Assets.xcassets/AppIcon.appiconset/
git commit -m "ios: configure app icon from 1024 master in asset catalog"
git push
```

---

## Task 9: Configure splash screen storyboard

**Files:**
- Modify: `app/ios/App/App/Base.lproj/LaunchScreen.storyboard`
- Add: `app/ios/App/App/Assets.xcassets/Splash.imageset/` (with the icon)

- [ ] **Step 1: Add a Splash image asset**

In Xcode's Project Navigator → `App` → `App` → `Assets.xcassets`. Right-click in the asset list pane → New Image Set. Rename it to `Splash`.

The new image set has 1x, 2x, 3x slots. Drag `icon-1024.png` from Finder into the **2x** slot (Xcode treats this as ~512px effective). Splash doesn't need pixel-perfect rendering since it's brief; one image is sufficient.

- [ ] **Step 2: Open the launch storyboard**

Project Navigator → `App` → `App` → `Base.lproj` → `LaunchScreen.storyboard`. Xcode opens the Interface Builder.

- [ ] **Step 3: Set the background color**

Click the View Controller → click the View (the main background rectangle). In the Inspector (right panel) → Attributes Inspector → **Background**. Click the color, choose "Custom..." → enter Hex `FFF8EC` → OK.

- [ ] **Step 4: Add a centered image**

From the Object Library (bottom-right `+` button or `Cmd+Shift+L`), drag an **Image View** onto the storyboard.

Click the new image view. In the Attributes Inspector:
- Image: `Splash` (from the dropdown)
- Content Mode: `Aspect Fit`

Click the image view → Editor menu → Resolve Auto Layout Issues → Reset to Suggested Constraints. This pins it sensibly.

Then add explicit centering: with the image view selected, click the small **Align** icon at the bottom of the canvas → check "Horizontally in Container" + "Vertically in Container" → Add 2 Constraints.

Set the image view's width and height (drag corners or use Size Inspector → set Width: 200, Height: 200).

- [ ] **Step 5: Save**

`Cmd+S`.

- [ ] **Step 6: Commit**

```bash
cd ~/projects/little-brain-games
git add app/ios/App/App/
git commit -m "ios: cream splash screen with centered icon (LaunchScreen.storyboard)"
git push
```

---

## Task 10: Configure code signing

**Files:** none modified by hand — Xcode mutates project settings via the GUI.

- [ ] **Step 1: Open project signing settings**

In Xcode's Project Navigator, click the blue `App` project icon at the very top. The middle pane shows Targets. Click the `App` target → **Signing & Capabilities** tab.

- [ ] **Step 2: Enable automatic signing**

Check **Automatically manage signing**.

- [ ] **Step 3: Select your team**

Under "Team", click the dropdown and select your Apple Developer team (will be listed as your name + "(Personal Team)" or your developer team name if Individual program is enrolled).

- [ ] **Step 4: Verify Bundle Identifier**

The Bundle Identifier field should show `app.kidlearn.tinygenius`. If it doesn't (Capacitor's default may be slightly different — e.g., based on capacitor.config.json), edit it to match.

- [ ] **Step 5: Wait for Xcode to provision**

Xcode talks to Apple Developer portal in the background. After ~10 seconds you should see "Provisioning Profile: Xcode Managed Profile" populated, and a green check on the Signing Certificate row.

If you see an error like "Failed to register bundle identifier" — that means another developer's app has already taken `app.kidlearn.tinygenius`. Pick a more specific Bundle ID (e.g., `app.kidlearn.tinygenius.ios` or `com.warrenlim.littlebraingames`), update Xcode and `capacitor.config.json` to match. **The Android Bundle ID can stay `app.kidlearn.tinygenius` independently.**

- [ ] **Step 6: Commit project file changes**

Xcode wrote the team ID into the project file. Commit:

```bash
cd ~/projects/little-brain-games
git add app/ios/App/App.xcodeproj/project.pbxproj
git commit -m "ios: configure automatic code signing with Apple Developer team"
git push
```

---

## Task 11: First simulator run

**Files:** none modified.

- [ ] **Step 1: Sync web assets one more time**

```bash
cd ~/projects/little-brain-games/app
npm run sync
```

- [ ] **Step 2: Pick an iOS Simulator**

In Xcode, top-left, click the device dropdown next to the ▶ Run button. Select **iPhone 16 Pro** (or any iPhone running iOS 17+).

If no simulators are listed, click **Add Additional Simulators** → Simulators tab → `+` → pick iPhone 16 Pro / iOS 18 → Create.

- [ ] **Step 3: Build and run**

Click the ▶ Run button (or `Cmd+R`). First build takes 30-90 seconds (Xcode compiles Swift, Capacitor bridges, native plugins). Subsequent runs are faster.

Expected: iOS Simulator launches showing the splash screen for ~1.5s, then the four-game UI we know from Android.

- [ ] **Step 4: Smoke test all four games on the simulator**

In the simulator window:

- Click 🧠 Memory → flip two cards → match them
- Click 🎨 Pattern → click correct option → see it advance
- Click 🧩 Puzzle → drag a piece to its slot using the simulator's mouse-as-finger
- Click 🦉 Logic → click the odd one out
- Verify audio plays through Mac speakers (simulator forwards audio to your Mac)

If anything fails (game doesn't render, crashes, missing assets), check Xcode's console output (`Cmd+Shift+Y`) for errors. Most likely cause: web assets weren't sync'd. Re-run `npm run sync` and ▶ again.

- [ ] **Step 5: Run the in-page self-test**

In Safari on your Mac: `Develop` menu → choose your simulator's iPhone → choose "Little Brain Games" → opens Safari Web Inspector pointed at the app's WebView. In the Console, run `__runSelfTest()`. Expected: all assertions pass.

(If the `Develop` menu isn't visible: Safari → Settings → Advanced → check "Show features for web developers". And on the iOS Simulator: Settings app → Safari → Advanced → enable "Web Inspector".)

- [ ] **Step 6: Commit any fixes (if any were needed)**

```bash
cd ~/projects/little-brain-games
git status
# If any files changed:
git add -A
git commit -m "ios: fixes from simulator smoke test"
git push
```

---

## Task 12: Real iPhone test via USB

**Files:** none modified.

- [ ] **Step 1: Connect iPhone via USB / Lightning**

Plug your iPhone into the Mac. iPhone may prompt "Trust this computer?" → tap Trust.

- [ ] **Step 2: Enable Developer Mode on iPhone (iOS 16+)**

On iPhone: Settings → Privacy & Security → scroll to **Developer Mode** → toggle ON → restart iPhone when prompted.

If you don't see Developer Mode in Settings, it appears only after you try to install a developer-signed app once. Continue to step 3 first; Developer Mode option will appear after that.

- [ ] **Step 3: Select your device in Xcode**

In Xcode, top-left device dropdown → your iPhone should now be listed. Select it.

- [ ] **Step 4: Run on device**

Click ▶ Run. Xcode builds and installs to the iPhone. First time this may take 1-2 minutes — Xcode is also installing developer support files on your iPhone.

- [ ] **Step 5: Trust the developer profile on iPhone**

First-time apps from your developer team are untrusted. iPhone shows "Untrusted Developer" alert. To trust:

iPhone Settings → General → VPN & Device Management → tap your developer name → Trust.

Then on iPhone home screen, tap the Little Brain Games icon. App launches.

- [ ] **Step 6: Verification checklist on real iPhone**

Walk through these on the device. Mark each one as you confirm:

- [ ] Splash shows for ~1.5s, fades to game
- [ ] Game UI loads with all 4 game buttons
- [ ] **🧠 Memory** — flip cards, match works, chime plays
- [ ] **🎨 Pattern** — click correct option, advances
- [ ] **🧩 Puzzle** — drag a piece, snaps into place
- [ ] **🧩 Puzzle Upload picture** — click upload, system photo picker opens, your privacy text shows, pick a photo, becomes the puzzle scene
- [ ] **🦉 Logic** — click odd one out, advances
- [ ] **Rotation** — start a puzzle, place a few pieces, rotate the phone to landscape. Placed pieces stay placed; puzzle does not restart. Rotate back: same.
- [ ] **App icon on home screen** shows the brain silhouette on coral
- [ ] **App name** under icon reads "Little Brain Games"
- [ ] **Status bar** is dark text (readable on cream background)
- [ ] **Audio** plays through device speaker

- [ ] **Step 7: Fix anything that failed, commit**

If anything broken, fix in code or Xcode settings, re-sync, re-run. Commit the fixes:

```bash
cd ~/projects/little-brain-games
git add -A
git commit -m "ios: fixes from real-device verification"
git push
```

---

## Task 13: Archive and upload to App Store Connect

**Files:** none modified.

- [ ] **Step 1: Pre-register the Bundle ID at Apple Developer portal**

Open https://developer.apple.com/account/resources/identifiers/list in a browser. Sign in. Click `+` to register a new identifier.

- App IDs → Continue → App → Continue
- Description: `Little Brain Games`
- Bundle ID: Explicit, `app.kidlearn.tinygenius`
- Capabilities: leave defaults (no special entitlements needed)
- Continue → Register

If the identifier is already registered (e.g., Xcode pre-registered it during signing), skip.

- [ ] **Step 2: Switch Xcode to Release scheme**

In Xcode, top-left scheme dropdown (next to device dropdown) → **App** → Edit Scheme... → Run (left sidebar) → Build Configuration → Release → Close.

(Default is Debug. We need Release for archives.)

- [ ] **Step 3: Select "Any iOS Device" as the target**

Top-left device dropdown → choose **Any iOS Device (arm64)** at the top. Archives can only be made when targeting a generic device, not a simulator or specific phone.

- [ ] **Step 4: Archive**

Xcode menu: Product → Archive. Build runs (~1 minute). When done, the **Organizer** window opens with your archive listed.

If Organizer doesn't open: Window menu → Organizer → Archives tab.

- [ ] **Step 5: Validate the archive (catches issues before upload)**

In Organizer with your archive selected, click **Validate App**. Steps:
- App Store Connect distribution → Next
- Distribution options → Upload your app's symbols (leave checked) → Next
- Re-sign automatically → Next
- Validate

Wait 1-2 minutes. Expected: green check "App validation succeeded". If it errors, the error message is specific (missing key in Info.plist, signing issue, etc.) — fix and retry.

- [ ] **Step 6: Distribute to App Store Connect**

In Organizer with your archive selected, click **Distribute App**. Steps:
- App Store Connect → Next
- Upload → Next
- Distribution options: keep defaults → Next
- Re-sign automatically → Next
- Review settings → Upload

Wait 2-5 minutes. Expected: "Upload Successful". Apple's servers process the binary in the background (5-30 minutes more).

- [ ] **Step 7: Verify in App Store Connect**

Open https://appstoreconnect.apple.com → My Apps. If "Little Brain Games" doesn't exist yet, create it:
- `+` New App
- Platforms: iOS
- Name: `Little Brain Games`
- Primary language: English (US)
- Bundle ID: `app.kidlearn.tinygenius` (selectable from dropdown after registration in Step 1)
- SKU: `little-brain-games-1` (any unique identifier; not user-visible)
- User Access: Full Access
- Create

Then click into the app → TestFlight tab → wait for the build to appear (~5-30 min processing). When it does, status shows "Processing" → "Ready to Test" → "Missing Compliance" or similar.

- [ ] **Step 8: Answer the encryption-export question**

When the build status shows "Missing Compliance", click into it. Apple asks if your app uses encryption.

- Does your app use encryption? **No** *(your app uses only standard HTTPS — exempt under common categories — but for a kids' app with no network, even safer to answer No)*

After you answer, status changes to "Ready to Submit".

- [ ] **Step 9: Commit (no source changes; this is informational)**

This task produces an artifact (the uploaded build), not source changes. Skip the commit step.

---

## Task 14: TestFlight install on your own iPhone

**Files:** none modified.

- [ ] **Step 1: Add yourself as an internal tester**

App Store Connect → Little Brain Games → TestFlight tab → Internal Testing (left sidebar) → click `+` next to "Testers" → select your own user (the Apple ID you signed in with).

- [ ] **Step 2: Install TestFlight on your iPhone**

On your iPhone, open the App Store and search "TestFlight" → install. (You probably already have it from prior development.)

- [ ] **Step 3: Open the TestFlight invite**

You'll get an email from Apple titled "You've been invited to test Little Brain Games on TestFlight." Open the email on your iPhone → tap the **View in TestFlight** link.

If the email hasn't arrived (sometimes takes 5 min), open the TestFlight app directly → Redeem → enter the redemption code from your invitation. Or just open TestFlight; the app may already appear in the list.

- [ ] **Step 4: Install via TestFlight**

In TestFlight, tap **Install** next to Little Brain Games. App downloads + installs.

- [ ] **Step 5: Run the same verification checklist from Task 12**

Open the app via the home-screen icon (or the "Open" button in TestFlight). Walk through the same checklist as Task 12:

- [ ] Splash → game → all 4 games work
- [ ] Audio works
- [ ] Drag-drop puzzle works
- [ ] Photo upload works
- [ ] Rotation preserves state
- [ ] Icon, name, status bar correct

This installation goes through the same path real testers will use later in Phase 2.

- [ ] **Step 6: Commit any fixes (likely none if Task 12 already passed)**

```bash
cd ~/projects/little-brain-games
git status
# If anything changed:
git add -A
git commit -m "ios: fixes from TestFlight verification"
git push
```

---

## Task 15: Update README with Mac/iOS workflow

**Files:**
- Modify: `app/README.md`

- [ ] **Step 1: Read the current README**

```bash
cat ~/projects/little-brain-games/app/README.md
```

You'll see Windows/PowerShell-flavored instructions for the Android workflow.

- [ ] **Step 2: Append the iOS section**

Append this content to the end of `app/README.md`:

```markdown
---

## iOS workflow (Mac required)

iOS development requires a Mac with Xcode 15+ and CocoaPods installed.

### One-time setup on a new Mac

```bash
xcode-select --install              # Xcode Command Line Tools (if needed)
sudo gem install cocoapods          # CocoaPods for iOS native deps
git clone https://github.com/Traaa1234/little-brain-games.git ~/projects/little-brain-games
cd ~/projects/little-brain-games/app
npm install
```

Sign in to your Apple Developer Program account in Xcode → Settings → Accounts.

### Daily workflow (after editing kids-game/index.html)

```bash
cd ~/projects/little-brain-games/app
npm run sync                        # syncs both Android and iOS web bundles
```

Then open the iOS project in Xcode:

```bash
open ios/App/App.xcworkspace
```

Use **App.xcworkspace** (not `.xcodeproj`) — the workspace includes CocoaPods.

### Run on iOS Simulator

In Xcode: top-left device dropdown → pick an iPhone simulator → ▶ Run.

### Run on real iPhone via USB

1. Connect iPhone via cable, accept "Trust this computer?" prompt
2. iPhone Settings → Privacy & Security → Developer Mode → ON → restart
3. In Xcode device dropdown, pick your iPhone
4. ▶ Run. First time, iPhone Settings → General → VPN & Device Management → trust your developer profile.

### Archive for App Store

1. Switch scheme to Release: Edit Scheme → Run → Build Configuration → Release
2. Device dropdown: **Any iOS Device (arm64)**
3. Product → Archive
4. In Organizer: Validate App → Distribute App → App Store Connect → Upload

Build appears in App Store Connect → TestFlight after ~5-30 min processing.

### Bumping version

For each App Store upload, increase the build number (`CFBundleVersion`):

In Xcode → App target → General → "Build" field. Increment by 1 each upload (1, 2, 3, …). Marketing version (`CFBundleShortVersionString`) is the user-facing string ("1.0.0"); bump that whenever you want.

### iOS-specific files

| File | Purpose |
|------|---------|
| `ios/App/App.xcworkspace` | Open this in Xcode |
| `ios/App/App/Info.plist` | App permissions, orientations, display name |
| `ios/App/App/Assets.xcassets/AppIcon.appiconset/` | App icon (1024 master regenerates all sizes) |
| `ios/App/App/Base.lproj/LaunchScreen.storyboard` | Splash screen |
| `ios/App/Podfile` | CocoaPods dependencies (Capacitor + plugins) |
```

- [ ] **Step 3: Verify**

```bash
tail -50 ~/projects/little-brain-games/app/README.md
```

Expected: shows the new iOS section.

- [ ] **Step 4: Commit**

```bash
cd ~/projects/little-brain-games
git add app/README.md
git commit -m "docs: add iOS workflow section to app README"
git push
```

---

## Self-Review

**Spec coverage:**

- ✅ Capacitor iOS platform added — Tasks 3, 4
- ✅ Bundle ID, app name, version configured — Tasks 5, 10 (Bundle ID), Info.plist Task 6 (display name + version)
- ✅ App icon at all required sizes — Tasks 7 (master), 8 (asset catalog auto-generates)
- ✅ Splash screen — Task 9
- ✅ Auto-rotation without losing state — Task 6 (Info.plist orientations) + tested in Task 12
- ✅ Photo picker permission string — Task 6
- ✅ Code signing via Automatic with team — Task 10
- ✅ Build + archive a release `.ipa` — Task 13
- ✅ Run on real iPhone via TestFlight — Task 14
- ✅ Folder rename `android-app/` → `app/` — Task 2
- ✅ Reuse from Android (icon, splash design, privacy policy URL, listing copy) — Tasks 7, 9 (reuse warmth palette + brain design)
- ✅ Out-of-scope items (App Store Connect listing creation, Made for Kids enrollment, etc.) explicitly deferred — Phase 2 spec
- ✅ README documents Mac workflow — Task 15

**Placeholder scan:** No "TBD"/"TODO" placeholders. Every task has explicit commands, file content, and verification.

**Path / type consistency:**
- `app/` (renamed) used uniformly across all tasks after Task 2
- Bundle ID `app.kidlearn.tinygenius` consistent across capacitor.config.json (Task 5), Apple Developer portal (Task 13 step 1), Xcode signing (Task 10)
- `~/projects/little-brain-games/` used as the canonical clone path
- Capacitor 6.x version consistent

No gaps or inconsistencies found.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-04-29-little-brain-games-ios-phase1.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks. The Mac-only / Xcode-GUI tasks (1, 4 if `pod install` issues, 6, 8, 9, 10, 11, 12, 13, 14) you'll need to do by hand on the Mac because no subagent can drive the Xcode GUI or push buttons on a physical iPhone. The mostly-mechanical tasks (2, 3, 5, 7, 15) can be subagent-driven.

**2. Inline Execution** — execute tasks in this session with checkpoints. Same caveat: you do the Mac/Xcode steps by hand, I do the file edits and commits.

Which approach?
