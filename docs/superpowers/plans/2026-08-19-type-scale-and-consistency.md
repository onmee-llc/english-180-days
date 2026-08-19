# Type Scale & Consistency Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a shared `--text-*` font-size scale and a `--radius-input` token to `tokens.css`, apply both across every component/view that currently hardcodes those values, replace the remaining inline `oklch()` color literals with existing tokens, and consolidate 2 of 3 hand-rolled pill buttons onto `BaseButton` (adding a `ghost` variant for the one that needs it).

**Architecture:** One foundational task (tokens.css) other tasks depend on, one `BaseButton.vue` task (new variant) two button-migration tasks depend on, then one task per remaining file doing a mechanical CSS-value swap (font-size/radius/oklch → token). Every task is presentation-only — no prop/interface changes to any component except `BaseButton.vue`'s new `ghost` variant value.

**Tech Stack:** Vue 3 `<script setup>`, scoped SFC CSS, `mobile/src/styles/tokens.css`.

## Global Constraints

- Every `font-size` replacement uses the token whose value is nearest the
  current raw value, per this exact mapping (see Task 1): `0.68/0.7/0.72rem
  → --text-2xs (0.7rem)`, `0.75/0.78rem → --text-xs (0.75rem)`,
  `0.8/0.85rem → --text-sm (0.85rem)`, `0.9/0.95/1rem → --text-base
  (0.95rem)`, `1.05/1.1rem → --text-md (1.05rem)`, `1.3/1.35rem → --text-lg
  (1.3rem)`. `clamp(1.6rem, 5vw + 1rem, 2.1rem)` (only in `ScreenHeader.vue`)
  becomes `var(--text-display)`.
- Two font sizes are explicitly excluded from the sweep and stay hardcoded:
  `CalendarView.vue`'s `.calendar__streak-flame` (`1.8rem`) and
  `.calendar__streak-count` (`2.75rem`) — each has exactly one consumer.
  `LessonDetail.vue`'s `:deep(code)` (`0.88em`, relative unit, not part of
  the rem-based scale) and `.lesson-detail__complete` (`0.95rem`, the
  Mark-complete button — explicitly out of scope per sub-project 3's
  decision, reaffirmed here) also stay hardcoded.
- `border-radius: 14px` becomes `var(--radius-input)` everywhere it
  appears: `BottomNav.vue`, `TextField.vue`, `CoursesView.vue`,
  `CalendarView.vue`, `SpeakView.vue`.
- Inline `oklch(20% 0.012 250 / 0.1)` and `oklch(20% 0.012 250 / 0.25)`
  become `var(--color-hairline)` and `var(--color-shadow-soft)`
  respectively (both tokens already exist in `tokens.css`).
  `SpeakView.vue`'s one `oklch(20% 0.012 250 / 0.08)` also becomes
  `var(--color-hairline)` — the accepted non-exact-match delta from the
  spec.
- Do not modify `Card.vue` or `Badge.vue`'s non-font-size CSS.
- Do not modify `LessonDetail.vue`'s Mark-complete button in any way
  (CSS or markup) beyond what's explicitly listed above.
- No new test files except one added test in `BaseButton.test.js` (Task 2).

---

### Task 1: Add `--text-*` and `--radius-input` tokens

**Files:**
- Modify: `mobile/src/styles/tokens.css`

**Interfaces:**
- Produces: `--text-2xs` (0.7rem), `--text-xs` (0.75rem), `--text-sm`
  (0.85rem), `--text-base` (0.95rem), `--text-md` (1.05rem), `--text-lg`
  (1.3rem), `--text-display` (`clamp(1.6rem, 5vw + 1rem, 2.1rem)`),
  `--radius-input` (14px) — every later task consumes these by name.

- [ ] **Step 1: Add the tokens**

In `mobile/src/styles/tokens.css`, this block currently reads:

```css
  --radius-card: 20px;
  --radius-pill: 999px;

  --space-2xs: 0.25rem;
```

Change it to:

