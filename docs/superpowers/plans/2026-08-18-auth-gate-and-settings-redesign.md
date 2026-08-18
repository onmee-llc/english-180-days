# Auth Gate + Settings Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require Google sign-in before any screen is reachable, and make `SettingsView.vue`'s remaining rows share one consistent auto-save pattern instead of three different shapes.

**Architecture:** A new `authResolved` signal on the existing `useProgress()` singleton (distinct from the pre-existing `isReady`, which only means "the auth listener is registered," not "we know the real status") gates both a router navigation guard (`authGuard.js`) and `App.vue`'s render (a `SplashView` shown until resolved). Sign-in moves from `SettingsView.vue` into a new `LoginView.vue`, reached only when unauthenticated.

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), Vue Router 4, Vitest. No new dependencies.

## Global Constraints

- All work is scoped to `mobile/`.
- No new npm dependencies — `SplashView.vue` reuses the existing
  `mobile/brand/icon.svg` via a relative import; every other screen reuses
  the existing token system in `mobile/src/styles/tokens.css`.
- `authResolved` (not the pre-existing `isReady`) is the only signal the
  router guard and `App.vue` may use to know Firebase has reported the real
  sign-in status — `isReady` only means the listener is registered.
- Existing test conventions apply: `vi.resetModules()` + dynamic `import()`
  per test for singleton composables; `vi.mock()` for module imports.
- Every interactive element touched (sign-in button, API key input) ships
  its full state set: default / hover / focus-visible / active / disabled /
  loading / error, per the design's Hallmark-informed input/button rules.

---

### Task 1: `authResolved` on `useProgress`

**Files:**
- Modify: `mobile/src/composables/useProgress.js:65-73` (state block), `:116-119` (top of the `onAuthStateChanged` callback), `:195` (return statement)
- Test: `mobile/src/composables/useProgress.test.js` (new)

