# Shared Component System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build five reusable Vue components (Button, TextField, Card, ScreenHeader, Badge) that replace the button/input/card/header/badge CSS currently hand-duplicated across `LoginView.vue`, `SettingsView.vue`, and `SpeakView.vue`.

**Architecture:** Five presentational Vue 3 `<script setup>` components in a new `mobile/src/components/base/` directory, each with a props/slots API derived directly from patterns already in the codebase. No screen is migrated to use them in this plan — that's each screen's own future step.

**Tech Stack:** Vue 3 (Composition API), Vitest, `@vue/test-utils` (new), `happy-dom` (new).

## Global Constraints

- All work is scoped to `mobile/`.
- No new visual tokens — every component references only existing tokens in `mobile/src/styles/tokens.css`.
- No screen migration in this plan — `LoginView.vue`, `SettingsView.vue`, `SpeakView.vue`, and every other view keep their current markup unchanged. These five components are built and tested in isolation, not wired into any screen yet.
- New components live in `mobile/src/components/base/` (not `mobile/src/components/`, which holds feature components like `BottomNav.vue`).
- Component tests use `@vue/test-utils`'s `mount()`. Since this repo's default Vitest environment is Node (no DOM), every component test file needs `// @vitest-environment happy-dom` as its first line — a per-file override, not a global config change, so existing composable tests are unaffected.

---

### Task 1: `BaseButton.vue`

**Files:**
- Create: `mobile/src/components/base/BaseButton.vue`
- Test: `mobile/src/components/base/BaseButton.test.js`
- Modify: `mobile/package.json` (adds `@vue/test-utils` and `happy-dom` to `devDependencies`)

**Interfaces:**
- Produces: `<BaseButton variant="primary"|"outline" tone="default"|"coral" loading loadingLabel disabled>` — a single root `<button>`, so native events (`@click`) reach it via Vue's automatic attribute/listener fallthrough with no explicit `emit` needed. Slots: default (label), `icon` (leading icon, hidden while `loading`).

- [ ] **Step 1: Install the new test dependencies**

```bash
cd mobile
npm install --save-dev @vue/test-utils happy-dom
```

- [ ] **Step 2: Write the failing test**

Create `mobile/src/components/base/BaseButton.test.js`:

```js
// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import BaseButton from './BaseButton.vue';

describe('BaseButton', () => {
  it('renders the default slot as its label', () => {
    const wrapper = mount(BaseButton, {slots: {default: 'Sign in'}});
    expect(wrapper.text()).toBe('Sign in');
  });

  it('applies the variant and tone classes', () => {
    const wrapper = mount(BaseButton, {
      props: {variant: 'outline', tone: 'coral'},
    });
    expect(wrapper.classes()).toContain('base-button--outline');
    expect(wrapper.classes()).toContain('base-button--coral');
  });

  it('disables the button and swaps to loadingLabel while loading', () => {
    const wrapper = mount(BaseButton, {
      props: {loading: true, loadingLabel: 'Signing in…'},
      slots: {default: 'Sign in with Google', icon: '<svg />'},
    });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.text()).toBe('Signing in…');
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('emits a native click to a parent listener when enabled', async () => {
    const wrapper = mount(BaseButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/components/base/BaseButton.test.js`
