# Type Scale & Consistency Cleanup — Design

## Context

Sub-project 7, follow-up to the 6-part mobile UI/UX redesign. Triggered by
a taste-skill audit (checklist: hierarchy, restraint, consistency,
typography, motion, edge cases) that found four concrete, evidence-backed
consistency gaps — surveyed directly against the codebase
(`grep -rn "font-size:"` / `"border-radius: 14px"` / `"oklch("` across
`mobile/src`), not estimated:

- No shared font-size scale: 47 `font-size` declarations across the app
  use 17 distinct raw rem values, with no `--text-*` tokens in
  `tokens.css` (which already has disciplined `--space-*` and 2
  `--radius-*` tokens).
- `border-radius: 14px` is hardcoded in 5 files, used as often as the two
  actual radius tokens but never named as one.
- 5 inline `oklch(20% 0.012 250 / …)` literals remain in `LessonDetail.vue`
  and `SpeakView.vue`, 4 of which are byte-identical to the existing
  `--color-hairline`/`--color-shadow-soft` tokens.
- Three hand-rolled pill-button implementations
  (`LoginView.vue`'s sign-in button, `SpeakView.vue`'s history-toggle,
  `LessonDetail.vue`'s Mark-complete) coexist with `BaseButton.vue`
  instead of using it.

"Visual personality" (a distinctive typeface, a stronger "playful" voice)
was raised in the same audit but is a separate, larger creative/brand
decision — explicitly out of scope here, deferred to its own future
sub-project.

`LessonDetail.vue`'s Mark-complete button was evaluated for
`BaseButton` consolidation in sub-project 3 and rejected there (bespoke
press shadow, spring easing, and a distinct disabled/"done" treatment that
`BaseButton` doesn't support) — that decision stands and isn't
re-litigated here.

## Goals

**Type scale.** Add a `--text-*` token set to `tokens.css` and replace
every raw `font-size` rem value across `mobile/src/components/` and
`mobile/src/views/` (including the `base/` primitives) with the matching
token:

| Token | Value | Replaces (raw values) |
|---|---|---|
| `--text-2xs` | `0.7rem` | `0.68rem`, `0.7rem`, `0.72rem` |
| `--text-xs` | `0.75rem` | `0.75rem`, `0.78rem` |
| `--text-sm` | `0.85rem` | `0.8rem`, `0.85rem` |
| `--text-base` | `0.95rem` | `0.9rem`, `0.95rem`, `1rem` |
| `--text-md` | `1.05rem` | `1.05rem`, `1.1rem` |
| `--text-lg` | `1.3rem` | `1.3rem`, `1.35rem` |

`--text-display` is **not** new — `ScreenHeader.vue`'s existing
`clamp(1.6rem, 5vw + 1rem, 2.1rem)` title size becomes this token, and
every consumer keeps using `ScreenHeader`, so no file besides
`tokens.css` and `ScreenHeader.vue` itself touches this value.

Two sizes are explicitly **not** tokenized: `CalendarView.vue`'s
`2.75rem` streak-count numeral and `1.8rem` streak-flame emoji size. Each
has exactly one consumer — a token with one consumer doesn't reduce
duplication, it just renames a value, so both stay as local hardcoded
rems (YAGNI).

**Accepted rounding deltas.** Six raw values move by ≤0.05rem (≤0.8px at
a 16px root) to land on their token: `0.68rem→0.7rem` (`BottomNav.vue`
label), `0.72rem→0.75rem` (`LessonDetail.vue` table header), `0.78rem→
0.75rem` (`Badge.vue`), `0.8rem→0.85rem` (`TextField.vue` hint,
`SettingsView.vue` email/version), `1rem→0.95rem` (`LessonDetail.vue`
body text), `1.1rem→1.05rem` (`LessonDetail.vue` h3,
`CoursesView.vue` link-title). Same category of change already accepted
throughout this redesign (e.g. sub-project 2's `LoginView.vue` spacing
convergence) — imperceptible individually, and the payoff is one shared
scale instead of 17 one-off values.

**Radius token.** Add `--radius-input: 14px` to `tokens.css`. Replace the
5 hardcoded `border-radius: 14px` declarations
(`BottomNav.vue`, `TextField.vue`, `CoursesView.vue`,
`CalendarView.vue`, `SpeakView.vue`) with `var(--radius-input)`.

**OKLCH cleanup.** Replace all 5 inline `oklch(20% 0.012 250 / …)`
literals with the matching token:
- `LessonDetail.vue:146` and `:182` (alpha `0.1`) → `var(--color-hairline)`
- `SpeakView.vue:407` (alpha `0.25`) → `var(--color-shadow-soft)`
- `SpeakView.vue:437` (alpha `0.1`) → `var(--color-hairline)`
- `SpeakView.vue:467` (alpha `0.08`, the history-section top border) →
  `var(--color-hairline)` (alpha `0.1`) — the one non-exact match. A
  `0.02` alpha delta is not visually distinguishable; reusing the
  existing token beats inventing a third hairline value for one caller.

**Button consolidation.**
- `LoginView.vue`'s sign-in button (`.login__button`) becomes
  `<BaseButton :loading="isSigningIn" loading-label="Signing in…">` with
  the Google `<svg>` in the `icon` slot. Its current CSS is a
  value-for-value match of `BaseButton`'s base + `primary` variant
  (height `2.75rem`, padding `0 1.4rem`, pill radius, weight 600, `bg:
  accent`/`color: on-accent`, hover → `accent-deep`, active
  `translateY(1px)`, focus-visible outline, `disabled` opacity `0.6`) —
  a direct swap, not a redesign. `.login__button`'s CSS and the
  now-redundant `isSigningIn`-conditional label text move to
  `BaseButton`'s existing `loading`/`loading-label` props.
- `BaseButton.vue` gains a third variant, `variant="ghost"`
  (`background: var(--color-paper-2)`, `color: var(--color-ink)`, hover →
  `var(--color-paper-3)`, weight 500 — copied from `SpeakView.vue`'s
  current `.speak__history-toggle` CSS, its only real consumer today).
  This is the one base-component change in this sub-project; every prior
  sub-project left `base/` files untouched, but a variant added because
  one real, currently-existing screen needs it is the sanctioned path
  this redesign has used throughout (documented in the shared-component
  system's own design spec) — not speculative growth.
- `SpeakView.vue`'s history-toggle becomes
  `<BaseButton variant="ghost" :aria-expanded="showHistory" @click="showHistory = !showHistory">`,
  with its current two-child markup (label span + count badge span) as
  default-slot content. Its own `.speak__history-toggle` CSS is deleted.

## Non-goals

- No new typeface, no expanded "playful" personality — separate
  sub-project.
- No change to `LessonDetail.vue`'s Mark-complete button — already
  decided against in sub-project 3.
- No change to `Card.vue` or `Badge.vue`'s own CSS values beyond the
  type-scale token swap (their padding/radius/color rules are untouched).
- No repo-wide sweep beyond `mobile/src/components/` and
  `mobile/src/views/` — `mobile/src/styles/tokens.css` itself is the only
  other file touched (adding the new tokens).

## Testing

Same convention as every prior sub-project: no new test files.
`BaseButton.vue`'s existing test file gets one new test for the `ghost`
variant (it already has parametrized coverage for `primary`/`outline`,
this follows the same pattern). No other component has dedicated tests
to update — verification is `npm run build` plus a manual smoke pass
across every touched screen (font sizes, radii, button appearances)
since this touches presentation only, matching how every earlier
sub-project in this series was verified.
