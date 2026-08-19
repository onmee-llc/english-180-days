# Navigation Shell — Design

## Context

Sub-project 2 of 6 in the mobile UI/UX redesign initiative (see
`2026-08-19-shared-component-system-design.md` for the full roadmap and
rationale). Sub-project 1 shipped five shared components, including
`ScreenHeader.vue`, but wired none of them into a real screen — that's this
step's job for the header pattern.

**Scope check performed before this design:** `BottomNav.vue` was read in
full. It already has a complete state set (default, hover, focus-visible,
active-route, a recording pulse state synced with `SpeakView`'s own
recording color, `prefers-reduced-motion` handling) and no consistency
problem with the rest of the app. There is no real UX issue to fix there —
this design only tokenizes two inline OKLCH values in it, matching the
precedent set in sub-project 1 (`TextField.vue`'s `--color-border`): fix
scoped to the one file touched, not a repo-wide sweep of every file sharing
the same alpha values.

`TodayView.vue` does not use the eyebrow+title header pattern at all (it
goes straight into `LessonDetail.vue`'s own "Day N · Topic" + title shape,
a different, unrelated pattern) — it's out of scope for this step, not an
oversight.

## Goals

- Five screens that currently hand-roll the eyebrow+title(+subtitle) header
  markup — `SettingsView.vue`, `LoginView.vue`, `SpeakView.vue`,
  `CoursesView.vue`, `CalendarView.vue` — use `ScreenHeader.vue` instead,
  with their exact current copy unchanged.
- Each migrated screen's now-dead `__eyebrow`/`__title`/`__subtitle` CSS
  rules are removed (`ScreenHeader.vue` owns that styling now).
- `BottomNav.vue`'s two inline OKLCH values (a hairline top border, a soft
  drop shadow) become named tokens in `tokens.css`.

## Non-goals

- No content/copy changes to any screen — eyebrow/title/subtitle text stays
  exactly what it is today.
- No changes to `BottomNav.vue`'s behavior, layout, or any state beyond the
  two token extractions — it was already in good shape.
- No changes to `TodayView.vue`/`LessonDetail.vue` — their header shape is
  a different pattern, covered (if at all) by sub-project 3.
- No repo-wide tokenization of every file sharing the same OKLCH alpha
  values as `BottomNav.vue` — scoped to the one file, matching the
  sub-project 1 precedent.

## Design

### `ScreenHeader` migration (5 files)

Each screen replaces its existing header markup with a `<ScreenHeader>`
call carrying its current copy verbatim, and removes the CSS rules that
markup used (now unreachable).

| File | `eyebrow` | `title` | `subtitle` |
|---|---|---|---|
| `SettingsView.vue` | `SETTINGS` | `Settings` | *(none)* |
| `LoginView.vue` | `SIGN IN` | `Daily Mastery` | `Sign in with your Google account to start today's lesson.` |
| `SpeakView.vue` | `SPEAK · VI → EN` | `Say it in Vietnamese` | `Hold the mic, speak naturally — get the English back.` |
| `CoursesView.vue` | `COURSES` | `All topics` | *(none)* |
| `CalendarView.vue` | `CALENDAR` | `Your streak` | *(none)* |

Each file: add `import ScreenHeader from '../components/base/ScreenHeader.vue';`,
replace the `<header class="…__header">…</header>` block with the
`<ScreenHeader>` call from the table, delete the corresponding
`.…__header` / `.…__eyebrow` / `.…__title` / `.…__subtitle` CSS rules from
that file's `<style scoped>` block.

**Known, accepted visual change — `LoginView.vue` only:** today,
`.login__card` (a `flex-direction: column; gap: var(--space-md)` container)
holds the eyebrow/title/subtitle as three of its own direct flex children,
so they're spaced by `--space-md` (1rem) from each other. `ScreenHeader`
groups those three into one internal block spaced by `--space-2xs`
(0.25rem), and that whole block becomes a single flex child of
`.login__card`. Net effect: the header text tightens up, then a full
`--space-md` gap separates the header block from the sign-in button below
it (previously the subtitle-to-button gap was also just `--space-md`).
This was flagged during sub-project 1's review as an expected
"convergence, not a regression" — `ScreenHeader`'s tighter internal
spacing is the new canonical value other screens already use unmodified
(`SettingsView.vue`, `SpeakView.vue` never had `--space-md` between their
own eyebrow/title). Accepted as correct, not a bug to work around.

### `BottomNav.vue` token extraction

Add two tokens to `mobile/src/styles/tokens.css`'s `:root` block, near the
existing `--color-border` (added in sub-project 1):

```css
--color-hairline: oklch(20% 0.012 250 / 0.1);
--color-shadow-soft: oklch(20% 0.012 250 / 0.25);
```

In `BottomNav.vue`:
- `border-top: 1px solid oklch(20% 0.012 250 / 0.1);` → `border-top: 1px
  solid var(--color-hairline);`
- `box-shadow: 0 -8px 24px -16px oklch(20% 0.012 250 / 0.25);` → `box-shadow:
  0 -8px 24px -16px var(--color-shadow-soft);`

No other file changes — the same alpha values appear inline elsewhere in
the codebase (`LessonDetail.vue`, `SpeakView.vue`, `CalendarView.vue`, per
sub-project 1's whole-branch review notes) and are explicitly left alone,
same reasoning as `--color-border`'s scoped introduction.

## Testing

None of these five screens or `BottomNav.vue` currently have dedicated
`.test.js` files (confirmed: this repo has never had component tests for
views, only for composables and, as of sub-project 1, the five `base/`
primitives). This step doesn't change that convention — it's a markup/CSS
substitution with no new logic, verified by:
- `ScreenHeader.vue`'s own tests (already passing, unchanged by this step)
  already cover that it renders `eyebrow`/`title`/`subtitle` correctly —
  that coverage transfers to every consumer automatically.
- A manual smoke check per migrated screen (visually confirm the header
  still reads correctly) is the verification method, consistent with how
  this codebase has treated presentation-only view changes throughout this
  session (e.g. the auth-gate and Settings-redesign sub-projects).
- `npm run build` succeeding is the mechanical check that nothing broke at
  compile time.

## Out of scope (explicitly deferred)

- `TodayView.vue`/`LessonDetail.vue`'s header shape — sub-project 3's
  concern, not this one's.
- Any further `BottomNav.vue` changes beyond the two token extractions.
- Tokenizing the same OKLCH alpha values in the other files that share
  them — a separate, repo-wide cleanup task if it's ever done at all.
