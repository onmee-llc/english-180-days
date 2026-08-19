# Today + Lesson Header Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `LessonDetail.vue`'s hand-rolled day-line + title markup with the shared `ScreenHeader` component, using dynamic (per-lesson) prop values.

**Architecture:** One-file change. `LessonDetail.vue` imports `ScreenHeader` from `./base/ScreenHeader.vue` and passes a template-literal `eyebrow` and `title` built from the `lesson` prop it already receives. The two now-dead CSS rules that duplicated `ScreenHeader`'s styling are deleted.

**Tech Stack:** Vue 3 `<script setup>`, scoped SFC CSS, existing `mobile/src/styles/tokens.css` design tokens.

## Global Constraints

- No content/copy change: the eyebrow text stays `Day {{ lesson.day }} · {{ lesson.topicTitle }}`, the title stays `{{ lesson.shortTitle }}` — only the rendering mechanism changes.
- Do not touch `.lesson-detail__complete` (the Mark-complete button) or any of its states.
- Do not touch `mobile/src/views/TodayView.vue`.
- Do not touch `.lesson-detail__body` or any of its `:deep()` rules.
- No new test file — this codebase has no dedicated test file for `LessonDetail.vue` today (confirmed: `find mobile/src -iname "*LessonDetail*"` returns only the component itself), and this change has no new logic to cover. `ScreenHeader.vue`'s own existing tests already cover `eyebrow`/`title` rendering for every consumer, this one included.
- Known, accepted visual delta (same category as prior sub-projects' convergences, not a regression): `.lesson-detail` is a `flex-direction: column; gap: var(--space-md)` container. Today, the gap between the day-line and the title is that flex `gap` (1rem, since both `<p>` and `<h1>` currently carry `margin: 0` between themselves), and the title carries its own `margin: 0 0 var(--space-xs)` that adds another 0.5rem before the lesson body — 1.5rem total between title and body. After migration, `ScreenHeader` becomes a single flex child: the day/title internal gap becomes `ScreenHeader`'s own `gap: var(--space-2xs)` (0.25rem), and the space between the header block and the lesson body becomes just `.lesson-detail`'s flex `gap` (1rem, since `ScreenHeader` has no external margin) — a reduction from 1.5rem to 1rem. Accept this; do not add compensating margin to work around it.

---

### Task 1: Migrate `LessonDetail.vue` header to `ScreenHeader`

**Files:**
- Modify: `mobile/src/components/LessonDetail.vue`

**Interfaces:**
- Consumes: `ScreenHeader` from `mobile/src/components/base/ScreenHeader.vue` — props `eyebrow: String (required)`, `title: String (required)`, `subtitle: String (default: '')`. This task does not pass `subtitle`.
- Produces: nothing consumed by later tasks — this is the only task in this plan.

- [ ] **Step 1: Add the `ScreenHeader` import**

In `mobile/src/components/LessonDetail.vue`, the `<script setup>` block currently reads:

```vue
<script setup>
defineProps({
  lesson: {type: Object, required: true},
  isComplete: {type: Boolean, required: true},
});
defineEmits(['mark-complete']);
</script>
```

Change it to:

```vue
<script setup>
import ScreenHeader from './base/ScreenHeader.vue';

defineProps({
  lesson: {type: Object, required: true},
  isComplete: {type: Boolean, required: true},
});
defineEmits(['mark-complete']);
</script>
```

- [ ] **Step 2: Replace the day-line + title markup**

In the same file, the template currently reads:

```vue
<template>
  <section class="lesson-detail">
    <p class="lesson-detail__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
    <h1 class="lesson-detail__title">{{ lesson.shortTitle }}</h1>
    <div class="lesson-detail__body" v-html="lesson.bodyHtml"></div>
```

Change the two `<p>`/`<h1>` lines to:

```vue
<template>
  <section class="lesson-detail">
    <ScreenHeader
      :eyebrow="`Day ${lesson.day} · ${lesson.topicTitle}`"
      :title="lesson.shortTitle"
    />
    <div class="lesson-detail__body" v-html="lesson.bodyHtml"></div>
```

The rest of the template (the `<div class="lesson-detail__body">` and the `<button class="lesson-detail__complete">`) is unchanged.

- [ ] **Step 3: Delete the now-dead CSS rules**

In the same file's `<style scoped>` block, delete these two rules in full:

```css
.lesson-detail__day {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.lesson-detail__title {
  margin: 0 0 var(--space-xs);
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
```

Leave the blank line between `.lesson-detail { ... }` and the `/* ---------- lesson body (v-html) ---------- */` comment that follows — do not leave a double blank line or remove the comment.

- [ ] **Step 4: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors (this is a markup/CSS-only change with no new logic — there is no unit test to run for this task, per the Global Constraints note above).

- [ ] **Step 5: Manual smoke check**

Run: `cd mobile && npm run dev`, open the app, sign in, navigate to a lesson via Today (or Courses → a topic → a lesson), and confirm:
- The "Day N · Topic" eyebrow line and the lesson's short title render correctly above the lesson body.
- The Mark-complete button still looks and behaves exactly as before (unchanged).

Report the result of this manual check in the task report (this plan has no automated test for the visual change, so this step is the actual verification).

- [ ] **Step 6: Commit**

```bash
cd mobile
git add src/components/LessonDetail.vue
git commit -m "refactor(mobile): migrate LessonDetail header to ScreenHeader"
```
