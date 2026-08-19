# Visual Personality (DM Sans typeface) — Design

## Context

Sub-project 8, the last of the mobile UI/UX redesign initiative. Deferred
out of sub-project 7 (`2026-08-19-type-scale-and-consistency-design.md`)
because it's a real creative/brand decision — a new typeface — rather than
a mechanical consistency fix. A taste-skill audit found the app's claimed
"playful (Hum register)" character (written into every component's Hallmark
stamp comment) is only weakly expressed visually: the app uses the system
font stack only (`-apple-system, BlinkMacSystemFont, 'Segoe UI Variable',
'Segoe UI', system-ui, sans-serif`), no distinctive typeface, personality
carried almost entirely by a few emoji (🔥📚🎉).

**Font choice and its one hard constraint.** The app has substantial
Vietnamese-language content (lesson explanations, the Speak feature's
Vietnamese transcripts and bilingual callouts, UI copy) alongside English,
so any new typeface needed full Vietnamese diacritic coverage to be usable
app-wide without visible inconsistency. The user was asked this directly
and chose **DM Sans**, a Google Fonts variable geometric sans, after being
told explicitly that it does *not* carry Vietnamese diacritics — verified
directly against Google Fonts' own CSS response (`curl
"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400..900"` returns
only `/* latin-ext */` and `/* latin */` `@font-face` blocks; no
`/* vietnamese */` block, and the `unicode-range`s present don't cover the
Vietnamese tone-mark range `U+1EA0–U+1EF9` that most Vietnamese words need).
The user's explicit, informed decision: use DM Sans everywhere anyway, and
accept that Vietnamese tone-marked text will render in the CSS
fallback font (the same system-font stack already in `tokens.css`) instead
of DM Sans — this is standard per-glyph CSS font-fallback behavior, not a
bug, and is called out here so it isn't later mistaken for one.

## Goals

- Self-host DM Sans as a variable font (weight range 400–900, one file per
  subset) — not a Google Fonts CDN `<link>` — so the app has no runtime
  network dependency for its own typeface and degrades gracefully offline
  (falls straight to the existing system-font stack with zero extra
  latency, rather than a failed CDN fetch).
- Two `.woff2` files, fetched from Google Fonts' stable, versioned
  `fonts.gstatic.com` URLs and committed into the repo at
  `mobile/src/styles/fonts/`:
  - `dm-sans-latin.woff2` ←
    `https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2`
    (`unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
    U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122,
    U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD` — covers all English
    content).
  - `dm-sans-latin-ext.woff2` ←
    `https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6h9Q.woff2`
    (`unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7,
    U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F,
    U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F,
    U+A720-A7FF` — covers untoned Vietnamese base vowels like `ă â ê ô ơ ư`,
    though not the tone-marked combinations).
- Add two `@font-face` rules to `mobile/src/styles/tokens.css` (above the
  `:root` block), one per subset, both `font-family: 'DM Sans'`,
  `font-weight: 400 900` (the variable-axis range), `font-style: normal`,
  `font-display: swap` (shows the fallback font instantly, swaps to DM Sans
  once loaded — avoids a blank-text flash), and the matching
  `unicode-range` from each file's real Google Fonts CSS response above.
- Update `--font-display` in `tokens.css` from:
  ```css
  --font-display:
    -apple-system, BlinkMacSystemFont, 'Segoe UI Variable', 'Segoe UI',
    system-ui, sans-serif;
  ```
  to:
  ```css
  --font-display:
    'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI Variable',
    'Segoe UI', system-ui, sans-serif;
  ```
  `--font-body: var(--font-display);` is already defined in terms of
  `--font-display` and needs no separate edit — it picks up DM Sans
  automatically.

## Non-goals

- `--font-mono` (used for eyebrows/mono-style labels throughout the app)
  is untouched — the taste-skill audit's personality finding was about
  body/display text, not the mono label style, and DM Sans has no
  monospace counterpart.
- No component's `font-weight` value changes. DM Sans is a variable font,
  so every existing `font-weight: 500/600/700/…` declaration across the
  app continues to work exactly as before, now rendered in DM Sans's own
  interpolated weight instead of the system font's nearest static weight.
  Restyling which elements are bold vs. regular is a separate, later
  decision if the user wants to push the "energetic" feel further — not
  bundled into this typeface swap.
- No change to any component's markup, props, or behavior — this is a
  two-file addition plus a two-line token edit.
- No Google Fonts `<link>`/CDN reference anywhere — self-hosted only.

## Testing

Same convention as every prior sub-project: no new test files (no logic
changed, purely a font-loading/CSS change). Verification is `npm run
build` succeeding (confirms Vite resolves the new `url()` references to
the `.woff2` files correctly) plus a manual visual check across a few
screens (Today, Speak, Settings) in `npm run dev` to confirm DM Sans is
visibly loading for English text and the app doesn't look broken for
Vietnamese text (fallback engaging as expected, not tofu/missing glyphs).
