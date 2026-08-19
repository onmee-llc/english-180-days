# Navigation Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate five screens' hand-rolled eyebrow+title(+subtitle) header markup to the shared `ScreenHeader.vue` component, and extract `BottomNav.vue`'s two inline OKLCH values into named tokens.

**Architecture:** Pure markup/CSS substitution — each screen swaps its own `<header>` block for a `<ScreenHeader>` call carrying identical copy, then deletes the now-dead CSS that markup used. No behavior, props, or data flow changes anywhere. `BottomNav.vue` gets two `var(--token)` swaps for values it already had inline.

**Tech Stack:** Vue 3 (`<script setup>`), no new dependencies.

## Global Constraints

- All work is scoped to `mobile/`.
- No copy changes — every `eyebrow`/`title`/`subtitle` string is copied verbatim from the screen's current markup.
- `ScreenHeader.vue`, `TextField.vue`, `Card.vue`, `Badge.vue`, `BaseButton.vue` (sub-project 1) already exist and are not modified by this plan.
- No test files are added — this plan is pure markup/CSS substitution with no new logic. Verification is `npm run build` (compile check) per task, consistent with the design spec's stated testing approach for this sub-project.
- Two visual changes are expected and accepted, not bugs to fix around:
  - `LoginView.vue`'s header block tightens from `--space-md` internal gaps to `ScreenHeader`'s `--space-2xs` (see Task 2).
  - `SpeakView.vue`'s title shrinks slightly and its weight drops from 600 to `ScreenHeader`'s 700-but-smaller-clamp (see Task 3) — this is the same "convergence to the canonical shared value" the spec already called out for `LoginView.vue`; the underlying CSS values simply differ slightly per screen today, and `ScreenHeader` picks the value `SettingsView.vue`/`CoursesView.vue`/`CalendarView.vue` already use unmodified.

---

### Task 1: `SettingsView.vue` → `ScreenHeader`

**Files:**
- Modify: `mobile/src/views/SettingsView.vue:1-56` (script import + header block), `:151-172` (dead CSS)

**Interfaces:**
- Consumes: `ScreenHeader.vue` → `<ScreenHeader eyebrow="…" title="…" />` (no `subtitle` — this screen never had one).

- [ ] **Step 1: Add the import and replace the header markup**

In `mobile/src/views/SettingsView.vue`, add to the top of the `<script setup>` block (after the existing imports):

```js
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Replace:

```html
    <header class="settings__header">
      <p class="settings__eyebrow">SETTINGS</p>
      <h1 class="settings__title">Settings</h1>
    </header>
```

with:

```html
    <ScreenHeader eyebrow="SETTINGS" title="Settings" />
```

- [ ] **Step 2: Remove the now-dead CSS**

Delete these three rules from the `<style scoped>` block:

```css
.settings__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.settings__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.settings__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `cd mobile && npm run build`
Expected: `✓ built in <N>s`, no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, sign in, open Settings.
Expected: "SETTINGS" eyebrow and "Settings" title render identically to before (same text, same position at the top of the screen).

- [ ] **Step 5: Commit**

```bash
git add src/views/SettingsView.vue
git commit -m "refactor(mobile): migrate SettingsView header to ScreenHeader"
```

---

### Task 2: `LoginView.vue` → `ScreenHeader`

**Files:**
- Modify: `mobile/src/views/LoginView.vue:1-43` (script import + header block), `:113-135` (dead CSS)

**Interfaces:**
- Consumes: `ScreenHeader.vue` → `<ScreenHeader eyebrow="…" title="…" subtitle="…" />`.

- [ ] **Step 1: Add the import and replace the header markup**

Add to the top of `<script setup>`:

```js
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Replace:

```html
      <p class="login__eyebrow">SIGN IN</p>
      <h1 class="login__title">Daily Mastery</h1>
      <p class="login__subtitle">
        Sign in with your Google account to start today's lesson.
      </p>
```

with:

```html
      <ScreenHeader
        eyebrow="SIGN IN"
        title="Daily Mastery"
        subtitle="Sign in with your Google account to start today's lesson."
      />
