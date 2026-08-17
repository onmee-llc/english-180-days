# Daily Mastery — mobile app

Vue 3 + Vite wrapped in Capacitor. Lesson content is parsed out of the
Eleventy source at build time into `src/content/lessons.json` (gitignored —
`predev`/`prebuild` regenerate it automatically). Auth + progress sync against
the same `aevo-labs` Firebase project and the same `users/{uid}` document the
web app uses.

```bash
npm install
npm run dev     # regenerates lessons.json, then serves on :5173
npm run build
npx vitest run
npx cap sync
```

## ⚠️ Required before native builds can sign in

`mobile/ios/` and `mobile/android/` are gitignored (regenerated, not
committed) — on a fresh clone, run `npx cap add ios` / `npx cap add android`
before `npx cap sync`. **Re-running `cap add` regenerates these folders from
scratch**, so steps 2, 3, 6, 7, and 8 below (the files/edits that live inside
them) must be reapplied after every `cap add`, not just done once.

Google sign-in uses [`@capacitor-firebase/authentication`][plugin], which on
iOS/Android runs through the **native** Firebase SDKs. Those SDKs read a
per-platform config file that is not in this repo and cannot be generated
here — it has to be downloaded from the Firebase Console by the owner of the
`aevo-labs` project. **`npx cap run ios|android` will not authenticate until
these are done:**

1. In the Firebase Console for `aevo-labs`, **register an iOS app** with
   bundle ID `vn.onmee.dailymastery` and an **Android app** with package name
   `vn.onmee.dailymastery` (both must match `appId` in
   `capacitor.config.json`).
2. Download **`GoogleService-Info.plist`** (iOS) → place at
   `mobile/ios/App/App/GoogleService-Info.plist`.
3. Download **`google-services.json`** (Android) → place at
   `mobile/android/app/google-services.json`.
4. Enable **Google** as a sign-in provider under Authentication → Sign-in
   method.
5. Add the Android app's **SHA-1 signing certificate fingerprint** in the
   Firebase Console (debug and release). Android Google Sign-In fails without
   it.
6. **Android only:** open `mobile/android/variables.gradle` and add
   `rgcfaIncludeGoogle = true` inside the `ext { ... }` block. Without it,
   `@capacitor-firebase/authentication` compiles the Google Sign-In SDK as
   `compileOnly` instead of bundling it — the app **crashes on launch** with
   `NoClassDefFoundError: ...GoogleSignIn` the moment the plugin initializes,
   not just when you tap sign-in.
7. **iOS only:** open `GoogleService-Info.plist` and copy the
   `REVERSED_CLIENT_ID` value. In Xcode, select the `App` target → **Info**
   tab → **URL Types** → add one, pasting `REVERSED_CLIENT_ID` into the
   **URL Schemes** field (this writes a `CFBundleURLTypes` entry into
   `Info.plist`). Without this, iOS Google Sign-In can't redirect back into
   the app after the user picks an account — it just fails silently.
8. **iOS only:** the Speak tab's speech recognition needs two usage strings in
   `Info.plist` — add them the same way as the URL scheme in step 6 (Xcode →
   `App` target → **Info** tab, or by editing `Info.plist` directly):
   - `NSSpeechRecognitionUsageDescription` — e.g. "Used to transcribe what you
     say for the Speak translation feature."
   - `NSMicrophoneUsageDescription` — e.g. "Used to record your voice for the
     Speak translation feature."

   iOS kills the app on the first speech-recognition call if either is
   missing. Android needs nothing here: the plugin ships its own
   `RECORD_AUDIO` permission and Android 11+ `<queries>` entry, merged in
   automatically.
9. Re-run `npx cap sync`.

No placeholder versions of these files exist in the repo on purpose — a fake
one fails at runtime in a much more confusing way than a missing one.

Sign-in in the browser dev server works without any of the above: on web the
plugin falls back to the Firebase JS SDK's popup flow.

The Speak tab does not: `@capacitor-community/speech-recognition` has no web
implementation, so every call throws `Method not implemented on web.` in
`npm run dev`. On-device speech recognition can only be tested in a native
build.

[plugin]: https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication
