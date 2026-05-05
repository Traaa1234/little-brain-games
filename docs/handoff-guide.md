# Little Brain Games — Project Handoff Guide

This document covers everything you (or a fresh collaborator) needs to understand the current state of the project, build either platform, and continue toward App Store / Play Store publication.

**Last updated:** May 2026

---

## 1. What This App Is

**Little Brain Games** is a children's learning app for ages 5–7 with four mini-games:

| Game | What it does |
|------|--------------|
| 🧠 Memory | Match pairs of picture cards (or picture + word pairs) |
| 🎨 Pattern | Identify what comes next in a shape/letter/word sequence |
| 🧩 Jigsaw Puzzle | Drag pieces to assemble a picture (10/25/50/75/100 pieces) |
| 🦉 Odd One Out | Find the item that doesn't belong in a group |

**Tech stack:**
- Single-file HTML/CSS/JS game (`kids-game/index.html`, ~95 KB)
- Capacitor 6.x wrapping the HTML in a WebView for both Android and iOS
- No frameworks, no build system — vanilla JS with Web Audio API
- Zero third-party SDKs, zero network access, zero data collection

---

## 2. Repository

| Item | Value |
|------|-------|
| GitHub repo | https://github.com/Traaa1234/little-brain-games |
| Default branch | `main` |
| Privacy policy (live) | https://traaa1234.github.io/little-brain-games/privacy-policy.html |

**Folder structure:**

```
little-brain-games/
├── kids-game/
│   └── index.html              ← THE GAME — edit this file only
├── android-app/                ← Capacitor project (both Android + iOS)
│   ├── capacitor.config.json
│   ├── package.json
│   ├── www/                    ← built copy of the game (auto-generated, don't edit)
│   ├── android/                ← Android Studio project
│   ├── ios/                    ← Xcode project (after npx cap add ios)
│   ├── scripts/sync-game.mjs   ← copies game → www, then caps sync
│   ├── .env.local              ← keystore credentials (gitignored, Windows only)
│   └── store-assets/
│       ├── icon-512.png        ← Play Store icon (Android)
│       ├── feature-graphic.png ← Play Store banner (1024×500)
│       └── screenshots/
│           ├── android/        ← 6 Android screenshots
│           └── ios/            ← 5 iOS screenshot mockups (SVG)
└── docs/
    ├── play-store-listing.md   ← All Google Play Console copy + metadata
    ├── app-store-listing.md    ← All App Store Connect copy + metadata
    ├── privacy-policy.html     ← Hosted via GitHub Pages
    └── handoff-guide.md        ← This file
```

---

## 3. Accounts & Credentials

### Google (Android)

| Item | Value |
|------|-------|
| Google account | learnerOne250@gmail.com |
| Play Console URL | https://play.google.com/console |
| App package name | app.kidlearn.tinygenius |
| Developer name | KidLearn |

**Android keystore** (critical — back this up separately):
- Location: wherever you saved it when running `keytool` (check your `.env.local` for the path)
- `.env.local` file location: `android-app/.env.local` (gitignored)
- `.env.example` shows the required variable names
- **If this keystore is lost, you can never update the app on Google Play.**

### Apple (iOS)

| Item | Value |
|------|-------|
| Apple ID | *(the Apple ID you enrolled with — check developer.apple.com)* |
| Apple Developer Program | Individual — $99/year renewal |
| Bundle ID | app.kidlearn.tinygenius |
| App Store Connect URL | https://appstoreconnect.apple.com |
| Developer name shown | Your legal name (Individual account) |

Apple signing is handled by Xcode Automatic Signing — no separate keystore file to back up. If you change Macs, log in to Xcode with the same Apple ID.

### GitHub Pages (Privacy Policy)

| Item | Value |
|------|-------|
| GitHub account | Traaa1234 |
| Pages branch | `main`, `/docs` folder |
| Live URL | https://traaa1234.github.io/little-brain-games/privacy-policy.html |

---

## 4. Current Status (as of May 2026)

### Android — Google Play Store

| Track | Version | Status |
|-------|---------|--------|
| Internal testing | 1.0.1 (versionCode 2) | Live |
| Closed testing (closed-test-1) | 1.0.1 (versionCode 2) | In review by Google |
| Production | — | Not yet submitted |

