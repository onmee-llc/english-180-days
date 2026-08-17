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
6. Re-run `npx cap sync`.

No placeholder versions of these files exist in the repo on purpose — a fake
one fails at runtime in a much more confusing way than a missing one.

Sign-in in the browser dev server works without any of the above: on web the
plugin falls back to the Firebase JS SDK's popup flow.

[plugin]: https://github.com/capawesome-team/capacitor-firebase/tree/main/packages/authentication
