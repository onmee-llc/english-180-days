# Proposal: Homepage Calendar + Learn Page Filter

**Status:** Proposed
**Date:** 2026-04-19

---

## Overview

Two features are proposed:

1. **Homepage Calendar** — a monthly calendar grid on the homepage that maps each calendar date to its program lesson, so users can see the full 180-day journey at a glance and click through to any lesson.
2. **Learn Page Filter** — filter buttons on `/learn/` that let users show only `Tech` topics or only `English` topics.

---

## Feature 1: Homepage Calendar

### Goal

Show a calendar on the homepage (below the current overview section) where every day of the 180-day program is visible. Today's date is highlighted. Past lessons are dimmed. Clicking a day navigates to that lesson.

### Data

The program starts on **2026-04-13** (Day 1). The schedule is:

| Days   | Topic slug                           | Lesson count |
|--------|--------------------------------------|-------------|
| 1–14   | topic-1-introduce-yourself           | 14          |
| 15–28  | topic-2-system-design                | 14          |
| 29–42  | topic-3-api-microservices            | 14          |
| 43–56  | topic-4-cloud-infrastructure         | 14          |
| 57–70  | topic-5-ai-ml-pipelines              | 14          |
| 71–84  | topic-6-automation-workflow          | 14          |
| 85–98  | topic-7-project-storytelling         | 14          |
| 99–112 | topic-8-problem-solving              | 14          |
| 113–126| topic-9-team-communication           | 14          |
| 127–140| topic-10-salary-negotiation          | 14          |
| 141–180| (buffer / review period)             | —           |

A new Eleventy data file `src/site/_data/lessonSchedule.js` will build the full mapping:

```js
// Returns an array of 180 day entries:
// { day, date (YYYY-MM-DD), url, title, topic }
```

Lesson URLs follow the pattern `/learn/topic-N-slug/lesson-NNN`.
Lesson titles are read directly from the front matter of each `.md` file using the Eleventy collections API — **not** hardcoded.

Because this is a static site, the calendar is rendered server-side in Nunjucks. Month navigation (prev/next) is handled client-side with a small vanilla JS module added to the homepage bundle.

### Files changed / created

| File | Action | Notes |
|------|--------|-------|
| `src/site/_data/lessonSchedule.js` | **Create** | Build-time lesson schedule: day → date, url, title |
| `src/site/_includes/partials/lesson-calendar.njk` | **Create** | Nunjucks macro rendering a 6-month calendar grid |
| `src/site/_includes/homepage.njk` | **Modify** | Add `{% include "partials/lesson-calendar.njk" %}` section below overview |
| `src/scss/pages/_homepage.scss` | **Modify** | Add `.lesson-calendar`, `.lesson-calendar__grid`, `.calendar-day`, `.calendar-day--today`, `.calendar-day--past`, `.calendar-day--active` styles |
| `src/lib/lesson-calendar.js` | **Create** | Vanilla JS for month prev/next navigation; loaded as page script |
| `src/site/content/en/index.md` | **Modify** | Add `pageScripts: ['/js/lesson-calendar.js']` to front matter |
| `rollup.config.js` | **Modify** | Add `src/lib/lesson-calendar.js` as a separate Rollup entry |

### Calendar layout (wireframe)

```
┌─────────────────────────────────────────────────────┐
│  < April 2026                               May >    │
│  Mon  Tue  Wed  Thu  Fri  Sat  Sun                   │
│                 1    2    3    4    5                 │
│  6    7    8    9    10   11   12                    │
│  13   14   15   16   17   18  [19]  ← today          │
│  ...                                                 │
│  Each numbered cell shows: Day N — Short title       │
│  Clickable → /learn/topic-X-slug/lesson-NNN          │
└─────────────────────────────────────────────────────┘
```

- Cells not part of the program are empty.
- Today's cell has a distinct highlight ring.
- Past cells are rendered at reduced opacity.
- Active (today) cell is always scrolled into view on page load.

### Responsive behaviour

- Mobile: single-column scroll, cells stack vertically (week-per-row layout compressed).
- Tablet+: full grid layout.

---

## Feature 2: Learn Page Filter

### Goal

Add filter toggle buttons (`All` / `Tech` / `English`) to the `/learn/` hero section. Clicking a button hides cards that don't match the selected type. No page reload.

### Classification of existing topics

| Course slug | Type |
|---|---|
| topic-1 through topic-10 | `tech` |
| topic-11-daily-with-kids | `english` |
| topic-12-llm-system-architecture | `tech` |
| topic-13-prompt-engineering | `tech` |
| topic-14-ai-tech-talks | `tech` |
| topic-15-en-reading-lab | `english` |
| topic-16-en-technical-writing | `english` |
| certification-prep | `english` |
| pronunciation-guide | `english` |

### Files changed / created

| File | Action | Notes |
|------|--------|-------|
| `src/site/_data/courses/*/meta.yml` | **Modify** (×19) | Add `type: tech` or `type: english` to each course |
| `src/site/_includes/learn-page.njk` | **Modify** | Add filter buttons in hero; add `data-type="{{ course.meta.type }}"` to each card; embed filter JS |
| `src/scss/pages/_learn.scss` | **Modify** | Add `.learn__filters`, `.learn__filter-btn`, `.learn__filter-btn--active` styles |

### Interaction model

```
[ All ]  [ Tech ]  [ English ]   ← buttons in hero
```

- Default: **All** is active, all cards visible.
- Click **Tech**: hide cards with `data-type="english"`, mark Tech button active.
- Click **English**: hide cards with `data-type="tech"`, mark English button active.
- Click **All**: show all cards again.
- Filter state is persisted in `sessionStorage` so it survives soft-navigation.
- No external dependencies — pure vanilla JS, ~30 lines, inlined in the template.

---

## Out of scope

- Completion tracking / checkmarks (requires backend state).
- Drag-to-reschedule.
- Push notifications for daily reminders.
- Calendar export (`.ics`).

---

## Implementation order

1. Add `type` to all `meta.yml` files.
2. Update `learn-page.njk` + `_learn.scss` for filter.
3. Create `lessonSchedule.js` data file.
4. Create `lesson-calendar.njk` partial.
5. Update `homepage.njk` + `_homepage.scss`.
6. Create `lesson-calendar.js` and wire Rollup entry.
7. Add `pageScripts` to homepage front matter.
