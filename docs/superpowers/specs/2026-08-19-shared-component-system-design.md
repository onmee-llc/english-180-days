# Shared Component System — Design

## Context

Sub-project 1 of a larger, explicitly phased initiative: "redesign the mobile
app's UI/UX for consistency and polish" (visual/UX only — no new learning
features, existing functionality unchanged). The full roadmap, agreed with
the user before this spec:

1. **Shared component system** (this spec)
2. Navigation shell (`BottomNav.vue` + the header pattern)
3. Today + Lesson (`TodayView.vue`, `LessonDetail.vue`) — the daily habit loop
4. Courses (`CoursesView.vue`)
5. Calendar (`CalendarView.vue`)
6. Speak + Settings (`SpeakView.vue`, `SettingsView.vue`) — already redesigned
   once this session; this step applies the finished shared components to
   them

Each step is its own spec → plan → implementation cycle. This document
covers step 1 only.

**Why this goes first:** a taste-skill audit of the just-shipped
`LoginView.vue`/`SettingsView.vue` (2026-08-18) found that every screen in
this app hand-rolls its own button/input/card CSS — `.login__button`,
`.settings__button`, `.speak__mic`, `.btn.btn--outline.btn--coral` are all
independently maintained, near-duplicate implementations of the same
handful of visual patterns. That's the concrete, structural reason the app
can drift out of sync even when each screen individually looks fine at
ship time. Building shared components first means every subsequent
per-screen redesign (steps 2-6) consumes one correct implementation instead
of writing a fifth or sixth variant.

## Goals

- Five reusable Vue components covering every repeated UI pattern currently
  duplicated across screens: button, text input, card, screen header,
  badge.
- Each component's API is derived from patterns that actually exist in the
  codebase today (`LoginView.vue`, `SettingsView.vue`, `SpeakView.vue`,
  `CoursesView.vue`, `CalendarView.vue`) — no speculative props for
  variants that don't exist yet.
- Every component has a real test (this repo has no Vue component test
  today — only composable/plain-JS tests).

## Non-goals

- **No screen migration.** `LoginView.vue`, `SettingsView.vue`, and every
  other view keep their current hand-rolled markup after this step. Wiring
  the new components into a screen is explicitly the job of that screen's
  own future step (2-6 above) — bundling migration into this step would
  blur the phase boundary the user agreed to.
- No new design tokens, colors, or spacing values. Every component
  references only tokens already in `mobile/src/styles/tokens.css`.
- No Storybook or component-preview tooling. Verification is via component
  tests, consistent with this repo's existing lightweight-tooling
  approach (no test framework beyond Vitest anywhere in the project).
- No behavior changes to any existing screen — this step is purely
  additive (5 new files + 1 new devDependency), so nothing here can
  regress the app that ships today.

## Architecture

New directory: `mobile/src/components/base/` — deliberately separate from
the existing `mobile/src/components/` (which holds feature components like
`BottomNav.vue`, `LessonDetail.vue`; the `base/` subfolder marks these five
as design-system primitives, not screen-specific pieces).

New devDependency: `@vue/test-utils` — the standard Vue-org companion to
Vitest for mounting and asserting on component output. Nothing in this repo
currently allows testing a Vue component's rendered output or emitted
events; every existing `.test.js` file tests a plain composable/JS module.
Building five components meant to be trusted across the whole app without
any way to verify their actual rendered behavior is worse than not building
a component library — hence the addition.

## Components

### `BaseButton.vue`

Replaces: `.login__button`, `.settings__button` (+ `--primary`/`--outline`
modifiers), `.btn`/`.btn--outline`/`.btn--coral` (from `SpeakView.vue`'s
retry button). Confirmed these all resolve to the same underlying CSS
values (height 2.75rem, `--radius-pill`, same transition timings) — this is
one pattern with three independent implementations, not three patterns.

**Props:**
- `variant`: `'primary' | 'outline'`, default `'primary'`
- `tone`: `'default' | 'coral'`, default `'default'` — `coral` maps to
  `--color-accent-3`/`--color-accent-3-deep`, matching `SpeakView.vue`'s
  retry button
- `loading`: `Boolean`, default `false`
- `loadingLabel`: `String`, default `'Loading…'`
- `disabled`: `Boolean`, default `false`