Expected: FAIL — `Failed to resolve import "./BaseButton.vue"` (file doesn't exist yet).

- [ ] **Step 4: Write the implementation**

Create `mobile/src/components/base/BaseButton.vue`:

```vue
<script setup>
defineProps({
  variant: {type: String, default: 'primary'}, // 'primary' | 'outline'
  tone: {type: String, default: 'default'}, // 'default' | 'coral'
  loading: {type: Boolean, default: false},
  loadingLabel: {type: String, default: 'Loading…'},
  disabled: {type: Boolean, default: false},
});
</script>

<template>
  <button
    type="button"
    class="base-button"
    :class="[
      `base-button--${variant}`,
      {'base-button--coral': tone === 'coral'},
    ]"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
  >
    <template v-if="loading">{{ loadingLabel }}</template>
    <template v-else>
      <slot name="icon" />
      <slot />
    </template>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
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
    color var(--dur-fast) var(--ease-out),
    opacity var(--dur-fast) var(--ease-out);
}

.base-button:active:not(:disabled) {
  transform: translateY(1px);
}

.base-button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

@media (hover: hover) {
  .base-button--primary:hover:not(:disabled) {
    background: var(--color-accent-deep);
  }
}

.base-button--outline {
  border: 1.5px solid var(--color-ink-2);
  background: transparent;
  color: var(--color-ink);
}

@media (hover: hover) {
  .base-button--outline:hover:not(:disabled) {
    background: var(--color-paper-3);
  }
}

.base-button--coral {
  border-color: var(--color-accent-3-deep);
  color: var(--color-accent-3-deep);
}

@media (hover: hover) {
  .base-button--coral:hover:not(:disabled) {
    background: var(--color-accent-3);
    color: var(--color-ink);
  }
}

@media (prefers-reduced-motion: reduce) {
  .base-button {
    transition:
      background-color var(--dur-fast) linear,
      color var(--dur-fast) linear,
      opacity var(--dur-fast) linear;
    transform: none !important;
  }
}
</style>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/components/base/BaseButton.test.js`
Expected: PASS (4 tests)

- [ ] **Step 6: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites — confirms the `happy-dom` per-file override didn't affect any existing composable test.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/components/base/BaseButton.vue src/components/base/BaseButton.test.js
git commit -m "feat(mobile): add BaseButton shared component"
```

---

### Task 2: `TextField.vue`

**Files:**
- Create: `mobile/src/components/base/TextField.vue`
- Test: `mobile/src/components/base/TextField.test.js`

**Interfaces:**
- Produces: `<TextField v-model="draft" type="password" label="Gemini API key" id="gemini-api-key" hint="…" error="…" success="…">` — standard `v-model` (`modelValue`/`update:modelValue`). Native attrs/listeners (`placeholder`, `autocomplete`, `@blur`, `@change`, …) forward to the inner `<input>` via `inheritAttrs: false` + `v-bind="$attrs"`.

- [ ] **Step 1: Write the failing test**

Create `mobile/src/components/base/TextField.test.js`:

```js
// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import TextField from './TextField.vue';

describe('TextField', () => {
  it('binds modelValue and emits update:modelValue on input', async () => {
    const wrapper = mount(TextField, {
      props: {modelValue: '', label: 'Gemini API key', id: 'api-key'},
    });
    await wrapper.find('input').setValue('AIzaTest');
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['AIzaTest']);
  });

  it('shows the hint by default and swaps to the error when set', async () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Gemini API key',
        id: 'api-key',
        hint: 'Stored on this device.',
      },
    });
    expect(wrapper.text()).toContain('Stored on this device.');
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('false');

    await wrapper.setProps({error: 'Could not save the key.'});
    expect(wrapper.text()).not.toContain('Stored on this device.');
    expect(wrapper.text()).toContain('Could not save the key.');
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true');
  });

  it('renders the success status line when set', () => {
    const wrapper = mount(TextField, {
      props: {label: 'Gemini API key', id: 'api-key', success: '✓ Saved'},
    });
    const status = wrapper.find('[role="status"]');
    expect(status.exists()).toBe(true);
    expect(status.text()).toBe('✓ Saved');
  });

  it('forwards native attributes to the input', () => {
    const wrapper = mount(TextField, {
      props: {label: 'Gemini API key', id: 'api-key'},
      attrs: {placeholder: 'AIza...', autocomplete: 'off'},
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('AIza...');
    expect(wrapper.find('input').attributes('autocomplete')).toBe('off');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/components/base/TextField.test.js`
Expected: FAIL — `Failed to resolve import "./TextField.vue"`.

- [ ] **Step 3: Write the implementation**

Create `mobile/src/components/base/TextField.vue`:

```vue
<script setup>
defineOptions({inheritAttrs: false});

const props = defineProps({
  modelValue: {type: String, default: ''},
  type: {type: String, default: 'text'},
  label: {type: String, required: true},
  id: {type: String, required: true},
  hint: {type: String, default: ''},
  error: {type: String, default: ''},
  success: {type: String, default: ''},
});

defineEmits(['update:modelValue']);

const hintId = `${props.id}-hint`;
</script>

<template>
  <div class="text-field">
    <label :for="id" class="text-field__label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      class="text-field__input"
      :value="modelValue"
      :aria-invalid="!!error"
      :aria-describedby="hint || error ? hintId : undefined"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="success" class="text-field__success" role="status">{{
      success
    }}</span>
    <p v-if="error" :id="hintId" class="text-field__error">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="text-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.text-field__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink-2);
}

.text-field__input {
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
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.text-field__input::placeholder {
  color: var(--color-ink-3);
}

@media (hover: hover) {
  .text-field__input:hover {
    background: var(--color-paper-3);
  }
}

.text-field__input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
  border-color: var(--color-ink-2);
}

.text-field__success {
  color: var(--color-accent-2);
  font-size: 0.85rem;
  font-weight: 600;
}

.text-field__error {
  margin: 0;
  color: var(--color-accent-3-deep);
  font-size: 0.85rem;
}

.text-field__hint {
  margin: 0;
  color: var(--color-ink-3);
  font-size: 0.8rem;
  line-height: 1.5;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/components/base/TextField.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add src/components/base/TextField.vue src/components/base/TextField.test.js
git commit -m "feat(mobile): add TextField shared component"
```

---

### Task 3: `Card.vue`

**Files:**
- Create: `mobile/src/components/base/Card.vue`
- Test: `mobile/src/components/base/Card.test.js`

**Interfaces:**
- Produces: `<Card><slot content/></Card>` — a `<div class="card">` wrapper, no props.

- [ ] **Step 1: Write the failing test**

Create `mobile/src/components/base/Card.test.js`:

```js
// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import Card from './Card.vue';

describe('Card', () => {
  it('renders slot content inside the card wrapper', () => {
    const wrapper = mount(Card, {slots: {default: '<p>Hello</p>'}});
    expect(wrapper.find('.card p').text()).toBe('Hello');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/components/base/Card.test.js`
Expected: FAIL — `Failed to resolve import "./Card.vue"`.

- [ ] **Step 3: Write the implementation**

Create `mobile/src/components/base/Card.vue`:

```vue
<template>
  <div class="card"><slot /></div>
</template>

<style scoped>
.card {
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/components/base/Card.test.js`
Expected: PASS (1 test)

- [ ] **Step 5: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add src/components/base/Card.vue src/components/base/Card.test.js
git commit -m "feat(mobile): add Card shared component"
```

---

### Task 4: `ScreenHeader.vue`

**Files:**
- Create: `mobile/src/components/base/ScreenHeader.vue`
- Test: `mobile/src/components/base/ScreenHeader.test.js`

**Interfaces:**
- Produces: `<ScreenHeader eyebrow="SETTINGS" title="Settings" subtitle="…">` — no slots, `subtitle` optional.

- [ ] **Step 1: Write the failing test**

Create `mobile/src/components/base/ScreenHeader.test.js`:

```js
// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import ScreenHeader from './ScreenHeader.vue';

describe('ScreenHeader', () => {
  it('renders eyebrow and title', () => {
    const wrapper = mount(ScreenHeader, {
      props: {eyebrow: 'SETTINGS', title: 'Settings'},
    });
    expect(wrapper.find('.screen-header__eyebrow').text()).toBe('SETTINGS');
    expect(wrapper.find('.screen-header__title').text()).toBe('Settings');
  });

  it('renders no subtitle element when omitted', () => {
    const wrapper = mount(ScreenHeader, {
      props: {eyebrow: 'SETTINGS', title: 'Settings'},
    });
    expect(wrapper.find('.screen-header__subtitle').exists()).toBe(false);
  });

  it('renders the subtitle when provided', () => {
    const wrapper = mount(ScreenHeader, {
      props: {
        eyebrow: 'SIGN IN',
        title: 'Daily Mastery',
        subtitle: 'Sign in to continue.',
      },
    });
    expect(wrapper.find('.screen-header__subtitle').text()).toBe(
      'Sign in to continue.',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/components/base/ScreenHeader.test.js`
Expected: FAIL — `Failed to resolve import "./ScreenHeader.vue"`.

- [ ] **Step 3: Write the implementation**

Create `mobile/src/components/base/ScreenHeader.vue`:

```vue
<script setup>
defineProps({
  eyebrow: {type: String, required: true},
  title: {type: String, required: true},
  subtitle: {type: String, default: ''},
});
</script>

<template>
  <header class="screen-header">
    <p class="screen-header__eyebrow">{{ eyebrow }}</p>
    <h1 class="screen-header__title">{{ title }}</h1>
    <p v-if="subtitle" class="screen-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.screen-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.screen-header__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.screen-header__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.screen-header__subtitle {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/components/base/ScreenHeader.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add src/components/base/ScreenHeader.vue src/components/base/ScreenHeader.test.js
git commit -m "feat(mobile): add ScreenHeader shared component"
```

---

### Task 5: `Badge.vue`

**Files:**
- Create: `mobile/src/components/base/Badge.vue`
- Test: `mobile/src/components/base/Badge.test.js`

**Interfaces:**
- Produces: `<Badge icon="🔥" label="3-day streak" earned>` — root is a single `<li>` (matches its only current usage inside a `<ul>` in `SettingsView.vue`'s badges list).

- [ ] **Step 1: Write the failing test**

Create `mobile/src/components/base/Badge.test.js`:

```js
// @vitest-environment happy-dom
import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import Badge from './Badge.vue';

describe('Badge', () => {
  it('renders icon and label', () => {
    const wrapper = mount(Badge, {props: {icon: '🔥', label: '3-day streak'}});
    expect(wrapper.text()).toContain('🔥');
    expect(wrapper.text()).toContain('3-day streak');
  });

  it('applies the earned class only when earned is true', () => {
    const unearned = mount(Badge, {
      props: {icon: '🔥', label: '3-day streak'},
    });
    expect(unearned.classes()).not.toContain('badge--earned');

    const earned = mount(Badge, {
      props: {icon: '🔥', label: '3-day streak', earned: true},
    });
    expect(earned.classes()).toContain('badge--earned');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd mobile && npx vitest run src/components/base/Badge.test.js`
Expected: FAIL — `Failed to resolve import "./Badge.vue"`.

- [ ] **Step 3: Write the implementation**

Create `mobile/src/components/base/Badge.vue`:

```vue
<script setup>
defineProps({
  icon: {type: String, required: true},
  label: {type: String, required: true},
  earned: {type: Boolean, default: false},
});
</script>

<template>
  <li class="badge" :class="{'badge--earned': earned}" :title="label">
    <span aria-hidden="true">{{ icon }}</span>
    <span class="badge__label">{{ label }}</span>
  </li>
</template>

<style scoped>
.badge {
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

.badge--earned {
  background: var(--color-accent-2-tint);
  color: var(--color-ink);
  opacity: 1;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd mobile && npx vitest run src/components/base/Badge.test.js`
Expected: PASS (2 tests)

- [ ] **Step 5: Run the full suite**

Run: `cd mobile && npx vitest run`
Expected: PASS, all suites.

- [ ] **Step 6: Commit**

```bash
git add src/components/base/Badge.vue src/components/base/Badge.test.js
git commit -m "feat(mobile): add Badge shared component"
```
