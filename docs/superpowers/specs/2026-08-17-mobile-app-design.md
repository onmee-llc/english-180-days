# Daily Mastery Mobile App — Design

## Context

Daily Mastery is currently an Eleventy static site deployed to Firebase Hosting
(project `aevo-labs`). The user wants a real mobile app (iOS + Android) with a
redesigned UI/UX, for convenience studying the 180-day program on the go.

Electron was the originally requested tool, but Electron only targets desktop
(Windows/Mac/Linux) — it cannot produce an iOS/Android app. Capacitor was
chosen instead: it wraps a standard web frontend (Vue 3 in this case) into
native iOS and Android app shells, giving native mic/notification/storage
access while reusing one codebase. A desktop build can be added later via
Capacitor's Electron platform if ever needed, from the same Vue codebase.

## Goals

- Native iOS + Android app, installable on phones.
- New UI/UX designed for mobile (bottom nav, cards, gestures) — not a shrunk
  copy of the desktop web layout.
- Feature parity with the core web experience: today's lesson, calendar +
  streak, course/lesson browsing.
- Works fully offline for reading lessons.
- Daily reminder notification to protect the streak.
- Host for the mic-translate feature (see companion spec).

## Non-goals

- Replacing the existing web site — web stays as-is, this is a new, separate
  frontend.
- Live content updates without a new app build/install — content changes
  require a rebuild in v1.
- Desktop build — not built now, left possible via Capacitor later.

## Architecture

New `mobile/` directory in this repo, own `package.json`, own toolchain:
**Vue 3 + Vite + Capacitor**. Capacitor builds the iOS and Android native
projects from the Vite web build.

**Shared backend** — same Firebase project (`aevo-labs`) as the web app:
- Auth: Google sign-in (Firebase Auth), same account as web.
- Progress: same Firestore document shape at `users/{uid}` (`streak`,
  completed lessons) — the app reads/writes the same document the web app
  already uses, so progress stays in sync across devices.

**Lesson content** — the existing markdown (`src/site/content/en/learn/**`)
and yml (`src/site/_data/courses/**`) remain the single source of truth. A
build-time script (`mobile/scripts/build-content.js`) parses this content
into a single `mobile/src/content/lessons.json`, bundled into the app at
build time. No content API/server — lessons are fully available offline.
Updating lesson content requires re-running the build and reinstalling the
app (accepted trade-off for v1; a hosted-JSON approach was considered and
rejected as unneeded complexity for a single-user app).

**Program schedule** — day numbering reuses the same `PROGRAM_START`
constant convention as `lessonSchedule.js` / `study-toolbox.js`
(`2026-08-22`), computed client-side from the device clock.

## Screens

- **Today** — current day's bilingual lesson content, mark-complete action.
- **Calendar** — 180-day grid, streak indicator, tap a past/future day to
  view its lesson.
- **Courses** — browse by track (English / AI-ML / Finance), revisit any
  past lesson.
- **Mic Translate** — see companion spec
  `2026-08-17-mic-translate-design.md`.
- **Settings** — daily reminder time, Claude API key entry, sign-in/out.

## Data flow

1. App launch → Firebase Auth restores session (or shows sign-in).
2. Fetch `users/{uid}` from Firestore → merge with any local progress not
   yet synced (reuse the union-merge strategy already implemented in
   `src/lib/fb.js`, ported to a Vue composable).
3. Render Today's lesson from the bundled `lessons.json`, keyed by day
   number derived from `PROGRAM_START`.
4. Marking a lesson complete updates local state immediately, then pushes to
   Firestore in the background.

## Notifications

One daily local notification (Capacitor Local Notifications plugin) at a
user-configured fixed time, reminding to complete today's lesson. No server
push infrastructure needed — purely local/on-device scheduling.

## Error handling

- **Offline**: lesson content always renders (bundled JSON). Firestore
  read/write failures are caught and retried on reconnect, matching the
  existing try/catch + `logError` pattern in `fb.js`.
- **Not signed in**: app is still usable; progress is kept local-only until
  the user signs in, then merges into Firestore (same as the web app's
  existing reconciliation behavior).

## Testing

- Manual verification on iOS Simulator and Android Emulator via
  `npx cap run ios` / `npx cap run android` — this is a single-user personal
  app, not covered by the existing Percy/Karma/Mocha suites, which stay
  scoped to the Eleventy site.
- `build-content.js` gets one assert-based self-check: it hard-fails only
  when zero lessons parse (a real breakage, e.g. a wrong content path). A
  lesson file whose title has no "Day N" prefix is warned and skipped, not
  treated as a failure — that's expected for supplementary content that
  isn't part of the day-by-day schedule (matching how
  `lessonSchedule.js` already treats such files on the web).

## Visual design

Implementation should invoke the `hallmark` or `taste-skill` skill (per user
request) to drive the actual visual/UI polish — this spec defines structure
and data flow, not final pixel design.
