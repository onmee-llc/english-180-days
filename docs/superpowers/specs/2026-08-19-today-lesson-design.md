# Today + Lesson — Design

## Context

Sub-project 3 of 6 in the mobile UI/UX redesign initiative (see
`2026-08-19-shared-component-system-design.md` for the roadmap). Scope was
narrowed during brainstorming after reading both `TodayView.vue` and
`LessonDetail.vue` in full: there is exactly one genuine, evidence-backed
fit for a shared component here, not the two-file rewrite the roadmap
label might imply.

**What was found:** `LessonDetail.vue`'s "Day N · Topic" line +
`shortTitle` heading uses CSS values byte-identical to `ScreenHeader.vue`'s
eyebrow/title (`font-family: var(--font-mono); font-size: 0.7rem;
letter-spacing: 0.1em; text-transform: uppercase` for the eyebrow;
`font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem); font-weight: 700;
letter-spacing: -0.02em` for the title) — a real duplicate, not a
coincidental resemblance.

**What was explicitly rejected, with reasons:**
- The "Mark complete" button (`.lesson-detail__complete`) has a
  `box-shadow: 0 4px 0 0 var(--color-accent-deep)` tactile press effect,
  spring easing, and a distinct "done" visual state — none of which
  `BaseButton` supports today. Sub-project 1's spec is explicit that new
  `BaseButton` variants get added "when a real screen needs it, not
  speculatively now" — but here the honest read is the opposite direction:
  this button already has a real, different, working design, and bending
  it to fit `BaseButton`'s existing flat-pill shape would be a downgrade,
  not a consolidation. Left as-is.
- `TodayView.vue` has no header, no card surface, and no button — it's
  already minimal. There is nothing in it to migrate.

## Goals

- `LessonDetail.vue`'s day-line + title uses `ScreenHeader.vue` instead of
  its own duplicated CSS, with dynamic (not static) `eyebrow`/`title`
  values — the first consumer in this redesign to bind these props
  dynamically rather than pass literal strings, since the text is
  per-lesson content.

## Non-goals

- No change to the "Mark complete" button.
- No change to `TodayView.vue`.
- No change to the `v-html` lesson body or any of its `:deep()` styling.

## Design

Replace:

```html
<p class="lesson-detail__day">Day {{ lesson.day }} · {{ lesson.topicTitle }}</p>
<h1 class="lesson-detail__title">{{ lesson.shortTitle }}</h1>
```

with:

```html
<ScreenHeader
  :eyebrow="`Day ${lesson.day} · ${lesson.topicTitle}`"
  :title="lesson.shortTitle"
/>
```

Add `import ScreenHeader from './base/ScreenHeader.vue';` (this file is at
`mobile/src/components/LessonDetail.vue`, so the shared component sits one
level down at `mobile/src/components/base/ScreenHeader.vue` — a shorter
relative path than the `../components/base/` used by the view-level files
in sub-project 2, since this file already lives in `components/`).

Remove the now-dead `.lesson-detail__day` and `.lesson-detail__title` CSS
rules.

**Accepted visual change, same category as sub-project 2's convergences:**
the gap between the day-line and the title tightens from the current
title's `margin: 0 0 var(--space-xs)` bottom-margin approach to
`ScreenHeader`'s `gap: var(--space-2xs)` flex layout — a small reduction
(0.5rem → 0.25rem), consistent with every other screen already migrated.

## Testing

Same approach as sub-project 2: no new test files (pure markup/CSS
substitution, `ScreenHeader.vue`'s own existing tests already cover
`eyebrow`/`title` rendering for every consumer including this one).
Verification is `npm run build` plus a manual smoke check — open a lesson
in Today or Courses and confirm the day-line and title still read
correctly.
