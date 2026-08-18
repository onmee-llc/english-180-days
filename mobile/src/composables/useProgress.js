import {reactive, toRefs} from 'vue';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as authSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import {Preferences} from '@capacitor/preferences';
import {Capacitor} from '@capacitor/core';
import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {ensureFirebaseApp} from '../firebase.js';
import {mergeProgress} from './mergeProgress.js';

// ── NATIVE BUILD PREREQUISITE (manual, Firebase Console owner only) ─────────
// Google sign-in below runs through the native Firebase SDKs on iOS/Android.
// Those SDKs read a per-platform config file that is NOT in this repo and
// cannot be generated here. Before `npx cap run ios|android` will
// authenticate, the owner of the `aevo-labs` Firebase project must:
//   1. Register an iOS app and an Android app in the Firebase Console with
//      bundle ID / package name `vn.onmee.dailymastery` (must match `appId`
//      in mobile/capacitor.config.json).
//   2. Download `GoogleService-Info.plist` → place in `mobile/ios/App/App/`.
//   3. Download `google-services.json`     → place in `mobile/android/app/`.
//   4. Enable Google as a sign-in provider in Firebase Auth, and add the
//      Android app's SHA-1 signing certificate fingerprint (Android's Google
//      Sign-In fails without it).
// Until then sign-in only works in the browser dev server. See mobile/README.md.
// ───────────────────────────────────────────────────────────────────────────

const PROGRESS_KEY = 'dm_progress';

// This is a single-family personal app, not a public one — only these
// emails may use it. Mirrors the same allowlist enforced server-side in
// firestore.rules; that rule is the real security boundary (Firestore
// rejects reads/writes from any other account regardless of this check).
// This client-side check exists only so a disallowed sign-in gets a clear
// message and an immediate sign-out instead of a confusing permission-denied
// error the first time Firestore is touched.
const ALLOWED_EMAILS = [
  'onmeevn@gmail.com',
  'losteras.channel@gmail.com',
  'ngoradio.hi@gmail.com',
  'andrew.hcmuns@gmail.com',
];

/**
 * The string stored in the shared Firestore `completed` array. Must stay
 * byte-identical to what the web app writes — Eleventy's `page.url`
 * (`src/site/_includes/course.njk`), which is directory-style with a
 * trailing slash. Any drift here means web and mobile completions stop
 * reconciling and the array grows two entries per lesson.
 */
export function lessonKey(lesson) {
  return `/learn/${lesson.topicSlug}/lesson-${lesson.lessonNum}/`;
}

const state = reactive({
  progress: {streak: {}, completed: []},
  isSignedIn: false,
  isReady: false,
  authError: '',
  user: null, // {displayName, email, photoURL} from Firebase Auth — Settings/Profile
});

let unsubscribeSnapshot = () => {};

async function forceSignOut() {
  try {
    await FirebaseAuthentication.signOut();
  } catch (err) {
    console.warn('native sign-out failed', err);
  }
  await authSignOut(getAuth());
}

async function loadLocalProgress() {
  const {value} = await Preferences.get({key: PROGRESS_KEY});
  try {
    return value ? JSON.parse(value) : {streak: {}, completed: []};
  } catch (_) {
    return {streak: {}, completed: []};
  }
}

async function saveLocalProgress(data) {
  state.progress = data;
  await Preferences.set({key: PROGRESS_KEY, value: JSON.stringify(data)});
}

function userRef(uid) {
  return doc(getFirestore(), 'users', uid);
}

async function pushProgress(uid) {
  try {
    await setDoc(userRef(uid), state.progress, {merge: true});
  } catch (err) {
    console.warn('could not write progress to Firestore', err);
  }
}

export function useProgress() {
  async function init() {
    if (state.isReady) return;
    ensureFirebaseApp();
    state.progress = await loadLocalProgress();

    onAuthStateChanged(getAuth(), async (user) => {
      unsubscribeSnapshot();

      if (user && !ALLOWED_EMAILS.includes(user.email)) {
        state.authError = `${user.email} is not allowed to use this app.`;
        state.isSignedIn = false;
        state.user = null;
        await forceSignOut();
        return;
      }

      state.authError = '';
      state.isSignedIn = !!user;
      const {displayName, email, photoURL} = user || {};
      state.user = user ? {displayName, email, photoURL} : null;
      if (!user) return;

      try {
        const snap = await getDoc(userRef(user.uid));
        const remote = snap.exists() ? snap.data() : {};
        const merged = mergeProgress(state.progress, remote);
        await saveLocalProgress(merged);
        await pushProgress(user.uid);

        unsubscribeSnapshot = onSnapshot(userRef(user.uid), async (s) => {
          const r = s.exists() ? s.data() : {};
          await saveLocalProgress(mergeProgress(state.progress, r));
        });
      } catch (err) {
        console.warn('could not reconcile progress', err);
        return;
      }
    });

    state.isReady = true;
  }

  async function signIn() {
    ensureFirebaseApp();
    // signInWithPopup() cannot work in a WKWebView/Android WebView (no
    // opener to postMessage back to, and Google rejects OAuth in embedded
    // WebViews). The plugin uses the native Google SDK on device and falls
    // back to the JS SDK's popup on web.
    const result = await FirebaseAuthentication.signInWithGoogle();
    // On web the plugin drives getAuth() itself, so it's already signed in.
    // On native it only signs into the *native* Firebase SDK — the JS SDK
    // session that onAuthStateChanged/Firestore depend on has to be opened
    // separately with the credential the native flow returned.
    if (Capacitor.isNativePlatform()) {
      const credential = GoogleAuthProvider.credential(
        result.credential?.idToken,
      );
      await signInWithCredential(getAuth(), credential);
    }
  }

  async function signOut() {
    await forceSignOut();
  }

  function isComplete(lesson) {
    return !!lesson && state.progress.completed.includes(lessonKey(lesson));
  }

  async function markComplete(lesson) {
    const completed = new Set(state.progress.completed);
    completed.add(lessonKey(lesson));
    const today = new Date().toISOString().slice(0, 10);
    const next = {
      ...state.progress,
      completed: [...completed],
      streak: {...state.progress.streak, [today]: true},
      firstVisit: state.progress.firstVisit || today,
    };
    await saveLocalProgress(next);
    const user = getAuth().currentUser;
    if (user) await pushProgress(user.uid);
  }

  return {...toRefs(state), init, signIn, signOut, isComplete, markComplete};
}