**What's needed before Production:**
1. ✅ Close testing review approved (in progress — 3–7 business days)
2. ⬜ Recruit 12+ testers to opt in via: `https://play.google.com/apps/testing/app.kidlearn.tinygenius`
3. ⬜ Run 14 consecutive days of active testing with 12+ testers
4. ⬜ Click "Apply for production access" in Play Console
5. ⬜ Set price under Monetization → App pricing BEFORE first production release
6. ⬜ Create Production release and roll out

**Important pricing note:**
- Once published to production as FREE, you can NEVER change to paid.
- Set price first, then publish.
- Testers always get it free regardless (via opt-in URL or license testing).
- Add tester emails to: Play Console → Setup → License testing (for free installs on paid app).

### iOS — Apple App Store

| Phase | Status |
|-------|--------|
| Phase 1: Build iOS app | 🟡 Not started — needs Mac + Xcode |
| Phase 2: App Store submission | ⬜ Pending Phase 1 |

**What's needed to start Phase 1 (iOS build):**
1. ✅ Apple Developer account enrolled ($99/year)
2. ✅ Xcode installed on Mac (from Mac App Store)
3. ⬜ Run on Mac: `git clone`, `npm install`, `npx cap add ios`
4. ⬜ Configure Xcode signing, icons, splash, Info.plist
5. ⬜ Archive and upload to App Store Connect
6. ⬜ TestFlight install and verify on real iPhone

Full step-by-step instructions: `docs/superpowers/plans/2026-04-29-little-brain-games-ios-phase1.md`

---

## 5. How to Edit the Game

**All game logic lives in one file:**

```
kids-game/index.html
```

After editing:

**On Windows (Android):**
```powershell
cd C:\Users\elinw\projects\little-brain-games\android-app
npm run sync
```
Then rebuild the AAB in Android Studio or via Gradle.

**On Mac (iOS + Android):**
```bash
cd ~/projects/little-brain-games/android-app
npm run sync
```
Then in Xcode: ▶ Run to see changes in simulator.

---

## 6. How to Build Android (Windows)

**Prerequisites:**
- Android Studio installed
- Java: `$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"`
- Signing credentials in `android-app/.env.local`

