# Change: Homepage Calendar + Learn Page Filter

**Date:** 2026-04-19
**Commits:** `13f4972a5`, `e19e290e4`
**Status:** Shipped ✅

---

## Summary

Two features delivered in one session:

1. **Homepage Calendar** — full 180-day journey mapped to a calendar grid, visible on the homepage.
2. **Learn Page Filter** — `All / Tech / English` filter on `/learn/` to narrow course cards by type.

---

## Feature 1 — Homepage Calendar

### Files created
| File | Purpose |
|------|---------|
| `src/site/_data/lessonSchedule.js` | Build-time data: reads all `lesson-NNN.md` front matter via `gray-matter`, maps each to a calendar date starting Day 1 = 2026-04-13. Returns 8 pre-built monthly grid structures. 202 lesson cells resolved. |
| `src/lib/lesson-calendar.js` | Client module: initialises to current month, prev/next nav, marks `.is-today` / `.is-past`, smooth-scrolls today into view. Loaded via `pageScripts`. |
| `src/site/_includes/partials/lesson-calendar.njk` | Server-rendered calendar partial. 8 months pre-rendered as hidden elements; JS reveals active month. Each lesson cell is a `<a>` with `data-date` / `data-topic` / `data-type`. |

### Files modified
| File | Change |
|------|--------|
| `src/site/_includes/homepage.njk` | Added `{% include "partials/lesson-calendar.njk" %}` below overview section. |
| `src/scss/pages/_homepage.scss` | ~200 lines: calendar widget shell, month nav, day-of-week row, 7-column week grid, lesson/free/empty cell variants, 8 topic color themes via `data-topic`, today ring, past-day dimming, hover lift, legend, mobile compressed mode. |
| `src/site/content/en/index.md` | Added `pageScripts: ['/js/lesson-calendar.js']`. |
| `rollup.config.js` | Added `lesson-calendar.js` to dev + production input arrays. |

---

## Feature 2 — Learn Page Filter

### Files created
| File | Purpose |
|------|---------|
| `src/lib/learn-filter.js` | Filter module: reads `data-course-type` on cards, toggles visibility, persists state in `sessionStorage`. Loaded via `pageScripts`. |

### Files modified
| File | Change |
|------|--------|
| `src/site/_data/courses/*/meta.yml` (×18) | Added `type: tech` or `type: english` to all 18 course meta files. |
| `src/site/_includes/learn-page.njk` | Filter bar (`All / Tech / English`) in hero; `data-course-type` + coloured type badge on each card; `pageScripts: ['/js/learn-filter.js']`. |
| `src/scss/pages/_learn.scss` | Pill-style filter buttons with active state, tech/english dot indicators, course type badge. |
| `rollup.config.js` | Added `learn-filter.js` to dev + production input arrays. |

---

## Other
| File | Change |
|------|--------|
| `.sass-lint.yml` | Created — whitelists `gap`, `row-gap`, `column-gap`, `aspect-ratio`, `inset` as valid CSS properties; disables `property-sort-order` (sass-lint bug crash on CSS custom properties). |

---

## Type classification applied

| Course | Type |
|--------|------|
| topic-1 through topic-10 | tech |
| topic-11-daily-with-kids | english |
| topic-12-llm-system-architecture | tech |
| topic-13-prompt-engineering | tech |
| topic-14-ai-tech-talks | tech |
| topic-15-en-reading-lab | english |
| topic-16-en-technical-writing | english |
| certification-prep | english |
| pronunciation-guide | english |