```

- [ ] **Step 2: Remove the now-dead CSS**

Delete these three rules:

```css
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
```

- [ ] **Step 3: Verify the build compiles**

Run: `cd mobile && npm run build`
Expected: `✓ built in <N>s`, no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, view the Login screen (sign out first if already signed in, or open in a private window).
Expected: "SIGN IN" / "Daily Mastery" / subtitle still render, in the same order, inside the card. The gap between the header block and the button below it is now `--space-md` (unchanged) but the eyebrow/title/subtitle themselves sit closer together than before — this is the expected, accepted change described in Global Constraints.

- [ ] **Step 5: Commit**

```bash
git add src/views/LoginView.vue
git commit -m "refactor(mobile): migrate LoginView header to ScreenHeader"
```

---

### Task 3: `SpeakView.vue` → `ScreenHeader`

**Files:**
- Modify: `mobile/src/views/SpeakView.vue:1-38` (script import + header block), `:201-231` (dead CSS)

**Interfaces:**
- Consumes: `ScreenHeader.vue` → `<ScreenHeader eyebrow="…" title="…" subtitle="…" />`.

- [ ] **Step 1: Add the import and replace the header markup**

Add to the top of `<script setup>`:

```js
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Replace:

```html
    <header class="speak__header">
      <p class="speak__eyebrow">SPEAK · VI → EN</p>
      <h1 class="speak__title">Say it in Vietnamese</h1>
      <p class="speak__subtitle">
        Hold the mic, speak naturally — get the English back.
      </p>
    </header>
```

with:

```html
    <ScreenHeader
      eyebrow="SPEAK · VI → EN"
      title="Say it in Vietnamese"
      subtitle="Hold the mic, speak naturally — get the English back."
    />
```

- [ ] **Step 2: Remove the now-dead CSS**

Delete these four rules (and the `/* ---------- header ---------- */` section comment directly above them):

```css
/* ---------- header ---------- */

.speak__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.speak__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.speak__title {
  margin: 0;
  font-size: clamp(1.7rem, 5vw + 1rem, 2.25rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.speak__subtitle {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.95rem;
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `cd mobile && npm run build`
Expected: `✓ built in <N>s`, no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, open the Speak tab.
Expected: "SPEAK · VI → EN" / "Say it in Vietnamese" / subtitle still render at the top. The title is now slightly smaller and heavier-weight than before (`ScreenHeader`'s canonical style vs. this screen's own previous one-off size/weight) — expected per Global Constraints, not a regression.

- [ ] **Step 5: Commit**

```bash
git add src/views/SpeakView.vue
git commit -m "refactor(mobile): migrate SpeakView header to ScreenHeader"
```

---

### Task 4: `CoursesView.vue` → `ScreenHeader`

**Files:**
- Modify: `mobile/src/views/CoursesView.vue:1-34` (script import + header block), `:78-99` (dead CSS)

**Interfaces:**
- Consumes: `ScreenHeader.vue` → `<ScreenHeader eyebrow="…" title="…" />` (no `subtitle`).

- [ ] **Step 1: Add the import and replace the header markup**

Add to the top of `<script setup>`:

```js
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Replace:

```html
    <header class="courses__header">
      <p class="courses__eyebrow">COURSES</p>
      <h1 class="courses__title">All topics</h1>
    </header>
```

with:

```html
    <ScreenHeader eyebrow="COURSES" title="All topics" />
```

- [ ] **Step 2: Remove the now-dead CSS**

Delete these three rules:

```css
.courses__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.courses__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.courses__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `cd mobile && npm run build`
Expected: `✓ built in <N>s`, no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, open the Courses tab.
Expected: "COURSES" / "All topics" render identically to before.

- [ ] **Step 5: Commit**

```bash
git add src/views/CoursesView.vue
git commit -m "refactor(mobile): migrate CoursesView header to ScreenHeader"
```

---

### Task 5: `BottomNav.vue` token extraction

**Files:**
- Modify: `mobile/src/styles/tokens.css:7-14` (add two tokens), `mobile/src/components/BottomNav.vue:117-118` (use them)

**Interfaces:**
- Produces: `--color-hairline` and `--color-shadow-soft` in `tokens.css`, available globally to every component from this point on. **Task 6 depends on `--color-shadow-soft` — this task must run before Task 6.**

- [ ] **Step 1: Add the two tokens**

In `mobile/src/styles/tokens.css`, the `:root` block currently has, among its color tokens:

```css
  --color-ink-3: rgb(21 17 43 / 45%);
  --color-border: oklch(20% 0.012 250 / 0.16);
