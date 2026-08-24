# Unified Master Brand Kit & Mobile Design System

**Status:** Canonical Ecosystem Standard v2.0  
**Target Environments:** Mobile (iOS / Android / PWA), Web Workbench & Embedded Tools  
**Design Reference:** Rivyn Product Standard + Shopify Messaging & Polaris Ergonomics + Onmee Identity  

---

## 1. Core Philosophy & Product Character

1. **Operational Calm & Clarity First**: State, clarity, and next-action readiness supersede decorative flourishes.
2. **Zero Raw Emoji Policy**: Absolute rule across all user-facing code, components, briefings, and agent responses. 100% SVG vector line iconography.
3. **No Fluff / Mobile Brevity**: Responses and briefings are dense, structured (bullet points, markdown tables, code blocks), and direct.
4. **Muted by Default Audio Ergonomics**: Sound output is muted by default upon opening. The user explicitly toggles speech or voice mode when ready.
5. **Fluid Dual-Mode Input (Voice + Text)**: Instant zero-friction switching between hands-free voice interaction and a collapsible, discreet text input bar.

---

## 2. Brand Hierarchy & Ecosystem Roles

| Brand Entity | Role in Ecosystem | Visual Signature |
| :--- | :--- | :--- |
| **Daily Mastery** | Core Learning & Growth System | Deep Slate `#111827`, Amber Gold `#b98900` |
| **Alex AI** | Autonomous Personal Co-pilot & Agent | Electric Indigo `#3d4ee8` + Ember Signal `#ea580c` |
| **Rivyn** | Workflow, Scenarios & Tool Automation | Restrained Ember `#ea580c`, Crisp Line Borders |
| **Onmee** | Parent Technology Foundation | Subtle endorsement mark: `by Onmee` |

---

## 3. Design Tokens & Color Palette

### 3.1 Color Roles (CSS Variables)

```css
:root {
  /* Surfaces & Canvas */
  --color-paper: #f6f6f9;            /* Base canvas */
  --color-paper-2: #ffffff;          /* Raised card surfaces */
  --color-paper-3: #f0f1f5;          /* Inset surfaces, pills & chips */
  --color-paper-dark: #0f172a;       /* High-contrast dark surfaces */

  /* Inks & Text */
  --color-ink: #111827;              /* Primary text (near-black) */
  --color-ink-2: #4b5563;            /* Secondary body text */
  --color-ink-3: #9ca3af;            /* Metadata, placeholders, caption */
  --color-ink-inverse: #f9fafb;      /* Text on dark surfaces */

  /* Borders & Hairlines */
  --color-border: rgba(0, 0, 0, 0.08);
  --color-hairline: rgba(0, 0, 0, 0.06);
  --color-border-strong: rgba(0, 0, 0, 0.16);

  /* Brand Accents */
  --color-accent: #3d4ee8;           /* Primary Action / Alex AI Brand */
  --color-accent-deep: #2f3ec4;      /* Pressed / Active accent */
  --color-on-accent: #ffffff;        /* High-contrast text on accent */
  --color-ember: #ea580c;            /* Onmee / Rivyn Ember Signal */
  --color-ember-tint: rgba(234, 88, 12, 0.08);

  /* Semantic State Colors (Always paired with text/icon) */
  --color-success: #008060;          /* Polaris Emerald */
  --color-success-tint: rgba(0, 128, 96, 0.08);
  --color-warning: #b98900;          /* Amber */
  --color-warning-tint: rgba(185, 137, 0, 0.08);
  --color-danger: #d72c0d;           /* Critical Red */
  --color-danger-tint: #fdeee9;
  --color-info: #2563eb;             /* Technical Blue */

  /* Geometry & Radii */
  --radius-card: 16px;               /* Standard card */
  --radius-input: 12px;              /* Controls & inputs */
  --radius-pill: 9999px;             /* Chips & badges */
  --radius-sm: 8px;                  /* Compact controls */

  /* Elevation Shadows */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.05), 0 6px 16px -4px rgba(0, 0, 0, 0.04);
  --shadow-glow: 0 6px 20px -4px rgba(61, 78, 232, 0.28);
  --shadow-popover: 0 10px 30px rgba(0, 0, 0, 0.12);
}
```

---

## 4. Typography Scale

