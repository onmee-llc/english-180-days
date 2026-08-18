# Auth Gate + Settings Redesign — Design

## Context

The app currently lets any screen be reached without signing in — the router
has no guards, and `TodayView`/`CalendarView`/`SettingsView`/`LessonView`
each decide independently whether to show sign-in hints or work in a
degraded local-only mode. The user wants a proper mobile-app flow: sign in
with Google before anything else is reachable.

Separately, `SettingsView.vue`'s three rows (sign-in, reminder time, Gemini
API key) currently have three different shapes — a solo full-width button, a
solo auto-saving input, and an input-plus-explicit-Save-button pair — which
reads as inconsistent even though the underlying CSS already shares one
token system.

This design covers both, in the order agreed: auth gate first (it changes
where sign-in lives), Settings row consistency second.

## Goals

- No screen is reachable without a signed-in, allow-listed Google account,
  except the login screen itself.
- A splash/loading state covers the gap between app launch and Firebase
  confirming the real sign-in status — never a flash of the wrong screen.
- `SettingsView.vue`'s remaining rows (profile, reminder time, API key) share
  one visual/interaction pattern: label above input, auto-save, no per-row
  Save button.
- Every interactive element touched (Google sign-in button, API key input)
  gets its full state set (default/hover/focus/active/disabled/loading/
  error/success) — not just default+hover like today.

## Non-goals

- No change to `useProgress.js`'s local-first progress storage or Firestore
  sync — only its auth-resolution timing changes.
- No redesign of `TodayView`/`CalendarView`/`CoursesView`/`LessonView` — the
  `:show-sign-in-hint` prop and similar now-dead conditionals in those files
  are cleanup, not a visual redesign, and are called out explicitly in the
  plan rather than silently dropped.
- No password/email auth — Google sign-in only, unchanged from today.

## Architecture

**The core problem this design solves:** `useProgress.js`'s existing
`isReady` flag is set `true` immediately after registering Firebase's
`onAuthStateChanged` listener — not after that listener has actually
reported whether a session exists. A router guard written against `isReady`
would redirect an already-signed-in user to `/login` for a moment on every
cold start, because `isSignedIn` is still its initial `false` at that point.

**Fix:** add a second, distinct signal — `authResolved` — that only becomes
true inside the `onAuthStateChanged` callback's first invocation (i.e. once
Firebase has actually reported a real status, signed-in or not). Both the
router guard and `App.vue`'s splash gate read `authResolved`, never
`isReady`, for this decision.

**Router guard** (`router.js`, `beforeEach`): calls `init()` (idempotent),
awaits `authResolved`, then: unauthenticated + target isn't `/login` →
redirect to `/login`; authenticated + target is `/login` → redirect to
`/today` (the root route). Otherwise proceeds.

**Splash gate** (`App.vue`): renders a `SplashView` in place of
`<router-view>` while `!authResolved`, and `<BottomNav>` only once
`authResolved && isSignedIn`. This is independent of the router guard's own
await — both key off the same underlying `authResolved` state from the same
`useProgress()` singleton, so they resolve in the same tick and the user
never sees an unauthenticated screen flash before the redirect lands.

## Components

### `useProgress.js` (modify)

- Add `const authResolved = ref(false)`.
- Inside `init()`'s `onAuthStateChanged` callback, at the end (after the
  disallowed-email branch and the normal branch both complete — success or
  failure of the Firestore reconciliation doesn't gate this), set
  `authResolved.value = true` the first time the callback fires, and resolve
  a module-scope promise (`authResolvedPromise`) the same way.
- Export `authResolved` (ref) and `whenAuthResolved()` — a function
  returning `authResolvedPromise` — from `useProgress()`.

### `router.js` (modify)

- Add route: `{path: '/login', name: 'login', component: () =>
  import('./views/LoginView.vue')}`.
- Add `router.beforeEach(async (to) => { ... })` implementing the guard
  described above.

### `LoginView.vue` (new)

Full-screen card, centered content — not full-bleed. Structure, top to
bottom: eyebrow (`SIGN IN`, matching the existing `SETTINGS` / `SPEAK · VI →
EN` eyebrow pattern already used by every other screen — this is the
established app-wide convention, not a new addition), app name, one-line
description, "Sign in with Google" button (full-width pill, same visual
family as `.settings__button--primary` / `.speak__mic`), error message slot
for the disallowed-email case (reuses `useProgress()`'s existing
`authError`).

**Sign-in button — full 8-state set** (today's `handleSignIn` in
`SettingsView.vue` only has default + error):
- Default / hover / focus-visible / active: same recipe as
  `.settings__button--primary`.
- Loading: while `signIn()`'s promise is in flight, disable the button and
  swap its label to "Signing in…" (no spinner icon needed at this size —
  label swap is the feedback, per the app's existing "silent, label-carries-
  state" pattern in `SpeakView.vue`'s mic label).
- Disabled: only ever the loading state's disabled — there's no other
  disable condition on this screen.
- Error: `authError` (disallowed email, shown via `useProgress()`) or a
  local `signInError` (cancelled/failed popup, same message as today's
  `SettingsView.vue`) — same visual treatment as `SettingsView.vue`'s
  existing `.settings__error`.
- Success: no visible success state on this screen — `handleSignIn` calls
  `router.push({name: 'today'})` right after `signIn()` resolves, so the
  screen is gone before any success affordance would matter (silent
  success, consistent with the rest of the app's microinteraction voice).

**Motion:** one primitive only — the button's existing press-lift
(`translateY` on `:active`, matching `.settings__button`'s existing
recipe). No page-entrance animation; a login screen doesn't need busyness.

### `SplashView.vue` (new)

Full-screen, `--color-paper` background, the app's mark centered (reuse
whatever mark/icon asset the app already ships — `mobile/brand/icon.svg` per
the brand kit — sized modestly, not full-viewport). One motion primitive: a
single soft ring-pulse around the mark, visually related to but simpler than
`SpeakView.vue`'s existing `speak-ring` keyframe (one ring, not two,
`--dur-slow` timing). Respects `prefers-reduced-motion: reduce` — animation
off, mark stays static. This view is never routed to directly; `App.vue`
renders it conditionally, not via the router.

