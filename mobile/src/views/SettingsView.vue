<script setup>
import {onMounted, ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useProgress} from '../composables/useProgress.js';
import {useReminder} from '../composables/useReminder.js';
import {useApiKey} from '../composables/useApiKey.js';
import {getBadges} from '../composables/useBadges.js';
import ScreenHeader from '../components/base/ScreenHeader.vue';

// This screen is only ever reached signed-in (the router's authGuard
// guarantees it), so there's no sign-in button or auth-error branch here
// anymore — that lives in LoginView.vue now.
const {user, progress, signOut} = useProgress();
const router = useRouter();
const {time, init: initReminder, setTime} = useReminder();
const {apiKey, init: initApiKey, setApiKey} = useApiKey();

const streakCount = computed(() => Object.keys(progress.value.streak || {}).length);
const completedCount = computed(() => progress.value.completed.length);
const badges = computed(() =>
  getBadges({streakCount: streakCount.value, completedCount: completedCount.value}),
);

const apiKeyDraft = ref('');
const apiKeySaved = ref(false);
const apiKeyError = ref('');

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

async function handleSignOut() {
  await signOut();
  router.push({name: 'login'});
}

onMounted(async () => {
  initReminder();
  await initApiKey();
  apiKeyDraft.value = apiKey.value;
});
</script>

<template>
  <section class="settings">
    <ScreenHeader eyebrow="SETTINGS" title="Settings" />

    <div v-if="user" class="settings__row settings__profile">
      <img
        v-if="user.photoURL"
        :src="user.photoURL"
        :alt="user.displayName || user.email"
        class="settings__avatar"
      />
      <div class="settings__profile-info">
        <p class="settings__profile-name">{{ user.displayName || user.email }}</p>
        <p class="settings__profile-email">{{ user.email }}</p>
      </div>
      <div class="settings__profile-stats">
        <span>🔥 {{ streakCount }} {{ streakCount === 1 ? 'day' : 'days' }}</span>
        <span>📚 {{ completedCount }} done</span>
      </div>
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

.settings__row {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}

/* ---------- profile ---------- */

.settings__profile {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-sm) var(--space-md);
}

.settings__avatar {
  grid-row: span 2;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-pill);
  object-fit: cover;
}

.settings__profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.settings__profile-name {
  margin: 0;
  font-weight: 600;
}

.settings__profile-email {
  margin: 0;
  color: var(--color-ink-2);
  font-size: 0.8rem;
}

.settings__profile-stats {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--space-md);
  font-size: 0.9rem;
  font-weight: 500;
}

.settings__badges {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

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

.settings__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink-2);
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
