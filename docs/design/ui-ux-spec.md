# Rivyn Scenarios — UI/UX Specification

Status: Design contract v1.0  
Product language: English  
Working tone: technical and utilitarian

## 1. Design principles

### Outcome before mechanism

Use task language such as “Publish a Reel” and “Create a Pin.” Do not expose engine terms such as bundle, iterator, aggregator, module operation, or execution directive in primary flows.

### Webhook-first by default

The ordered workflow builder is the primary experience. Every draft starts with a secured webhook and then accepts destination modules in execution order. The first release does not expose a free-position graph, branching, arbitrary code, or Make-specific engine vocabulary.

### Operational clarity

States must be named directly. Prefer “Reconnect Instagram” over “Resolve connection issue.” Prefer “Video is longer than the allowed duration” over “Invalid media.”

### Restrained visual language

- No emoji.
- No emoji-like glyphs used as controls.
- No sparkle, robot, neural, magic-wand, assistant-avatar, chat-bubble, gradient-mesh, or decorative AI motifs.
- No copy such as “magic,” “copilot,” “AI-powered,” “let Rivyn think,” or synthetic assistant speech.
- Use a professional line-icon set when an icon improves scanning. Every icon-only control requires an accessible name and tooltip unless the meaning is universally established.
- Use the Onmee wordmark without an AI-themed mark inside the application shell.

## 2. Visual foundation

The application inherits Onmee's brand identity, not the marketing site's page composition.

- Product UI and wordmark: Inter variable, weights 450, 550, 600, and 650. This single-family choice is an intentional match to the requested Shopify Messaging application reference.
- Product h1: 18 px with 24 px leading. Application body: 13 px with 20 px leading. Table labels: 12 px. Coarse-pointer targets remain at least 44 px.
- Background: warm-white paper.
- Primary ink: near-black cool neutral.
- Primary controls use near-black ink. Onmee ember orange remains a restrained brand and focus signal.
- Success, warning, and danger colors are semantic and do not replace the primary signal.
- Borders are functional boundaries, not decoration.
- Controls use an 8 px radius, panels and popovers use 12 px, and dialogs use 16 px. Status badges may be pill-shaped; ordinary buttons do not.
- Motion is brief and functional, never bouncing, glowing, typing, or continuously pulsing.

Application tokens will be exported in `app/tokens.css` before component styling. The existing marketing tokens are a brand reference only and remain unchanged.

The measured reference inventory and the distinction between observed Shopify values and Rivyn adaptations are documented in `shopify-messaging-ui-audit.md`.

## 3. Application shell

