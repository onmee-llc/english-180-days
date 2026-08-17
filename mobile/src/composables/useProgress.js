import {reactive, toRefs} from 'vue';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
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
import {ensureFirebaseApp} from '../firebase.js';
import {mergeProgress} from './mergeProgress.js';

const PROGRESS_KEY = 'dm_progress';

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
});

let unsubscribeSnapshot = () => {};

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
      state.isSignedIn = !!user;
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
    await signInWithPopup(getAuth(), new GoogleAuthProvider());
  }

  async function signOut() {
    await authSignOut(getAuth());
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
