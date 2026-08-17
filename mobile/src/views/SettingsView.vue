<script setup>
import {onMounted, ref} from 'vue';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';

const {isSignedIn, authError, signIn, signOut} = useProgress();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();

const signInError = ref('');
const apiKeyDraft = ref('');
const apiKeySaved = ref(false);

async function handleSignIn() {
  signInError.value = '';
  try {
    await signIn();
  } catch (err) {
    // Most commonly the user closed the Google account picker — not a bug,
    // just needs a visible message instead of a silently dead button.
    signInError.value = 'Sign-in was cancelled or failed. Please try again.';
  }
}

async function saveApiKey() {
  await setApiKey(apiKeyDraft.value.trim());
  apiKeySaved.value = true;
  setTimeout(() => (apiKeySaved.value = false), 2000);
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
</script>

<template>
  <section class="settings">
    <header class="settings__header">
      <p class="settings__eyebrow">SETTINGS</p>
      <h1 class="settings__title">Settings</h1>
    </header>

    <div class="settings__row">
      <button
        v-if="!isSignedIn"
        type="button"
        class="settings__button settings__button--primary"
        @click="handleSignIn"
      >
        Sign in with Google
      </button>
      <button v-else type="button" class="settings__button settings__button--outline" @click="signOut">
        Sign out
      </button>
      <p v-if="authError" class="settings__error" role="alert">{{ authError }}</p>
      <p v-else-if="signInError" class="settings__error" role="alert">{{ signInError }}</p>
    </div>

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

    <div class="settings__row">
      <label for="claude-api-key" class="settings__label">Claude API key</label>
      <div class="settings__field-group">
        <input
          id="claude-api-key"
          type="password"
          class="settings__input"
          v-model="apiKeyDraft"
          placeholder="sk-ant-..."
          autocomplete="off"
        />
        <button type="button" class="settings__button settings__button--primary" @click="saveApiKey">
          Save
        </button>
      </div>
      <span v-if="apiKeySaved" class="settings__saved">✓ Saved</span>
      <p class="settings__hint">
        Used by the Speak tab to translate and explain sentences. Stored only
        on this device.
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Hallmark · component: settings form · genre: playful (Hum register)
 * theme: Daily Mastery brand (awenvia DNA) — shares tokens with SpeakView.vue via global src/styles/tokens.css
 * states: buttons — default · hover · focus-visible · active
 *         time/password inputs — default · hover · focus · disabled(n/a)
 */

.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  min-height: 100dvh;
  padding: var(--space-xl) var(--space-lg) calc(6rem + env(safe-area-inset-bottom));
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

.settings__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs);
}

.settings__eyebrow {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.settings__title {
  margin: 0;
  font-size: clamp(1.6rem, 5vw + 1rem, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.settings__row {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}

.settings__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink-2);
}

.settings__field-group {
  display: flex;
  gap: var(--space-xs);
}

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

.settings__button--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

@media (hover: hover) {
  .settings__button--primary:hover {
    background: var(--color-accent-deep);
  }
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

@media (prefers-reduced-motion: reduce) {
  .settings__button {
    transition: background-color var(--dur-fast) linear, color var(--dur-fast) linear;
    transform: none !important;
  }
}
</style>