**Build a signed AAB:**
```powershell
cd C:\Users\elinw\projects\little-brain-games\android-app\android
.\gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

**Before uploading to Play Store:** bump `versionCode` and `versionName` in:
`android-app/android/app/build.gradle`

---

## 7. How to Build iOS (Mac only)

**Prerequisites:**
- Xcode 15+ installed (Mac App Store)
- CocoaPods: `sudo gem install cocoapods`
- Node 18+: `brew install node`
- iOS platform added: `npx cap add ios` (run once)

**Daily workflow:**
```bash
cd ~/projects/little-brain-games/android-app
npm run sync                        # updates www/ and syncs to Xcode project
open ios/App/App.xcworkspace        # open in Xcode
```

**Archive for App Store:**
1. Xcode → Product → Archive
2. Organizer → Validate App → Distribute App → App Store Connect → Upload
3. Open appstoreconnect.apple.com → TestFlight → wait for build (~5-30 min)

**Before each App Store upload:** increment the Build number in Xcode → App target → General → Build.

---

## 8. Store Assets Checklist

### Google Play Store

| Asset | File | Status |
|-------|------|--------|
| Icon (512×512 PNG) | `store-assets/icon-512.png` | ✅ Done |
| Feature graphic (1024×500 PNG) | `store-assets/feature-graphic.png` | ✅ Done |
| Phone screenshots (6) | `store-assets/screenshots/android/` | ✅ Done |
| Short description | `docs/play-store-listing.md` | ✅ Done |
| Long description | `docs/play-store-listing.md` | ✅ Done |
| Privacy policy URL | https://traaa1234.github.io/... | ✅ Live |
| Content rating (IARC) | Answered in Play Console | ✅ Done |
| Data Safety form | Answered in Play Console | ✅ Done |

### Apple App Store

| Asset | File / Location | Status |
|-------|-----------------|--------|
| App icon (1024×1024 PNG) | Generate from `store-assets/icon-512.png` via `sips` | 🟡 Mac step |
| iPhone 6.7" screenshots (5) | `store-assets/screenshots/ios/*.svg` (mockups) | ⚠️ Need real captures |
| iPhone 5.5" screenshots | Need from simulator | ⬜ Not done |
| Subtitle (30 chars) | `docs/app-store-listing.md` | ✅ Written |
| Promotional text (170 chars) | `docs/app-store-listing.md` | ✅ Written |
| Keywords (100 chars) | `docs/app-store-listing.md` | ✅ Written |
| Description | `docs/app-store-listing.md` | ✅ Written |
| Privacy nutrition label | Answer in App Store Connect (answer: No data) | ⬜ App Store Connect step |
| Age rating | Answer IARC questionnaire in App Store Connect | ⬜ App Store Connect step |
| Paid Applications Agreement | Sign in App Store Connect → Agreements | ⬜ Required for paid app |

> ⚠️ iOS screenshot SVG mockups are design references only. Real screenshots must be captured from Xcode's iPhone 16 Pro Max simulator (`Cmd+S` in simulator = screenshot saved to Desktop). They must be exactly **1290×2796 px**.

---

## 9. Key Decisions Already Made

| Decision | Choice | Reason |
|----------|--------|--------|
| App architecture | Single HTML file in Capacitor | Simplest to maintain, no build step |
| Android package name | app.kidlearn.tinygenius | Chosen at project start — cannot change |
| iOS bundle ID | app.kidlearn.tinygenius | Same as Android for consistency |
| Developer name | KidLearn (Google) / Legal name (Apple) | Google allows DBA; Apple Individual shows legal name |
| Pricing | Paid ($2.99 iOS / TBD Android) | Set before first production release — cannot go free→paid after |
| Data collection | Zero | COPPA compliance by default; simplest App Store / Play Store forms |
| Privacy policy | GitHub Pages, same URL for both stores | Free hosting, no maintenance |
| Photo picker | Android: system file picker / iOS: PHPickerViewController | System pickers = no permission needed at install, only on use |
| Offline-first | No network requests at all | Kids' app on planes/cars; stronger privacy story |
| Orientation | Auto-rotate (all orientations) | Kids hold tablets any way |

---

## 10. Things to Watch Out For

1. **Android keystore** — if lost, the app is stranded on its current version forever. Back it up to a USB drive or password manager.

2. **versionCode must always increase** — each new APK/AAB upload to Play Store needs a higher versionCode than any previously uploaded build, even failed ones.

3. **iOS build number must always increase** — same rule for App Store. Xcode shows it as "Build" under General tab.

4. **Don't publish Android to production as Free** — if the plan is to charge, set the price in Monetization → App pricing before the production release.

5. **Tester email addresses** — add testers to both (a) the closed testing track email list AND (b) Play Console → Setup → License testing, so they can install for free on a paid app.

6. **Apple review note about photo picker** — the `NSPhotoLibraryUsageDescription` text in Info.plist must explain exactly when and why the photo is accessed. The current proposed text in the iOS design spec is adequate; don't shorten it.

7. **Made for Kids (Apple)** — once you select a Kids age band in App Store Connect, it cannot be removed. Only do this if the app stays kid-focused permanently.

8. **Paid Applications Agreement (Apple)** — must be signed before a paid app can go live. It requires banking info (for payouts) and tax forms. It can take 24–48h to activate after signing.

---

## 11. Reference Documents

| Document | Purpose |
|----------|---------|
| `docs/play-store-listing.md` | All Google Play Console copy, metadata, and submission checklist |
| `docs/app-store-listing.md` | All App Store Connect copy, metadata, and submission checklist |
| `docs/privacy-policy.html` | Privacy policy (hosted via GitHub Pages) |
| `docs/superpowers/plans/2026-04-29-little-brain-games-ios-phase1.md` | Step-by-step iOS Phase 1 build plan (very detailed) |
| `docs/superpowers/specs/2026-04-29-little-brain-games-ios-phase1-design.md` | iOS Phase 1 design decisions and rationale |
| `android-app/android/app/build.gradle` | Android signing config, versionCode, versionName |
| `android-app/capacitor.config.json` | Capacitor config for both platforms |
| `android-app/android/app/src/main/AndroidManifest.xml` | Android permissions and orientation config |
