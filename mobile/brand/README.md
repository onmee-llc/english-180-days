# Daily Mastery — brand kit

DNA lifted from awenvia.com's actual CSS (not guessed — see values below), not applied to the
shipped app UI yet (that's still the Hum theme from the earlier design pass). This is the
reference for the next re-skin, plus the app icon, which *is* live now.

## Tokens

```css
--brand-ink:        #15112b; /* near-black indigo, headings/body */
--brand-primary:     #3d4ee8; /* indigo-violet, primary actions */
--brand-primary-deep:#3240be;
--brand-accent:      #2dd4a7; /* mint/teal, secondary accent */
--brand-warm:        #f4b860; /* gold, sparing use */
--brand-alert:       #b42348;
--brand-alert-tint:  #fff0f3;
--brand-paper:       #fff;
--brand-paper-2:     #f6f5fb; /* lavender-white, default bg */
--brand-paper-3:     #f0eefa;
--brand-mint-tint:   #e8faf5;
--brand-ink-2:       #4e4869; /* muted secondary text */

--brand-font-body: 'DM Sans', -apple-system, sans-serif;
--brand-font-mono: 'DM Mono', ui-monospace, monospace;

--brand-radius-pill: 999px;   /* buttons */
--brand-radius-card: 8px 10px 22px 24px; /* small→large card scale, pick nearest */

--brand-shadow-soft: 0 1px 2px #15112b0d, 0 8px 28px #15112b0a;
--brand-shadow-glow: 0 8px 24px #3d4ee82e; /* on primary buttons only */
```

Type scale: light body (300–400), medium labels (500), bold headings (600–700).
Headings: tight tracking (-0.02em to -0.035em). Uppercase eyebrow labels: wide tracking
(0.12–0.16em) — same pattern the current Hum theme already uses for eyebrows, so that part
carries over free.

DM Sans / DM Mono are free Google Fonts, not currently loaded — the app is offline-first
with no web-font pipeline (see `SpeakView.vue`'s own comment on why it uses system fonts
instead). Adding them means either bundling the `.woff2` files locally (no CDN call) or
accepting a network fetch on first load. Not done here — flagging the decision, not making it.

## Icon

Source: `icon.svg` (1024×1024, indigo `#3d4ee8` bg, 3 ascending white bars — progress/mastery
motif, legible at 48px). Generated into every iOS/Android size + splash screen via:

```bash
cd mobile
npx @capacitor/assets generate --android --iconBackgroundColor '#3d4ee8' --iconBackgroundColorDark '#3d4ee8' --splashBackgroundColor '#f6f5fb' --splashBackgroundColorDark '#f6f5fb'
npx @capacitor/assets generate --ios     --iconBackgroundColor '#3d4ee8' --iconBackgroundColorDark '#3d4ee8' --splashBackgroundColor '#f6f5fb' --splashBackgroundColorDark '#f6f5fb'
```

Re-run after any `npx cap add ios|android` (same reason as every other native asset in this
app — those folders are gitignored and regenerated from scratch). `icon.svg`/`splash.svg`
here are the only files worth hand-editing; `icon.png`/`splash.png` are just the raster
handoff to `@capacitor/assets` and regenerate with `magick icon.svg -resize 1024x1024 icon.png`
(same for splash.svg → splash.png at 2732×2732) if the source SVG changes.

## Applying this to the app UI

Not done. Skipped: re-skinning 5 already-reviewed screens on a one-line ask. If wanted, the
concrete next step is swapping the values in `mobile/src/styles/tokens.css` — same variable
names the Hum theme already established, so no template changes needed, only the values.
Say so and it's a small job; nothing here blocks it.