```

Add the two new tokens directly after `--color-border`:

```css
  --color-ink-3: rgb(21 17 43 / 45%);
  --color-border: oklch(20% 0.012 250 / 0.16);
  --color-hairline: oklch(20% 0.012 250 / 0.1);
  --color-shadow-soft: oklch(20% 0.012 250 / 0.25);
```

- [ ] **Step 2: Use the tokens in `BottomNav.vue`**

Replace:

```css
  border-top: 1px solid oklch(20% 0.012 250 / 0.1);
  box-shadow: 0 -8px 24px -16px oklch(20% 0.012 250 / 0.25);
```

with:

```css
  border-top: 1px solid var(--color-hairline);
  box-shadow: 0 -8px 24px -16px var(--color-shadow-soft);
```

(This is inside the `.bottom-nav` rule — only the two color values change, not the border width or shadow offset/blur/spread numbers.)

- [ ] **Step 3: Verify the build compiles**

Run: `cd mobile && npm run build`
Expected: `✓ built in <N>s`, no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, look at the bottom nav bar on any screen.
Expected: the hairline top border and the soft drop shadow above it look identical to before (same colors — this is a value-preserving rename).

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/components/BottomNav.vue
git commit -m "refactor(mobile): tokenize BottomNav's hairline border and shadow"
```

---

### Task 6: `CalendarView.vue` → `ScreenHeader`

**Files:**
- Modify: `mobile/src/views/CalendarView.vue:1-29` (script import + header block), `:73-94` (dead header CSS), `:105` (bonus token substitution, see note below)

**Interfaces:**
- Consumes: `ScreenHeader.vue` → `<ScreenHeader eyebrow="…" title="…" />` (no `subtitle`). Also consumes `--color-shadow-soft`, produced by Task 5 — Task 5 must already be complete before this task runs.

**Note on scope:** while editing this file for its header, its `.calendar__streak` box-shadow (line 105) uses the exact same `oklch(20% 0.012 250 / 0.25)` value that Task 5 extracts into `--color-shadow-soft` for `BottomNav.vue`. The spec's non-goal is "no repo-wide sweep" (i.e. don't go hunting for every file with this value) — but since this file is already being edited in this same task for an unrelated reason, leaving an un-migrated duplicate of a token just introduced one file over would be an inconsistency worth avoiding for free. This task includes that one-line substitution; no other file beyond `CalendarView.vue` and `BottomNav.vue` gets touched for this token.

- [ ] **Step 1: Add the import and replace the header markup**

Add to the top of `<script setup>`:

```js
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Replace:

```html
    <header class="calendar__header">
      <p class="calendar__eyebrow">CALENDAR</p>
      <h1 class="calendar__title">Your streak</h1>
    </header>
```

with:

```html
    <ScreenHeader eyebrow="CALENDAR" title="Your streak" />
```

- [ ] **Step 2: Remove the now-dead header CSS**

Delete these three rules:

```css
.calendar__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.calendar__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.calendar__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

- [ ] **Step 3: Swap the streak box-shadow to the shared token**

Replace:

```css
  box-shadow: 0 12px 32px -18px oklch(20% 0.012 250 / 0.25);
```

with:

```css
  box-shadow: 0 12px 32px -18px var(--color-shadow-soft);
```

(This is inside the `.calendar__streak` rule — only the color value changes, not the shadow's offset/blur/spread numbers.)

- [ ] **Step 4: Verify the build compiles**

Run: `cd mobile && npm run build`
Expected: `✓ built in <N>s`, no errors.

- [ ] **Step 5: Manual smoke check**

Run: `cd mobile && npm run dev`, open the Calendar tab.
Expected: "CALENDAR" / "Your streak" render identically to before; the streak badge's drop shadow looks unchanged (same color, since `--color-shadow-soft` is a value-preserving rename of the literal that was already there).

- [ ] **Step 6: Commit**

```bash
git add src/views/CalendarView.vue
git commit -m "refactor(mobile): migrate CalendarView header to ScreenHeader, reuse --color-shadow-soft"
```
