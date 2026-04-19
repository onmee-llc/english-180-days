# 2026-04-20 — Floating Study Toolbox

**Commit:** `d997f6e62`
**Branch:** `main`

## Summary

Added a floating study toolbox widget visible on every page of the site. Fixed to the bottom-right corner (FAB-style), it gives instant access to today's lesson, tomorrow's preview, and quick links to the calendar and all topics.

## Files Changed

| File | Action |
|---|---|
| `src/site/_data/lessonSchedule.js` | Added `lessonMap` (compact date→lesson flat map) to the exported data object |
| `src/site/_includes/partials/study-toolbox.njk` | Created: FAB toggle button + popup panel HTML, embeds lesson JSON data block |
| `src/lib/study-toolbox.js` | Created: Rollup module — today/tomorrow lookup, progress ring, open/close, click-outside, Escape key |
| `src/scss/blocks/_study-toolbox.scss` | Created: all visual styles for FAB, popup, lesson card, day badges, links, skeleton, progress ring |
| `src/scss/next.scss` | Added `@import 'blocks/study-toolbox'` after `@import 'blocks/fab'` |
| `src/site/_includes/default.njk` | Added `{% include 'partials/study-toolbox.njk' %}` before site-footer |
| `src/site/_includes/partials/script-loader.njk` | Added `loadScript('/js/study-toolbox.js', 'module')` to load on all pages |
| `rollup.config.js` | Added `./src/lib/study-toolbox.js` to dev and production input arrays |
| `.sass-lint.yml` | Whitelisted `overscroll-behavior-x` and `scroll-margin-top` (modern CSS properties flagged by sass-lint v1.12) |

## Feature Details

- **FAB button**: 52px circle, bottom-right fixed, calendar icon / X close icon with crossfade animation
- **Progress ring**: SVG arc around button shows % of 180-day program elapsed (calculated client-side from `PROGRAM_START = 2026-04-13`)
- **Popup panel**: slide-up animation, contains:
  - Header: "Study Toolbox" + progress text (e.g. "7 / 180 days (4%)")
  - Today's lesson card: colour-coded day badge, lesson title, "Open lesson →" CTA
  - Tomorrow preview: mini badge + link
  - Quick links: "Full calendar →" (`/#lesson-calendar`), "All topics →" (`/learn/`)
- **Data strategy**: lesson map embedded per-page as `<script type="application/json" id="study-toolbox-data">` (CSP-safe non-executable data block), looked up at runtime by ISO date string
- **Close behaviour**: click outside panel, Escape key, or click the toggle button again
