# Speak + Settings Component Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hand-rolled button/badge/input markup in `SpeakView.vue` and `SettingsView.vue` with the shared `BaseButton`, `Badge`, `TextField`, and `Card` components, deleting the CSS they duplicated.

**Architecture:** Two independent, single-file tasks — `SpeakView.vue` (one button swap) and `SettingsView.vue` (button, badge list, and two form rows). Both consume `base/` components already built and tested in an earlier sub-project; neither task depends on the other.

**Tech Stack:** Vue 3 `<script setup>`, scoped SFC CSS, existing `mobile/src/styles/tokens.css` design tokens, existing `mobile/src/components/base/*` components.

## Global Constraints

- No behavior change beyond the ones explicitly called out per-task below.
- Do not modify `BaseButton.vue`, `TextField.vue`, `Card.vue`, or `Badge.vue` — all four already support everything this plan needs.
- Do not touch `SpeakView.vue`'s mic button, transcript display, result card, or history section.
- Do not touch `SettingsView.vue`'s profile grid layout (`.settings__profile`), avatar, or stats line — only the badges list inside it changes.
- Do not touch `CoursesView.vue` or `CalendarView.vue` — out of scope (see spec's Context section for why).
- No new test files — `BaseButton.vue`, `TextField.vue`, `Card.vue`, and `Badge.vue` already have their own tests covering the props this plan uses; this codebase has no dedicated test files for view-level components.
- The reminder-time field must keep its current `@change`-only write semantics (fires once, on commit) — not `v-model`'s `@input` (fires on every keystroke/wheel-tick), because `setTime()` writes to `Preferences` and reschedules a native local notification on every call.

---

### Task 1: Migrate `SpeakView.vue`'s "Try again" button to `BaseButton`

**Files:**
- Modify: `mobile/src/components/SpeakView.vue`

**Interfaces:**
- Consumes: `BaseButton` from `mobile/src/components/base/BaseButton.vue` — props `variant: String (default 'primary')` ('primary'|'outline'), `tone: String (default 'default')` ('default'|'coral'). Renders a native `<button type="button">` with default slot content.
- Produces: nothing consumed by Task 2 — the two tasks are independent.

- [ ] **Step 1: Add the `BaseButton` import**

In `mobile/src/components/SpeakView.vue`, the `<script setup>` block currently starts:

```vue
<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useSpeakSession} from '../composables/useSpeakSession.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Change it to:

```vue
<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useSpeakSession} from '../composables/useSpeakSession.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
```

- [ ] **Step 2: Replace the "Try again" button markup**

In the same file's template, this block currently reads:

```vue
        <button
          type="button"
          class="btn btn--outline btn--coral"
          @click="retry"
        >
          Try again
        </button>
```

Change it to:

```vue
        <BaseButton variant="outline" tone="coral" @click="retry">
          Try again
        </BaseButton>
