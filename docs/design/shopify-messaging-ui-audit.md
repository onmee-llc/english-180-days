# Shopify Messaging UI audit for Rivyn

Status: Applied reference study v1  
Inspection date: 23 August 2026  
Source: Authenticated Shopify Admin route and its embedded Shopify Messaging application  
Method: Read-only DOM, stylesheet, accessibility-role, and computed-style inspection

## Scope and safety

The inspection covered visual primitives and non-mutating popover behavior. No automation, message, app installation, review, account setting, or Shopify store configuration was created or changed. Rivyn does not include Shopify code or Shopify branding; it adapts the measured density and interaction principles to Rivyn's existing information architecture.

## Toolkit inventory

The embedded application is built on three visible layers:

1. Shopify Polaris classes and tokens, including `Polaris-Text`, `Polaris-Box`, layout primitives, button primitives, and theme-provider tokens.
2. Shopify internal analytics components under the `Analytics-UI-Components-*` namespace for filters, option lists, popovers, metrics, and table controls.
3. Product-specific CSS Modules for Messaging cards, automation templates, mobile-friendly modal behavior, action menus, and related surfaces.

The inspected page was not a Tailwind, shadcn, or Material UI implementation. Rivyn continues using React, semantic HTML, native dialog behavior, and Lucide icons; adopting Polaris itself would add a large Shopify-specific dependency without improving the requested workflow.

## Measured visual system

| Element | Observed Shopify value | Rivyn adaptation |
| --- | --- | --- |
| Font family | Inter, Noto Sans fallbacks, system fallbacks | Self-hosted Inter variable with Noto Sans and system fallbacks |
| Body | 13 px, weight 450, 20 px leading | Same |
| Page heading | 18 px, weight 600, 24 px leading | Same |
| Table heading | 12 px, weight 550, 20 px leading | Same size and weight |
| Promo heading | 13 px, weight 600, 20 px leading | Used for compact section headings |
| Primary control | 28 px high, 13 px label, 8 px radius, dark surface | Same fine-pointer geometry; 44 px minimum on coarse pointers |
| Secondary control | 28 px high, neutral gray surface, 8 px radius | Same geometry and neutral hierarchy |
| Active tab | 28 px high, 4 px by 12 px padding, 8 px radius, neutral selected surface | Same pill-like selected treatment without decorative underline |
| Page background | `#f1f1f1` | Warm-tinted OKLCH equivalent |
| Primary text | `#303030` | Warm-tinted OKLCH equivalent |
| Muted text | `#616161` | Warm-tinted OKLCH equivalent |
| Secondary surface | `#f7f7f7` | Warm-tinted OKLCH equivalent |
| Rule | `#cccccc` | Warm-tinted OKLCH equivalent |
| Card | White surface, 16 px padding, 12 px radius, hairline multi-layer elevation | Tinted surface, 12 px radius, restrained elevation |
| Popover | 530 px observed date picker, 12 px radius, layered shadow, z-index 513 | Responsive width, 12 px radius, named overlay layer |
| Table header row | About 36.5 px high | 36.5 px |
| Table body row | 53 px high | 53 px |
| Desktop side navigation | 240 px wide | 240 px |
| Top application bar | Dark, approximately 56 px high | 56 px |

## Spacing and shape tokens

The reference exposes a dense four-point rhythm with 2, 4, 6, 8, 12, 16, 24, 28, 40, 64, and 96 px steps. Control radius is 8 px, panel and popover radius is 12 px, and dialog radius is 16 px. Rivyn retains these values as named tokens instead of scattering raw values through components.

## Interaction findings

- Filter and option controls open anchored popovers instead of navigating away.
- The inspected date popover closes with Escape and leaves the current filter unchanged.
- Focus, hover, pressed, disabled, error, and success states retain control geometry.
- Density does not reduce touch accessibility: Rivyn expands the same visible controls to 44 px targets when the primary pointer is coarse.
- Tables favor scan speed: restrained color, compact rows, tabular numbers, and no decorative card grid.

## Applied Rivyn decisions

- Replaced the web-oriented Geist and Newsreader pairing with a deliberate application-only Inter system.
- Changed primary controls to near-black, leaving Onmee ember for focus, webhook identity, and small brand signals.
- Added the dark top bar, 240 px navigation rail, neutral page surface, compact controls, selected tabs, panel elevation, table density, and popover geometry.
- Preserved Rivyn's webhook-first ordered builder and did not copy Shopify Messaging information architecture.
- Added Escape dismissal and focus entry for the Add module popover without dismissing the parent Scenario builder.

## Functional parity statement

The current Rivyn frontend proves the webhook-first draft flow, supported provider/action picker, module ordering, security-field presentation, local draft state, and local webhook-listening state. It does not yet prove Make.com-equivalent production execution. OAuth, durable API persistence, real webhook ingestion, signature verification at the deployed edge, provider publishing, run retries, and activation remain backend integration milestones.