**Interfaces:**
- Produces: `useProgress()` gains `authResolved` (a `ref(false)`, flips to `true` the first time Firebase's `onAuthStateChanged` callback fires — regardless of which branch it takes) and `whenAuthResolved()` (a function returning a promise that resolves at the same moment). Every other existing export of `useProgress()` is unchanged.

- [ ] **Step 1: Write the failing test**

Create `mobile/src/composables/useProgress.test.js`:

```js
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/composables/useProgress.test.js`
Expected: FAIL — `authResolved` is `undefined` on the object returned by `useProgress()` (property doesn't exist yet).

- [ ] **Step 3: Add `authResolved` to the implementation**

In `mobile/src/composables/useProgress.js`, replace this block (currently lines 65-73):

```js
const state = reactive({
  progress: {streak: {}, completed: []},
  isSignedIn: false,
  isReady: false,
  authError: '',
  user: null, // {displayName, email, photoURL} from Firebase Auth — Settings/Profile
});

let unsubscribeSnapshot = () => {};
```

with:

```js
const state = reactive({
  progress: {streak: {}, completed: []},
  isSignedIn: false,
  isReady: false,
  authError: '',
  user: null, // {displayName, email, photoURL} from Firebase Auth — Settings/Profile
});

// isReady (above) only means "the onAuthStateChanged listener is registered" —
// it flips true synchronously in init(), before Firebase has actually reported
// whether a session exists. authResolved is the real signal: true only once
// the listener's callback has fired at least once, so isSignedIn can be trusted.
// The router guard and App.vue's splash gate key off this, never isReady.
const authResolved = ref(false);
let resolveAuthResolved;
const authResolvedPromise = new Promise((resolve) => {
  resolveAuthResolved = resolve;
});

let unsubscribeSnapshot = () => {};
```

This requires `ref` to be imported alongside `reactive`/`toRefs` — update the top import line from:

```js
import {reactive, toRefs} from 'vue';
```

to:

```js
import {reactive, ref, toRefs} from 'vue';
```

- [ ] **Step 4: Set `authResolved` at the top of the auth-state callback**

In the same file, find `onAuthStateChanged(getAuth(), async (user) => {` (inside `init()`) and its first line, `unsubscribeSnapshot();`. Replace:

```js
    onAuthStateChanged(getAuth(), async (user) => {
      unsubscribeSnapshot();

      if (user && !ALLOWED_EMAILS.includes(user.email)) {
```

with:

```js
    onAuthStateChanged(getAuth(), async (user) => {
      unsubscribeSnapshot();

      if (!authResolved.value) {
        authResolved.value = true;
        resolveAuthResolved();
      }

      if (user && !ALLOWED_EMAILS.includes(user.email)) {
```

- [ ] **Step 5: Export the new interface**

Replace the `useProgress()` return statement:

```js
  return {...toRefs(state), init, signIn, signOut, isComplete, markComplete};
```

with:

```js
  return {
    ...toRefs(state),
    authResolved,
    whenAuthResolved: () => authResolvedPromise,
    init,
    signIn,
    signOut,
    isComplete,
    markComplete,
  };
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/composables/useProgress.test.js`
Expected: PASS (2 tests)

- [ ] **Step 7: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites (no other file references `useProgress.js`'s return shape in a way this changes).

- [ ] **Step 8: Commit**

```bash
git add src/composables/useProgress.js src/composables/useProgress.test.js
git commit -m "feat(mobile): add authResolved signal to useProgress"
```

---

### Task 2: `SplashView.vue`

**Files:**
- Create: `mobile/src/views/SplashView.vue`

**Interfaces:**
- Produces: a presentational component with no props, no emits — `<SplashView />`.

- [ ] **Step 1: Create the component**

Create `mobile/src/views/SplashView.vue`:

```vue
<script setup>
import iconUrl from '../../brand/icon.svg';
</script>

<template>
  <section class="splash">
    <div class="splash__mark-wrap">
      <span class="splash__ring" aria-hidden="true"></span>
      <img :src="iconUrl" alt="" class="splash__mark" />
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: launch splash · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: static only — no interactive elements
 */

.splash {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  background: var(--color-paper);
}

.splash__mark-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 6rem;
  height: 6rem;
}

.splash__ring {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-card);
  border: 1.5px solid var(--color-accent);
  opacity: 0;
  animation: splash-ring 1.8s var(--ease-out) infinite;
}

@keyframes splash-ring {
  0% {
    transform: scale(0.85);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}

.splash__mark {
  position: relative;
  z-index: 1;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: var(--radius-card);
  box-shadow: 0 10px 24px -8px color-mix(in oklab, var(--color-accent) 55%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .splash__ring {
    animation: none;
    display: none;
  }
}
</style>
```

- [ ] **Step 2: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS — this is a new, unreferenced file so far; nothing should break.

- [ ] **Step 3: Commit**

```bash
git add src/views/SplashView.vue
git commit -m "feat(mobile): add SplashView for the auth-resolving gap"
```

---

### Task 3: `LoginView.vue`

**Files:**
- Create: `mobile/src/views/LoginView.vue`

**Interfaces:**
- Consumes: `useProgress()` → `{authError, isSignedIn, signIn}` (all pre-existing exports, unchanged by Task 1). `useRouter()` from `vue-router`.
- Produces: a presentational component with no props, no emits — `<LoginView />`. Navigates to the `today` route once `isSignedIn` becomes `true`.

- [ ] **Step 1: Create the component**

Create `mobile/src/views/LoginView.vue`:

```vue
<script setup>
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';

const router = useRouter();
const {authError, isSignedIn, signIn} = useProgress();

const isSigningIn = ref(false);
const signInError = ref('');

// Navigate off the redirect only once isSignedIn is actually true — not
// right after signIn()'s own promise resolves. signIn() can resolve before
// the onAuthStateChanged listener (which also runs the disallowed-email
// check) has finished — isSignedIn is the one signal that's already been
// through that check.
watch(isSignedIn, (signedIn) => {
  if (signedIn) router.push({name: 'today'});
});

async function handleSignIn() {
  signInError.value = '';
  isSigningIn.value = true;
  try {
    await signIn();
  } catch (err) {
    // Most commonly the user closed the Google account picker — not a bug,
    // just needs a visible message instead of a silently dead button.
    signInError.value = 'Sign-in was cancelled or failed. Please try again.';
  } finally {
    isSigningIn.value = false;
  }
}
</script>

<template>
  <section class="login">
    <div class="login__card">
      <p class="login__eyebrow">SIGN IN</p>
      <h1 class="login__title">Daily Mastery</h1>
      <p class="login__subtitle">
        Sign in with your Google account to start today's lesson.
      </p>

      <button
        type="button"
        class="login__button"
        :disabled="isSigningIn"
        :aria-disabled="isSigningIn"
        @click="handleSignIn"
      >
        {{ isSigningIn ? 'Signing in…' : 'Sign in with Google' }}
      </button>

      <p v-if="authError || signInError" class="login__error" role="alert">
        {{ authError || signInError }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: auth gate screen · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: sign-in button — default · hover · focus-visible · active · disabled(loading) · error
 */

.login {
  display: grid;
  place-items: center;
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg);
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.login__card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
  max-width: 26rem;
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  text-align: center;
}

.login__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.login__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.login__subtitle {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.95rem;
  line-height: 1.5;
}

.login__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.75rem;
  padding: 0 1.4rem;
  margin-top: var(--space-xs);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}

@media (hover: hover) {
  .login__button:hover:not(:disabled) {
    background: var(--color-accent-deep);
  }
}

.login__button:active:not(:disabled) {
  transform: translateY(1px);
}

.login__button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.login__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: 0.85rem;
}

@media (prefers-reduced-motion: reduce) {
  .login__button {
    transition:
      background-color var(--dur-fast) linear,
      opacity var(--dur-fast) linear;
    transform: none !important;
  }
}
</style>
```

- [ ] **Step 2: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS — new, unreferenced file so far.

- [ ] **Step 3: Commit**

```bash
git add src/views/LoginView.vue
git commit -m "feat(mobile): add LoginView"
```

---

### Task 4: `authGuard.js` + router wiring

**Files:**
- Create: `mobile/src/authGuard.js`
- Test: `mobile/src/authGuard.test.js` (new)
- Modify: `mobile/src/router.js` (full file, 24 lines)

**Interfaces:**
- Consumes: `useProgress()` → `{authResolved, isSignedIn, init, whenAuthResolved}` (from Task 1). `LoginView.vue` (from Task 3) — the route this guard protects against/redirects to.
- Produces: `authGuard(to)` — an async function taking a Vue Router route-location-like object with a `.name` property, returning `undefined` (proceed) or `{name: 'login'}` / `{name: 'today'}` (redirect). Exported standalone (not just registered inline) specifically so it's testable without instantiating a real router — `createWebHistory()` needs a browser `window`, which the test environment doesn't have.

- [ ] **Step 1: Write the failing test**

Create `mobile/src/authGuard.test.js`:

```js
import {describe, it, expect, vi, beforeEach} from 'vitest';

const authResolved = {value: false};
const isSignedIn = {value: false};
const init = vi.fn(async () => {});
let resolveWhenAuthResolved;
const whenAuthResolved = vi.fn(
  () =>
    new Promise((resolve) => {
      resolveWhenAuthResolved = resolve;
    }),
);

vi.mock('./composables/useProgress.js', () => ({
  useProgress: () => ({authResolved, isSignedIn, init, whenAuthResolved}),
}));

beforeEach(() => {
  vi.resetModules();
  authResolved.value = false;
  isSignedIn.value = false;
  init.mockClear();
  whenAuthResolved.mockClear();
});

describe('authGuard', () => {
  it('waits for auth to resolve before deciding', async () => {
    const {authGuard} = await import('./authGuard.js');
    const resultPromise = authGuard({name: 'today'});

    await Promise.resolve(); // let the guard reach the await
    authResolved.value = true;
    isSignedIn.value = false;
    resolveWhenAuthResolved();

    const result = await resultPromise;
    expect(result).toEqual({name: 'login'});
  });

  it('redirects to login when resolved and signed out', async () => {
    authResolved.value = true;
    const {authGuard} = await import('./authGuard.js');

    const result = await authGuard({name: 'today'});

    expect(result).toEqual({name: 'login'});
  });

  it('lets a signed-in user through to a non-login route', async () => {
    authResolved.value = true;
    isSignedIn.value = true;
    const {authGuard} = await import('./authGuard.js');

    const result = await authGuard({name: 'settings'});

    expect(result).toBeUndefined();
  });

  it('redirects a signed-in user away from /login', async () => {
    authResolved.value = true;
    isSignedIn.value = true;
    const {authGuard} = await import('./authGuard.js');

    const result = await authGuard({name: 'login'});

    expect(result).toEqual({name: 'today'});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/authGuard.test.js`
Expected: FAIL — `Failed to resolve import "./authGuard.js"` (file doesn't exist yet).

- [ ] **Step 3: Create `authGuard.js`**

Create `mobile/src/authGuard.js`:

```js
import {useProgress} from './composables/useProgress.js';

// Exported as a standalone function (not just registered inline in
// router.js) so it can be unit-tested directly — createWebHistory() needs a
// browser `window`, which the test environment doesn't have, so importing
// router.js in a test isn't an option.
export async function authGuard(to) {
  const {authResolved, isSignedIn, init, whenAuthResolved} = useProgress();
  await init();
  if (!authResolved.value) await whenAuthResolved();
  if (to.name !== 'login' && !isSignedIn.value) return {name: 'login'};
  if (to.name === 'login' && isSignedIn.value) return {name: 'today'};
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/authGuard.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Wire the guard and the `/login` route into `router.js`**

Replace `mobile/src/router.js` in full:

```js
import {createRouter, createWebHistory} from 'vue-router';
import {authGuard} from './authGuard.js';
import TodayView from './views/TodayView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', name: 'today', component: TodayView},
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('./views/CalendarView.vue'),
    },
    {
      path: '/courses',
      name: 'courses',
      component: () => import('./views/CoursesView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/SettingsView.vue'),
    },
    {
      path: '/lesson/:topicSlug/:lessonNum',
      name: 'lesson',
      component: () => import('./views/LessonView.vue'),
    },
    {
      path: '/speak',
      name: 'speak',
      component: () => import('./views/SpeakView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
    },
  ],
});