```

- [ ] **Step 3: Delete the now-dead `.btn` CSS block**

In the same file's `<style scoped>` block, delete this entire block in full (it's the only place `.btn`/`.btn--outline`/`.btn--coral` are used in the file):

```css
/* ---------- buttons ---------- */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.7rem 1.3rem;
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}
.btn:active {
  transform: translateY(1px);
}
.btn:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.btn--outline {
  border: 1.5px solid currentColor;
  background: transparent;
}
.btn--coral {
  color: var(--color-accent-3-deep);
}
.btn--coral:hover {
  background: var(--color-accent-3);
  color: var(--color-ink);
}
```

Leave the blank line between the deleted block and the `/* ---------- history ---------- */` comment that follows it — don't leave a double blank line.

- [ ] **Step 4: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Manual smoke check**

Run: `cd mobile && npm run dev`, open the app, sign in, go to Speak, trigger an error state (e.g. hold-and-release the mic without an API key configured, or with an invalid one), and confirm the "Try again" button still renders in the coral outline style and calling it retries correctly.

Report the result of this manual check in the task report — this task has no automated test for the visual change.

- [ ] **Step 6: Commit**

```bash
cd mobile
git add src/components/SpeakView.vue
git commit -m "refactor(mobile): migrate SpeakView Try-again button to BaseButton"
```

---

### Task 2: Migrate `SettingsView.vue`'s button, badges, and inputs to shared components

**Files:**
- Modify: `mobile/src/components/SettingsView.vue`

**Interfaces:**
- Consumes:
  - `BaseButton` from `mobile/src/components/base/BaseButton.vue` (see Task 1's Interfaces block for its props).
  - `Badge` from `mobile/src/components/base/Badge.vue` — props `icon: String (required)`, `label: String (required)`, `earned: Boolean (default false)`. Root element is a `<li>`.
  - `TextField` from `mobile/src/components/base/TextField.vue` — props `modelValue: String`, `type: String (default 'text')`, `label: String (required)`, `id: String (required)`, `hint: String`, `error: String`, `success: String`; emits `update:modelValue`; forwards any other attrs (including event listeners like `@blur`/`@change`) to its inner `<input>` via `inheritAttrs: false` + `v-bind="$attrs"`.
  - `Card` from `mobile/src/components/base/Card.vue` — a plain `<div class="card"><slot /></div>` wrapper providing padding/radius/background.
- Produces: nothing consumed by Task 1 — the two tasks are independent.

- [ ] **Step 1: Add the four component imports**

In `mobile/src/components/SettingsView.vue`, the `<script setup>` block currently starts:

```vue
<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';
import {getBadges} from '../composables/useBadges.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
```

Change it to:

```vue
<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';
import {getBadges} from '../composables/useBadges.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';
import BaseButton from '../components/base/BaseButton.vue';
import Badge from '../components/base/Badge.vue';
import TextField from '../components/base/TextField.vue';
import Card from '../components/base/Card.vue';
```

- [ ] **Step 2: Add `handleReminderChange`**

In the same file, this function currently exists:

```js
async function handleApiKeyBlur() {
  if (apiKeyDraft.value.trim() === apiKey.value) return;
  apiKeyError.value = '';
  try {
    await setApiKey(apiKeyDraft.value.trim());
    apiKeySaved.value = true;
    setTimeout(() => (apiKeySaved.value = false), 2000);
  } catch (err) {
    apiKeyError.value = 'Could not save the key. Please try again.';
  }
}
```

Add a new function directly after it (before `handleSignOut`):

```js
async function handleApiKeyBlur() {
  if (apiKeyDraft.value.trim() === apiKey.value) return;
  apiKeyError.value = '';
  try {
    await setApiKey(apiKeyDraft.value.trim());
    apiKeySaved.value = true;
    setTimeout(() => (apiKeySaved.value = false), 2000);
  } catch (err) {
    apiKeyError.value = 'Could not save the key. Please try again.';
  }
}

function handleReminderChange(event) {
  setTime(event.target.value);
}
```

- [ ] **Step 3: Replace the profile row's badge list**

In the same file's template, this block currently reads:

```vue
      <ul class="settings__badges">
        <li
          v-for="badge in badges"
          :key="badge.id"
          class="settings__badge"
          :class="{'settings__badge--earned': badge.earned}"
          :title="badge.label"
        >
          <span aria-hidden="true">{{ badge.icon }}</span>
          <span class="settings__badge-label">{{ badge.label }}</span>
        </li>
      </ul>
```

Change it to:

```vue
      <ul class="settings__badges">
        <Badge
          v-for="badge in badges"
          :key="badge.id"
          :icon="badge.icon"
          :label="badge.label"
          :earned="badge.earned"
        />
      </ul>
```

- [ ] **Step 4: Wrap the profile row in `Card`**

Immediately above the block from Step 3, this line currently reads:

```vue
    <div v-if="user" class="settings__row settings__profile">
```

Change it to:

```vue
    <Card v-if="user" class="settings__row settings__profile">
```

And the matching closing tag, currently:

```vue
    </div>

    <div class="settings__row">
      <button
        type="button"
        class="settings__button settings__button--outline"
        @click="handleSignOut"
      >
        Sign out
      </button>
    </div>
```

Change it to:

```vue
    </Card>

    <Card class="settings__row">
      <BaseButton variant="outline" @click="handleSignOut">Sign out</BaseButton>
    </Card>
```

- [ ] **Step 5: Replace the reminder-time row**

This block currently reads:

```vue
    <div class="settings__row">
      <label for="reminder-time" class="settings__label">Daily reminder</label>
      <input
        id="reminder-time"
        type="time"
        class="settings__input"
        :value="time"
        @change="setTime($event.target.value)"
      />
    </div>
```

Change it to:

```vue
    <Card>
      <TextField
        id="reminder-time"
        type="time"
        label="Daily reminder"
        :model-value="time"
        @change="handleReminderChange"
      />
    </Card>
```

- [ ] **Step 6: Replace the API-key row**

This block currently reads:

```vue
    <div class="settings__row">
      <label for="gemini-api-key" class="settings__label">Gemini API key</label>
      <input
        id="gemini-api-key"
        type="password"
        class="settings__input"
        v-model="apiKeyDraft"
        placeholder="AIza..."
        autocomplete="off"
        :aria-invalid="!!apiKeyError"
        aria-describedby="gemini-api-key-hint"
        @blur="handleApiKeyBlur"
      />
      <span v-if="apiKeySaved" class="settings__saved" role="status">✓ Saved</span>
      <p v-if="apiKeyError" id="gemini-api-key-hint" class="settings__error">
        {{ apiKeyError }}
      </p>
      <p v-else id="gemini-api-key-hint" class="settings__hint">
        Used by the Speak tab to translate and explain sentences. Stored only
        on this device.
      </p>
    </div>