### `App.vue` (modify)

```html
<template>
  <SplashView v-if="!authResolved" />
  <router-view v-else />
  <BottomNav v-if="authResolved && isSignedIn" />
</template>
```

Destructure `authResolved` and `isSignedIn` from `useProgress()` (already
imported here for `init()`).

### `SettingsView.vue` (modify)

- Drop `isSignedIn`, `authError`, `signIn`, `handleSignIn`, `signInError`
  from the script — this screen is only ever reached signed-in now, so the
  sign-in button, its error display, and the `v-if="isSignedIn && user"`
  guard around the profile block are all dead code. Render the profile block
  unconditionally (the guard already guarantees `user` is set); keep the
  sign-out button unconditionally.
- **API key row**: replace the `.settings__field-group` (input + explicit
  "Save" button) with a single input, matching the reminder-time row's
  shape. Save moves from a click handler to a `@blur` handler:
  ```js
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
  ```
  `setApiKey`'s underlying `SecureStoragePlugin.set()` call is a native
  plugin call and can genuinely fail (unlike the reminder time's plain
  `Preferences` write) — this is why the API key row, and not the reminder
  row, gets an explicit error state. Add `apiKeyError` (ref), wire
  `aria-invalid="!!apiKeyError"` and `aria-describedby` on the input, and
  render the error in place of the hint text when present (same
  helper-text-replaced-by-error pattern used everywhere else that already
  has error states).
- Both remaining input rows (reminder time, API key) now share the same
  shape: label above, single auto-saving input, no adjacent button.

## Data flow

1. App launches → `App.vue` mounts → `useProgress().init()` runs (via
   `onMounted`, same as today) → `authResolved` is `false` → `SplashView`
   shows.
2. In parallel, the router has already started resolving the initial route,
   but the `beforeEach` guard is awaiting `whenAuthResolved()` — navigation
   doesn't commit yet.
3. Firebase reports the real auth state → `onAuthStateChanged` callback
   fires → `authResolved.value = true` (and the promise resolves).
4. The router guard's `await` returns; it redirects to `/login` or lets the
   original target through, based on `isSignedIn`.
5. `App.vue` re-renders: `authResolved` is now `true`, so `router-view`
   replaces `SplashView`, showing whichever route the guard settled on.
6. On `/login`, user taps "Sign in with Google" → `signIn()` → on success,
   `useProgress()`'s existing `onAuthStateChanged` listener updates
   `isSignedIn` → `LoginView.vue` explicitly calls `router.push({name:
   'today'})` right after `signIn()` resolves (Vue Router doesn't navigate
   on its own just because a ref changed — nothing else triggers this
   redirect, so the push has to be explicit here).

## Error handling

- **Sign-in cancelled/failed** (existing `signInError` pattern, moved to
  `LoginView.vue`): shown inline, user can retry immediately — button
  returns to its default state.
- **Disallowed email** (existing `authError` from `useProgress()`, via
  `forceSignOut()`): shown inline on `/login` — the guard has already
  redirected there since `isSignedIn` is `false` after the forced sign-out.
- **API key save failure**: new `apiKeyError` state in `SettingsView.vue`,
  described above.
- **Auth check itself never resolving** (e.g. no network on first-ever
  launch, before any session was persisted): out of scope for this design —
  `SplashView` has no timeout/fallback. Flagging as a known gap, not
  silently deciding it away: if this turns out to matter in practice, a
  timeout-driven "check your connection" state on `SplashView` is the
  natural follow-up, not built here.

## Testing

- `useProgress.test.js` (new, this composable currently has no test file):
  cover `authResolved` transitioning from `false` to `true` only after
  `onAuthStateChanged`'s callback fires, and `whenAuthResolved()` resolving
  at that point — this is the one piece of new, real timing logic in the
  change.
- Router guard: a small dedicated test mocking `useProgress()` to cover the
  three branches (unresolved → waits; resolved + signed out + non-login
  target → redirects to `/login`; resolved + signed in + `/login` target →
  redirects to `/today`).
- `SettingsView.vue`'s API key blur-save: no existing test file for this
  view; not adding one now — the view is presentation-heavy and the one
  real logic branch (save failure → error shown) is thin enough to verify
  manually, consistent with how this file has been treated so far (its
  Speak-feature sibling views also have no dedicated `.test.js`).

## Out of scope (flagged, not silently dropped)

- `TodayView.vue`'s `:show-sign-in-hint="!isSignedIn"` prop and any similar
  per-view sign-in fallback UI become dead code once the gate guarantees
  every view is reached signed-in. Removing them is mechanical cleanup for
  the implementation plan to include, not a design decision.
- Settings visual/token polish beyond the three rows discussed (badges list,
  profile layout) is unchanged — not part of this design's scope.
