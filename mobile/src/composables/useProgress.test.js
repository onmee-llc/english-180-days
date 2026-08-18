import {describe, it, expect, vi, beforeEach} from 'vitest';

let authStateCallback;
const onAuthStateChangedMock = vi.fn((_auth, cb) => {
  authStateCallback = cb;
  return () => {};
});

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  GoogleAuthProvider: {credential: vi.fn()},
  signInWithCredential: vi.fn(),
  signOut: vi.fn(async () => {}),
  onAuthStateChanged: (...args) => onAuthStateChangedMock(...args),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDoc: vi.fn(async () => ({exists: () => false, data: () => ({})})),
  setDoc: vi.fn(async () => {}),
  onSnapshot: vi.fn(() => () => {}),
}));

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(async () => ({value: null})),
    set: vi.fn(async () => {}),
  },
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {isNativePlatform: () => false},
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    signOut: vi.fn(async () => {}),
    signInWithGoogle: vi.fn(async () => ({})),
  },
}));

vi.mock('../firebase.js', () => ({ensureFirebaseApp: vi.fn()}));

beforeEach(() => {
  vi.resetModules();
  onAuthStateChangedMock.mockClear();
  authStateCallback = undefined;
});

describe('useProgress authResolved', () => {
  it('stays false until onAuthStateChanged reports a status, then resolves whenAuthResolved()', async () => {
    const {useProgress} = await import('./useProgress.js');
    const {authResolved, whenAuthResolved, init} = useProgress();

    await init();
    expect(authResolved.value).toBe(false);

    let resolved = false;
    whenAuthResolved().then(() => {
      resolved = true;
    });

    await authStateCallback(null); // Firebase reports: no signed-in user
    await Promise.resolve(); // flush the callback's own microtasks
    await Promise.resolve(); // flush whenAuthResolved().then()

    expect(authResolved.value).toBe(true);
    expect(resolved).toBe(true);
  });

  it('reports resolved even on the disallowed-email branch', async () => {
    const {useProgress} = await import('./useProgress.js');
    const {authResolved, init} = useProgress();

    await init();
    await authStateCallback({email: 'not-allowed@example.com'});
    await Promise.resolve();

    expect(authResolved.value).toBe(true);
  });
});
