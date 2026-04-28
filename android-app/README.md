# Little Brain Games — Android App

Capacitor wrapper for the kids' learning game (`../kids-game/index.html`). Produces a signed Android App Bundle (`.aab`) ready for the Google Play Store.

## One-time setup

You need:
- Android Studio (any recent version, with bundled JDK 17+)
- Node.js 18+ (for Capacitor CLI)

```powershell
cd C:\Users\elinw\projects\little-brain-games\android-app
npm install
```

If you ever hit `keytool` or Gradle "JAVA_HOME not set" errors, point at Android Studio's bundled JDK once for your user:

```powershell
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[Environment]::SetEnvironmentVariable("Path", "$env:JAVA_HOME\bin;" + [Environment]::GetEnvironmentVariable("Path", "User"), "User")
```

Close and reopen PowerShell after running those.

## Daily workflow

After editing `kids-game/index.html` (the actual game):

```powershell
cd C:\Users\elinw\projects\little-brain-games\android-app
npm run sync
```

This copies the HTML into `www/` and runs `npx cap sync android` to refresh the Android project's bundled assets.

## Debug build (testing)

Build a debug APK to install on your own phone or an emulator:

```powershell
cd C:\Users\elinw\projects\little-brain-games\android-app
npm run sync
cd android
.\gradlew.bat assembleDebug
```

Output: `android-app\android\app\build\outputs\apk\debug\app-debug.apk`. Email or Drive it to your phone, tap to install (allow "unknown sources" once for whatever app you're installing from).

## Release build (Play Store AAB)

Prerequisite: a `.env.local` file in `android-app\` with real keystore credentials. See `.env.example` for the format.

```powershell
cd C:\Users\elinw\projects\little-brain-games\android-app
npm run sync
cd android
.\gradlew.bat bundleRelease
```

Output: `android-app\android\app\build\outputs\bundle\release\app-release.aab`. Upload this file to Play Console.

## Keystore — CRITICAL

The release keystore at `%USERPROFILE%\.android\keystores\littlebraingames-release.jks` is used to sign every Play Store upload. Google Play locks the published listing to this exact key.

**If this file is lost, you can never publish updates to this app on Play Store.**

Required backups:
- File copy in your password manager (1Password / Bitwarden / Keychain) as an attachment
- Keystore password and key alias (`littlebraingames`) in the same record

Verify your backup is readable before considering this app published.

## Versioning

Bump these for every Play Store upload, in `android-app\android\app\build.gradle`:

- `versionCode` — integer, must increase every release (1, 2, 3, …)
- `versionName` — display string, semver style ("1.0.0", "1.0.1", "1.1.0")

Then rebuild the AAB and upload.

## Project structure

| Path | Purpose |
|------|---------|
| `www/` | Capacitor web assets (build-time copy of `..\kids-game\`) |
| `scripts\sync-game.mjs` | Copies game HTML and runs `cap sync` |
| `android\` | Generated Android Studio project — open this folder in Android Studio |
| `capacitor.config.json` | Capacitor app id, name, plugin config |
| `store-assets\` | Phase 2 inputs: 512×512 store icon, future screenshots |
| `.env.example` | Documented placeholders for keystore env vars |
| `.env.local` | (gitignored) Real keystore credentials on this machine only |

## Troubleshooting

- **Gradle sync fails:** ensure Android Studio's bundled JDK is selected (`File → Settings → Build → Build Tools → Gradle → Gradle JDK`).
- **`KEYSTORE_FILE` not found on Windows:** use forward slashes in the path (`C:/Users/.../littlebraingames-release.jks`), not backslashes.
- **App restarts on rotation:** check that `AndroidManifest.xml` activity has `android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout|uiMode"`.
- **Audio silent:** the user must tap something first (Android WebView Web Audio policy). Already handled by the game.
- **Image Asset Studio adds invalid XML:** Android Studio's Image Asset wizard sometimes inserts a license comment above the `<?xml ?>` declaration, which is invalid XML. If a build fails with `The processing instruction target matching "[xX][mM][lL]" is not allowed`, open the offending file and move the `<?xml ?>` line back to the very first line of the file.
