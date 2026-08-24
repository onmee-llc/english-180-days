import {initializeApp} from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as authSignOut,
} from 'firebase/auth';
import {getFirestore, doc, getDoc, setDoc, onSnapshot} from 'firebase/firestore';

import {firebaseConfig} from 'webdev_config';
import {store} from './store';
import {clearSignedInState} from './actions';

import {logError} from './analytics';

// Daily Mastery stores per-day study progress under this localStorage key.
// When the user is signed in, the same shape is mirrored to Firestore at
// `users/{uid}` so streak + completed lessons follow them across devices.
//
// Schema:
// {
//   firstVisit: "YYYY-MM-DD",
//   streak: { "YYYY-MM-DD": true, ... },
//   completed: ["/learn/topic-1-introduce-yourself/lesson-001", ...]
// }
const PROGRESS_KEY = 'dm_progress';

// Custom DOM events used to decouple the (heavy, lazily-loaded) Firebase code
// from the lightweight <daily-progress> / <lesson-complete> components.
const SYNCED_EVENT = 'dm-progress-synced'; // remote → local applied
const CHANGED_EVENT = 'dm-progress-changed'; // local changed, push to remote

let isInitialized = false;
let unsubscribeSnapshot = () => {};
let lastWritten = null;

/** @returns {object} Locally stored progress. */
function loadLocalProgress() {
  try {
    return JSON.parse(localStorage[PROGRESS_KEY] || 'null') || {};
  } catch (_) {
    return {};
  }
}

/** @param {object} data Progress to persist locally. */
function saveLocalProgress(data) {
  try {
    localStorage[PROGRESS_KEY] = JSON.stringify(data);
  } catch (_) {
    // localStorage unavailable (private browsing) — non-fatal.
  }
}

/**
 * Merge two progress objects. Union of streak days and completed lessons;
 * earliest firstVisit wins. The operation is commutative and idempotent so
 * repeated syncs converge instead of fighting each other.
 *
 * @param {object} a
 * @param {object} b
 * @returns {object}
 */
function mergeProgress(a = {}, b = {}) {
  const out = {};

  const firstVisits = [a.firstVisit, b.firstVisit].filter(Boolean).sort();
  if (firstVisits.length) {
    out.firstVisit = firstVisits[0];
  }

  out.streak = Object.assign({}, a.streak || {}, b.streak || {});

  const completed = new Set([
    ...(Array.isArray(a.completed) ? a.completed : []),
    ...(Array.isArray(b.completed) ? b.completed : []),
  ]);
  out.completed = [...completed];

  return out;
}

/**
 * @returns {import('firebase/firestore').DocumentReference | null}
 */
function userRef() {
  const state = store.getState();
  if (!state.user) {
    return null;
  }
  return doc(getFirestore(), 'users', state.user.uid);
}

/**
 * Write the locally stored progress to Firestore (if signed in). Skips the
 * write when nothing changed since the last push to avoid snapshot loops.
 */
async function pushProgress() {
  const ref = userRef();
  if (!ref) {
    return;
  }
  const data = loadLocalProgress();
  const serialized = JSON.stringify(data);
  if (serialized === lastWritten) {
    return;
  }
  lastWritten = serialized;
  try {
    await setDoc(ref, data, {merge: true});
  } catch (err) {
    console.warn('could not write progress to Firestore', err);
    logError(err, 'write progress');
  }
}

export function initialize() {
  // Initialization is run lazily (only when a sign-in component needs it)
  // because not all pages use Firebase, and the auth code opens an IndexedDB
  // connection that would otherwise make pages ineligible for bfcache.
  if (isInitialized) {
    return;
  }

  initializeApp(firebaseConfig);

  // When a component reports a local change, mirror it to Firestore.
  window.addEventListener(CHANGED_EVENT, () => {
    pushProgress();
  });

  getAuth().onAuthStateChanged(async (user) => {
    store.setState({checkingSignedInState: false});
    unsubscribeSnapshot();

    if (!user) {
      try {
        delete localStorage['webdev_isSignedIn'];
      } catch (_) {
        // ignore
      }
      clearSignedInState();
      return;
    }

    store.setState({isSignedIn: true, user});
    try {
      localStorage['webdev_isSignedIn'] = '1';
    } catch (_) {
      // ignore
    }

    const ref = userRef();

    // One-time reconcile: merge whatever is on this device with the remote
    // document, then write the union back so both ends start in sync.
    try {
      const snap = await getDoc(ref);
      const remote = snap.exists() ? snap.data() : {};
      const merged = mergeProgress(loadLocalProgress(), remote);
      saveLocalProgress(merged);
      lastWritten = null; // force the reconcile write below
      await pushProgress();
      window.dispatchEvent(new CustomEvent(SYNCED_EVENT));
    } catch (err) {
      logError(err, 'reconcile progress');
    }

    // Keep this device updated if progress changes on another device.
    unsubscribeSnapshot = onSnapshot(ref, (snap) => {
      const remote = snap.exists() ? snap.data() : {};
      const merged = mergeProgress(loadLocalProgress(), remote);
      saveLocalProgress(merged);
      window.dispatchEvent(new CustomEvent(SYNCED_EVENT));
    });
  });

  isInitialized = true;
}

/**
 * Request that the user signs in with Google. Resolves on completion.
 *
 * @return {Promise<Object>} the auth user
 */
export async function signIn() {
  let user = null;
  try {
    initialize();
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(getAuth(), provider);
    user = res.user;
  } catch (err) {
    console.error('signIn error', err);
    logError(err, 'signIn');
  }

  return user;
}

/**
 * Requests that the user signs out.
 */
export async function signOut() {
  try {
    initialize();
    await authSignOut(getAuth());
  } catch (err) {
    console.error('signOut error', err);
    logError(err, 'signOut');
  }
}