Use **Inter Variable** (with fallback to system sans-serif `SF Pro Display`, `Roboto`).

| Role | Font Size | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display Title** | 20px / 1.25rem | 26px | 700 (Bold) | Screen headers, Alex greeting |
| **Section Title** | 16px / 1.00rem | 22px | 650 (Semi-bold) | Briefing pillar headers, card titles |
| **Component Title** | 14px / 0.875rem | 20px | 600 (Medium-bold)| Action cards, tool headers |
| **Body & Dialogue** | 13px / 0.8125rem| 19px | 450 (Regular) | Agent messages, briefings, inputs |
| **Supporting Label**| 12px / 0.75rem | 16px | 550 (Medium) | Timestamps, tags, status badges |
| **Dense Metadata** | 11px / 0.6875rem| 14px | 500 (Medium) | Token metrics, telemetry, latency |

---

## 5. Mobile Interaction & Component Standards

### 5.1 First-Screen "Talk with Alex" Voice Stage

```text
┌─────────────────────────────────────────────────────────────┐
│  [Lv.12 · 4,520 XP]      ALEX AI CO-PILOT       [🔊 Sound]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌──────────────────┐                     │
│                    │    ( ( 🎙️ ) )    │                     │
│                    │   Tap to Talk    │                     │
│                    └──────────────────┘                     │
│               "Ready to plan your day, Robert"              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ⚡ DAILY EXECUTIVE BRIEFING (Work · Mastery · Life · Market)│
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 💼 Work: 2 PRs to review · Complete Agent Core Engine │ │
│  │ 🎯 Mastery: Day 42 Streak · Today: Scalability English │ │
│  │ 📈 Market: BTC +3.2% · S&P 500 steady · AI Hardware Up │ │
│  └────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  [⌨️ Type Message...]  [▶ Today Plan]  [📊 Market]  [🇬🇧 Speak]│
└─────────────────────────────────────────────────────────────┘
```

1. **Audio State Control**:
   - **Muted (Default)**: Visual indicator with line-crossed speaker icon. No TTS plays automatically.
   - **Unmuted / Speaker Active**: Speaker waves active. Alex plays voice synthesis upon receiving turn responses.
2. **Microphone / Voice States**:
   - `idle`: Indigo outline, subtle whisper shadow.
   - `recording`: Crimson pulsing halo, soundwave vector animation.
   - `synthesizing / processing`: Spinning conic border indicator.
   - `speaking`: Rhythmic soundwave amplitude bars.
3. **Show/Hide Text Input**:
   - In collapsed state: Discreet bar with `[Type message...]` placeholder and quick action chips (`Lập kế hoạch`, `Báo cáo thị trường`, `Review PRs`, `Luyện nói`).
   - In expanded state: Full input bar with auto-expanding textarea, Voice/Send switch, and instant dismiss button.

---

## 6. Iconography Rules

- All icons are rendered via `<SvgIcon name="..." />` using standard 24x24 vector paths with `2px` stroke-width.
- Never use emojis (`🔥`, `🚀`, `🤖`, `✨`) in user-facing UI labels or headers.
- Approved SVG Icon Mapping:
  - Spark / AI: `spark`
  - Voice / Audio: `voice`, `volume-2`, `volume-x`, `mic`
  - Code / DevOps: `code`, `git-branch`, `terminal`
  - Market / Analytics: `chart`, `trending-up`, `dollar`
  - Checklist / Tasks: `check-square`, `clock`, `calendar`
  - Settings: `gear`, `sliders`

---

## 7. Motion & Accessibility Standard

- **Transitions**: Snappy and deterministic.
  - Button active: `100ms ease-out`
  - Input expand/collapse: `180ms cubic-bezier(0.16, 1, 0.3, 1)`
  - Sheet/Drawer entrance: `220ms ease-out`
  - Reduced Motion: Immediate state swap without layout animation.
- **Accessibility (WCAG 2.2 AA)**:
  - Touch targets: Minimum 44px x 44px hit-box.
  - High contrast: Inks meet minimum 4.5:1 contrast against surface background.
  - Focus rings: 2px solid `--color-accent` with 2px offset on keyboard navigation.
  - Screen Reader: Explicit `aria-label` and `aria-live="polite"` for live speech transcriptions and agent streaming tokens.