Desktop layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ Onmee / Rivyn        Workspace             Help   User menu │
├──────────────┬──────────────────────────────────────────────┤
│ Scenarios    │ Page title                      Primary task │
│ Connections  │ Context / filters                            │
│              │ Main content                                 │
└──────────────┴──────────────────────────────────────────────┘
```

- The left navigation is stable and text-led.
- The top bar contains workspace context and account controls only.
- One primary action appears per page header.
- Breadcrumbs appear only below the top-level route.
- Marketing navigation, blog links, and the public-site floating pill navigation do not appear in the authenticated application.

Tablet collapses the sidebar to an icon-and-label drawer. Mobile uses a top bar with a labelled menu trigger and a full-height navigation sheet. Core Scenario creation remains usable at 360 px.

## 4. Information architecture

### Scenarios

- List and filter
- Create a webhook-first draft
- Add ordered publishing modules
- Configure webhook security and field mapping
- Save and test a draft

### Connections

- Provider list
- Connection details
- Connect/reconnect/revoke

Additional routes are deferred until their operational flows are implemented. The shell does not show inactive placeholder navigation.

## 5. Scenario list

Header: title, one-line explanation, `Create scenario` primary button.

Toolbar: search, status filter, destination filter. Filters use visible labels and update the result count.

Each row shows:

- Scenario name
- Status badge
- Trigger label
- Destination names using provider wordmarks or restrained line icons
- Last run state and relative time with exact-time tooltip
- Next run or `Webhook`/`Manual`
- Connection warning when present
- Row action menu

Empty states explain the next task and contain one action. They do not use illustrations, generated mascots, or decorative symbols.

## 6. Scenario builder

The full-screen builder has three stable regions on desktop:

- Scenario outline: module count, workflow section, webhook API shortcut, and validation summary.
- Ordered workflow: fixed webhook trigger, publishing modules, `Add module`, and readiness state.
- Module inspector: endpoint/security fields for the webhook or connection/content fields for a publishing module.

The webhook is created automatically and cannot be removed or reordered. `Add module` exposes only Pinterest, Facebook Pages, and Instagram. Choosing a provider exposes only supported create actions such as Create a Pin, Create a Post, Create a Photo Post, Create a Reel, and Create a Carousel.

The editor uses task labels rather than operation identifiers. Every publishing module begins in `Connection required`. A Scenario becomes ready to test only after at least one publishing module exists and every publishing module has a healthy connection with all required scopes. Testing does not activate the Scenario.

### Provider connection inspector

- Connection state is shown before mapping fields.
- `Connect Pinterest`, `Connect Facebook Pages`, and `Connect Instagram` open a focused authorization review.
- The review names the Authorization Code method, account requirement, requested scopes, registered callback URL, and server-side token controls.
- The local fixture disables provider redirect and explains the missing backend and app credential configuration.
- Destination selectors remain disabled until provider account discovery succeeds.
- Escape closes authorization review without closing the builder or removing the module.
- Pinterest fields follow the audited Create a Pin configuration: media URL, board, Pin name, description, link, and alternative text.
- Facebook fields follow the audited Create a Post configuration: Page, caption, link, and optional publish date. Rivyn does not submit editable link metadata without verified domain ownership.

### Webhook security inspector

- Endpoint is masked by default and accepts POST over TLS only.
- Authentication defaults to HMAC SHA-256.
- Signature header and timestamp header are explicit.
- Replay window, payload limit, and requests-per-minute limits are visible.
- IP allowlist is optional and accepts CIDR ranges.
- Copy explains that Rivyn signs the exact body and timestamp, rejects expired requests, deduplicates accepted events, and never logs the signing secret.

### Responsive builder

- At 768 px the Scenario outline is removed and the ordered workflow remains beside the inspector.
- At 414 px and below the workflow and inspector stack vertically.
- Publishing modules stay ordered and selectable without drag as a requirement.
- No horizontal canvas or gesture-only interaction is required.

## 7. Run timeline

Summary header shows result, Scenario version, trigger time, duration, and test/production label.

Timeline items show:

- Step name and destination
- State and timestamps
- Attempt count
- Redacted input
- Normalized output
- Provider request identifier
- Failure explanation
- One explicit recovery action when applicable

Partial success is represented as its own state. It must not be collapsed into either success or failure.

## 8. Connections

Provider cards show provider name, connected account, granted scopes, health, last check, and relevant action. OAuth tokens are never rendered.

Connect buttons use provider names: `Connect Facebook Pages`, `Connect Instagram`, `Connect Pinterest`. Success returns to a confirmation screen that names the actual connected account and granted permissions.

Revocation is a destructive action. Show affected active Scenarios before confirmation. The confirmation action uses direct copy: `Revoke connection`.

## 9. Content and error copy

- Sentence case for headings and controls.
- Verbs lead actions: `Create scenario`, `Run test`, `Reconnect Instagram`.
- Avoid exclamation marks in operational UI.
- Avoid anthropomorphism and generated-sounding filler.
- Do not claim publication until the provider returns a confirmed publish identifier or a documented terminal state.
- Distinguish `Accepted by provider`, `Published`, `Scheduled`, and `Confirmation unavailable`.

Error structure:

1. What happened.
2. What was affected.
3. What the user can do next.
4. Technical detail behind a disclosure for operators.

## 10. Component state contract

Every interactive component documents and implements applicable states:

- Rest
- Hover
- Focus-visible
- Active/pressed
- Disabled
- Loading
- Error
- Success

Loading states preserve layout. Buttons retain their label with a progress indicator from the icon system; they never replace text with an animated decorative glyph. Errors remain near the related field and are announced by an accessible live region.

## 11. Accessibility

- WCAG 2.2 AA target.
- Logical heading hierarchy and landmarks.
- Skip link to main content.
- Visible focus on every interactive item.
- Minimum 44 by 44 CSS pixel pointer target where practical; never below 24 by 24.
- Form labels remain visible; placeholders do not replace labels.
- Errors are linked with `aria-describedby` and summarized after submission.
- Status is never communicated by color alone.
- Tables use semantic headers and a responsive alternative where horizontal comparison is essential.
- Dialog focus is trapped and restored.
- The Add module popover closes on Escape before the parent builder can close, and the draft remains unchanged.
- Reduced motion and increased contrast preferences are respected.

## 12. Responsive behavior

- 320–767 px: navigation sheet, compact list records, and stacked workflow/inspector.
- 768–959 px: collapsible navigation and two-column workflow/inspector.
- 960 px and above: persistent navigation and three-region workbench where space permits.
- No fixed canvas minimum width on mobile.

## 13. UX acceptance criteria

- A user can create a secured webhook-to-Instagram workflow without leaving the builder.
- Every new Scenario contains the webhook module at position one.
- The module picker contains only Pinterest, Facebook Pages, and Instagram in this release.
- Webhook security values are masked by default and testing never activates a Scenario.
- Every visible product string in the initial UI is English.
- Automated checks find no emoji code points in user-facing source files.
- Automated checks find no prohibited AI-style copy from the maintained vocabulary list.
- All primary flows pass keyboard-only and screen-reader naming checks.
- Empty, loading, partial, failure, and permission-repair states are implemented, not represented only in design documentation.
