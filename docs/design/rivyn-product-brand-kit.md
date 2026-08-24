# Rivyn Product UI Standard and Brand Kit

Status: Reusable application standard v1.0  
Default language: English  
Canonical tokens: `../tokens.css`  
Portable exports: `../design.md`

## 1. Purpose

This standard defines the visual and interaction system used by Rivyn. It is designed for authenticated operational products: dashboards, workflow tools, connection managers, review queues, and configuration interfaces. It is not a marketing-site system.

The system combines Onmee's restrained ember accent with the compact density and clear operational hierarchy studied in Shopify Messaging. It does not copy Shopify branding, illustrations, or product copy.

## 2. Product character

- Calm, compact, and explicit.
- Operational state is more important than decoration.
- One clear primary action per page or dialog.
- Plain English labels; no invented product jargon when a standard term exists.
- No emoji, sparkle motifs, assistant personas, generated-looking gradients, decorative glows, or synthetic claims.
- Use real data, status, and workflow structure as the visual material.

## 3. Brand hierarchy

- Product name: `Rivyn`.
- Endorsement: `by Onmee`, visually secondary.
- Primary brand signal: ember orange, used selectively for focus, active navigation, and high-value actions.
- Primary buttons in dense operational screens may use near-black for stronger contrast and calmer repetition.
- Provider colors and logos are identifiers only. They must not become page backgrounds or decorative color bands.

## 4. Typography

Inter Variable is the only product UI family. Load it locally and use system sans-serif fallbacks.

| Role | Size | Line height | Weight |
| --- | ---: | ---: | ---: |
| Page title | 18 px | 24 px | 600 |
| Section title | 16 px | 24 px | 600 |
| Component title | 13 px | 20 px | 600 |
| Body and controls | 13 px | 20 px | 450 |
| Supporting label | 12 px | 16 px | 550 |
| Dense metadata | 11 px | 16 px | 450–550 |

Rules:

- Use sentence case for all labels and headings.
- Do not use uppercase section labels as a visual shortcut.
- Keep prose between 45 and 75 characters per line.
- Use tabular numbers for counts, durations, timestamps, and quotas.
- Do not add a display typeface inside the authenticated product shell.

## 5. Color roles

Use token roles, never raw color values in components.

| Role | Use |
| --- | --- |
| `paper` | Application background |
| `paper-2` | Quiet grouped surfaces |
| `surface` | Tables, panels, dialogs, controls |
| `ink` | Primary text and high-contrast buttons |
| `ink-soft` | Secondary operational text |
| `muted` | Metadata and helper text |
| `rule` | Borders and separators |
| `accent` | Onmee brand signal and focus support |
| `success`, `warning`, `danger`, `info` | Semantic state only |

Every semantic color must be paired with a text label or icon. Color alone never communicates connection health, validation, run state, or errors.

## 6. Geometry and density

- Base unit: 4 px. The 2 px token exists only for optical corrections.
- Fine-pointer control height: 28 px.
- Coarse-pointer hit target: at least 44 px.
- Control radius: 8 px.
- Panel and popover radius: 12 px.
- Dialog radius: 16 px.
- Top bar: 56 px.
- Desktop sidebar: 240 px.
- Borders remain 1 px in every state; focus uses an outline and never changes geometry.
- Shadows are quiet separation tools. Use `shadow-whisper` for surfaces and `shadow-popover` for overlays.

## 7. Application shell

The default desktop shell contains:

1. A compact dark top bar with product, workspace, environment, and account context.
2. A labelled left navigation rail.
3. A left-biased content region without a marketing container width.
4. No footer inside the authenticated shell.

Below 60 rem, navigation becomes a labelled sheet. The page remains usable from 320 px without horizontal scrolling.

## 8. Component standards

### Buttons

- Primary: near-black or restrained ember, used once per decision surface.
- Secondary: neutral fill with the same height and radius.
- Destructive: quiet surface with danger text until confirmation is required.
- Icon-only buttons require an accessible name and tooltip.
- Labels never wrap.

### Inputs

- Visible label above the field.
- Helper or error text below with a stable one-line minimum height.
- Validate after blur, then revalidate on change.
- Reserve space for status or reveal controls.
- Default, hover, focus, disabled, loading, error, and success retain the same border width.

### Tables and lists

- Use tables when users compare repeated fields.
- Table headers are 12 px; rows use 13 px.
- Collapse into labelled records on narrow screens.
- Status, destination, last run, and repair actions stay visible without opening a detail page.

### Dialogs and popovers

- Use a full-screen native dialog for a multi-step workbench.
- Use a centred bounded dialog for authorization or destructive confirmation.
- Escape closes only the topmost surface.
- First focus enters the first meaningful field.
- Backdrop click may close non-destructive setup dialogs without changing the draft.

### Status

- Use `Configured`, `Connection required`, `Healthy`, `Reconnect`, `Ready to test`, and `Not ready to test` as explicit operational language.
- Never claim a provider is connected from fixture data.
- A successful visible update is silent; errors receive an actionable message.

## 9. Workflow editor pattern

- Webhook is the fixed first module.
- Publishing modules are ordered vertically so the flow remains usable on mobile.
- The centre column shows sequence and readiness.
- The right inspector shows the selected module's connection and mapping fields.
- Adding a provider module never implies authorization. It begins in `Connection required`.
- Destination fields remain disabled until an authenticated provider account supplies real options.
- Testing is blocked until every publishing module has a healthy connection and all required scopes.

## 10. Motion

Allowed primitives:

- Button press: 100 ms.
- Popover or sheet entry: 180–280 ms with `ease-out`.
- State changes that need no spatial explanation: instant.

Do not use page reveals, card lifts, animated gradients, parallax, cursor effects, bouncing easings, or `transition-all`. Reduced motion removes spatial transitions and keeps functional feedback at or below 150 ms.

## 11. Accessibility and responsive checks

- WCAG 2.2 AA target.
- Visible 2 px focus ring with 2 px offset.
- Keyboard support for every interactive path.
- No hover-only behavior.
- No horizontal overflow at 320, 360, 375, 414, 768, and 1440 px.
- Clickable labels stay on one line; the parent layout reflows instead.
- Dialogs remain entirely inside the viewport and body content scrolls internally.
- Automated Axe checks are required, followed by keyboard and visual review.

## 12. Copy rules

- Use verbs for actions: `Create scenario`, `Connect Pinterest`, `Save draft`.
- State the cause and next action: `Connection required. Authorize an account before testing.`
- Avoid vague labels such as `Continue`, `Submit`, or `Something went wrong` when a specific label is possible.
- Avoid celebratory or anthropomorphic language.
- Default UI, code comments, tests, logs, and product documentation are English.

## 13. Reuse checklist

When starting another Onmee application:

1. Copy `tokens.css` or one export from `design.md`.
2. Use the shell, typography, spacing, state, and responsive contracts unchanged.
3. Define product-specific information architecture before adding components.
4. Keep provider or domain colors inside identifier marks.
5. Add new tokens by semantic role only; do not create page-specific raw values.
6. Add traceable test cases before implementation.
7. Run source, unit, browser, accessibility, responsive, and production-safety checks.