```

Change it to:

```vue
    <Card>
      <TextField
        id="gemini-api-key"
        type="password"
        label="Gemini API key"
        v-model="apiKeyDraft"
        placeholder="AIza..."
        autocomplete="off"
        :error="apiKeyError"
        :success="apiKeySaved ? '✓ Saved' : ''"
        hint="Used by the Speak tab to translate and explain sentences. Stored only on this device."
        @blur="handleApiKeyBlur"
      />
    </Card>
```

- [ ] **Step 7: Slim `.settings__row` down to layout-only**

In the same file's `<style scoped>` block, this rule currently reads:

```css
.settings__row {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}
```

Change it to:

```css
.settings__row {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
```

- [ ] **Step 8: Delete the now-dead `.settings__badge`, `.settings__button`, `.settings__input`, `.settings__label`, `.settings__error`, `.settings__saved`, `.settings__hint` rules**

In the same file's `<style scoped>` block, delete each of these blocks in full — every one is now unused (their only consumers were migrated to shared components in Steps 3–6):

```css
.settings__badge {
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.4rem 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--color-paper-3);
  color: var(--color-ink-3);
  font-size: 0.78rem;
  opacity: 0.55;
}

.settings__badge--earned {
  background: var(--color-accent-2-tint);
  color: var(--color-ink);
  opacity: 1;
}
```

```css
.settings__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink-2);
}
```

```css
/* ---------- inputs ---------- */

.settings__input {
  flex: 1;
  min-width: 0;
  height: 2.75rem;
  padding: 0 var(--space-md);
  border: 1px solid oklch(20% 0.012 250 / 0.16);
  border-radius: 14px;
  outline: 2px solid transparent;
  outline-offset: 1px;
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: inherit;
  font-size: 0.95rem;
  transition: background-color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out);
}

.settings__input::placeholder {
  color: var(--color-ink-3);
}

@media (hover: hover) {
  .settings__input:hover {
    background: var(--color-paper-3);
  }
}

.settings__input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
  border-color: var(--color-ink-2);
}
```

```css
/* ---------- buttons ---------- */

.settings__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.75rem;
  padding: 0 1.4rem;
  border: 0;
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.settings__button:active {
  transform: translateY(1px);
}

.settings__button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.settings__button--outline {
  border: 1.5px solid var(--color-ink-2);
  background: transparent;
  color: var(--color-ink);
}

@media (hover: hover) {
  .settings__button--outline:hover {
    background: var(--color-paper-3);
  }
}
```

```css
/* ---------- messages ---------- */

.settings__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: 0.85rem;
}

.settings__saved {
  color: var(--color-accent-2);
  font-size: 0.85rem;
  font-weight: 600;
}

.settings__hint {
  margin: 0;
  color: var(--color-ink-3);
  font-size: 0.8rem;
  line-height: 1.5;
}
```

After these deletions, the `<style scoped>` block still needs a top-level comment/rule for `.settings`, `.settings__row` (now layout-only, from Step 7), the profile-section rules (`.settings__profile*`, `.settings__avatar`, `.settings__badges`), and the reduced-motion block — handled next.

- [ ] **Step 9: Delete the now-dead reduced-motion block**

This block currently reads (it's the last rule in the file, and its only selector — `.settings__button` — was just deleted in Step 8):

```css
@media (prefers-reduced-motion: reduce) {
  .settings__button {
    transition: background-color var(--dur-fast) linear, color var(--dur-fast) linear;
    transform: none !important;
  }
}
```

Delete it in full. `BaseButton.vue` already has its own `prefers-reduced-motion` handling, so no replacement is needed.

- [ ] **Step 10: Verify the build succeeds**

Run: `cd mobile && npm run build`
Expected: build completes with no errors.

- [ ] **Step 11: Manual smoke check**

Run: `cd mobile && npm run dev`, open the app, sign in, go to Settings, and confirm:
- The profile section still shows avatar/name/email/stats, and earned/unearned badges still render with the correct visual distinction.
- "Sign out" still works and navigates to the login screen.
- The reminder-time field still saves on change (not on every keystroke) — check that picking a new time updates it once, not repeatedly.
- The API-key field still validates: typing an invalid value and blurring shows the error state; typing a valid value and blurring shows "✓ Saved" briefly; the hint text shows when neither is active.

Report the result of this manual check in the task report — this task has no automated test for the visual/behavioral change.

- [ ] **Step 12: Commit**

```bash
cd mobile
git add src/components/SettingsView.vue
git commit -m "refactor(mobile): migrate SettingsView button/badges/inputs to shared components"
```