**Slots:**
- default — the button label
- `icon` — optional leading icon (e.g. the Google "G" mark on
  `LoginView.vue`'s sign-in button); hidden while `loading` is true

**Behavior:** root is a single `<button>` — native Vue 3 attribute/listener
fallthrough means `<BaseButton @click="handleSignIn">` works with no
explicit `emit` needed. `:disabled="disabled || loading"` and
`:aria-disabled="disabled || loading"`. While `loading` is true, the
default and `icon` slots are replaced by `loadingLabel`'s text — this
reproduces `LoginView.vue`'s existing "Signing in…" behavior exactly, just
generalized.

### `TextField.vue`

Replaces: `.settings__input` (used identically for both the `type="time"`
reminder field and the `type="password"` API-key field) plus each screen's
own label/hint/error markup.

**Props:**
- `modelValue`: `String` — standard `v-model` target
- `type`: `String`, default `'text'`
- `label`: `String`, required
- `id`: `String`, required — used for the `<label for>`/`<input id>` pair
- `hint`: `String`, optional — helper text shown below the input
- `error`: `String`, optional — when set, replaces the hint (never shown
  together), sets `aria-invalid="true"` on the input
- `success`: `String`, optional — a status line shown above the
  hint/error (e.g. "✓ Saved"), rendered with `role="status"` so it's
  announced

**Emits:** `update:modelValue` (standard `v-model`)

**Fallthrough:** `defineOptions({inheritAttrs: false})` +
`v-bind="$attrs"` on the inner `<input>`, so `placeholder`, `autocomplete`,
`@blur`, `@change`, etc. all attach to the input itself, not the wrapping
`<div>`. This is what lets `SettingsView.vue`'s API-key field keep its
`@blur="handleApiKeyBlur"` auto-save behavior and its reminder-time field
keep its plain `@change` behavior, both through the same component.

**Rendering order:** label → input → success line (if `success` set) →
hint or error paragraph (mutually exclusive, sharing one `id` referenced by
the input's `aria-describedby`, with a reserved min-height so an error
appearing doesn't shift the layout — matches `SettingsView.vue`'s existing
`aria-describedby="gemini-api-key-hint"` pattern).

### `Card.vue`

Replaces: `.settings__row`, `.login__card` — both already identical
(`padding: var(--space-lg)`, `border-radius: var(--radius-card)`,
`background: var(--color-paper-2)`).

**Props:** none.

**Slots:** default.

### `ScreenHeader.vue`

Replaces: the `<p class="…__eyebrow">…</p><h1 class="…__title">…</h1>`
pair duplicated at the top of every screen (`SETTINGS`, `SIGN IN`, `SPEAK ·
VI → EN`, `COURSES`, `CALENDAR`), plus the optional subtitle paragraph
(`LoginView.vue`, `SpeakView.vue` both have one).

**Props:**
- `eyebrow`: `String`, required
- `title`: `String`, required
- `subtitle`: `String`, optional

**Slots:** none — every observed usage is plain text; a slot would be
speculative flexibility with no current caller.

### `Badge.vue`

Replaces: `.settings__badge`/`.settings__badge--earned` (currently the only
consumer, in `SettingsView.vue`'s profile card).

**Props:**
- `icon`: `String`, required (an emoji, matching current usage — e.g. 🔥)
- `label`: `String`, required
- `earned`: `Boolean`, default `false`

**Slots:** none.

## Testing

Each component gets `mobile/src/components/base/<Name>.test.js` using
`@vue/test-utils`'s `mount()`. Per component, the tests cover its one real
piece of logic — these are presentation components, so most tests are
about props actually reaching the DOM/behavior, not branching logic:

- **`BaseButton`**: `loading=true` disables the button and swaps the
  rendered text to `loadingLabel`; `variant`/`tone` props apply the
  expected CSS class; a click on an enabled button emits the native click
  event to a parent listener.
- **`TextField`**: typing updates `modelValue` via `v-model`; setting
  `error` hides `hint` and sets `aria-invalid`; setting `success` renders
  the status line; an attr like `placeholder` reaches the inner `<input>`.
- **`Card`**: slot content renders inside the card wrapper.
- **`ScreenHeader`**: `eyebrow`/`title`/`subtitle` render in the right
  elements; omitting `subtitle` renders no subtitle element (not an empty
  one).
- **`Badge`**: `earned` toggles the `--earned` class; `icon`/`label` render.

## Out of scope (explicitly deferred)

- Migrating `LoginView.vue`, `SettingsView.vue`, `SpeakView.vue`,
  `TodayView.vue`, `LessonDetail.vue`, `CoursesView.vue`,
  `CalendarView.vue`, or `BottomNav.vue` to use these components — each
  happens in that screen's own future roadmap step.
- Any new visual variant not already observed in the codebase (e.g. a
  `TextField` `type="email"` treatment, a `BaseButton` `size` prop) — add
  when a real screen needs it, not speculatively now.