router.beforeEach(authGuard);
```

- [ ] **Step 6: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 7: Commit**

```bash
git add src/authGuard.js src/authGuard.test.js src/router.js
git commit -m "feat(mobile): gate routes behind sign-in"
```

---

### Task 5: Wire the splash gate into `App.vue`

**Files:**
- Modify: `mobile/src/App.vue` (full file, 13 lines)

**Interfaces:**
- Consumes: `useProgress()` → `{init, authResolved, isSignedIn}` (from Task 1). `SplashView.vue` (from Task 2).

- [ ] **Step 1: Replace `App.vue` in full**

```vue
<script setup>
import {onMounted} from 'vue';
import {useProgress} from './composables/useProgress.js';
import BottomNav from './components/BottomNav.vue';
import SplashView from './views/SplashView.vue';

const {init, authResolved, isSignedIn} = useProgress();
onMounted(init);
</script>

<template>
  <SplashView v-if="!authResolved" />
  <router-view v-else />
  <BottomNav v-if="authResolved && isSignedIn" />
</template>
```

- [ ] **Step 2: Manual smoke check**

Run: `cd mobile && npm run dev`, open the app in a browser.
Expected: the splash (indigo mark, pulsing ring) shows briefly, then either the Login screen (no session) or Today (existing session) appears. The bottom nav is absent on the splash and on Login, present everywhere else. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat(mobile): show a splash until auth resolves, gate BottomNav on sign-in"
```

