# Visual Personality (DM Sans Typeface) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Self-host DM Sans as a variable font and make it the app's display/body typeface, replacing the system-font-only stack.

**Architecture:** Two `.woff2` files are downloaded from Google Fonts' stable, versioned static host into the repo, referenced via two new `@font-face` rules in `tokens.css`, and `--font-display` is updated to use `'DM Sans'` first with the existing system-font stack retained as fallback.

**Tech Stack:** Plain CSS (`@font-face`), Vite (bundles the `url()`-referenced font assets automatically, no config needed), `mobile/src/styles/tokens.css`.

## Global Constraints

- Self-hosted only — no Google Fonts CDN `<link>` or `@import` anywhere.
- Exactly two font files, fetched from these exact URLs (verified against Google Fonts' live CSS response, stable/versioned `gstatic.com` paths):
  - `https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2` → save as `dm-sans-latin.woff2`
  - `https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6h9Q.woff2` → save as `dm-sans-latin-ext.woff2`
- DM Sans does not cover Vietnamese tone-marked characters (verified: no `vietnamese` subset exists for this font on Google Fonts) — Vietnamese text falls back to the existing system-font stack per standard CSS font-fallback behavior. This is an accepted, explicit product decision, not a bug to fix.
- No component `font-weight` values change — DM Sans is a variable font (weight range 400–900) and interpolates every existing weight declaration automatically.
- `--font-mono` is not touched.
- No new test files — this is a CSS/asset-only change with no logic to cover.

---

### Task 1: Self-host DM Sans and wire it into `--font-display`

**Files:**
- Create: `mobile/src/styles/fonts/dm-sans-latin.woff2`
- Create: `mobile/src/styles/fonts/dm-sans-latin-ext.woff2`
- Modify: `mobile/src/styles/tokens.css`

**Interfaces:**
- Produces: `--font-display` (and, transitively, `--font-body: var(--font-display);`, already defined and unchanged) now resolve to `'DM Sans', -apple-system, …` everywhere they're used across the app — no other file needs to change.

- [ ] **Step 1: Create the fonts directory and download the two font files**

Run these exact commands from the repo root:

```bash
mkdir -p mobile/src/styles/fonts
curl -sL "https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K4.woff2" -o mobile/src/styles/fonts/dm-sans-latin.woff2
curl -sL "https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6h9Q.woff2" -o mobile/src/styles/fonts/dm-sans-latin-ext.woff2
```

Verify both files downloaded and are non-empty, valid woff2 files:

```bash
ls -la mobile/src/styles/fonts/
file mobile/src/styles/fonts/dm-sans-latin.woff2
file mobile/src/styles/fonts/dm-sans-latin-ext.woff2
```

Expected: both files exist, each roughly 15–40 KB, and `file` reports them as `Web Open Font Format` (woff2) — not HTML or an error page (which would mean the URL returned something other than a font, e.g. a 404).

- [ ] **Step 2: Add the two `@font-face` rules**

In `mobile/src/styles/tokens.css`, the file currently starts:

```css
/* Daily Mastery brand tokens · DNA lifted from awenvia.com's shipped CSS (see
 * mobile/brand/README.md for the source values and rationale). Replaces the earlier
 * Hum theme (cream/pear/cyan/coral) — same variable names, so no template/component
 * changes were needed anywhere, only the values below.
 */

:root {
```

Change it to:

```css
/* Daily Mastery brand tokens · DNA lifted from awenvia.com's shipped CSS (see
 * mobile/brand/README.md for the source values and rationale). Replaces the earlier
 * Hum theme (cream/pear/cyan/coral) — same variable names, so no template/component
 * changes were needed anywhere, only the values below.
 */

/* Self-hosted DM Sans (variable font, weight 400-900) — no Google Fonts CDN
 * dependency. Vietnamese tone-marked text isn't covered by this font (Google
 * Fonts has no vietnamese subset for DM Sans) and falls back to the system
 * font stack in --font-display below — an accepted, explicit product
 * decision, not a bug.
 */
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: url('./fonts/dm-sans-latin-ext.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: url('./fonts/dm-sans-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

:root {
```

- [ ] **Step 3: Update `--font-display`**

In the same file, this line currently reads:

```css
  --font-display:
    -apple-system, BlinkMacSystemFont, 'Segoe UI Variable', 'Segoe UI',
    system-ui, sans-serif;
```

Change it to:

```css
  --font-display:
    'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI Variable',
    'Segoe UI', system-ui, sans-serif;
```

Do not change `--font-body: var(--font-display);` or `--font-mono` — both stay exactly as they are.

- [ ] **Step 4: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors, and the build output includes the two `.woff2` files as hashed assets (look for `dm-sans-latin` and `dm-sans-latin-ext` filenames in the build log's asset list — confirms Vite resolved the `url()` references in the CSS correctly).

- [ ] **Step 5: Manual smoke check**

Run: `cd mobile && npm run dev`, open the app, and check a few screens (Today, Speak, Settings):
- Open your browser's dev tools Network tab, reload, and confirm `dm-sans-latin.woff2` (and/or `dm-sans-latin-ext.woff2`) loads with a 200 status — confirms the font is actually being fetched, not silently failing.
- Confirm English text (button labels, headings) visibly renders in DM Sans's geometric style, not the previous system font.
- Confirm Vietnamese text (e.g. Settings' hint copy, or Speak's Vietnamese transcript if you have an API key configured) still renders correctly and legibly — it will look like the system font, not DM Sans, which is expected per the Global Constraints.

Report the result of this manual check in the task report — this task has no automated test for the visual change.

- [ ] **Step 6: Commit**

```bash
cd mobile
git add src/styles/fonts/dm-sans-latin.woff2 src/styles/fonts/dm-sans-latin-ext.woff2 src/styles/tokens.css
git commit -m "feat(mobile): self-host DM Sans as the app's display/body typeface"
```