```css
  --radius-card: 20px;
  --radius-pill: 999px;
  --radius-input: 14px;

  --text-2xs: 0.7rem;
  --text-xs: 0.75rem;
  --text-sm: 0.85rem;
  --text-base: 0.95rem;
  --text-md: 1.05rem;
  --text-lg: 1.3rem;
  --text-display: clamp(1.6rem, 5vw + 1rem, 2.1rem);

  --space-2xs: 0.25rem;
```

- [ ] **Step 2: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors (adding unused CSS custom
properties can't break anything, but confirms the file still parses).

- [ ] **Step 3: Commit**

```bash
cd mobile
git add src/styles/tokens.css
git commit -m "feat(mobile): add type-scale and input-radius design tokens"
```

---

### Task 2: Add `BaseButton`'s `ghost` variant

**Files:**
- Modify: `mobile/src/components/base/BaseButton.vue`
- Test: `mobile/src/components/base/BaseButton.test.js`

**Interfaces:**
- Consumes: `--text-base`, `--radius-input` are not used here, but
  `--space-xs`/`--space-sm`/`--space-md`/`--color-paper-2`/
  `--color-paper-3`/`--color-ink`/`--dur-fast`/`--ease-out` (all already
  used elsewhere in this file).
- Produces: `variant="ghost"` — Task 11 (SpeakView.vue) is the one
  consumer.

- [ ] **Step 1: Update the variant prop's documentation comment and add the `ghost` CSS rule**

In `mobile/src/components/base/BaseButton.vue`, this line currently reads:

```js
  variant: {type: String, default: 'primary'}, // 'primary' | 'outline'
```

Change it to:

```js
  variant: {type: String, default: 'primary'}, // 'primary' | 'outline' | 'ghost'
```

Then, in the same file's `<style scoped>` block, this line currently
reads:

```css
  font-size: 0.9rem;
```

Change it to:

```css
  font-size: var(--text-base);
```

Then, this block currently reads:

```css
.base-button--outline.base-button--coral {
  border-color: var(--color-accent-3-deep);
  color: var(--color-accent-3-deep);
}

@media (hover: hover) {
  .base-button--outline.base-button--coral:hover:not(:disabled) {
    background: var(--color-accent-3);
    color: var(--color-ink);
  }
}
```

Add this new rule directly after it:

```css
.base-button--ghost {
  height: auto;
  width: 100%;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-weight: 500;
}

@media (hover: hover) {
  .base-button--ghost:hover:not(:disabled) {
    background: var(--color-paper-3);
  }
}
```

This reproduces `SpeakView.vue`'s current `.speak__history-toggle`
appearance exactly (full-width row, `paper-2` background, weight 500)
while keeping `.base-button`'s shared `border: 0`, `border-radius:
var(--radius-pill)`, `cursor: pointer`, `transition`, `focus-visible`
outline, and `:disabled` opacity handling.

- [ ] **Step 2: Add a test for the ghost variant**

In `mobile/src/components/base/BaseButton.test.js`, this test currently
reads:

```js
  it('applies the variant and tone classes', () => {
    const wrapper = mount(BaseButton, {
      props: {variant: 'outline', tone: 'coral'},
    });
    expect(wrapper.classes()).toContain('base-button--outline');
    expect(wrapper.classes()).toContain('base-button--coral');
  });
```

Add a new test directly after it:

```js
  it('applies the ghost variant class', () => {
    const wrapper = mount(BaseButton, {props: {variant: 'ghost'}});
    expect(wrapper.classes()).toContain('base-button--ghost');
  });
```

- [ ] **Step 3: Run the test suite**

Run: `cd mobile && npx vitest run src/components/base/BaseButton.test.js`
Expected: 5 tests pass (4 existing + 1 new).

- [ ] **Step 4: Verify the full build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
cd mobile
git add src/components/base/BaseButton.vue src/components/base/BaseButton.test.js
git commit -m "feat(mobile): add BaseButton ghost variant, tokenize its font-size"
```

---

### Task 3: Type-scale sweep — `Badge.vue`, `ScreenHeader.vue`, `TextField.vue`

**Files:**
- Modify: `mobile/src/components/base/Badge.vue`
- Modify: `mobile/src/components/base/ScreenHeader.vue`
- Modify: `mobile/src/components/base/TextField.vue`

**Interfaces:**
- Consumes: `--text-2xs`, `--text-xs`, `--text-sm`, `--text-base`,
  `--text-display`, `--radius-input` (from Task 1).

- [ ] **Step 1: `Badge.vue`**

This line currently reads:

```css
  font-size: 0.78rem;
```

Change it to:

```css
  font-size: var(--text-xs);
```

- [ ] **Step 2: `ScreenHeader.vue`**

This line currently reads:

```css
  font-size: 0.7rem;
```

Change it to:

```css
  font-size: var(--text-2xs);
```

This line currently reads:

```css
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
```

Change it to:

```css
  font-size: var(--text-display);
```

This line currently reads:

```css
  font-size: 0.95rem;
```

Change it to:

```css
  font-size: var(--text-base);
```

- [ ] **Step 3: `TextField.vue`**

This line currently reads:

```css
  font-size: 0.85rem;
```

(the one in `.text-field__label`) Change it to:

```css
  font-size: var(--text-sm);
```

This line currently reads:

```css
  border-radius: 14px;
```

Change it to:

```css
  border-radius: var(--radius-input);
```

This line currently reads:

```css
  font-size: 0.95rem;
```

(the one in `.text-field__input`) Change it to:

```css
  font-size: var(--text-base);
```

This line currently reads:

```css
  color: var(--color-accent-2);
  font-size: 0.85rem;
  font-weight: 600;
```

(the one in `.text-field__success`) Change it to:

```css
  color: var(--color-accent-2);
  font-size: var(--text-sm);
  font-weight: 600;
```

This line currently reads:

```css
  color: var(--color-ink-3);
  font-size: 0.8rem;
  line-height: 1.5;
```

(the one in `.text-field__hint`) Change it to:

```css
  color: var(--color-ink-3);
  font-size: var(--text-sm);
  line-height: 1.5;
```

- [ ] **Step 4: Run the base-component test suite**

Run: `cd mobile && npx vitest run src/components/base/`
Expected: all `base/` tests pass (font-size/radius changes don't affect
any test assertion — none test computed style values).

- [ ] **Step 5: Verify the full build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
cd mobile
git add src/components/base/Badge.vue src/components/base/ScreenHeader.vue src/components/base/TextField.vue
git commit -m "refactor(mobile): tokenize font-size/radius in base primitives"
```

---

### Task 4: `BottomNav.vue`

**Files:**
- Modify: `mobile/src/components/BottomNav.vue`

**Interfaces:**
- Consumes: `--text-2xs`, `--radius-input` (from Task 1).

- [ ] **Step 1: Replace the two hardcoded values**

This line currently reads:

```css
  border-radius: 14px;
```

(in `.bottom-nav__link`) Change it to:

```css
  border-radius: var(--radius-input);
```

This line currently reads:

```css
  font-size: 0.68rem;
```

(in `.bottom-nav__label`) Change it to:

```css
  font-size: var(--text-2xs);
```

- [ ] **Step 2: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Manual smoke check**

Run: `cd mobile && npm run dev`, confirm the bottom nav bar still renders
correctly (pill highlight shape unchanged, label text still legible).

- [ ] **Step 4: Commit**

```bash
cd mobile
git add src/components/BottomNav.vue
git commit -m "refactor(mobile): tokenize font-size/radius in BottomNav"
```

---

### Task 5: `LessonDetail.vue`

**Files:**
- Modify: `mobile/src/components/LessonDetail.vue`

**Interfaces:**
- Consumes: `--text-2xs`, `--text-xs`, `--text-base`, `--text-md`,
  `--text-lg`, `--color-hairline` (from Task 1 and existing tokens).

- [ ] **Step 1: Replace the font-size values**

This line currently reads:

```css
.lesson-detail__body {
  line-height: 1.65;
  font-size: 1rem;
}
```

Change it to:

```css
.lesson-detail__body {
  line-height: 1.65;
  font-size: var(--text-base);
}
```

This line currently reads:

```css
.lesson-detail__body :deep(h2) {
  margin: var(--space-xl) 0 var(--space-xs);
  font-size: 1.3rem;
```

Change it to:

```css
.lesson-detail__body :deep(h2) {
  margin: var(--space-xl) 0 var(--space-xs);
  font-size: var(--text-lg);
```

This line currently reads:

```css
.lesson-detail__body :deep(h3) {
  margin: var(--space-lg) 0 var(--space-2xs);
  font-size: 1.1rem;
```

Change it to:

```css
.lesson-detail__body :deep(h3) {
  margin: var(--space-lg) 0 var(--space-2xs);
  font-size: var(--text-md);
```

This line currently reads:

```css
.lesson-detail__body :deep(h4) {
  margin: var(--space-md) 0 var(--space-2xs);
  font-size: 0.95rem;
```

Change it to:

```css
.lesson-detail__body :deep(h4) {
  margin: var(--space-md) 0 var(--space-2xs);
  font-size: var(--text-base);
```

This line currently reads:

```css
.lesson-detail__body :deep(table) {
  width: 100%;
  margin: 0 0 var(--space-md);
  border-collapse: collapse;
  font-size: 0.9rem;
}
```

Change it to:

```css
.lesson-detail__body :deep(table) {
  width: 100%;
  margin: 0 0 var(--space-md);
  border-collapse: collapse;
  font-size: var(--text-base);
}
```

This line currently reads:

```css
.lesson-detail__body :deep(th) {
  font-family: var(--font-mono);
  font-size: 0.72rem;
```

Change it to:

```css
.lesson-detail__body :deep(th) {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
```

This line currently reads:

```css
.lesson-detail__body :deep(.lesson-vi__label) {
  display: inline-block;
  margin-bottom: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: 0.7rem;
```

Change it to:

```css
.lesson-detail__body :deep(.lesson-vi__label) {
  display: inline-block;
  margin-bottom: var(--space-2xs);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
```

Do **not** touch `:deep(code)`'s `font-size: 0.88em;` (relative unit, out
of scope) or `.lesson-detail__complete`'s `font-size: 0.95rem;` (the
Mark-complete button — out of scope per the Global Constraints).

- [ ] **Step 2: Replace the two inline `oklch()` literals**

This line currently reads:

```css
.lesson-detail__body :deep(hr) {
  margin: var(--space-lg) 0;
  border: 0;
  border-top: 1px solid oklch(20% 0.012 250 / 0.1);
}
```

Change it to:

```css
.lesson-detail__body :deep(hr) {
  margin: var(--space-lg) 0;
  border: 0;
  border-top: 1px solid var(--color-hairline);
}
```

This line currently reads:

```css
.lesson-detail__body :deep(th),
.lesson-detail__body :deep(td) {
  padding: var(--space-xs) var(--space-sm);
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid oklch(20% 0.012 250 / 0.1);
}
```

Change it to:

```css
.lesson-detail__body :deep(th),
.lesson-detail__body :deep(td) {
  padding: var(--space-xs) var(--space-sm);
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--color-hairline);
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, open a lesson, confirm the body text,
headings, table, and Vietnamese callout still render correctly, and the
Mark-complete button is visually unchanged.

- [ ] **Step 5: Commit**

```bash
cd mobile
git add src/components/LessonDetail.vue
git commit -m "refactor(mobile): tokenize font-size and hairline color in LessonDetail body"
```

---

### Task 6: `CalendarView.vue`

**Files:**
- Modify: `mobile/src/views/CalendarView.vue`

**Interfaces:**
- Consumes: `--text-2xs`, `--text-xs`, `--text-base`, `--radius-input`
  (from Task 1).

- [ ] **Step 1: Replace the font-size values**

This line currently reads:

```css
.calendar__streak-label {
  color: var(--color-ink-2);
  font-size: 0.95rem;
}
```

Change it to:

```css
.calendar__streak-label {
  color: var(--color-ink-2);
  font-size: var(--text-base);
}
```

This line currently reads:

```css
.calendar__month-title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.75rem;
```

Change it to:

```css
.calendar__month-title {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
```

This line currently reads:

```css
.calendar__date {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
}
```

Change it to:

```css
.calendar__date {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-ink-3);
}
```

This line currently reads:

```css
.calendar__title-text {
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
```

Change it to:

```css
.calendar__title-text {
  flex: 1;
  min-width: 0;
  font-size: var(--text-base);
```

This line currently reads:

```css
.calendar__done-label {
  flex: none;
  padding: 0.15em 0.6em;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 0.7rem;
  font-weight: 600;
}
```

Change it to:

```css
.calendar__done-label {
  flex: none;
  padding: 0.15em 0.6em;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: var(--text-2xs);
  font-weight: 600;
}
```

Do **not** touch `.calendar__streak-flame`'s `font-size: 1.8rem;` or
`.calendar__streak-count`'s `font-size: 2.75rem;` — both out of scope
per the Global Constraints (single consumer each).

- [ ] **Step 2: Replace the radius value**

This line currently reads:

```css
  border-radius: 14px;
```

(in `.calendar__day`) Change it to:

```css
  border-radius: var(--radius-input);
```

- [ ] **Step 3: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, open Calendar, confirm the streak
numeral/flame are unchanged in size, and the month/date list still reads
correctly.

- [ ] **Step 5: Commit**

```bash
cd mobile
git add src/views/CalendarView.vue
git commit -m "refactor(mobile): tokenize font-size/radius in CalendarView"
```

---

### Task 7: `CoursesView.vue`

**Files:**
- Modify: `mobile/src/views/CoursesView.vue`

**Interfaces:**
- Consumes: `--text-xs`, `--text-base`, `--text-md`, `--radius-input`
  (from Task 1).

- [ ] **Step 1: Replace the font-size values**

This line currently reads:

```css
.courses__topic-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  font-size: 1.05rem;
```

Change it to:

```css
.courses__topic-title {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
  font-size: var(--text-md);
```

This line currently reads:

```css
.courses__link-day {
  flex: none;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
}
```

Change it to:

```css
.courses__link-day {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-ink-3);
}
```

This line currently reads:

```css
.courses__link-title {
  flex: 1;
  min-width: 0;
  font-size: 0.95rem;
```

Change it to:

```css
.courses__link-title {
  flex: 1;
  min-width: 0;
  font-size: var(--text-base);
```

This line currently reads:

```css
.courses__link-chevron {
  flex: none;
  color: var(--color-ink-3);
  font-size: 1.1rem;
  line-height: 1;
}
```

Change it to:

```css
.courses__link-chevron {
  flex: none;
  color: var(--color-ink-3);
  font-size: var(--text-md);
  line-height: 1;
}
```

- [ ] **Step 2: Replace the radius value**

This line currently reads:

```css
  border-radius: 14px;
```

(in `.courses__link`) Change it to:

```css
  border-radius: var(--radius-input);
```

- [ ] **Step 3: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Manual smoke check**

Run: `cd mobile && npm run dev`, open Courses, confirm the topic
headings and lesson list rows still render correctly.

- [ ] **Step 5: Commit**

```bash
cd mobile
git add src/views/CoursesView.vue
git commit -m "refactor(mobile): tokenize font-size/radius in CoursesView"
```

---

### Task 8: `TodayView.vue` and `LessonView.vue`

**Files:**
- Modify: `mobile/src/views/TodayView.vue`
- Modify: `mobile/src/views/LessonView.vue`

**Interfaces:**
- Consumes: `--text-md` (from Task 1).

- [ ] **Step 1: `TodayView.vue`**

This line currently reads:

```css
.today__empty-text {
  margin: 0;
  max-width: 32ch;
  color: var(--color-ink-2);
  font-size: 1.05rem;
  line-height: 1.5;
}
```

Change it to:

```css
.today__empty-text {
  margin: 0;
  max-width: 32ch;
  color: var(--color-ink-2);
  font-size: var(--text-md);
  line-height: 1.5;
}
```

- [ ] **Step 2: `LessonView.vue`**

This line currently reads:

```css
.lesson__empty-text {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 1.05rem;
  line-height: 1.5;
}
```

Change it to:

```css
.lesson__empty-text {
  margin: 0;
  color: var(--color-ink-2);
  font-size: var(--text-md);
  line-height: 1.5;
}
```

- [ ] **Step 3: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
cd mobile
git add src/views/TodayView.vue src/views/LessonView.vue
git commit -m "refactor(mobile): tokenize font-size in Today/Lesson empty states"
```

---

### Task 9: `SettingsView.vue`

**Files:**
- Modify: `mobile/src/views/SettingsView.vue`

**Interfaces:**
- Consumes: `--text-sm`, `--text-base` (from Task 1).

- [ ] **Step 1: Replace the font-size values**

This line currently reads:

```css
.settings__profile-email {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.8rem;
}
```

Change it to:

```css
.settings__profile-email {
  margin: 0;
  color: var(--color-ink-2);
  font-size: var(--text-sm);
}
```

This line currently reads:

```css
.settings__profile-stats {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--space-md);
  font-size: 0.9rem;
  font-weight: 500;
}
```

Change it to:

```css
.settings__profile-stats {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--space-md);
  font-size: var(--text-base);
  font-weight: 500;
}
```

This line currently reads:

```css
.settings__version {
  margin: 0;
  color: var(--color-ink-3);
  font-size: 0.8rem;
  text-align: center;
}
```

Change it to:

```css
.settings__version {
  margin: 0;
  color: var(--color-ink-3);
  font-size: var(--text-sm);
  text-align: center;
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Manual smoke check**

Run: `cd mobile && npm run dev`, open Settings, confirm the profile
email, stats line, and version footer still render correctly.

- [ ] **Step 4: Commit**

```bash
cd mobile
git add src/views/SettingsView.vue
git commit -m "refactor(mobile): tokenize font-size in SettingsView"
```

---

### Task 10: `LoginView.vue` — type scale + `BaseButton` migration

**Files:**
- Modify: `mobile/src/views/LoginView.vue`

**Interfaces:**
- Consumes: `BaseButton` (props `loading: Boolean`, `loadingLabel:
  String`, default slot, `icon` slot — see Task 2's Interfaces block for
  the full prop list), `--text-sm` (from Task 1).

- [ ] **Step 1: Import `BaseButton`**

This line currently reads:

```vue
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Change it to:

```vue
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
```

- [ ] **Step 2: Replace the sign-in button markup**

This block currently reads:

```vue
      <button
        type="button"
        class="login__button"
        :disabled="isSigningIn"
        :aria-disabled="isSigningIn"
        @click="handleSignIn"
      >
        <svg
          v-if="!isSigningIn"
          class="login__google-icon"
          viewBox="0 0 18 18"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
          />
          <path
            fill="#34A853"
            d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
          />
          <path
            fill="#FBBC05"
            d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
          />
          <path
            fill="#EA4335"
            d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
          />
        </svg>
        {{ isSigningIn ? 'Signing in…' : 'Sign in with Google' }}
      </button>
```

Change it to:

```vue
      <BaseButton
        :loading="isSigningIn"
        loading-label="Signing in…"
        class="login__button"
        @click="handleSignIn"
      >
        <template #icon>
          <svg
            class="login__google-icon"
            viewBox="0 0 18 18"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
            />
          </svg>
        </template>
        Sign in with Google
      </BaseButton>
```

`class="login__button"` is kept on the `<BaseButton>` tag only so the
next step's leftover CSS (the icon-sizing rule, which stays) has
something scoped to attach to via the file's existing `.login__button
.login__google-icon` structure — Vue's scoped-CSS attribute fallthrough
puts `LoginView.vue`'s own scope attribute onto `BaseButton`'s root
`<button>`, same mechanism already used for `Card` in sub-project 6.

- [ ] **Step 3: Delete the now-dead `.login__button` CSS, keep the icon rule**

This block currently reads:

```css
.login__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
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

.login__google-icon {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 3px;
  background: var(--color-on-accent);
  padding: 2px;
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
```

Change it to:

```css
.login__button {
  margin-top: var(--space-xs);
}

.login__google-icon {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 3px;
  background: var(--color-on-accent);
  padding: 2px;
}
```

`BaseButton`'s own CSS now owns every state (default, hover, active,
focus-visible, disabled/loading) — `.login__button` keeps only the
`margin-top` this screen's layout needs, which `BaseButton` has no
opinion on.

Then, later in the same `<style scoped>` block, this rule currently
reads:

```css
@media (prefers-reduced-motion: reduce) {
  .login__button {
    transition:
      background-color var(--dur-fast) linear,
      opacity var(--dur-fast) linear;
    transform: none !important;
  }
}
```

Delete it in full — `BaseButton.vue` already has its own
`prefers-reduced-motion` handling.

- [ ] **Step 4: Replace the remaining font-size value**

This line currently reads:

```css
.login__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: 0.85rem;
}
```

Change it to:

```css
.login__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: var(--text-sm);
}
```

- [ ] **Step 5: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 6: Manual smoke check**

Run: `cd mobile && npm run dev`, sign out (or use an incognito/private
window against the dev server) to reach `/login`, confirm: the button
shows the Google icon + "Sign in with Google" text, clicking it shows
"Signing in…" with the icon hidden while `isSigningIn` is true, and the
button is disabled during that state. Confirm hover/active/focus-visible
states still look correct (now `BaseButton`'s primary variant, same
colors as before since the CSS values matched exactly per the spec).

- [ ] **Step 7: Commit**

```bash
cd mobile
git add src/views/LoginView.vue
git commit -m "refactor(mobile): migrate LoginView sign-in button to BaseButton"
```

---

### Task 11: `SpeakView.vue` — type scale, radius, oklch, and `BaseButton` ghost migration

**Files:**
- Modify: `mobile/src/views/SpeakView.vue`

**Interfaces:**
- Consumes: `BaseButton` with `variant="ghost"` (produced by Task 2),
  `--text-2xs`, `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`,
  `--radius-input`, `--color-hairline`, `--color-shadow-soft` (from
  Task 1 and existing tokens).

- [ ] **Step 1: Replace the history-toggle button markup**

This block currently reads:

```vue
      <button
        type="button"
        class="speak__history-toggle"
        :aria-expanded="showHistory"
        @click="showHistory = !showHistory"
      >
        <span>{{ showHistory ? 'Hide history' : 'Show history' }}</span>
        <span class="speak__history-count">{{ history.length }}</span>
      </button>
```

Change it to:

```vue
      <BaseButton
        variant="ghost"
        :aria-expanded="showHistory"
        @click="showHistory = !showHistory"
      >
        <span>{{ showHistory ? 'Hide history' : 'Show history' }}</span>
        <span class="speak__history-count">{{ history.length }}</span>
      </BaseButton>
```

`BaseButton` is already imported in this file (from the Try-again button
migration). `:aria-expanded` and `@click` fall through onto `BaseButton`'s
root `<button>` via Vue's default attribute/listener fallthrough
(`BaseButton.vue` has no `inheritAttrs: false`) — same mechanism the
task-reviewer already verified for the Try-again button's `@click`.

- [ ] **Step 2: Delete the now-dead `.speak__history-toggle` CSS**

This block currently reads:

```css
.speak__history-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 0;
  border-radius: var(--radius-pill);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease-out);
}
.speak__history-toggle:hover {
  background: var(--color-paper-3);
}
.speak__history-toggle:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
```

Delete it in full — `BaseButton.vue`'s `.base-button--ghost` rule (added
in Task 2) now owns this appearance. `.speak__history-count`'s own rule
(the small pill badge inside the button) is unrelated and stays
untouched.

- [ ] **Step 3: Replace the font-size values**

This line currently reads:

```css
.speak__transcript {
  width: 100%;
  min-height: 3.2em;
  margin: 0;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-size: 1.05rem;
```

Change it to:

```css
.speak__transcript {
  width: 100%;
  min-height: 3.2em;
  margin: 0;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
  color: var(--color-ink);
  font-size: var(--text-md);
```

This line currently reads:

```css
.speak__mic-label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-ink-2);
}
```

Change it to:

```css
.speak__mic-label {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-ink-2);
}
```

This line currently reads:

```css
.speak__error-transcript {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.9rem;
}
```

Change it to:

```css
.speak__error-transcript {
  margin: 0;
  color: var(--color-ink-2);
  font-size: var(--text-base);
}
```

This line currently reads:

```css
.speak__result-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
```

Change it to:

```css
.speak__result-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
```

This line currently reads:

```css
.speak__english {
  margin: 0;
  font-size: 1.35rem;
```

Change it to:

```css
.speak__english {
  margin: 0;
  font-size: var(--text-lg);
```

This line currently reads:

```css
.speak__ipa {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-ink-2);
}
```

Change it to:

```css
.speak__ipa {
  margin: 0;
  font-family: var(--font-mono);
  font-size: var(--text-base);
  color: var(--color-ink-2);
}
```

This line currently reads:

```css
.speak__explanation {
  margin: var(--space-xs) 0 0;
  padding-top: var(--space-sm);
  border-top: 1px solid oklch(20% 0.012 250 / 0.1);
  color: var(--color-ink-2);
  font-size: 0.9rem;
  line-height: 1.55;
}
```

Change it to:

```css
.speak__explanation {
  margin: var(--space-xs) 0 0;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-hairline);
  color: var(--color-ink-2);
  font-size: var(--text-base);
  line-height: 1.55;
}
```

This line currently reads:

```css
.speak__history-count {
  display: inline-grid;
  place-items: center;
  min-width: 1.4em;
  padding: 0 0.35em;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}
```

Change it to:

```css
.speak__history-count {
  display: inline-grid;
  place-items: center;
  min-width: 1.4em;
  padding: 0 0.35em;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}
```

This line currently reads:

```css
.speak__history-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--space-sm) var(--space-md);
  border-radius: 14px;
  background: var(--color-paper-2);
}
```

Change it to:

```css
.speak__history-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-input);
  background: var(--color-paper-2);
}
```

This line currently reads:

```css
.speak__history-vi {
  font-weight: 500;
  font-size: 0.9rem;
}
```

Change it to:

```css
.speak__history-vi {
  font-weight: 500;
  font-size: var(--text-base);
}
```

This line currently reads:

```css
.speak__history-en {
  color: var(--color-ink-2);
  font-size: 0.85rem;
}
```

Change it to:

```css
.speak__history-en {
  color: var(--color-ink-2);
  font-size: var(--text-sm);
}
```

This line currently reads:

```css
.speak__history-ipa {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-ink-3);
}
```

Change it to:

```css
.speak__history-ipa {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-ink-3);
}
```

This line currently reads:

```css
.speak__history-empty {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-ink-3);
  font-size: 0.85rem;
  text-align: center;
}
```

Change it to:

```css
.speak__history-empty {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-ink-3);
  font-size: var(--text-sm);
  text-align: center;
}
```

- [ ] **Step 4: Replace the remaining `oklch()` literals**

This line currently reads:

```css
.speak__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-accent-2-tint);
  box-shadow: 0 12px 32px -18px oklch(20% 0.012 250 / 0.25);
}
```

Change it to:

```css
.speak__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-accent-2-tint);
  box-shadow: 0 12px 32px -18px var(--color-shadow-soft);
}
```

This line currently reads:

```css
.speak__history-section {
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid oklch(20% 0.012 250 / 0.08);
}
```

Change it to:

```css
.speak__history-section {
  margin-top: auto;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-hairline);
}
```

- [ ] **Step 5: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 6: Manual smoke check**

Run: `cd mobile && npm run dev`, open Speak: confirm the transcript,
mic label, result card, and history section all render with unchanged
apparent sizing; confirm the "Show history"/"Hide history" toggle still
works, still spans the full width, and its count badge still displays
correctly.

- [ ] **Step 7: Commit**

```bash
cd mobile
git add src/views/SpeakView.vue
git commit -m "refactor(mobile): migrate SpeakView history-toggle to BaseButton ghost, tokenize remaining CSS"
```