---

### Task 6: `SettingsView.vue` — drop sign-in, unify the API-key row

**Files:**
- Modify: `mobile/src/views/SettingsView.vue` (full file, 378 lines)

**Interfaces:**
- Consumes: `useProgress()` → `{user, progress, signOut}` (drops `isSignedIn`, `authError`, `signIn` — this screen is only ever reached signed-in now, per the router guard from Task 4).

- [ ] **Step 1: Replace the script block**

Replace lines 1–46:

```vue
<script setup>
import {onMounted, ref, computed} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';
import {getBadges} from '../composables/useBadges.js';

// This screen is only ever reached signed-in (the router's authGuard
// guarantees it), so there's no sign-in button or auth-error branch here
// anymore — that lives in LoginView.vue now.
const {user, progress, signOut} = useProgress();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length);
const completedCount = computed(() => progress.value.completed.length);
const badges = computed(() =>
  getBadges({streakCount: streakCount.value, completedCount: completedCount.value}),
);

const apiKeyDraft = ref('');
const apiKeySaved = ref(false);
const apiKeyError = ref('');

async function handleApiKeyBlur() {
  apiKeyError.value = '';
  try {
    await setApiKey(apiKeyDraft.value.trim());
    apiKeySaved.value = true;
    setTimeout(() => (apiKeySaved.value = false), 2000);
  } catch (err) {
    apiKeyError.value = 'Could not save the key. Please try again.';
  }
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
</script>
```

