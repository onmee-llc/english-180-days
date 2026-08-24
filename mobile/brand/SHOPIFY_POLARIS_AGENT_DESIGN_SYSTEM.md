# Shopify Messaging / Polaris Design System & Brandkit for AI Agents

A unified, reusable design system and brand toolkit meticulously audited from **Shopify Messaging (Shopify Inbox & Sidekick)**, **Shopify Admin (`admin.shopify.com`)**, and the **Shopify Polaris Design System**.

---

## 1. Core Principles & User Profile

1. **User Identity — Robert**:
   - The AI Assistant is named **Alex**, and always addresses the user as **Robert**.
   - Robert is a high-performing engineer and creator building mastery across AI engineering, systems design, financial strategy, and technical communication.
2. **Mobile-First UX — Icons Over Verbose Text**:
   - On mobile screens, screen space is premium. Verbose explanatory paragraphs are replaced with **explicit, standardized SVG icons**, concise tooltips, and compact action chips.
   - Zero raw emojis: Every visual element uses coherent SVG vector paths with semantic theme attribution.
3. **Polaris Visual Language (Exact Shopify Admin Tone)**:
   - **Canvas Background:** `#f1f1f1` (Polaris light neutral canvas).
   - **Cards & Surfaces:** `#ffffff` with a crisp 1px border (`#e1e3e5` subdued, `#d2d5d8` standard) and 1px layered box-shadow (`0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px 0 rgba(63, 63, 68, 0.1)`).
   - **Primary Action Fill:** Polaris Charcoal `#1a1a1a` for primary buttons; Shopify Green `#008060` for positive states, completion badges, and active connectivity; Polaris Blue `#2c6ecb` for interactive links.
   - **Radii:** `8px` for buttons, inputs, and chips; `12px` for cards; `16px` for modals and sheets; `9999px` for pill badges.
4. **Action-Oriented Messaging & Telemetry**:
   - Real-time token streaming with live telemetry (`[bolt] 110 tok/s`), collapsible *Thinking & Tool Execution* trace accordion, interactive Task Checklists, and Code Sandboxes with 1-click execution.

---

## 2. Color Palette & Semantic Tokens

| Variable | Hex / CSS Value | Role in Shopify Messaging Apps |
| :--- | :--- | :--- |
| `--p-surface-bg` | `#f1f1f1` | Neutral background canvas |
| `--p-surface-card` | `#ffffff` | Elevated message card surface |
| `--p-surface-subdued` | `#f7f7f8` | Inset items, secondary list rows |
| `--p-surface-hover` | `#f1f2f3` | Interactive hover background |
| `--p-color-primary` | `#1a1a1a` | Charcoal solid button & primary action |
| `--p-color-success` | `#008060` | Official Shopify Green for active status & badges |
| `--p-color-warning` | `#b98900` | Warm amber for in-progress tasks |
| `--p-color-critical` | `#d72c0d` | Polaris Red for destructive actions |
| `--p-color-accent` | `#2c6ecb` | Polaris interactive link & waveform blue |
| `--p-border-subdued`| `#e1e3e5` | 1px subtle divider lines |
| `--p-border-default`| `#d2d5d8` | 1px standard card & input borders |

---

## 3. Typography & Compact Hierarchy

- **Font Family:** `-apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif`
- **Monospaced:** `ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace`
- **Dense Typography Scale:**
  - `Page Title:` `20px` (`1.25rem`), font-weight `600`, letter-spacing `-0.01em`
  - `Subheading / Section:` `14px` (`0.875rem`), font-weight `600`
  - `Polaris Standard Body:` `13px` (`0.8125rem`), font-weight `400`, line-height `1.5`
  - `Caption / Metadata:` `12px` (`0.75rem`), color `#5c5f62`
  - `Telemetry Badge:` `11px` (`0.6875rem`), font-weight `600`, font-family monospaced

---

## 4. Reusable Vector Icon Library (`SvgIcon.vue`)

Standardized vector symbols available in `mobile/src/components/base/SvgIcon.vue`:
- `spark` (Alex AI emblem)
- `code` (Engineering Co-pilot / Sandbox)
- `voice` (English Coach / Voice recording)
- `chart` (Strategy & Metrics)
- `inbox` (Quick thought capture)
- `bolt` (Real-time stream / Telemetry)
- `gear` (Concurrent background engine)
- `task-check` (Interactive task checkbox)
- `play` / `stop` (Audio playback & streaming control)
- `flame` / `star` (Streak & XP rewards)
- `inspector` / `menu` / `trash` / `search` / `close`

---

## 5. Reusability Guide for Future Shopify Apps

1. **CSS Layer:** Import `mobile/src/styles/agent-polaris.css`.
2. **Icon Layer:** Drop in `mobile/src/components/base/SvgIcon.vue`.
3. **Core Engine:** Reuse `mobile/src/agent-core/` (`LLMClient.js`, `ConcurrentTaskEngine.js`, `ToolRegistry.js`, `MemoryStore.js`).
4. **UI Components:** Embed `AgentWorkspaceView.vue` as a standalone full-page workspace or inside a Shopify Admin Embedded App iframe.
