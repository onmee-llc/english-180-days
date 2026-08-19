# Speak + Settings — Design

## Context

Sub-project 6 of 6, and the last of the mobile UI/UX redesign initiative (see
`2026-08-19-shared-component-system-design.md` for the roadmap). Sub-projects
4 (Courses) and 5 (Calendar) were scoped out entirely after reading both
files in full: their list rows are `<router-link>`s and colored stat/pill
elements with bespoke shapes that don't match any shared component's actual
CSS values — forcing them in would be a mismatch, not a consolidation, so
no changes were made there.

`SpeakView.vue` and `SettingsView.vue` were read in full instead, alongside
the four existing `base/` components (`BaseButton`, `TextField`, `Card`,
`Badge`). Four genuine duplicates were found — each verified against the
shared component's actual current CSS, not assumed from memory.

## Goals

**`SpeakView.vue`:**
- The "Try again" button (`class="btn btn--outline btn--coral"`) becomes
  `<BaseButton variant="outline" tone="coral">Try again</BaseButton>`. It's
  the only element using the `.btn`/`.btn--outline`/`.btn--coral` classes in
  the file, so all three are deleted afterward.

**`SettingsView.vue`:**
- The Sign-out button (`.settings__button.settings__button--outline`)
  becomes `<BaseButton variant="outline" @click="handleSignOut">Sign
  out</BaseButton>`. Its CSS is a byte-for-byte match of `BaseButton`'s base
  + outline rules (height 2.75rem, padding 0 1.4rem, border 1.5px solid
  `--color-ink-2`, transparent background, hover → `--color-paper-3`). Only
  one button uses `.settings__button` in the file, so its CSS is deleted
  afterward.
- The badges list (`<li class="settings__badge" :class="{'settings__badge--earned': ...}">`)
  becomes a `<Badge :icon="badge.icon" :label="badge.label" :earned="badge.earned" />`
  per badge, replacing the manually-written `<li>`/two `<span>`s. Its CSS
  is a byte-for-byte match of `Badge.vue` (padding 0.4rem 0.7rem, pill
  radius, `--color-paper-3`/`--color-ink-3`/opacity 0.55 default,
  `--color-accent-2-tint`/`--color-ink`/opacity 1 earned). The `<ul
  class="settings__badges">` wrapper (grid/flex-wrap layout, not visual
  styling) stays as-is — `Badge`'s root is already a `<li>`, so it drops
  straight into the existing `<ul>`.
- The two input rows (reminder-time, Gemini API key) are rebuilt using
  `TextField`:
  - Reminder time: `<TextField id="reminder-time" type="time" label="Daily
    reminder" :model-value="time" @change="handleReminderChange" />`, with a
    new `handleReminderChange(event)` calling `setTime(event.target.value)`.
    This deliberately keeps the original `@change` semantics (fires once,
    on commit) rather than switching to `v-model`'s `@input` (fires on every
    keystroke/wheel-tick of the native time picker) — `setTime()` writes to
    `Preferences` and reschedules a native local notification on every call,
    so firing it on `@input` would spam both. `TextField` forwards
    `@change` straight through to its inner `<input>` via its existing
    `inheritAttrs: false` + `v-bind="$attrs"`, so no `TextField` change is
    needed for this to work.
  - Gemini API key: `<TextField id="gemini-api-key" type="password"
    label="Gemini API key" v-model="apiKeyDraft" placeholder="AIza..."
    autocomplete="off" :error="apiKeyError" :success="apiKeySaved ? '✓
    Saved' : ''" hint="Used by the Speak tab to translate and explain
    sentences. Stored only on this device." @blur="handleApiKeyBlur" />`.
    `TextField` forwards unrecognized attrs (`placeholder`, `autocomplete`,
    `@blur`) straight to its inner `<input>` via `inheritAttrs: false` +
    `v-bind="$attrs"`, so this works without any `TextField` changes.
  - Both rows' `.settings__row` surface (padding, radius, background) is a
    byte-for-byte match of `Card.vue`, so each becomes `<Card><TextField
    .../></Card>`, and the `.settings__row` CSS's own
    padding/radius/background lines are deleted (see below — the class
    itself isn't deleted, just those three declarations, because the
    profile and sign-out rows still use it for layout).
- The profile row and sign-out row keep `.settings__row` for its
  `display:flex; flex-direction:column; gap:var(--space-xs)` layout
  properties, since they still need it (or, for sign-out, don't strictly
  need it but removing it there alone would be an inconsistent one-off) —
  but now get their surface from `<Card>` too:
  `<Card class="settings__row settings__profile">…</Card>` and `<Card
  class="settings__row"><BaseButton …>Sign out</BaseButton></Card>`.
  `Card`'s root is a `<div>`, and Vue's scoped-CSS attribute fallthrough
  means `SettingsView`'s own `.settings__row`/`.settings__profile` scoped
  rules still apply to `Card`'s root element when the class is passed
  through like this — same mechanism already used in sub-project 2
  (`CalendarView.vue`'s bonus box-shadow token swap on an unrelated
  element it already owned).

## Non-goals

- No change to `SpeakView.vue`'s mic button, transcript display, result
  card, or history section — none of them match an existing shared
  component's shape or CSS.
- No change to `SettingsView.vue`'s profile grid layout
  (`.settings__profile`), avatar, or stats line — only the badges list
  inside it changes.
- No change to `Card.vue`, `Badge.vue`, `BaseButton.vue`, or `TextField.vue`
  themselves — all four already support everything this migration needs.
- No changes to `CoursesView.vue` or `CalendarView.vue` (sub-projects 4 and
  5) — evaluated and rejected, see Context above.
- This is the last sub-project in the 6-part roadmap; no further sub-projects
  follow.

## Testing

Same approach as every prior sub-project in this series: no new test files.
`BaseButton.vue`, `TextField.vue`, `Card.vue`, and `Badge.vue` already have
their own tests covering the props this migration uses, and this codebase
has never had dedicated test files for view-level components. Verification
is `npm run build` plus a manual smoke check on both screens: confirm the
Try-again button on Speak still works and reads correctly after an error;
confirm Settings' badges, sign-out, and both input rows still render, save,
and validate correctly (particularly the API-key field's error/success
states, since that's the one with the most moving parts).