- [ ] **Step 2: Replace the template block**

Replace the entire `<template>...</template>` block with:

```vue
<template>
  <section class="settings">
    <header class="settings__header">
      <p class="settings__eyebrow">SETTINGS</p>
      <h1 class="settings__title">Settings</h1>
    </header>

    <div v-if="user" class="settings__row settings__profile">
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        :alt="user.displayName || user.email"
        class="settings__avatar"
      />
      <div class="settings__profile-info">
        <p class="settings__profile-name">{{ user.displayName || user.email }}</p>
        <p class="settings__profile-email">{{ user.email }}</p>
      </div>
      <div class="settings__profile-stats">
        <span>🔥 {{ streakCount }} {{ streakCount === 1 ? 'day' : 'days' }}</span>
        <span>📚 {{ completedCount }} done</span>
      </div>
      <ul class="settings__badges">
        <li
          v-for="badge in badges"
          :key="badge.id"
          class="settings__badge"
          :class="{'settings__badge--earned': badge.earned}"
          :title="badge.label"
        >
          <span aria-hidden="true">{{ badge.icon }}</span>
          <span class="settings__badge-label">{{ badge.label }}</span>
        </li>
      </ul>
    </div>

    <div class="settings__row">
      <button
        type="button"
        class="settings__button settings__button--outline"
        @click="signOut"
      >
        Sign out
      </button>
    </div>

    <div class="settings__row">
      <label for="reminder-time" class="settings__label">Daily reminder</label>
      <input
        id="reminder-time"
        type="time"
        class="settings__input"
        :value="time"
        @change="setTime($event.target.value)"
      />
    </div>

    <div class="settings__row">
      <label for="gemini-api-key" class="settings__label">Gemini API key</label>
      <input
        id="gemini-api-key"
        type="password"
        class="settings__input"
        v-model="apiKeyDraft"
        placeholder="AIza..."
        autocomplete="off"
        :aria-invalid="!!apiKeyError"
        aria-describedby="gemini-api-key-hint"
        @blur="handleApiKeyBlur"
      />
      <span v-if="apiKeySaved" class="settings__saved">✓ Saved</span>
      <p v-if="apiKeyError" id="gemini-api-key-hint" class="settings__error">
        {{ apiKeyError }}
      </p>
      <p v-else id="gemini-api-key-hint" class="settings__hint">
        Used by the Speak tab to translate and explain sentences. Stored only
        on this device.
      </p>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Remove the now-dead `.settings__field-group` CSS rule**

Delete this rule (was directly below `.settings__label` in the `<style>` block):

```css
.settings__field-group {
  display: flex;
  gap: var(--space-xs);
}
```

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, sign in, open Settings.
Expected: profile card, "Sign out" button, reminder-time row, and API-key row all render. Typing an API key and clicking/tabbing away from the field shows "✓ Saved" (no Save button present). No console errors about `isSignedIn`, `authError`, or `signIn` being undefined.

- [ ] **Step 5: Commit**

```bash
git add src/views/SettingsView.vue
git commit -m "feat(mobile): drop sign-in from Settings, auto-save the API key on blur"
```

---

### Task 7: Remove the now-dead sign-in hint

**Files:**
- Modify: `mobile/src/views/TodayView.vue:8,38`
- Modify: `mobile/src/components/LessonDetail.vue:2-8,24-26,304-312`

**Interfaces:** none — this is dead-code cleanup. `showSignInHint` was a prop `LessonDetail.vue` used to show a "sign in to sync" hint; every screen is now reached signed-in (Task 4's guard), so the prop is always `false` from here on.

- [ ] **Step 1: Confirm nothing else uses `showSignInHint`**

Run: `cd mobile && grep -rn "showSignInHint\|show-sign-in-hint" src`
Expected: two hits — `TodayView.vue:38` (passing the prop) and `LessonDetail.vue:5,24` (receiving/using it) — the same two files this task changes.

- [ ] **Step 2: Remove the prop pass-through in `TodayView.vue`**

In `mobile/src/views/TodayView.vue`, remove `isSignedIn` from the `useProgress()` destructure (line 8) and the `:show-sign-in-hint` binding (line 38):

Replace:

```js
const {isSignedIn, isComplete, markComplete} = useProgress();
```

with:

```js
const {isComplete, markComplete} = useProgress();
```

Replace:

```vue
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete(lesson)"
      :show-sign-in-hint="!isSignedIn"
      @mark-complete="markComplete(lesson)"
    />
```

with:

```vue
    <LessonDetail
      :lesson="lesson"
      :is-complete="isComplete(lesson)"
      @mark-complete="markComplete(lesson)"
    />
```

- [ ] **Step 3: Remove the prop and its usage in `LessonDetail.vue`**

Replace:

```js
defineProps({
  lesson: {type: Object, required: true},
  isComplete: {type: Boolean, required: true},
  showSignInHint: {type: Boolean, default: false},
});
```

with:

```js
defineProps({
  lesson: {type: Object, required: true},
  isComplete: {type: Boolean, required: true},
});
```

Remove this block from the template (directly after the "Mark complete" button):

```vue
    <p v-if="showSignInHint" class="lesson-detail__hint">
      Sign in from Settings to sync progress across devices.
    </p>
```

Remove this now-dead CSS rule (and its `/* ---------- sign-in hint ---------- */` section comment directly above it):

```css
/* ---------- sign-in hint ---------- */

.lesson-detail__hint {
  margin: 0;
  padding-top: var(--space-sm);
  border-top: 1px solid oklch(20% 0.012 250 / 0.08);
  color: var(--color-ink-3);
  font-size: 0.85rem;
}
```

- [ ] **Step 4: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 5: Commit**

```bash
git add src/views/TodayView.vue src/components/LessonDetail.vue
git commit -m "chore(mobile): remove the dead sign-in hint (every screen is gated now)"
```
